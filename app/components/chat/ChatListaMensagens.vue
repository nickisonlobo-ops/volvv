<template>
  <div class="chat-lm" ref="scroller">
    <div class="chat-lm-data"><span>HOJE</span></div>
    <ChatItemMensagem v-for="(m, i) in mensagens" :key="i" :mensagem="m" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch, nextTick } from 'vue'

const props = defineProps<{ mensagens: any[] }>()

const scroller = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  })
  // Fallback para depois que imagens/videos carregam
  setTimeout(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  }, 300)
  setTimeout(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  }, 800)
}

onMounted(scrollToBottom)
onUpdated(scrollToBottom)
watch(() => props.mensagens.length, scrollToBottom)
</script>
