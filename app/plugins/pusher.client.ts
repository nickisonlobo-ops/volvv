import Pusher from 'pusher-js'

/**
 * Assina o canal do Pusher (client-only) e repassa os eventos pro store:
 *  - message:new    -> nova mensagem (recebida ou echo)
 *  - message:status -> atualização de status (sent/delivered/read)
 *
 * Canal por empresa: chat-{phone_number_id} (multi-tenant)
 * Também ouve o canal global 'chat' para status updates.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const key = config.public.pusherKey as string
  const cluster = config.public.pusherCluster as string

  if (!key || !cluster) {
    console.warn('[pusher] client não configurado (PUSHER_KEY / PUSHER_CLUSTER)')
    return
  }

  const chat = useChatStore()
  const empresaId = useState<number | null>('empresa_id', () => null)
  const pusher = new Pusher(key, { cluster })

  // Canal global para status e mensagens (fallback)
  const globalChannel = pusher.subscribe('chat')
  globalChannel.bind('message:status', (data: any) => {
    if (data?.waMessageId && data?.status) {
      chat.onRealtimeStatus(data.waMessageId, data.status)
    }
  })
  globalChannel.bind('message:new', (data: any) => {
    if (data?.conversation && data?.message) {
      chat.onRealtimeMessage(data.conversation, data.message)
    }
  })

  // Subscribe ao canal da empresa quando empresa_id estiver disponível
  let empresaChannel: any = null

  async function subscribeEmpresa() {
    const empId = empresaId.value
    if (!empId) return

    try {
      const cfg = await $fetch<any>('/api/whatsapp-config', { query: { empresa_id: empId } })
      if (cfg?.phone_number_id) {
        const channelName = `chat-${cfg.phone_number_id}`

        // Desinscreve do anterior se existir
        if (empresaChannel) {
          empresaChannel.unbind_all()
          pusher.unsubscribe(empresaChannel.name)
        }

        empresaChannel = pusher.subscribe(channelName)
        empresaChannel.bind('message:new', (data: any) => {
          if (data?.conversation && data?.message) {
            chat.onRealtimeMessage(data.conversation, data.message)
          }
        })
        empresaChannel.bind('message:status', (data: any) => {
          if (data?.waMessageId && data?.status) {
            chat.onRealtimeStatus(data.waMessageId, data.status)
          }
        })
        console.log(`[pusher] subscrito em ${channelName}`)
      }
    } catch (e) {
      console.warn('[pusher] falha ao buscar config da empresa:', e)
      // Fallback: subscribe no canal global para message:new também
      globalChannel.bind('message:new', (data: any) => {
        if (data?.conversation && data?.message) {
          chat.onRealtimeMessage(data.conversation, data.message)
        }
      })
    }
  }

  // Watch empresa_id e subscribe quando mudar
  watch(empresaId, () => subscribeEmpresa(), { immediate: true })
})
