<template>
  <div class="chat-bolha midia" :class="de">
    <div class="chat-video-wrap">
      <video :src="url" controls preload="metadata" class="chat-video-player" />
      <span class="chat-hora sobre">{{ hora }}</span>
    </div>
    <p v-if="legenda" class="chat-img-legenda">{{ legenda }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  de: 'in' | 'out'
  url: string
  hora: string
  legenda?: string
}>()
</script>
