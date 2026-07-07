/**
 * Conecta / atualiza uma integração de marketing.
 * Grava o token (server-side, service role) e TESTA a conexão na hora,
 * setando status = 'conectado' | 'erro'.
 *
 * Body: { empresa_id, plataforma, account_id, access_token, refresh_token?, conta_nome? }
 * Resposta: metadados da integração (sem o token).
 */
import type { Credenciais, Plataforma, TesteConexao } from '../../utils/marketing/types'
import { testarMeta, trocarPorTokenLongo, buscarCredenciaisMensageria } from '../../utils/marketing/metaAds'
import { inscreverPaginaNoWebhook } from '../../utils/metaMessagingSend'
import { testarGoogleAds } from '../../utils/marketing/googleAds'
import { testarGa4 } from '../../utils/marketing/ga4'

const PLATAFORMAS: Plataforma[] = ['meta', 'google_ads', 'ga4']

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const empresaId = body?.empresa_id
  const plataforma = body?.plataforma as Plataforma

  if (!empresaId || !plataforma || !PLATAFORMAS.includes(plataforma)) {
    throw createError({ statusCode: 400, message: 'empresa_id e plataforma válidos são obrigatórios' })
  }
  if (!body?.access_token || !body?.account_id) {
    throw createError({ statusCode: 400, message: 'access_token e account_id são obrigatórios' })
  }

  const creds: Credenciais = {
    plataforma,
    accountId: String(body.account_id),
    accessToken: String(body.access_token),
    refreshToken: body.refresh_token ? String(body.refresh_token) : null,
  }

  // Meta: tenta trocar por um token de longa duração (~60 dias) antes de testar/salvar,
  // pra não depender do usuário colar um token que expira em 1-2h.
  if (plataforma === 'meta') {
    creds.accessToken = await trocarPorTokenLongo(creds.accessToken!)
  }

  // Testa a conexão conforme a plataforma
  let teste: TesteConexao
  if (plataforma === 'meta') teste = await testarMeta(creds)
  else if (plataforma === 'google_ads') teste = await testarGoogleAds(creds)
  else teste = await testarGa4(creds)

  const supabase = useSupabaseServer()
  const pageId = plataforma === 'meta' && body.page_id ? String(body.page_id) : null

  const payload: Record<string, unknown> = {
    empresa_id: empresaId,
    plataforma,
    conta_nome: teste.conta_nome || body.conta_nome || null,
    account_id: creds.accountId,
    access_token: creds.accessToken,
    refresh_token: creds.refreshToken,
    meta_page_id: pageId,
    status: teste.ok ? 'conectado' : 'erro',
    erro_msg: teste.ok ? null : (teste.erro || 'Falha desconhecida'),
    ativo: true,
    ultimo_sync: teste.ok ? new Date().toISOString() : null,
  }

  // Meta + Página configurada: na primeira conexão (ainda sem Página de
  // mensagens escolhida), usa a mesma Página dos anúncios como padrão pra
  // a central de mensagens. Se o usuário já escolheu outra Página lá
  // (seletor em /mensagens), reconectar aqui NÃO sobrescreve essa escolha.
  if (plataforma === 'meta' && teste.ok && pageId) {
    const { data: existente } = await supabase
      .from('marketing_integracoes')
      .select('meta_msg_page_id')
      .eq('empresa_id', empresaId)
      .eq('plataforma', 'meta')
      .maybeSingle()

    if (!existente?.meta_msg_page_id) {
      const mensageria = await buscarCredenciaisMensageria(creds, pageId)
      if (mensageria.pageAccessToken) {
        // Inscreve a Página no webhook — sem isso a Meta não entrega mensagens
        // pra ela, mesmo com a URL de callback já verificada.
        const inscricao = await inscreverPaginaNoWebhook(pageId, mensageria.pageAccessToken)
        if (inscricao.ok) {
          payload.meta_msg_page_id = pageId
          payload.meta_msg_page_nome = mensageria.pageNome || null
          payload.meta_msg_page_access_token = mensageria.pageAccessToken
          payload.meta_msg_instagram_business_id = mensageria.instagramBusinessId || null
          payload.meta_msg_instagram_usuario = mensageria.instagramUsuario || null
        } else {
          console.error('[integracoes] falha ao inscrever Página padrão no webhook:', inscricao.erro)
        }
      }
    }
  }

  // Upsert por (empresa_id, plataforma)
  const { data, error } = await supabase
    .from('marketing_integracoes')
    .upsert(payload, { onConflict: 'empresa_id,plataforma' })
    .select('id, plataforma, conta_nome, account_id, status, erro_msg, ultimo_sync, ativo, updated_at')
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
