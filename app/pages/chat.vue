<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8">
    <!-- Header -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #25d366, #128c7e))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex items-center gap-3 sm:gap-5">
          <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
            <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
          </div>
          <div>
            <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">WhatsApp</h1>
            <p class="text-sm text-white/80 mt-1.5">Atendimento via WhatsApp</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Kanban -->
    <KanbanBoard pipeline-tipo="whatsapp" @card-click="onCardClick" />

    <!-- Modal da Conversa -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalAberto"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl h-[80vh] overflow-hidden flex flex-col" :data-theme="chatTheme">
            <!-- Header do modal -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-900 text-white rounded-t-3xl">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                  {{ conversaAtiva?.titulo?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <div>
                  <p class="font-bold">{{ conversaAtiva?.titulo }}</p>
                  <p class="text-xs text-gray-300">online</p>
                </div>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10" @click="fecharModal">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <!-- Corpo: mensagens -->
            <div class="flex-1 overflow-hidden" :data-theme="chatTheme">
              <ChatAreaMensagens
                v-if="conversaAtivaView"
                :conversa="conversaAtivaView"
                :mensagens="mensagensView"
                @enviar="onEnviar"
              />
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
const store = useChatStore()
const modalAberto = ref(false)
const conversaAtiva = ref<KanbanCard | null>(null)

onMounted(() => {
  store.loadConversas()
})

function onCardClick(card: KanbanCard) {
  conversaAtiva.value = card
  // Selecionar conversa no store pelo id (UUID string no campo card.id)
  store.selectConversa(String(card.id))
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
}

const conversaAtivaView = computed(() => {
  if (!conversaAtiva.value) return null
  return {
    id: 0,
    nome: conversaAtiva.value.titulo,
    hora: '',
    previa: '',
    foto: '',
    cor: '#25d366',
  }
})

const mensagensView = computed(() =>
  store.mensagens
    .filter(m => m.type === 'msg')
    .map((m: any) => {
      const base = { de: m.from, hora: m.time }
      switch (m.kind) {
        case 'text':
          return { ...base, tipo: 'texto', texto: m.text }
        case 'image':
          return { ...base, tipo: 'imagem', url: m.url, legenda: m.caption }
        case 'audio':
          return { ...base, tipo: 'audio', url: m.url, duracao: m.duration || '0:00' }
        case 'video':
          return { ...base, tipo: 'video', url: m.url, legenda: m.caption }
        case 'document':
          return { ...base, tipo: 'documento', url: m.url, nomeArquivo: m.filename || 'arquivo', tamanho: m.size }
        case 'sticker':
          return { ...base, tipo: 'sticker', url: m.url }
        default:
          return { ...base, tipo: 'texto', texto: '' }
      }
    })
)

function onEnviar(txt: string) {
  store.sendMensagem(txt)
}
</script>
