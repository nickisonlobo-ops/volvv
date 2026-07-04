<template>
  <section class="chat-area-mensagens">
    <ChatHeaderMensagem :conversa="conversa" @toggle-theme="$emit('toggle-theme')" />
    <div class="chat-wrap">
      <div class="chat-pattern"></div>
      <ChatListaMensagens :mensagens="mensagens" />
      <ChatInput @enviar="$emit('enviar', $event)" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ conversa: any; mensagens: any[] }>()
defineEmits<{ (e: 'enviar', texto: string): void; (e: 'toggle-theme'): void }>()
</script>
