<template>
  <div class="chat-page" :data-theme="chatTheme" style="height: 100%; max-height: 100%; overflow: hidden;">
    <ChatAreaConversa :conversas="conversasView" :ativa-id="ativaIdNum" @selecionar="onSelecionar" :class="{ 'chat-mobile-hidden': mobileConversaAberta }">
      <template #header>
        <div class="mkt-canal-tabs">
          <button type="button" :class="{ active: store.canal === 'instagram' }" @click="store.setCanal('instagram')">Instagram</button>
          <button type="button" :class="{ active: store.canal === 'facebook' }" @click="store.setCanal('facebook')">Facebook</button>
        </div>
        <div class="mkt-pagina-picker">
          <select :value="paginaSelecionada" :disabled="trocandoPagina || !paginas.length" @change="onTrocarPagina(($event.target as HTMLSelectElement).value)">
            <option value="" disabled>{{ paginas.length ? 'Selecione a Página…' : 'Nenhuma Página encontrada' }}</option>
            <option v-for="p in paginas" :key="p.id" :value="p.id">{{ p.nome }}</option>
          </select>
          <span v-if="trocandoPagina" class="mkt-mini-spin"></span>
        </div>
        <p v-if="erroPagina" class="mkt-pagina-erro">{{ erroPagina }}</p>
      </template>
    </ChatAreaConversa>

    <!-- Botão toggle tema -->
    <button class="chat-theme-toggle" @click="toggleChatTheme">
      <svg v-if="chatTheme === 'dark'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7 5.7 1.4 1.4M4.9 4.9l1.4 1.4m11.4 0 1.4-1.4M4.9 19.1l1.4-1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
      {{ chatTheme === 'dark' ? 'Claro' : 'Escuro' }}
    </button>

    <div class="chat-area-mensagens-wrap" :class="{ 'chat-mobile-visible': mobileConversaAberta }">
      <button v-if="mobileConversaAberta" class="chat-mobile-back" @click="mobileConversaAberta = false">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
      </button>
      <ChatAreaMensagens :conversa="conversaAtivaView" :mensagens="mensagensView" @enviar="onEnviar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useMensagensMetaStore } from '~/stores/mensagensMeta'
import { useEmpresa } from '~/composables/useEmpresa'
import '~/assets/chat.css'

definePageMeta({ layout: 'default' })

const { loadEmpresa } = useEmpresa()
const store = useMensagensMetaStore()

const chatTheme = ref('dark')
function toggleChatTheme() {
  chatTheme.value = chatTheme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('chat_theme', chatTheme.value)
}

// Seletor de Página (independente da Página usada em anúncios) — puxa todas
// as Páginas que a conta Meta conectada administra e deixa escolher qual
// alimenta a central de mensagens.
const paginas = ref<{ id: string; nome: string; foto?: string }[]>([])
const paginaSelecionada = ref('')
const trocandoPagina = ref(false)
const erroPagina = ref<string | null>(null)
let empresaIdAtual: number | null = null

async function carregarPaginas(empresaId: number) {
  try {
    const [recursos, integracoes] = await Promise.all([
      $fetch<{ paginas?: { id: string; nome: string; foto?: string }[] }>('/api/marketing/meta-recursos', { query: { empresa_id: empresaId } }),
      $fetch<{ plataforma: string; meta_msg_page_id?: string }[]>('/api/marketing/integracoes', { query: { empresa_id: empresaId } }),
    ])
    paginas.value = recursos?.paginas ?? []
    paginaSelecionada.value = integracoes.find((i) => i.plataforma === 'meta')?.meta_msg_page_id || ''
  } catch (e) {
    console.error('[mensagens] falha ao carregar Páginas:', e)
  }
}

async function onTrocarPagina(pageId: string) {
  if (!pageId || !empresaIdAtual) return
  trocandoPagina.value = true
  erroPagina.value = null
  try {
    await $fetch('/api/marketing/selecionar-pagina-mensagens', {
      method: 'POST',
      body: { empresa_id: empresaIdAtual, page_id: pageId },
    })
    paginaSelecionada.value = pageId
    store.forceReload()
    unsubscribeRealtime()
    await subscribeRealtime(empresaIdAtual)
  } catch (e: any) {
    erroPagina.value = e?.data?.message || 'Falha ao trocar de Página.'
  } finally {
    trocandoPagina.value = false
  }
}

// Realtime (Pusher) — canais próprios desta página (Page ID / IG Business ID),
// resolvidos a partir da Página escolhida acima. Instância de Pusher separada
// da usada pelo WhatsApp (pusher.client.ts) — não mexe lá.
let pusherClient: any = null
let boundChannels: any[] = []

function unsubscribeRealtime() {
  boundChannels.forEach((ch) => ch.unbind_all())
  boundChannels = []
  pusherClient?.disconnect()
  pusherClient = null
}

