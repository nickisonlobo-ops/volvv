<template>
  <div class="chat-bolha" :class="de">
    <span class="chat-txt">{{ texto }}</span>
    <span class="chat-hora">{{ hora }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  de: 'in' | 'out'
  texto: string
  hora: string
}>()
</script>
