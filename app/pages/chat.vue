<template>
  <div class="chat-page" :data-theme="chatTheme">
    <ChatAreaConversa :conversas="conversasView" :ativa-id="ativaIdNum" @selecionar="onSelecionar" />
    <ChatAreaMensagens :conversa="conversaAtivaView" :mensagens="mensagensView" @enviar="onEnviar" />
    <!-- Toggle Dark/Light -->
    <button class="chat-theme-toggle" @click="chatTheme = chatTheme === 'dark' ? 'light' : 'dark'">
      <svg v-if="chatTheme === 'dark'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7 5.7 1.4 1.4M4.9 4.9l1.4 1.4m11.4 0 1.4-1.4M4.9 19.1l1.4-1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
      {{ chatTheme === 'dark' ? 'Claro' : 'Escuro' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '~/stores/chat'
import '~/assets/chat.css'

definePageMeta({ layout: 'default' })

const chatTheme = ref('dark')
const store = useChatStore()

onMounted(() => {
  store.loadConversas()
})

// Map store conversas to the format our components expect
const conversasView = computed(() =>
  store.conversas.map((c, idx) => ({
    id: idx,
    _realId: c.id,
    nome: c.name,
    hora: c.time,
    previa: c.preview,
    foto: c.img || '',
    cor: c.color || '#374151',
    naoLidas: 0,
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

// Map store mensagens to the format our balloon components expect
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
