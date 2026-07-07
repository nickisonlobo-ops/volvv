/**
 * Executa uma AÇÃO de escrita numa plataforma de marketing.
 * Hoje: Meta Ads (requer token com escopo ads_management).
 * Lê a credencial server-side (service role) — token nunca vai ao front.
 *
 * Body: { empresa_id, plataforma, acao, ...params }
 *   acao = 'status'   → { objeto_id, status: 'ACTIVE'|'PAUSED' }
 *   acao = 'budget'   → { objeto_id, valor, tipo?: 'diario'|'total' }
 *   acao = 'criar'    → { nome, objetivo?, orcamento_diario?, ativar? }
 *   acao = 'excluir'  → { objeto_id }
 */
import type { Plataforma } from '../../utils/marketing/types'
import { getIntegracao } from '../../utils/marketing/marketingConfig'
import { metaSetStatus, metaSetBudget, metaCreateCampaign, metaDeleteCampaign } from '../../utils/marketing/metaActions'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const empresaId = body?.empresa_id
  const plataforma = body?.plataforma as Plataforma
  const acao = body?.acao as string

  if (!empresaId || !plataforma || !acao) {
    throw createError({ statusCode: 400, message: 'empresa_id, plataforma e acao são obrigatórios' })
  }
  if (plataforma !== 'meta') {
    throw createError({ statusCode: 400, message: 'Ações disponíveis apenas para Meta no momento.' })
  }

  const creds = await getIntegracao(empresaId, plataforma)
  if (!creds || !creds.accessToken) {
    throw createError({ statusCode: 400, message: 'Integração Meta não conectada.' })
  }

  let res
  switch (acao) {
    case 'status': {
      const status = body.status === 'ACTIVE' ? 'ACTIVE' : 'PAUSED'
      if (!body.objeto_id) throw createError({ statusCode: 400, message: 'objeto_id obrigatório' })
      res = await metaSetStatus(creds, String(body.objeto_id), status)
      break
    }
    case 'budget': {
      if (!body.objeto_id) throw createError({ statusCode: 400, message: 'objeto_id obrigatório' })
      res = await metaSetBudget(creds, String(body.objeto_id), Number(body.valor), body.tipo === 'total' ? 'total' : 'diario')
      break
    }
    case 'criar': {
      if (!body.nome) throw createError({ statusCode: 400, message: 'nome obrigatório' })
      res = await metaCreateCampaign(creds, {
        nome: String(body.nome),
        objetivo: body.objetivo ? String(body.objetivo) : undefined,
        orcamentoDiarioReais: body.orcamento_diario ? Number(body.orcamento_diario) : undefined,
        ativar: !!body.ativar,
      })
      break
    }
    case 'excluir': {
      if (!body.objeto_id) throw createError({ statusCode: 400, message: 'objeto_id obrigatório' })
      res = await metaDeleteCampaign(creds, String(body.objeto_id))
      break
    }
    default:
      throw createError({ statusCode: 400, message: `Ação desconhecida: ${acao}` })
  }

  if (!res.ok) {
    throw createError({ statusCode: 502, message: res.erro || 'Falha na ação Meta.' })
  }
  return res
})
