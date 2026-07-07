/**
 * Escolhe qual Página do Facebook alimenta a central de mensagens
 * (Instagram/Messenger) — independente da Página usada em anúncios.
 * Busca o Page Access Token + Instagram vinculado na hora e persiste.
 * Body: { empresa_id, page_id }
 */
import { selecionarPaginaMensageria } from '../../utils/marketing/marketingConfig'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const empresaId = body?.empresa_id
  const pageId = body?.page_id

  if (!empresaId || !pageId) {
    throw createError({ statusCode: 400, message: 'empresa_id e page_id são obrigatórios' })
  }

  const res = await selecionarPaginaMensageria(empresaId, String(pageId))
  if (!res.ok) {
    throw createError({ statusCode: 502, message: res.erro || 'Falha ao selecionar a Página.' })
  }
  return res
})
