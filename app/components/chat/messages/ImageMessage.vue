<template>
  <div class="chat-bolha midia" :class="de">
    <div class="chat-mid-img">
      <img :src="url" alt="Imagem" class="chat-img-render" @click="$emit('lightbox', url)" />
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

defineEmits<{ (e: 'lightbox', url: string): void }>()
</script>
