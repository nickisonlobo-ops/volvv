<template>
  <div class="chat-im-row" :class="mensagem.de">
    <!-- Texto -->
    <TextMessage v-if="mensagem.tipo === 'texto'" :de="mensagem.de" :texto="mensagem.texto" :hora="mensagem.hora" :status="mensagem.status" />
    <!-- Áudio -->
    <AudioMessage v-else-if="mensagem.tipo === 'audio'" :de="mensagem.de" :url="mensagem.url" :duracao="mensagem.duracao || '0:00'" :hora="mensagem.hora" :avatar-url="mensagem.avatarUrl" />
    <!-- Imagem -->
    <ImageMessage v-else-if="mensagem.tipo === 'imagem'" :de="mensagem.de" :url="mensagem.url" :hora="mensagem.hora" :legenda="mensagem.legenda" :status="mensagem.status" />
    <!-- Vídeo -->
    <VideoMessage v-else-if="mensagem.tipo === 'video'" :de="mensagem.de" :url="mensagem.url" :hora="mensagem.hora" :legenda="mensagem.legenda" />
    <!-- Documento -->
    <DocumentMessage v-else-if="mensagem.tipo === 'documento'" :de="mensagem.de" :url="mensagem.url" :nome-arquivo="mensagem.nomeArquivo || 'arquivo'" :tamanho="mensagem.tamanho" :hora="mensagem.hora" />
    <!-- Sticker -->
    <StickerMessage v-else-if="mensagem.tipo === 'sticker'" :de="mensagem.de" :url="mensagem.url" />
  </div>
</template>

<script setup lang="ts">
import TextMessage from './messages/TextMessage.vue'
import AudioMessage from './messages/AudioMessage.vue'
import ImageMessage from './messages/ImageMessage.vue'
import VideoMessage from './messages/VideoMessage.vue'
import DocumentMessage from './messages/DocumentMessage.vue'
import StickerMessage from './messages/StickerMessage.vue'

defineProps<{ mensagem: any }>()
</script>
