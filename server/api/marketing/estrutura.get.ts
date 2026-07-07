/**
 * Estrutura de uma campanha Meta: conjuntos + anúncios.
 * ?empresa_id=X&campanha_id=Y
 */
import { getIntegracao } from '../../utils/marketing/marketingConfig'
import { metaGetEstrutura } from '../../utils/marketing/metaResources'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const empresaId = q.empresa_id as string | undefined
  const campanhaId = q.campanha_id as string | undefined
  if (!empresaId || !campanhaId) {
    throw createError({ statusCode: 400, message: 'empresa_id e campanha_id obrigatórios' })
  }

  const creds = await getIntegracao(empresaId, 'meta')
  if (!creds || !creds.accessToken) {
    throw createError({ statusCode: 400, message: 'Integração Meta não conectada.' })
  }

  return await metaGetEstrutura(creds, campanhaId)
})
