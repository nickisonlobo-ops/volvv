<template>
  <div class="chat-ci-bar">
    <button class="chat-ic-btn big" title="Anexar">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>
    </button>
    <button class="chat-ic-btn big" title="Emoji">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>
    </button>
    <input class="chat-ci-input" v-model="texto" @keyup.enter="enviar" placeholder="Digite uma mensagem" />
    <button class="chat-ic-btn big" @click="enviar" :title="texto ? 'Enviar' : 'Áudio'">
      <svg v-if="texto" width="24" height="24" viewBox="0 0 24 24" fill="var(--chat-accent)"><path d="M3 20 22 12 3 4l4 8-4 8Z"/></svg>
      <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V22h2v-3.1A7 7 0 0 0 19 12h-2Z"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'enviar', texto: string): void }>()
const texto = ref('')

function enviar() {
  if (!texto.value.trim()) return
  emit('enviar', texto.value.trim())
  texto.value = ''
}
</script>
