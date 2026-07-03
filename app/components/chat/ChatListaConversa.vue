<template>
  <div class="chat-lista">
    <ChatItemConversa
      v-for="c in conversas"
      :key="c.id"
      :conversa="c"
      :ativa="c.id === ativaId"
      @selecionar="$emit('selecionar', c.id)"
    />
    <div v-if="!conversas.length" class="chat-lista-vazio">Nenhuma conversa encontrada</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ conversas: any[]; ativaId: number }>()
defineEmits<{ (e: 'selecionar', id: number): void }>()
</script>
