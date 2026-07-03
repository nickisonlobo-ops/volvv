<template>
  <div class="chat-hc">
    <div class="chat-hc-top">
      <h1>Conversas</h1>
      <div class="chat-hc-actions">
        <button class="chat-ic-btn" title="Nova conversa">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M12 9v6M9 12h6"/></svg>
        </button>
        <button class="chat-ic-btn" title="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
        </button>
      </div>
    </div>
    <div class="chat-hc-search">
      <span class="chat-search-ic">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      </span>
      <input :value="busca" @input="$emit('update:busca', ($event.target as HTMLInputElement).value)" placeholder="Pesquisar ou começar uma nova conversa" />
    </div>
    <div class="chat-hc-chips">
      <button v-for="f in filtros" :key="f" class="chat-chip" :class="{ on: filtro === f }" @click="$emit('update:filtro', f)">{{ f }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ busca: string; filtro: string }>()
defineEmits<{ (e: 'update:busca', v: string): void; (e: 'update:filtro', v: string): void }>()

const filtros = ['Tudo', 'Não lidas', 'Favoritas', 'Grupos']
</script>
