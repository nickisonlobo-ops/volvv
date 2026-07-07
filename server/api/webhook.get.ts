/**
 * GET /api/webhook
 *
 * Handshake de verificação exigido pela Meta ao cadastrar a "URL de callback"
 * de um webhook nativo (ex: Instagram messaging/comments) no App Dashboard:
 * a Meta chama este endpoint com hub.mode=subscribe, hub.verify_token e
 * hub.challenge — se o token bater com META_WEBHOOK_VERIFY_TOKEN, respondemos
 * com o valor de hub.challenge em texto puro (é exatamente isso que a Meta espera).
 *
 * Sem esses parâmetros (ex: visita manual no navegador pra testar o túnel/URL),
 * mantém o sanity check simples de sempre.
 */
export default defineEventHandler((event) => {
  const q = getQuery(event)
  const mode = q['hub.mode']
  const token = q['hub.verify_token']
  const challenge = q['hub.challenge']

  if (mode || token || challenge) {
    const config = useRuntimeConfig()
    const esperado = config.metaWebhookVerifyToken
    if (mode === 'subscribe' && esperado && token === esperado) {
      return String(challenge ?? '')
    }
    throw createError({ statusCode: 403, message: 'Token de verificação inválido.' })
  }

  return { ok: true, service: 'webhook', method: 'GET' }
})
