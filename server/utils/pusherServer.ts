import Pusher from 'pusher'
import type { ConversationRow, MessageRow } from '../../app/types/database'

/** Canal por empresa para isolamento multi-tenant */
function channelFor(phoneNumberId?: string): string {
  return phoneNumberId ? `chat-${phoneNumberId}` : 'chat'
}

let client: Pusher | null = null

function getPusher(): Pusher | null {
  const c = useRuntimeConfig()
  const appId = (c.pusherAppId || process.env.PUSHER_APP_ID) as string
  const key = (c.public?.pusherKey || process.env.PUSHER_KEY) as string
  const secret = (c.pusherSecret || process.env.PUSHER_SECRET) as string
  const cluster = (c.public?.pusherCluster || process.env.PUSHER_CLUSTER) as string

  if (!appId || !key || !secret || !cluster) {
    console.warn('[pusher] não configurado (PUSHER_APP_ID/KEY/SECRET/CLUSTER)')
    return null
  }
  if (!client) client = new Pusher({ appId, key, secret, cluster, useTLS: true })
  return client
}

/** Nova mensagem (recebida ou echo) -> front. Publica no canal da empresa E no global. */
export async function publishNewMessage(conversation: ConversationRow, message: MessageRow) {
  const pusher = getPusher()
  if (!pusher) return

  const channel = channelFor(conversation.phone_number_id)
  try {
    // Publica no canal específico da empresa
    await pusher.trigger(channel, 'message:new', { conversation, message })
    // Publica também no canal global (fallback para clientes que ainda não migraram)
    if (channel !== 'chat') {
      await pusher.trigger('chat', 'message:new', { conversation, message })
    }
  } catch (e) {
    console.error('[pusher] publishNewMessage:', e)
  }
}

/** Atualização de status (sent/delivered/read) -> front. Publica em todos (global) por simplicidade. */
export async function publishStatus(waMessageId: string, status: string) {
  try {
    // Status vai no canal global (não sabemos o phone_number_id aqui facilmente)
    await getPusher()?.trigger('chat', 'message:status', { waMessageId, status })
  } catch (e) {
    console.error('[pusher] publishStatus:', e)
  }
}
