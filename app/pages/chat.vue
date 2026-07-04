<template>
  <div>
    <div class="chat-page" :data-theme="chatTheme" v-if="viewMode === 'chat'">
      <ChatAreaConversa :conversas="conversasView" :ativa-id="ativaIdNum" @selecionar="onSelecionar" />
      <ChatAreaMensagens :conversa="conversaAtivaView" :mensagens="mensagensView" @enviar="onEnviar" />
      <button class="chat-theme-toggle" @click="chatTheme = chatTheme === 'dark' ? 'light' : 'dark'">
        {{ chatTheme === 'dark' ? '☀ Claro' : '🌙 Escuro' }}
      </button>
      <button class="chat-theme-toggle" style="bottom: 120px;" @click="viewMode = 'kanban'">📋 Kanban</button>
    </div>
    <div v-else class="min-h-full bg-transparent p-3 sm:p-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold">WhatsApp — Kanban</h1>
        <button class="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold" @click="viewMode = 'chat'">← Chat</button>
      </div>
      <KanbanBoard pipeline-tipo="whatsapp" @card-click="onKanbanCardClick" />
    </div>
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

function onKanbanCardClick(card: KanbanCard) {
  store.selectConversa(String(card.id))
  viewMode.value = 'chat'
}
</script>
