<template>
  <div class="chat-im-row" :class="de">
    <div class="chat-sticker">
      <img :src="url" alt="Sticker" class="chat-sticker-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  de: 'in' | 'out'
  url: string
}>()
</script>
