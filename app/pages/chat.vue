<template>
  <div :style="{ height: viewMode === 'chat' ? '100%' : 'auto', overflow: viewMode === 'chat' ? 'hidden' : 'auto' }">
    <div class="chat-page" v-if="viewMode === 'chat'" :data-theme="chatTheme" style="height: 100%; max-height: 100%; overflow: hidden;">
      <ChatAreaConversa :conversas="conversasView" :ativa-id="ativaIdNum" @selecionar="onSelecionar" @kanban="viewMode = 'kanban'" :class="{ 'chat-mobile-hidden': mobileConversaAberta }" />
      <!-- Botão config flutuante no chat mode -->
      <button class="chat-config-btn" title="Configurações WhatsApp" @click="showWhatsAppConfig = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </button>
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

    <!-- MODO KANBAN -->
    <div v-else class="min-h-full bg-transparent p-3 sm:p-8">
      <!-- Header padrao -->
      <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
        <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #25d366, #128c7e))' }" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
        <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
          <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
            <div class="flex items-center gap-3 sm:gap-5">
              <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
                <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Atendimento</span>
                </div>
                <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">WhatsApp</h1>
                <p class="text-sm text-white/80 mt-1.5">Kanban de conversas</p>
              </div>
            </div>
            <button class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02]" @click="viewMode = 'chat'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
              Chat
            </button>
            <button class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-4 py-2.5 rounded-xl bg-white/20 text-white hover:bg-white/30 shadow-lg transition-all duration-200" @click="showWhatsAppConfig = true" title="Configurações WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <KanbanBoard :key="kanbanRefreshKey" pipeline-tipo="whatsapp" @card-click="onKanbanCardClick" />
    </div>

    <!-- Modal conversa (kanban) -->
    <Teleport to="body">
      <Transition name="fade">
        <ChatWhatsAppConfig v-if="showWhatsAppConfig" @close="showWhatsAppConfig = false" />
      </Transition>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useChatStore } from '~/stores/chat'
import { useEmpresa } from '~/composables/useEmpresa'
import type { KanbanCard } from '~/composables/useKanban'
import '~/assets/chat.css'

definePageMeta({ layout: 'default' })

const { loadEmpresa } = useEmpresa()

// Tema do chat: dark ou light (persistido no localStorage)
const chatTheme = ref('dark')

function toggleChatTheme() {
  chatTheme.value = chatTheme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('chat_theme', chatTheme.value)
}
onMounted(async () => {
  chatTheme.value = localStorage.getItem('chat_theme') || 'dark'
  await loadEmpresa()
  // Garante que empresa_id carregou antes de buscar conversas
  const empId = useState<number | null>('empresa_id')
  if (empId.value) {
    store.loadConversas()
  } else {
    // Aguarda o empresa_id ficar disponível (max 3s)
    const stop = watch(empId, (val) => {
      if (val) {
        store.loadConversas()
        stop()
      }
    }, { immediate: true })
    setTimeout(() => stop(), 3000)
  }
})

const viewMode = ref<'chat' | 'kanban'>('chat')
const mobileConversaAberta = ref(false)
const store = useChatStore()
const kanbanRefreshKey = ref(0)

// Refresh kanban quando conversas mudam (nova mensagem via Pusher)
watch(() => store.conversas, () => {
  if (viewMode.value === 'kanban') {
    kanbanRefreshKey.value++
  }
}, { deep: false })

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
  mobileConversaAberta.value = true
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
const showWhatsAppConfig = ref(false)

function onKanbanCardClick(card: KanbanCard) {
  store.selectConversa(String(card.id))
  modalConversaNome.value = card.titulo || ''
  modalConversaAberto.value = true
}
</script>

<style>
main:has(.chat-page) {
  overflow: hidden !important;
  height: 100% !important;
  max-height: 100% !important;
}
html:has(.chat-page) { background: var(--color-bg, #0b141a); }
.chat-config-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 15;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--chat-header, #202c33);
  border: 1px solid var(--chat-divider, #222d34);
  color: var(--chat-icon, #aebac1);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s;
}
.chat-config-btn:hover {
  background: var(--chat-hover, #2a3942);
  color: var(--chat-accent, #00a884);
}
</style>
