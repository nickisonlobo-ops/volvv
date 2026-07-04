<template>
  <div>
    <div class="chat-page" :data-theme="chatTheme" v-if="viewMode === 'chat'">
      <ChatAreaConversa :conversas="conversasView" :ativa-id="ativaIdNum" @selecionar="onSelecionar" />
      <ChatAreaMensagens :conversa="conversaAtivaView" :mensagens="mensagensView" @enviar="onEnviar" />
      <button class="chat-theme-toggle" @click="chatTheme = chatTheme === 'dark' ? 'light' : 'dark'">
        {{ chatTheme === 'dark' ? 'Ã¢Ëœâ‚¬ Claro' : 'Ã°Å¸Å’â„¢ Escuro' }}
      </button>
      <button class="chat-theme-toggle" style="bottom: 120px;" @click="viewMode = 'kanban'">Ã°Å¸â€œâ€¹ Kanban</button>
    </div>
    <div v-else class="min-h-full bg-transparent p-3 sm:p-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold">WhatsApp Ã¢â‚¬â€ Kanban</h1>
        <button class="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold" @click="viewMode = 'chat'">Ã¢â€ Â Chat</button>
      </div>
      <KanbanBoard pipeline-tipo="whatsapp" @card-click="onKanbanCardClick" />
    </div>

    <!-- Modal conversacional (abre por cima do Kanban) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalConversaAberto" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="modalConversaAberto = false">
          <div class="chat-page rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden" data-theme="dark" style="height: 85vh; flex-direction: column; display: flex; border-radius: 16px;">
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-3 bg-[#202c33] flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white font-bold text-sm">
                  {{ modalConversaNome?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <div>
                  <p class="text-white font-semibold text-sm">{{ modalConversaNome }}</p>
                  <p class="text-[#8696a0] text-xs">online</p>
                </div>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-[#aebac1] hover:text-white hover:bg-white/10" @click="modalConversaAberto = false">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Ãrea de mensagens (mesma estrutura do ChatAreaMensagens) -->
            <div class="chat-wrap" style="flex: 1; min-height: 0;">
              <div class="chat-pattern"></div>
              <ChatListaMensagens :mensagens="mensagensView" />
              <ChatInput @enviar="onEnviar" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '~/stores/chat'
import type { KanbanCard } from '~/composables/useKanban'
import '~/assets/chat.css'

definePageMeta({ layout: 'default' })

const chatTheme = ref('dark')
const viewMode = ref<'chat' | 'kanban'>('chat')
const store = useChatStore()

onMounted(() => { store.loadConversas() })

const conversasView = computed(() =>
  store.conversas.map((c, idx) => ({
    id: idx, _realId: c.id, nome: c.name, hora: c.time, previa: c.preview, foto: c.img || '', cor: c.color || '#374151', naoLidas: 0,
  }))
)

const ativaIdNum = computed(() => {
  const idx = store.conversas.findIndex(c => c.id === store.activeId)
  return idx >= 0 ? idx : 0
})

function onSelecionar(idx: number) {
  const conv = store.conversas[idx]
  if (conv) store.selectConversa(conv.id)
}

const conversaAtivaView = computed(() => {
  const c = store.conversas.find(c => c.id === store.activeId)
  if (!c) return { id: 0, nome: '', hora: '', previa: '', foto: '', cor: '#374151' }
  return { id: 0, nome: c.name, hora: c.time, previa: c.preview, foto: c.img || '', cor: c.color || '#374151' }
})

const mensagensView = computed(() =>
  store.mensagens.filter(m => m.type === 'msg').map((m: any) => {
    const base = { de: m.from, hora: m.time }
    switch (m.kind) {
      case 'text': return { ...base, tipo: 'texto', texto: m.text }
      case 'image': return { ...base, tipo: 'imagem', url: m.url, legenda: m.caption }
      case 'audio': return { ...base, tipo: 'audio', url: m.url, duracao: m.duration || '0:00' }
      case 'video': return { ...base, tipo: 'video', url: m.url, legenda: m.caption }
      case 'document': return { ...base, tipo: 'documento', url: m.url, nomeArquivo: m.filename || 'arquivo', tamanho: m.size }
      case 'sticker': return { ...base, tipo: 'sticker', url: m.url }
      default: return { ...base, tipo: 'texto', texto: '' }
    }
  })
)

function onEnviar(txt: string) { store.sendMensagem(txt) }

const modalConversaAberto = ref(false)
const modalConversaNome = ref('')

const modalConversaView = computed(() => ({
  id: 0, nome: modalConversaNome.value, hora: '', previa: '', foto: '', cor: '#25d366',
}))

function onKanbanCardClick(card: KanbanCard) {
  store.selectConversa(String(card.id))
  modalConversaNome.value = card.titulo || ''
  modalConversaAberto.value = true
}
</script>
