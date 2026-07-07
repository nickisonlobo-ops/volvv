// ═══════════════════════════════════════════════════════════════
// Recursos da conta Meta para dropdowns no painel (sem digitar IDs):
// Páginas, contas Instagram, Pixels, info da conta e busca de interesses.
// Também lê a estrutura de uma campanha (conjuntos + anúncios).
// ═══════════════════════════════════════════════════════════════

import type { Credenciais } from './types'

const GRAPH = 'https://graph.facebook.com/v21.0'
function actId(id: string): string { return id.startsWith('act_') ? id : `act_${id}` }

export interface RecursosMeta {
  ok: boolean
  erro?: string
  conta?: { nome?: string; moeda?: string; fuso?: string }
  paginas: { id: string; nome: string; foto?: string; instagram?: { id: string; usuario: string } | null }[]
  pixels: { id: string; nome: string }[]
}

export async function metaGetRecursos(creds: Credenciais): Promise<RecursosMeta> {
  if (!creds.accessToken || !creds.accountId) return { ok: false, erro: 'Credenciais ausentes.', paginas: [], pixels: [] }
  const token = creds.accessToken
  const acc = actId(creds.accountId)
  const base: RecursosMeta = { ok: true, paginas: [], pixels: [] }

  // Info da conta (moeda, fuso) — não bloqueia se falhar
  try {
    const c = await $fetch<{ name?: string; currency?: string; timezone_name?: string }>(`${GRAPH}/${acc}`, {
      query: { fields: 'name,currency,timezone_name', access_token: token },
    })
    base.conta = { nome: c.name, moeda: c.currency, fuso: c.timezone_name }
  } catch { /* ignora */ }

  // Páginas do usuário + conta IG vinculada
  try {
    const p = await $fetch<{ data: { id: string; name: string; picture?: { data?: { url?: string } }; instagram_business_account?: { id: string; username?: string } }[] }>(
      `${GRAPH}/me/accounts`,
      { query: { fields: 'id,name,picture{url},instagram_business_account{id,username}', limit: 100, access_token: token } },
    )
    base.paginas = (p.data || []).map((pg) => ({
      id: pg.id,
      nome: pg.name,
      foto: pg.picture?.data?.url,
      instagram: pg.instagram_business_account
        ? { id: pg.instagram_business_account.id, usuario: pg.instagram_business_account.username || 'instagram' }
        : null,
    }))
  } catch (e: any) {
    base.erro = e?.data?.error?.message || 'Não foi possível listar Páginas (verifique permissões pages_show_list).'
  }

  // Pixels da conta
  try {
    const px = await $fetch<{ data: { id: string; name: string }[] }>(`${GRAPH}/${acc}/adspixels`, {
      query: { fields: 'id,name', limit: 50, access_token: token },
    })
    base.pixels = (px.data || []).map((x) => ({ id: x.id, nome: x.name }))
  } catch { /* pixel opcional */ }

  return base
}

/** Busca interesses para segmentação (autocomplete). */
export async function metaSearchInterests(creds: Credenciais, q: string): Promise<{ id: string; nome: string; tamanho?: number }[]> {
  if (!creds.accessToken || !q) return []
  try {
    const res = await $fetch<{ data: { id: string; name: string; audience_size_lower_bound?: number }[] }>(`${GRAPH}/search`, {
      query: { type: 'adinterest', q, limit: 20, access_token: creds.accessToken },
    })
    return (res.data || []).map((i) => ({ id: i.id, nome: i.name, tamanho: i.audience_size_lower_bound }))
  } catch {
    return []
  }
}

/** Busca genérica de segmentação (comportamentos, dados demográficos, etc.). */
export async function metaSearchTargeting(
  creds: Credenciais,
  q: string,
  classe?: string, // ex: 'behaviors', 'demographics', 'life_events'
): Promise<{ id: string; nome: string; tamanho?: number; tipo?: string }[]> {
  if (!creds.accessToken || !q) return []
  try {
    const query: Record<string, unknown> = { type: 'adTargetingCategory', q, limit: 25, access_token: creds.accessToken }
    if (classe) query.class = classe
    const res = await $fetch<{ data: { id: string; name: string; audience_size_lower_bound?: number; type?: string }[] }>(`${GRAPH}/search`, { query })
    return (res.data || []).map((i) => ({ id: i.id, nome: i.name, tamanho: i.audience_size_lower_bound, tipo: i.type }))
  } catch {
    return []
  }
}

