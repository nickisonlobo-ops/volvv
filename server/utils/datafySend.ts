interface SendResponse {
  messages?: { id: string }[]
  contacts?: { wa_id: string }[]
}

/**
 * Envia mensagem de texto via Datafy (padrão Cloud API):
 *   POST {apiUrl}/v1/{phoneNumberId}/messages
 *   Authorization: Bearer {token}
 *
 * Resolve credenciais via whatsapp_config (multi-tenant) com fallback para env.
 */
export async function sendTextMessage(
  phoneNumberId: string,
  to: string,
  text: string,
): Promise<string | null> {
  const creds = await getWhatsAppCredentials(phoneNumberId)

  console.log(`[send] enviando para ${to} via ${creds.apiUrl}/v1/${phoneNumberId}/messages`)

  const res = await $fetch<SendResponse>(`${creds.apiUrl}/v1/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${creds.token}` },
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
