<template>
  <div class="chat-bolha" :class="de">
    <span class="chat-txt">{{ texto }}</span>
    <span class="chat-hora">
      {{ hora }}
      <span v-if="de === 'out' && status" class="chat-status-tick" :class="status">
        <!-- sent: 1 tick cinza -->
        <svg v-if="status === 'sent'" width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M11.07 0.65L4.27 7.83L1.63 5.09L0.22 6.41L4.27 10.65L12.48 1.97L11.07 0.65Z" fill="currentColor"/></svg>
        <!-- delivered: 2 ticks cinza -->
        <svg v-else-if="status === 'delivered'" width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M11.07 0.65L4.27 7.83L1.63 5.09L0.22 6.41L4.27 10.65L12.48 1.97L11.07 0.65Z" fill="currentColor"/><path d="M14.07 0.65L7.27 7.83L6.63 7.15L5.22 8.47L7.27 10.65L15.48 1.97L14.07 0.65Z" fill="currentColor"/></svg>
        <!-- read: 2 ticks azul -->
        <svg v-else-if="status === 'read'" width="16" height="11" viewBox="0 0 16 11" fill="none"><path d="M11.07 0.65L4.27 7.83L1.63 5.09L0.22 6.41L4.27 10.65L12.48 1.97L11.07 0.65Z" fill="currentColor"/><path d="M14.07 0.65L7.27 7.83L6.63 7.15L5.22 8.47L7.27 10.65L15.48 1.97L14.07 0.65Z" fill="currentColor"/></svg>
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  de: 'in' | 'out'
  texto: string
  hora: string
  status?: string
}>()
</script>
