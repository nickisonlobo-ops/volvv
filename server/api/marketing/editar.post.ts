/**
 * Edita um objeto Meta (campanha / conjunto / anúncio).
 * Body: { empresa_id, id, nivel: 'campanha'|'conjunto'|'anuncio', campos: {...} }
 *   campos usa nomes amigáveis: daily_budget_reais, lifetime_budget_reais, bid_amount_reais em R$.
 */
import { getIntegracao } from '../../utils/marketing/marketingConfig'
import { metaEditObjeto, type NivelMeta } from '../../utils/marketing/metaEdit'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const empresaId = body?.empresa_id
  const id = body?.id
  const nivel = body?.nivel as NivelMeta
  if (!empresaId || !id || !nivel) {
    throw createError({ statusCode: 400, message: 'empresa_id, id e nivel são obrigatórios' })
  }
  if (!['campanha', 'conjunto', 'anuncio'].includes(nivel)) {
    throw createError({ statusCode: 400, message: 'nivel inválido' })
  }

  const creds = await getIntegracao(empresaId, 'meta')
  if (!creds || !creds.accessToken) {
    throw createError({ statusCode: 400, message: 'Integração Meta não conectada.' })
  }

  const res = await metaEditObjeto(creds, String(id), nivel, body.campos || {})
  if (!res.ok) throw createError({ statusCode: 502, message: res.erro || 'Falha ao editar.' })
  return res
})