async function subscribeRealtime(empresaId: number) {
  const config = useRuntimeConfig()
  const key = config.public.pusherKey as string
  const cluster = config.public.pusherCluster as string
  if (!key || !cluster) return

  let pageId: string | undefined
  let igBusinessId: string | undefined
  try {
    const integracoes = await $fetch<{ plataforma: string; meta_msg_page_id?: string; meta_msg_instagram_business_id?: string }[]>(
      '/api/marketing/integracoes', { query: { empresa_id: empresaId } },
    )
    const meta = integracoes.find((i) => i.plataforma === 'meta')
    pageId = meta?.meta_msg_page_id
    igBusinessId = meta?.meta_msg_instagram_business_id
  } catch { return }

  const inboxIds = [pageId, igBusinessId].filter(Boolean) as string[]
  if (!inboxIds.length) return

  const { default: Pusher } = await import('pusher-js')
  pusherClient = new Pusher(key, { cluster })

  for (const inboxId of inboxIds) {
    const channel = pusherClient.subscribe(`chat-${inboxId}`)
    channel.bind('message:new', (data: any) => {
      if (data?.conversation && data?.message) store.onRealtimeMessage(data.conversation, data.message)
    })
    channel.bind('message:status', (data: any) => {
      if (data?.waMessageId && data?.status) store.onRealtimeStatus(data.waMessageId, data.status)
    })
    boundChannels.push(channel)
  }
}

onMounted(async () => {
  chatTheme.value = localStorage.getItem('chat_theme') || 'dark'
  await loadEmpresa()
  const empId = useState<number | null>('empresa_id')
  const iniciar = () => {
    empresaIdAtual = empId.value
    store.loadConversas()
    carregarPaginas(empId.value!)
    subscribeRealtime(empId.value!)
  }
  if (empId.value) {
    iniciar()
  } else {
    const stop = watch(empId, (val) => { if (val) { iniciar(); stop() } }, { immediate: true })
    setTimeout(() => stop(), 3000)
  }
})

onUnmounted(() => {
  unsubscribeRealtime()
})

const mobileConversaAberta = ref(false)

const conversasView = computed(() =>
  store.conversas.map((c, idx) => ({
    id: idx, _realId: c.id, nome: c.name, hora: c.time, previa: c.preview, foto: c.img || '', cor: c.color || '#374151', naoLidas: 0,
  })),
)

const ativaIdNum = computed(() => {
  const idx = store.conversas.findIndex((c) => c.id === store.activeId)
  return idx >= 0 ? idx : 0
})

function onSelecionar(idx: number) {
  const conv = store.conversas[idx]
  if (conv) store.selectConversa(conv.id)
  mobileConversaAberta.value = true
}

const conversaAtivaView = computed(() => {
  const c = store.conversas.find((c) => c.id === store.activeId)
  if (!c) return { id: 0, nome: '', hora: '', previa: '', foto: '', cor: '#374151' }
  return { id: 0, nome: c.name, hora: c.time, previa: c.preview, foto: c.img || '', cor: c.color || '#374151' }
})

const mensagensView = computed(() =>
  store.mensagens.filter((m) => m.type === 'msg').map((m: any) => {
    const base = { de: m.from, hora: m.time, status: m.status }
    switch (m.kind) {
      case 'text': return { ...base, tipo: 'texto', texto: m.text }
      case 'image': return { ...base, tipo: 'imagem', url: m.url, legenda: m.caption }
      case 'audio': return { ...base, tipo: 'audio', url: m.url, duracao: m.duration || '0:00' }
      case 'video': return { ...base, tipo: 'video', url: m.url, legenda: m.caption }
      case 'document': return { ...base, tipo: 'documento', url: m.url, nomeArquivo: m.filename || 'arquivo', tamanho: m.size }
      case 'sticker': return { ...base, tipo: 'sticker', url: m.url }
      default: return { ...base, tipo: 'texto', texto: '' }
    }
  }),
)

function onEnviar(txt: string) { store.sendMensagem(txt) }
</script>

<style>
main:has(.chat-page) { overflow: hidden !important; height: 100% !important; max-height: 100% !important; }
html:has(.chat-page) { background: var(--color-bg, #0b141a); }
.mkt-canal-tabs { display: flex; gap: 4px; padding: 10px 16px; border-bottom: 1px solid var(--chat-divider, #222d34); }
.mkt-canal-tabs button { flex: 1; padding: 7px; border: none; border-radius: 8px; background: transparent; color: var(--chat-text-2, #8696a0); font-size: 12.5px; font-weight: 600; cursor: pointer; }
.mkt-canal-tabs button.active { background: var(--chat-accent, #00a884); color: #fff; }
.mkt-pagina-picker { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--chat-divider, #222d34); }
.mkt-pagina-picker select { flex: 1; height: 34px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--chat-divider, #222d34); background: var(--chat-panel, #111b21); color: var(--chat-text, #e9edef); font-size: 12.5px; }
.mkt-pagina-erro { margin: 0 16px 8px; font-size: 11.5px; color: #f37272; }
.mkt-mini-spin { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.25); border-top-color: var(--chat-accent, #00a884); border-radius: 50%; animation: mkt-msg-spin 0.7s linear infinite; }
@keyframes mkt-msg-spin { to { transform: rotate(360deg); } }
</style>
