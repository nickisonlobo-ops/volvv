import { getCredenciaisMensageriaPorInbox } from '../../utils/marketing/marketingConfig'
import { sendMetaMessage } from '../../utils/metaMessagingSend'

/**
 * Envia uma mensagem de texto pela conversa informada.
 * body: { conversationId: string, text: string }
 *
 * Resolve o contato/inbox pela conversa e envia pelo canal certo — WhatsApp
 * (via Datafy) ou Instagram/Messenger (via Meta Send API, com o Page Access
 * Token da integração conectada) — persiste a mensagem (out, status 'sent')
 * e atualiza a prévia da conversa. O echo/status que voltarem pelo webhook
 * são idempotentes (wa_message_id).
 */
export default defineEventHandler(async (event) => {
  const { conversationId, text } = await readBody<{ conversationId?: string; text?: string }>(event)

  if (!conversationId || !text?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'conversationId e text são obrigatórios' })
  }

  const supabase = useSupabaseServer()

  // 1) dados da conversa (destinatário + inbox)
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .select('id, wa_id, phone_number_id, display_phone_number, canal')
    .eq('id', conversationId)
    .single()

  if (convErr || !conv) {
    throw createError({ statusCode: 404, statusMessage: 'conversa não encontrada' })
  }

  const canal = conv.canal ?? 'whatsapp'

  // 2) envia pelo canal certo
  let waMessageId: string | null = null
  if (canal === 'whatsapp') {
    waMessageId = await sendTextMessage(conv.phone_number_id, conv.wa_id, text.trim())
  } else {
    const cred = await getCredenciaisMensageriaPorInbox(conv.phone_number_id)
    if (!cred) {
      throw createError({ statusCode: 400, statusMessage: 'Integração Meta sem Page Access Token configurado. Reconecte em Configurações → Marketing.' })
    }
    const res = await sendMetaMessage(conv.phone_number_id, conv.wa_id, text.trim(), cred.pageAccessToken)
    if (!res.ok) {
      throw createError({ statusCode: 502, statusMessage: res.erro || 'Falha ao enviar mensagem.' })
    }
    waMessageId = res.id ?? null
  }

  // 3) persiste a mensagem enviada
  const nowIso = new Date().toISOString()
  const { data: inserted, error: insErr } = await supabase
    .from('messages')
    .upsert(
      {
        conversation_id: conv.id,
        wa_message_id: waMessageId,
        canal,
        direction: 'out',
        kind: 'text',
        from_wa_id: conv.display_phone_number,
        to_wa_id: conv.wa_id,
        body: text.trim(),
        status: 'sent',
        wa_timestamp: nowIso,
      },
      { onConflict: 'wa_message_id', ignoreDuplicates: true },
    )
    .select('*')
    .maybeSingle()

  if (insErr) {
    console.error('[send] insert message:', insErr.message)
  }

  // 4) atualiza a prévia/posição da conversa
  await supabase
    .from('conversations')
    .update({ last_message_preview: text.trim(), last_message_at: nowIso })
    .eq('id', conv.id)

  return { ok: true, waMessageId, message: inserted ?? null }
})
