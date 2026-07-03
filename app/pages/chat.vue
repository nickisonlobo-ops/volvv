<template>
  <div class="chat-page" :data-theme="chatTheme">
    <ChatAreaConversa :conversas="conversas" :ativa-id="ativaId" @selecionar="ativaId = $event" />
    <ChatAreaMensagens :conversa="conversaAtiva" :mensagens="mensagens" @enviar="enviarMensagem" />
    <!-- Toggle Dark/Light -->
    <button class="chat-theme-toggle" @click="chatTheme = chatTheme === 'dark' ? 'light' : 'dark'">
      <svg v-if="chatTheme === 'dark'" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7 5.7 1.4 1.4M4.9 4.9l1.4 1.4m11.4 0 1.4-1.4M4.9 19.1l1.4-1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
      {{ chatTheme === 'dark' ? 'Claro' : 'Escuro' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import '~/assets/chat.css'

definePageMeta({ layout: 'default' })

const chatTheme = ref('dark')
const ativaId = ref(2)

const conversas = ref([
  { id: 1, nome: 'Festa junina dia 11 e 12', hora: '13:00', previa: '~Giovani: Figurinha', naoLidas: 25, grupo: true, foto: 'https://picsum.photos/seed/junina/80', cor: '#5c6b73' },
  { id: 2, nome: 'Rodrigo Silva', hora: '12:44', previa: 'agora eu vou colocar o pé no acelerador', foto: 'https://i.pravatar.cc/80?img=68', cor: '#3f51b5' },
  { id: 3, nome: 'Igor Lopes', hora: '12:20', previa: '0:18', foto: 'https://i.pravatar.cc/80?img=12', cor: '#795548' },
  { id: 4, nome: 'Imobia', hora: '12:10', previa: 'Sua cobrança está disponível!', foto: '', cor: '#e0592a' },
  { id: 5, nome: 'Mãe ❤️', hora: '11:58', previa: 'Ligação de voz', foto: 'https://i.pravatar.cc/80?img=45', cor: '#c2185b' },
  { id: 6, nome: 'Nicolau', hora: '11:10', previa: 'Boa boa', naoLidas: 1, foto: 'https://i.pravatar.cc/80?img=33', cor: '#00897b' },
  { id: 7, nome: 'Edu', hora: '11:00', previa: 'Vc vai amanhã?', naoLidas: 1, foto: 'https://i.pravatar.cc/80?img=51', cor: '#546e7a' },
  { id: 8, nome: 'Nat', hora: '10:41', previa: 'Oie', foto: 'https://i.pravatar.cc/80?img=47', cor: '#8e24aa' },
])

const mensagensPorConversa = ref<Record<number, any[]>>({
  2: [
    { de: 'out', tipo: 'imagem', url: 'https://picsum.photos/seed/dash/400/300', legenda: 'Print do dashboard', hora: '10:26' },
    { de: 'in', tipo: 'audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duracao: '0:34', hora: '10:30', avatarUrl: 'https://i.pravatar.cc/80?img=68' },
    { de: 'out', tipo: 'documento', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', nomeArquivo: 'proposta-comercial.pdf', tamanho: '2.4 MB', hora: '10:42' },
    { de: 'in', tipo: 'sticker', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDI2N2d4Y2E3OXRnNnVqemV5ZGlrZGd0cHU1aHVneXFqcjE2NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3oEjI6SIIHBdRxXI40/giphy.gif', hora: '11:00' },
    { de: 'in', tipo: 'imagem', url: 'https://picsum.photos/seed/nature/400/500', hora: '12:14' },
    { de: 'in', tipo: 'texto', texto: 'Olha como tá o tempo aqui', hora: '12:14' },
    { de: 'in', tipo: 'texto', texto: '37 graus tá kkkk', hora: '12:15' },
    { de: 'out', tipo: 'texto', texto: 'Nuuuuu', hora: '12:37' },
    { de: 'out', tipo: 'audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duracao: '0:12', hora: '12:40' },
    { de: 'out', tipo: 'texto', texto: 'vou colocar whatsapp dentro do sistema', hora: '12:44' },
    { de: 'out', tipo: 'texto', texto: 'agora eu vou colocar o pé no acelerador', hora: '12:44' },
  ],
})

const conversaAtiva = computed(() => conversas.value.find(c => c.id === ativaId.value) || conversas.value[0])
const mensagens = computed(() => mensagensPorConversa.value[ativaId.value] || [])

function enviarMensagem(txt: string) {
  const agora = new Date()
  const h = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0')
  if (!mensagensPorConversa.value[ativaId.value]) mensagensPorConversa.value[ativaId.value] = []
  mensagensPorConversa.value[ativaId.value].push({ de: 'out', tipo: 'texto', texto: txt, hora: h })
  const c = conversas.value.find(c => c.id === ativaId.value)
  if (c) { c.previa = txt; c.hora = h }
}
</script>
