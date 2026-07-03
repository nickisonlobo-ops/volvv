import type { ParsedMessage } from '../utils/webhookParser'

/**
 * Webhook da Datafy (formato Meta). Recebe mensagens/echoes/status,
 * faz upsert da conversa e grava as mensagens no Supabase (idempotente).
 *
 * Datafy não envia header de assinatura por ora (endpoint aberto).
 * TODO: publicar no Pusher após gravar (camada de realtime).
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // log do que chega (debug — remover/condicionar depois)
  console.log('[webhook] <<< payload recebido:\n' + JSON.stringify(body, null, 2))

  const supabase = useSupabaseServer()
  const events = parseWebhook(body)

  for (const ev of events) {
    try {
      if (ev.type === 'status') {
        await supabase
          .from('messages')
          .update({ status: ev.status })
          .eq('wa_message_id', ev.waMessageId)
        await publishStatus(ev.waMessageId, ev.status)
        continue
      }

      await persistMessage(supabase, ev)
    } catch (e) {
      console.error('[webhook] erro ao processar evento:', e)
    }
  }

  console.log(`[webhook] processados ${events.length} eventos`)
  return { ok: true, processed: events.length }
})

async function persistMessage(supabase: ReturnType<typeof useSupabaseServer>, ev: ParsedMessage) {
  if (!ev.phoneNumberId || !ev.contactWaId) return

  // 1) upsert da conversa (por número + contato)
  const conversationId = await upsertConversation(supabase, ev)
  if (!conversationId) return

  // 2) resolve mídia (stub por ora -> media_url nulo)
  const mediaUrl = ev.mediaId ? await resolveMediaUrl(ev.mediaId) : null

  // 3) grava a mensagem (idempotente por wa_message_id)
  const { data: inserted, error } = await supabase
    .from('messages')
    .upsert(
      {
        conversation_id: conversationId,
        wa_message_id: ev.waMessageId,
        direction: ev.direction,
        kind: ev.kind,
        from_wa_id: ev.fromWaId,
        to_wa_id: ev.toWaId ?? null,
        body: ev.body ?? null,
        caption: ev.caption ?? null,
        media_id: ev.mediaId ?? null,
        media_url: mediaUrl,
        status: ev.direction === 'out' ? 'sent' : null,
        wa_timestamp: ev.waTimestamp,
      },
      { onConflict: 'wa_message_id', ignoreDuplicates: true },
    )
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('[webhook] insert message:', error.message)
    return
  }
  // duplicado (já processado) -> não republica
  if (!inserted) return

  // 4) atualiza a prévia/posição da conversa
  const { data: convRow } = await supabase
    .from('conversations')
    .update({
      last_message_preview: previewFor(ev.kind, ev.body, ev.caption),
      last_message_at: ev.waTimestamp,
    })
    .eq('id', conversationId)
    .select('*')
    .single()

  // 5) publica no Pusher pro front atualizar ao vivo
  if (convRow) await publishNewMessage(convRow, inserted)
}

/** Garante a conversa (insert/update) e retorna o id. */
async function upsertConversation(
  supabase: ReturnType<typeof useSupabaseServer>,
  ev: ParsedMessage,
): Promise<string | null> {
  const row: Record<string, unknown> = {
    phone_number_id: ev.phoneNumberId,
    wa_id: ev.contactWaId,
    display_phone_number: ev.displayPhoneNumber ?? null,
    waba_id: ev.wabaId ?? null,
  }
  // só sobrescreve nome/userId quando vierem no payload (echo não traz nome)
  if (ev.contactName) row.contact_name = ev.contactName
  if (ev.contactUserId) row.contact_user_id = ev.contactUserId

  const { data, error } = await supabase
    .from('conversations')
    .upsert(row, { onConflict: 'phone_number_id,wa_id' })
    .select('id')
    .single()

  if (error) {
    console.error('[webhook] upsert conversation:', error.message)
    return null
  }
  return data?.id ?? null
}
