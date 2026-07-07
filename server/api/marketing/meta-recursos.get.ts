/**
 * Recursos da conta Meta para os dropdowns do painel.
 *   ?empresa_id=X                         → { conta, paginas, pixels }
 *   ?empresa_id=X&q=texto                 → { interesses }
 *   ?empresa_id=X&tipo=T&q=texto          → busca de segmentação:
 *        tipo = comportamentos | demografia | eventos | localidades | idiomas
 *   ?empresa_id=X&tipo=audiences          → { audiences } (públicos personalizados)
 */
import { getIntegracao } from '../../utils/marketing/marketingConfig'
import {
  metaGetRecursos, metaSearchInterests, metaSearchTargeting,
  metaSearchLocations, metaSearchLocales, metaGetAudiences,
} from '../../utils/marketing/metaResources'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const empresaId = q.empresa_id as string | undefined
  if (!empresaId) throw createError({ statusCode: 400, message: 'empresa_id obrigatório' })

  const creds = await getIntegracao(empresaId, 'meta')
  if (!creds || !creds.accessToken) {
    throw createError({ statusCode: 400, message: 'Integração Meta não conectada.' })
  }

  const busca = (q.q as string) || ''
  const tipo = (q.tipo as string) || ''

  if (tipo === 'audiences') return { audiences: await metaGetAudiences(creds) }
  if (tipo === 'localidades') return { resultados: await metaSearchLocations(creds, busca) }
  if (tipo === 'idiomas') return { resultados: await metaSearchLocales(creds, busca) }
  if (tipo === 'comportamentos') return { resultados: await metaSearchTargeting(creds, busca, 'behaviors') }
  if (tipo === 'demografia') return { resultados: await metaSearchTargeting(creds, busca, 'demographics') }
  if (tipo === 'eventos') return { resultados: await metaSearchTargeting(creds, busca, 'life_events') }

  if (busca) return { interesses: await metaSearchInterests(creds, busca) }
  return await metaGetRecursos(creds)
})