/** Busca localidades (cidades/regiões) — retorna a `key` usada no targeting. */
export async function metaSearchLocations(creds: Credenciais, q: string): Promise<{ key: string; nome: string; tipo?: string }[]> {
  if (!creds.accessToken || !q) return []
  try {
    const res = await $fetch<{ data: { key: string; name: string; type?: string; region?: string; country_name?: string }[] }>(`${GRAPH}/search`, {
      query: { type: 'adgeolocation', location_types: JSON.stringify(['city', 'region']), q, limit: 20, access_token: creds.accessToken },
    })
    return (res.data || []).map((l) => ({ key: l.key, nome: [l.name, l.region, l.country_name].filter(Boolean).join(', '), tipo: l.type }))
  } catch {
    return []
  }
}

/** Busca idiomas (locales) — retorna o key numérico usado em targeting.locales. */
export async function metaSearchLocales(creds: Credenciais, q: string): Promise<{ id: string; nome: string }[]> {
  if (!creds.accessToken || !q) return []
  try {
    const res = await $fetch<{ data: { key: number; name: string }[] }>(`${GRAPH}/search`, {
      query: { type: 'adlocale', q, limit: 20, access_token: creds.accessToken },
    })
    return (res.data || []).map((l) => ({ id: String(l.key), nome: l.name }))
  } catch {
    return []
  }
}

/** Lista os públicos personalizados (custom audiences) da conta. */
export async function metaGetAudiences(creds: Credenciais): Promise<{ id: string; nome: string; tipo?: string; tamanho?: number }[]> {
  if (!creds.accessToken || !creds.accountId) return []
  try {
    const res = await $fetch<{ data: { id: string; name: string; subtype?: string; approximate_count?: number }[] }>(`${GRAPH}/${actId(creds.accountId)}/customaudiences`, {
      query: { fields: 'id,name,subtype,approximate_count', limit: 100, access_token: creds.accessToken },
    })
    return (res.data || []).map((a) => ({ id: a.id, nome: a.name, tipo: a.subtype, tamanho: a.approximate_count }))
  } catch {
    return []
  }
}

// ── Estrutura de uma campanha: conjuntos + anúncios ─────────────
export interface EstruturaAd { id: string; nome: string; status: string }
export interface EstruturaAdSet { id: string; nome: string; status: string; orcamentoDiario: number | null; ads: EstruturaAd[] }

function normStatus(s: string): string {
  return s === 'ACTIVE' ? 'ativa' : s === 'PAUSED' ? 'pausada' : s.toLowerCase()
}

export async function metaGetEstrutura(creds: Credenciais, campanhaId: string): Promise<{ ok: boolean; erro?: string; adsets: EstruturaAdSet[] }> {
  if (!creds.accessToken) return { ok: false, erro: 'Token ausente.', adsets: [] }
  const token = creds.accessToken
  try {
    const [adsetsRes, adsRes] = await Promise.all([
      $fetch<{ data: { id: string; name: string; status: string; daily_budget?: string }[] }>(`${GRAPH}/${campanhaId}/adsets`, {
        query: { fields: 'id,name,status,daily_budget', limit: 50, access_token: token },
      }),
      $fetch<{ data: { id: string; name: string; status: string; adset_id: string }[] }>(`${GRAPH}/${campanhaId}/ads`, {
        query: { fields: 'id,name,status,adset_id', limit: 100, access_token: token },
      }),
    ])
    const adsPorSet = new Map<string, EstruturaAd[]>()
    for (const a of adsRes.data || []) {
      const arr = adsPorSet.get(a.adset_id) || []
      arr.push({ id: a.id, nome: a.name, status: normStatus(a.status) })
      adsPorSet.set(a.adset_id, arr)
    }
    const adsets: EstruturaAdSet[] = (adsetsRes.data || []).map((s) => ({
      id: s.id,
      nome: s.name,
      status: normStatus(s.status),
      orcamentoDiario: s.daily_budget ? Number(s.daily_budget) / 100 : null,
      ads: adsPorSet.get(s.id) || [],
    }))
    return { ok: true, adsets }
  } catch (e: any) {
    return { ok: false, erro: e?.data?.error?.message || 'Falha ao ler estrutura da campanha.', adsets: [] }
  }
}
