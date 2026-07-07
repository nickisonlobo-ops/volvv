import type { Kind } from '../../app/types/chat'
import type { ParsedEvent, Canal } from './webhookParser'

/**
 * Normaliza o webhook NATIVO de mensagens do Instagram/Messenger (produto
 * "Messenger Platform" / "Instagram API with Instagram Login") em uma lista
 * plana de eventos, no mesmo formato usado pelo parser do WhatsApp
 * (webhookParser.ts) — reaproveita phoneNumberId/contactWaId como
 * identificadores genéricos de "caixa de entrada" e "contato externo".
 *
 * Formato (bem diferente do WhatsApp — usa `messaging[]` direto na entry,
 * não `changes[].value`):
 *   { object: 'instagram'|'page', entry: [{ id, time, messaging: [
 *       { sender:{id}, recipient:{id}, timestamp, message:{ mid, text?, attachments?, is_echo? } }
 *   ] }] }
 */

function canalDoObjeto(object: unknown): Canal | null {
  if (object === 'instagram') return 'instagram'
  if (object === 'page') return 'facebook'
  return null
}

function toIso(ts: unknown): string {
  const n = Number(ts)
  // Messenger/Instagram mandam timestamp em milissegundos (ao contrário do WhatsApp, em segundos).
  return Number.isFinite(n) ? new Date(n).toISOString() : new Date().toISOString()
}

/** Extrai tipo + conteúdo de uma mensagem do Messenger/Instagram. */
function extractContent(m: any): { kind: Kind; body?: string; caption?: string; mediaId?: string } {
  const att = m?.attachments?.[0]
  if (!att) return { kind: 'text', body: m?.text }
  switch (att.type) {
    case 'image':
      return { kind: 'image', mediaId: att.payload?.url }
    case 'video':
      return { kind: 'video', mediaId: att.payload?.url }
    case 'audio':
      return { kind: 'audio', mediaId: att.payload?.url }
    case 'file':
      return { kind: 'document', mediaId: att.payload?.url }
    default:
      return { kind: 'text', body: `[tipo não suportado: ${att.type}]` }
  }
}

export function parseMetaMessagingWebhook(body: any): ParsedEvent[] {
  const canal = canalDoObjeto(body?.object)
  if (!canal || !Array.isArray(body?.entry)) return []

  const events: ParsedEvent[] = []

  for (const entry of body.entry) {
    const inboxId: string | undefined = entry?.id
    for (const ev of entry?.messaging ?? []) {
      const senderId: string | undefined = ev?.sender?.id
      const recipientId: string | undefined = ev?.recipient?.id
      if (!senderId || !recipientId) continue

      if (ev.message?.mid) {
        const isEcho = !!ev.message.is_echo
        // Mensagem nossa (echo): sender = nossa própria Página/conta. Mensagem recebida: sender = o contato.
        const contactId = isEcho ? recipientId : senderId
        events.push({
          type: 'message',
          direction: isEcho ? 'out' : 'in',
          canal,
          phoneNumberId: inboxId,
          contactWaId: contactId,
          waMessageId: ev.message.mid,
          fromWaId: senderId,
          toWaId: recipientId,
          ...extractContent(ev.message),
          waTimestamp: toIso(ev.timestamp),
        })
      }
      // Recibos de entrega (delivery.mids[]) — leitura (read) não traz mids específicos
      // (só um watermark de timestamp), por isso não dá pra mapear pra uma mensagem só.
      if (Array.isArray(ev.delivery?.mids)) {
        for (const mid of ev.delivery.mids) {
          events.push({ type: 'status', canal, waMessageId: mid, status: 'delivered', waTimestamp: toIso(ev.delivery.watermark) })
        }
      }
    }
  }

  return events
}
