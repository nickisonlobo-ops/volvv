import { defineStore } from 'pinia'
import type { Conversa, Mensagem, MensagemBalao } from '~/types/chat'
import type { ConversationRow, MessageRow, Canal } from '~/types/database'
import { mapConversa, mapMensagem } from '~/utils/chatMappers'

/**
 * Central de mensagens — Instagram e Facebook (Meta), via API nativa (não
 * passa pela Datafy). Espelha app/stores/chat.ts (WhatsApp), que fica
 * intocado, mas parametrizado por `canal` pra poder alternar Instagram <->
 * Facebook na mesma tela sem misturar os dados.
 */

const CONV_PAGE = 20
const MSG_PAGE = 50

interface MsgCache {
  items: Mensagem[]
  hasMore: boolean
}

export const useMensagensMetaStore = defineStore('mensagensMeta', () => {
  const currentEmpresaId = useState<number | null>('empresa_id', () => null)
  const canal = ref<Extract<Canal, 'instagram' | 'facebook'>>('instagram')
  let lastLoadedKey = ''

  const conversas = ref<Conversa[]>([])
  const conversasLoaded = ref(false)
  const hasMoreConversas = ref(true)
  const loadingConversas = ref(false)

  const msgCache = reactive<Record<string, MsgCache>>({})
  const loadingMensagens = ref(false)
  const loadingOlder = ref(false)

  const activeId = ref('')
  let tmpSeq = 0

  const mensagens = computed<Mensagem[]>(() => msgCache[activeId.value]?.items ?? [])
  const hasMoreMensagens = computed(() => msgCache[activeId.value]?.hasMore ?? false)

  function resetEstado() {
    conversas.value = []
    hasMoreConversas.value = true
    activeId.value = ''
    Object.keys(msgCache).forEach((k) => delete msgCache[k])
    conversasLoaded.value = false
  }

  /** Troca o canal exibido (Instagram <-> Facebook) e recarrega do zero. */
  function setCanal(novoCanal: 'instagram' | 'facebook') {
    if (canal.value === novoCanal) return
    canal.value = novoCanal
    resetEstado()
    loadConversas()
  }

  /** Força recarregar do zero (ex: depois de trocar a Página selecionada). */
  function forceReload() {
    resetEstado()
    loadConversas()
  }

  async function loadConversas() {
    const key = `${currentEmpresaId.value}:${canal.value}`
    if (conversasLoaded.value && lastLoadedKey === key) {
      if (!activeId.value && conversas.value.length) selectConversa(conversas.value[0]!.id)
      return
    }
    resetEstado()
    await loadMoreConversas(true)
    conversasLoaded.value = true
    lastLoadedKey = key
    if (!activeId.value && conversas.value.length) selectConversa(conversas.value[0]!.id)
  }

  async function loadMoreConversas(reset = false) {
    if (loadingConversas.value) return
    if (!reset && !hasMoreConversas.value) return
    loadingConversas.value = true
    try {
      const offset = reset ? 0 : conversas.value.length
      const rows = await $fetch<ConversationRow[]>('/api/conversations', {
        query: { limit: CONV_PAGE, offset, empresa_id: currentEmpresaId.value || undefined, canal: canal.value },
      })
      const mapped = rows.map(mapConversa)
      conversas.value = reset ? mapped : [...conversas.value, ...mapped]
      hasMoreConversas.value = rows.length === CONV_PAGE
    } catch (e) {
      console.error('[mensagensMeta] conversas:', e)
    } finally {
      loadingConversas.value = false
    }
  }

  function selectConversa(id: string) {
    activeId.value = id
    if (!msgCache[id]) loadFirstMensagens(id)
  }

  async function loadFirstMensagens(id: string) {
    loadingMensagens.value = true
    try {
      const rows = await $fetch<MessageRow[]>(`/api/conversations/${id}/messages`, {
        query: { limit: MSG_PAGE, offset: 0 },
      })
      msgCache[id] = { items: rows.map(mapMensagem).reverse(), hasMore: rows.length === MSG_PAGE }
    } catch (e) {
      console.error('[mensagensMeta] mensagens:', e)
    } finally {
      loadingMensagens.value = false
    }
  }

  async function loadOlderMensagens() {
    const id = activeId.value
    const cache = msgCache[id]
    if (loadingOlder.value || !cache?.hasMore || !id) return
    loadingOlder.value = true
    try {
      const rows = await $fetch<MessageRow[]>(`/api/conversations/${id}/messages`, {
        query: { limit: MSG_PAGE, offset: cache.items.length },
      })
      const older = rows.map(mapMensagem).reverse()
      cache.items = [...older, ...cache.items]
      cache.hasMore = rows.length === MSG_PAGE
    } catch (e) {
      console.error('[mensagensMeta] mensagens (older):', e)
    } finally {
      loadingOlder.value = false
    }
  }

  function pushMensagem(conversationId: string, msg: MensagemBalao, preview?: string) {
    const cache = msgCache[conversationId]
    if (cache) {
      if (msg.waMessageId && cache.items.some((m) => m.type === 'msg' && m.waMessageId === msg.waMessageId)) return
      cache.items = [...cache.items, msg]
    }
    const idx = conversas.value.findIndex((c) => c.id === conversationId)
    if (idx >= 0) {
      const conv = { ...conversas.value[idx]!, time: msg.time ?? '', preview: preview ?? '' }
      conversas.value = [conv, ...conversas.value.filter((_, i) => i !== idx)]
    }
  }

  async function sendMensagem(text: string) {
    const id = activeId.value
    const corpo = text.trim()
    if (!id || !corpo) return

    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const clientId = `tmp-${++tmpSeq}`
    pushMensagem(id, { type: 'msg', kind: 'text', from: 'out', text: corpo, time: hora, status: 'sent', clientId }, corpo)

    try {
      const res = await $fetch<{ waMessageId?: string | null }>('/api/messages/send', {
        method: 'POST',
        body: { conversationId: id, text: corpo },
      })
      const wamid = res?.waMessageId
      const cache = msgCache[id]
      if (wamid && cache) {
        cache.items = cache.items.map((m) => (m.type === 'msg' && m.clientId === clientId ? { ...m, waMessageId: wamid } : m))
      }
    } catch (e) {
      console.error('[mensagensMeta] envio falhou:', e)
    }
  }

  /* ---------- realtime (Pusher) ---------- */
  function onRealtimeMessage(convRow: ConversationRow, msgRow: MessageRow) {
    if (convRow.canal !== canal.value) return
    const msg = mapMensagem(msgRow) as MensagemBalao
    const conversationId = convRow.id
    if (!conversas.value.some((c) => c.id === conversationId)) {
      conversas.value = [mapConversa(convRow), ...conversas.value]
    }
    pushMensagem(conversationId, msg, convRow.last_message_preview ?? undefined)
  }

  function onRealtimeStatus(waMessageId: string, status: string) {
    const st = (status === 'failed' ? undefined : status) as MensagemBalao['status']
    for (const cid in msgCache) {
      const items = msgCache[cid]!.items
      const i = items.findIndex((m) => m.type === 'msg' && m.waMessageId === waMessageId)
      if (i >= 0) {
        const next = items.slice()
        next[i] = { ...(items[i] as MensagemBalao), status: st }
        msgCache[cid]!.items = next
        break
      }
    }
  }

  return {
    canal,
    setCanal,
    forceReload,
    conversas,
    activeId,
    mensagens,
    hasMoreConversas,
    hasMoreMensagens,
    loadingConversas,
    loadingMensagens,
    loadingOlder,
    loadConversas,
    loadMoreConversas,
    selectConversa,
    loadOlderMensagens,
    pushMensagem,
    sendMensagem,
    onRealtimeMessage,
    onRealtimeStatus,
  }
})
