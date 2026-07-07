// ═══════════════════════════════════════════════════════════════
// Envio de mensagens via Meta Send API (Messenger + Instagram).
// Docs: https://developers.facebook.com/docs/messenger-platform/reference/send-api
// ═══════════════════════════════════════════════════════════════

const GRAPH = 'https://graph.facebook.com/v21.0'

/**
 * Envia uma mensagem de texto pelo Messenger (Página do Facebook) ou pelo
 * Instagram Direct. inboxId = Page ID (facebook) ou ID da conta comercial
 * do Instagram (instagram); recipientId = PSID/IGSID do contato.
 * Exige o Page Access Token (não é o mesmo token de anúncios).
 */
export async function sendMetaMessage(
  inboxId: string,
  recipientId: string,
  text: string,
  pageAccessToken: string,
): Promise<{ ok: boolean; id?: string; erro?: string }> {
  if (!pageAccessToken) {
    return { ok: false, erro: 'Page Access Token não configurado. Reconecte a integração Meta com uma Página válida em Configurações → Marketing.' }
  }
  try {
    const res = await $fetch<{ message_id?: string }>(`${GRAPH}/${inboxId}/messages`, {
      method: 'POST',
      body: {
        recipient: { id: recipientId },
        message: { text },
        messaging_type: 'RESPONSE',
        access_token: pageAccessToken,
      },
    })
    return { ok: true, id: res.message_id }
  } catch (e: any) {
    return { ok: false, erro: e?.data?.error?.error_user_msg || e?.data?.error?.message || e?.message || 'Falha ao enviar mensagem.' }
  }
}
