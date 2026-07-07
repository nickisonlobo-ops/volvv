// ═══════════════════════════════════════════════════════════════
// Edição de objetos Meta (campanha / conjunto / anúncio) via POST /<id>.
// Allowlist de campos por nível — só envia o que a Meta aceita naquele nível.
// Valores em R$ (orçamento/lance) convertidos para centavos.
// ═══════════════════════════════════════════════════════════════

import type { Credenciais } from './types'
import type { AcaoResult } from './metaActions'

const GRAPH = 'https://graph.facebook.com/v21.0'

function extrairErro(e: any): string {
  return e?.data?.error?.error_user_msg || e?.data?.error?.message || e?.message || 'Falha ao editar na Meta.'
}

export type NivelMeta = 'campanha' | 'conjunto' | 'anuncio'

/** Campos aceitos em cada nível. Chaves *_reais são convertidas de R$ para centavos. */
const CAMPOS_PERMITIDOS: Record<NivelMeta, string[]> = {
  campanha: ['name', 'status', 'daily_budget_reais', 'lifetime_budget_reais', 'bid_strategy', 'special_ad_categories'],
  conjunto: [
    'name', 'status', 'daily_budget_reais', 'lifetime_budget_reais', 'start_time', 'end_time',
    'targeting', 'optimization_goal', 'billing_event', 'bid_amount_reais', 'promoted_object', 'adset_schedule',
  ],
  anuncio: ['name', 'status', 'creative'],
}

const CAMPOS_JSON = new Set(['targeting', 'promoted_object', 'special_ad_categories', 'adset_schedule', 'creative'])

/**
 * Edita um objeto. `campos` usa nomes "amigáveis":
 * daily_budget_reais / lifetime_budget_reais / bid_amount_reais em R$.
 */
export async function metaEditObjeto(
  creds: Credenciais,
  id: string,
  nivel: NivelMeta,
  campos: Record<string, unknown>,
): Promise<AcaoResult> {
  if (!creds.accessToken) return { ok: false, erro: 'Token ausente.' }
  const permitidos = CAMPOS_PERMITIDOS[nivel]
  if (!permitidos) return { ok: false, erro: 'Nível inválido.' }

  const body: Record<string, unknown> = { access_token: creds.accessToken }
  for (const [k, v] of Object.entries(campos)) {
    if (v === undefined || v === null || v === '') continue
    if (!permitidos.includes(k)) continue
    if (k === 'daily_budget_reais') body.daily_budget = Math.round(Number(v) * 100)
    else if (k === 'lifetime_budget_reais') body.lifetime_budget = Math.round(Number(v) * 100)
    else if (k === 'bid_amount_reais') body.bid_amount = Math.round(Number(v) * 100)
    else if (CAMPOS_JSON.has(k)) body[k] = typeof v === 'string' ? v : JSON.stringify(v)
    else body[k] = v
  }

  const chaves = Object.keys(body).filter((k) => k !== 'access_token')
  if (!chaves.length) return { ok: false, erro: 'Nenhum campo válido para editar.' }

  try {
    await $fetch(`${GRAPH}/${id}`, { method: 'POST', body })
    return { ok: true, id }
  } catch (e) {
    return { ok: false, erro: extrairErro(e) }
  }
}

/** Lê os campos atuais de um objeto (para pré-preencher o formulário de edição). */
export async function metaGetObjeto(creds: Credenciais, id: string, nivel: NivelMeta): Promise<{ ok: boolean; erro?: string; dados?: any }> {
  if (!creds.accessToken) return { ok: false, erro: 'Token ausente.' }
  const fields: Record<NivelMeta, string> = {
    campanha: 'name,status,objective,daily_budget,lifetime_budget,bid_strategy',
    conjunto: 'name,status,daily_budget,lifetime_budget,start_time,end_time,optimization_goal,billing_event,bid_amount,targeting',
    anuncio: 'name,status,creative{id}',
  }
  try {
    const dados = await $fetch(`${GRAPH}/${id}`, { query: { fields: fields[nivel], access_token: creds.accessToken } })
    return { ok: true, dados }
  } catch (e) {
    return { ok: false, erro: extrairErro(e) }
  }
}
