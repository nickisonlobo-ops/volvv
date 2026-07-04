<template>
  <div>
    <div class="chat-page" :data-theme="chatTheme" v-if="viewMode === 'chat'">
      <ChatAreaConversa :conversas="conversasView" :ativa-id="ativaIdNum" @selecionar="onSelecionar" />
      <ChatAreaMensagens :conversa="conversaAtivaView" :mensagens="mensagensView" @enviar="onEnviar" />
      <!-- Botoes flutuantes no topo direito -->
      <div style="position: fixed; top: 70px; right: 20px; z-index: 40; display: flex; gap: 8px;">
        <button class="px-3 py-2 rounded-xl text-xs font-bold shadow-lg transition-all hover:scale-105" style="background: var(--chat-header, #202c33); color: var(--chat-text, #e9edef); border: 1px solid var(--chat-divider, #222d34);" @click="viewMode = 'kanban'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:middle;margin-right:4px;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"/></svg>
          Kanban
        </button>
        <button class="px-3 py-2 rounded-xl text-xs font-bold shadow-lg transition-all hover:scale-105" style="background: var(--chat-header, #202c33); color: var(--chat-text, #e9edef); border: 1px solid var(--chat-divider, #222d34);" @click="chatTheme = chatTheme === 'dark' ? 'light' : 'dark'">
          {{ chatTheme === 'dark' ? 'Claro' : 'Escuro' }}
        </button>
      </div>
    </div>
    <div v-else class="min-h-full bg-transparent p-3 sm:p-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold">WhatsApp - Kanban</h1>
        <button class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25d366] text-white text-sm font-bold shadow-lg hover:bg-[#128c7e] transition-colors" @click="viewMode = 'chat'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
          Chat
        </button>
      </div>
      <KanbanBoard pipeline-tipo="whatsapp" @card-click="onKanbanCardClick" />
    </div>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalConversaAberto" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="modalConversaAberto = false">
          <div class="chat-page rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden" data-theme="dark" style="height: 85vh; flex-direction: column; display: flex; border-radius: 16px;">
            <div class="flex items-center justify-between px-5 py-3 bg-[#202c33] flex-shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white font-bold text-sm">{{ modalConversaNome?.charAt(0)?.toUpperCase() || '?' }}</div>
                <div>
                  <p class="text-white font-semibold text-sm">{{ modalConversaNome }}</p>
                  <p class="text-[#8696a0] text-xs">online</p>
                </div>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-[#aebac1] hover:text-white hover:bg-white/10" @click="modalConversaAberto = false">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
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

function onKanbanCardClick(card: KanbanCard) {
  store.selectConversa(String(card.id))
  modalConversaNome.value = card.titulo || ''
  modalConversaAberto.value = true
}
</script>
