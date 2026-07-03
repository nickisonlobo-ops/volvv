<template>
  <div class="chat-lm" ref="scroller">
    <div class="chat-lm-data"><span>HOJE</span></div>
    <ChatItemMensagem v-for="(m, i) in mensagens" :key="i" :mensagem="m" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, nextTick } from 'vue'

defineProps<{ mensagens: any[] }>()

const scroller = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  })
}

onMounted(scrollToBottom)
onUpdated(scrollToBottom)
</script>
