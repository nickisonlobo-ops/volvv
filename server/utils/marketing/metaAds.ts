// ═══════════════════════════════════════════════════════════════
// Meta Marketing API (Facebook + Instagram Ads).
// Auth: access_token de longa duração + account_id (act_<id>).
// Docs: https://developers.facebook.com/docs/marketing-api/insights
// ═══════════════════════════════════════════════════════════════

import type { Credenciais, PlatformResult, TesteConexao, CampanhaNorm, SeriedPonto } from './types'
import { emptyResult } from './types'

const GRAPH = 'https://graph.facebook.com/v21.0'

/** Normaliza account_id para o formato act_<id> exigido pela Graph API. */
function actId(id: string): string {
  return id.startsWith('act_') ? id : `act_${id}`
}

/**
 * Troca um token curto (Graph API Explorer, ~1-2h) por um de longa duração (~60 dias).
 * Exige META_APP_ID + META_APP_SECRET configurados (painel do app na Meta → Configurações
 * básicas). Sem essas variáveis, ou se a troca falhar, devolve o token original — a conexão
 * não é bloqueada por isso, só dura menos.
 */
export async function trocarPorTokenLongo(token: string): Promise<string> {
  const config = useRuntimeConfig()
  const appId = config.metaAppId
  const appSecret = config.metaAppSecret
  if (!appId || !appSecret) return token
  try {
    const res = await $fetch<{ access_token?: string }>(`${GRAPH}/oauth/access_token`, {
      query: {
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: token,
      },
    })
    return res.access_token || token
  } catch (e: any) {
    console.error('[meta] troca de token longo falhou, mantendo o original:', e?.data?.error?.message || e?.message)
    return token
  }
}

interface InsightRow {
  spend?: string
  clicks?: string
  impressions?: string
  actions?: { action_type: string; value: string }[]
  date_start?: string
}

/** Soma conversões relevantes das "actions" do insight. */
function contarConversoes(actions?: { action_type: string; value: string }[]): number {
  if (!actions) return 0
  const tipos = ['lead', 'onsite_conversion.lead_grouped', 'purchase', 'offsite_conversion.fb_pixel_lead']
  return actions
    .filter((a) => tipos.includes(a.action_type))
    .reduce((s, a) => s + Number(a.value || 0), 0)
}

/**
 * Testa a conexão: busca o nome da conta de anúncio.
 * Usado ao gravar credenciais em Configurações.
 */
export async function testarMeta(creds: Credenciais): Promise<TesteConexao> {
  if (!creds.accessToken || !creds.accountId) {
    return { ok: false, erro: 'Token ou ID da conta ausente.' }
  }
  try {
    const res = await $fetch<{ name?: string; account_status?: number }>(
      `${GRAPH}/${actId(creds.accountId)}`,
      { query: { fields: 'name,account_status', access_token: creds.accessToken } },
    )
    return { ok: true, conta_nome: res.name }
  } catch (e: any) {
    const msg = e?.data?.error?.message || e?.message || 'Falha ao conectar à Meta.'
    return { ok: false, erro: msg }
  }
}

/**
 * Busca o Page Access Token e o ID da conta comercial do Instagram vinculada
 * à Página conectada — necessários pra enviar mensagens (Send API) via
 * Messenger/Instagram. Usa o mesmo User Access Token já testado em testarMeta.
 * Sem page_id configurado, ou se a Página não aparecer entre as gerenciadas
 * pelo usuário do token, devolve tudo undefined (mensageria fica indisponível
 * até o usuário configurar a Página certa — não bloqueia a conexão de anúncios).
 */
export async function buscarCredenciaisMensageria(
  creds: Credenciais,
  pageId: string,
): Promise<{ pageNome?: string; pageAccessToken?: string; instagramBusinessId?: string; instagramUsuario?: string }> {
  if (!creds.accessToken || !pageId) return {}
  try {
    const res = await $fetch<{ data: { id: string; name?: string; access_token?: string; instagram_business_account?: { id: string; username?: string } }[] }>(
      `${GRAPH}/me/accounts`,
      { query: { fields: 'id,name,access_token,instagram_business_account{id,username}', limit: 100, access_token: creds.accessToken } },
    )
    const pagina = (res.data || []).find((p) => p.id === pageId)
    return {
      pageNome: pagina?.name,
      pageAccessToken: pagina?.access_token,
      instagramBusinessId: pagina?.instagram_business_account?.id,
      instagramUsuario: pagina?.instagram_business_account?.username,
    }
  } catch (e: any) {
    console.error('[meta] falha ao buscar credenciais de mensageria:', e?.data?.error?.message || e?.message)
    return {}
  }
}

/**
 * Busca métricas do período e campanhas ativas.
 * @param since 'YYYY-MM-DD'  @param until 'YYYY-MM-DD'
 */
export async function fetchMeta(
  creds: Credenciais,
  since: string,
  until: string,
): Promise<PlatformResult> {
  if (!creds.accessToken || !creds.accountId) {
    return emptyResult('Credenciais Meta ausentes.')
  }

  const account = actId(creds.accountId)
  const timeRange = JSON.stringify({ since, until })

  try {
    // 1) Insights diários da conta (para KPIs + série do gráfico)
    const insightsResp = await $fetch<{ data: InsightRow[] }>(`${GRAPH}/${account}/insights`, {
      query: {
        fields: 'spend,clicks,impressions,actions',
        time_range: timeRange,
        time_increment: 1,
        access_token: creds.accessToken,
      },
    })

    let investimento = 0
    let cliques = 0
    let conversoes = 0
    const serie: SeriedPonto[] = []
    for (const row of insightsResp.data ?? []) {
      const spend = Number(row.spend || 0)
      investimento += spend
      cliques += Number(row.clicks || 0)
      conversoes += contarConversoes(row.actions)
      if (row.date_start) serie.push({ data: row.date_start, valor: spend })
    }

    // 2) Campanhas com insights agregados no período
    const campResp = await $fetch<{
      data: { id: string; name: string; status: string; insights?: { data: InsightRow[] } }[]
    }>(`${GRAPH}/${account}/campaigns`, {
      query: {
        fields: `id,name,status,insights.time_range(${timeRange}){spend,clicks,actions}`,
        limit: 50,
        access_token: creds.accessToken,
      },
    })

    const campanhas: CampanhaNorm[] = (campResp.data ?? []).map((c) => {
      const ins = c.insights?.data?.[0]
      const spend = Number(ins?.spend || 0)
      const conv = contarConversoes(ins?.actions)
      const roi = spend > 0 && conv > 0 ? `${Math.round((conv * 200 / spend) * 100)}%` : '—'
      return {
        id: c.id,
        plataforma: 'meta' as const,
        nome: c.name,
        canal: 'meta',
        icone: '📸',
        investimento: spend,
        resultado: `${conv} conversões`,
        roi,
        status: c.status === 'ACTIVE' ? 'ativa' : c.status === 'PAUSED' ? 'pausada' : 'encerrada',
      }
    })

    return {
      conectado: true,
      campanhas,
      investimento,
      cliques,
      conversoes,
      serie,
      // Meta não separa sessões por canal orgânico; contribui como um canal só.
      canais: cliques > 0 ? [{ nome: 'Meta Ads', qtd: cliques, cor: '#e1306c' }] : [],
    }
  } catch (e: any) {
    const msg = e?.data?.error?.message || e?.message || 'Falha ao buscar dados da Meta.'
    console.error('[meta] fetch erro:', msg)
    return emptyResult(msg)
  }
}
