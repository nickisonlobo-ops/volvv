<template>
  <div class="chat-hm">
    <div class="chat-hm-left">
      <div class="chat-hm-avatar"><img v-if="conversa?.foto" :src="conversa.foto" /></div>
      <div class="chat-hm-info">
        <span class="chat-hm-nome">{{ conversa?.nome }}</span>
        <span class="chat-hm-status">online</span>
      </div>
    </div>
    <div class="chat-hm-actions">
      <button class="chat-ic-btn" title="Tema" @click="$emit('toggle-theme')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 5.07 1.41 1.41M5.52 5.52l1.41 1.41m11.14 0 1.41-1.41M5.52 18.48l1.41-1.41"/></svg>
      </button>
      <button class="chat-ic-btn" title="Video">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/></svg>
      </button>
      <button class="chat-ic-btn" title="Ligar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 15.5c-1.2 0-2.5-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2a15.1 15.1 0 0 1-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1C8.7 6.5 8.5 5.2 8.5 4c0-.5-.4-1-1-1H4c-.6 0-1 .5-1 1 0 9.4 7.6 17 17 17 .5 0 1-.4 1-1v-3.5c0-.6-.5-1-1-1Z"/></svg>
      </button>
      <button class="chat-ic-btn" title="Pesquisar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      </button>
      <button class="chat-ic-btn" title="Menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ conversa: any }>()
defineEmits<{ (e: 'toggle-theme'): void }>()</script>
