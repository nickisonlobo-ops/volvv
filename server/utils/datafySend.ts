interface SendResponse {
  messages?: { id: string }[]
  contacts?: { wa_id: string }[]
}

/**
 * Envia mensagem de texto via Datafy (padrão Cloud API):
 *   POST {DATAFY_API_URL}/v1/{phoneNumberId}/messages
 *   Authorization: Bearer {DATAFY_NUMBER_TOKEN}
 * Retorna o wamid da mensagem criada (ou null).
 */
export async function sendTextMessage(
  phoneNumberId: string,
  to: string,
  text: string,
): Promise<string | null> {
  const config = useRuntimeConfig()
  const base = (config.datafyApiUrl || process.env.DATAFY_API_URL) as string
  const token = (config.datafyNumberToken || process.env.DATAFY_NUMBER_TOKEN) as string

  if (!base || !token) {
    throw createError({
      statusCode: 500,
      message: 'Datafy não configurado (DATAFY_API_URL / DATAFY_NUMBER_TOKEN).',
    })
  }

  console.log(`[send] enviando para ${to} via ${base}/v1/${phoneNumberId}/messages`)

  const res = await $fetch<SendResponse>(`${base}/v1/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text },
    },
  })

  console.log(`[send] resposta:`, JSON.stringify(res))
  return res?.messages?.[0]?.id ?? null
}
