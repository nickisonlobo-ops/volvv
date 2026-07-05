import type { ParsedMessage } from '../utils/webhookParser'

/**
 * Webhook da Datafy (formato Meta). Recebe mensagens/echoes/status,
 * faz upsert da conversa e grava as mensagens no Supabase (idempotente).
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('[webhook] <<< payload recebido:\n' + JSON.stringify(body, null, 2))

  try {
    const supabase = useSupabaseServer()
    const events = parseWebhook(body)

    console.log(`[webhook] parseou ${events.length} eventos`)

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
      } catch (e: any) {
        console.error('[webhook] erro ao processar evento:', e?.message || e)
      }
    }

    console.log(`[webhook] processados ${events.length} eventos OK`)
    return { ok: true, processed: events.length }
  } catch (e: any) {
    console.error('[webhook] erro geral:', e?.message || e)
    return { ok: false, error: e?.message || 'erro interno' }
  }
})

async function persistMessage(supabase: ReturnType<typeof useSupabaseServer>, ev: ParsedMessage) {
  if (!ev.phoneNumberId || !ev.contactWaId) {
    console.warn('[webhook] mensagem sem phoneNumberId ou contactWaId, ignorando')
    return
  }

  const conversationId = await upsertConversation(supabase, ev)
  if (!conversationId) return

  const mediaUrl = ev.mediaId ? await resolveMediaUrl(ev.mediaId, ev.phoneNumberId) : null

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
  if (!inserted) return

  // Incrementa unread_count se mensagem recebida (in)
  const updatePayload: Record<string, unknown> = {
    last_message_preview: previewFor(ev.kind, ev.body, ev.caption),
    last_message_at: ev.waTimestamp,
  }
  if (ev.direction === 'in') {
    // Incrementa via RPC ou raw query
    await supabase.rpc('increment_unread', { conv_id: conversationId }).catch(() => {
      // Fallback: se RPC nao existe, faz update direto
      supabase.from('conversations').update({ unread_count: 999 }).eq('id', conversationId)
    })
  }

  const { data: convRow } = await supabase
    .from('conversations')
    .update(updatePayload)
    .eq('id', conversationId)
    .select('*')
    .single()

  if (convRow) await publishNewMessage(convRow, inserted)
}

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
