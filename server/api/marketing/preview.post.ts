/**
 * Gera uma prévia REAL do anúncio (iframe oficial da Meta), sem criar nenhum objeto.
 * Usado pelo wizard de "Novo anúncio" pra mostrar exatamente como o anúncio vai renderizar.
 *
 * Body: mesmos campos de criativo do /api/marketing/anuncio (formato, page_id, link, mensagem,
 *   titulo?, descricao?, cta?, imagem_url?, imagem_base64?, video_*?, cards?, instagram_actor_id?)
 *   + ad_format (ex: MOBILE_FEED_STANDARD, FACEBOOK_STORY_MOBILE)
 */
import { getIntegracao } from '../../utils/marketing/marketingConfig'
import { metaGeneratePreview } from '../../utils/marketing/metaActions'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const empresaId = body?.empresa_id
  if (!empresaId) throw createError({ statusCode: 400, message: 'empresa_id obrigatório' })

  const creds = await getIntegracao(empresaId, 'meta')
  if (!creds || !creds.accessToken) {
    throw createError({ statusCode: 400, message: 'Integração Meta não conectada.' })
  }

  const res = await metaGeneratePreview(
    creds,
    {
      nome: 'preview',
      formato: (body.formato as 'imagem' | 'video' | 'carrossel') || 'imagem',
      pageId: body.page_id ? String(body.page_id) : '',
      linkDestino: String(body.link || ''),
      mensagem: String(body.mensagem || ''),
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
    },
    body.ad_format ? String(body.ad_format) : 'MOBILE_FEED_STANDARD',
  )

  if (!res.ok) {
    throw createError({ statusCode: 502, message: res.erro || 'Falha ao gerar prévia.', data: res })
  }
  return res
})
