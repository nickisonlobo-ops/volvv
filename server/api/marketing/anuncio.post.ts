/**
 * Cria um ANÚNCIO COMPLETO na Meta: campanha → conjunto → criativo → anúncio.
 * Requer token com escopo ads_management + Page ID do Facebook.
 *
 * Body: {
 *   empresa_id,
 *   campanha_id?,          // usa campanha existente; se ausente, cria nova
 *   campanha_nome?, objetivo?,
 *   nome, orcamento_diario, paises?, idade_min?, idade_max?,
 *   page_id?,              // se ausente, usa o da integração
 *   link, mensagem, titulo?, descricao?, imagem_url?, cta?, instagram_actor_id?,
 *   ativar?
 * }
 */
import { getIntegracao } from '../../utils/marketing/marketingConfig'
import { metaCreateFullAd } from '../../utils/marketing/metaActions'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const empresaId = body?.empresa_id
  if (!empresaId) throw createError({ statusCode: 400, message: 'empresa_id obrigatório' })
  if (!body?.nome) throw createError({ statusCode: 400, message: 'nome do anúncio obrigatório' })
  if (!body?.link) throw createError({ statusCode: 400, message: 'link de destino obrigatório' })
  if (!body?.mensagem) throw createError({ statusCode: 400, message: 'mensagem (texto do anúncio) obrigatória' })

  const creds = await getIntegracao(empresaId, 'meta')
  if (!creds || !creds.accessToken) {
    throw createError({ statusCode: 400, message: 'Integração Meta não conectada.' })
  }

  const res = await metaCreateFullAd(creds, {
    campanhaId: body.campanha_id ? String(body.campanha_id) : undefined,
    campanhaNome: body.campanha_nome ? String(body.campanha_nome) : undefined,
    objetivo: body.objetivo ? String(body.objetivo) : undefined,
    nome: String(body.nome),
    orcamentoDiarioReais: body.orcamento_diario ? Number(body.orcamento_diario) : undefined,
    orcamentoTotalReais: body.orcamento_total ? Number(body.orcamento_total) : undefined,
    bidStrategy: body.bid_strategy ? String(body.bid_strategy) : undefined,
    bidAmountReais: body.bid_amount ? Number(body.bid_amount) : undefined,
    optimizationGoal: body.optimization_goal ? String(body.optimization_goal) : undefined,
    billingEvent: body.billing_event ? String(body.billing_event) : undefined,
    inicio: body.inicio ? String(body.inicio) : undefined,
    fim: body.fim ? String(body.fim) : undefined,
    daypartingHoras: Array.isArray(body.dayparting_horas) ? body.dayparting_horas.map(Number) : undefined,
    paises: Array.isArray(body.paises) ? body.paises : undefined,
    cidades: Array.isArray(body.cidades) ? body.cidades : undefined,
    raioKm: body.raio_km ? Number(body.raio_km) : undefined,
    idadeMin: body.idade_min ? Number(body.idade_min) : undefined,
    idadeMax: body.idade_max ? Number(body.idade_max) : undefined,
    generos: Array.isArray(body.generos) ? body.generos.map(Number) : undefined,
    idiomas: Array.isArray(body.idiomas) ? body.idiomas.map(Number) : undefined,
    interesses: Array.isArray(body.interesses) ? body.interesses : undefined,
    comportamentos: Array.isArray(body.comportamentos) ? body.comportamentos : undefined,
    exclusoesInteresses: Array.isArray(body.exclusoes) ? body.exclusoes : undefined,
    publicosIncluir: Array.isArray(body.publicos_incluir) ? body.publicos_incluir : undefined,
    publicosExcluir: Array.isArray(body.publicos_excluir) ? body.publicos_excluir : undefined,
    plataformas: Array.isArray(body.plataformas) ? body.plataformas : undefined,
    posFacebook: Array.isArray(body.pos_facebook) ? body.pos_facebook : undefined,
    posInstagram: Array.isArray(body.pos_instagram) ? body.pos_instagram : undefined,
    dispositivos: Array.isArray(body.dispositivos) ? body.dispositivos : undefined,
    pixelId: body.pixel_id ? String(body.pixel_id) : undefined,
    eventoConversao: body.evento_conversao ? String(body.evento_conversao) : undefined,
    formato: (body.formato as 'imagem' | 'video' | 'carrossel') || 'imagem',
    pageId: body.page_id ? String(body.page_id) : (creds.pageId || ''),
    linkDestino: String(body.link),
    mensagem: String(body.mensagem),
    titulo: body.titulo ? String(body.titulo) : undefined,
    descricao: body.descricao ? String(body.descricao) : undefined,
    cta: body.cta ? String(body.cta) : undefined,
    instagramActorId: body.instagram_actor_id ? String(body.instagram_actor_id) : undefined,
    imagemUrl: body.imagem_url ? String(body.imagem_url) : undefined,
    imagemBase64: body.imagem_base64 ? String(body.imagem_base64) : undefined,
    videoId: body.video_id ? String(body.video_id) : undefined,
    videoUrl: body.video_url ? String(body.video_url) : undefined,
    videoThumbUrl: body.video_thumb_url ? String(body.video_thumb_url) : undefined,
    cards: Array.isArray(body.cards) ? body.cards : undefined,
    ativar: !!body.ativar,
  })

  if (!res.ok) {
    throw createError({ statusCode: 502, message: res.erro || 'Falha ao criar anúncio.', data: res })
  }
  return res
})
