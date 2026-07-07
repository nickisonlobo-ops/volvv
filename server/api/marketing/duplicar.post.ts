/**
 * Duplica um objeto Meta (campanha / conjunto / anúncio). Cópia vem PAUSADA.
 * Body: { empresa_id, id, nivel, deep?, sufixo? }
 */
import { getIntegracao } from '../../utils/marketing/marketingConfig'
import { metaDuplicar } from '../../utils/marketing/metaDuplicate'
import type { NivelMeta } from '../../utils/marketing/metaEdit'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const empresaId = body?.empresa_id
  const id = body?.id
  const nivel = body?.nivel as NivelMeta
  if (!empresaId || !id || !nivel) {
    throw createError({ statusCode: 400, message: 'empresa_id, id e nivel são obrigatórios' })
  }

  const creds = await getIntegracao(empresaId, 'meta')
  if (!creds || !creds.accessToken) {
    throw createError({ statusCode: 400, message: 'Integração Meta não conectada.' })
  }

  const res = await metaDuplicar(creds, String(id), nivel, { deep: body.deep !== false, sufixo: body.sufixo || ' — cópia' })
  if (!res.ok) throw createError({ statusCode: 502, message: res.erro || 'Falha ao duplicar.' })
  return res
})
