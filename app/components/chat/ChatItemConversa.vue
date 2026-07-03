<template>
  <div class="ci-chat" :class="{ ativa }" @click="$emit('selecionar')">
    <div class="ci-chat-avatar" :style="{ background: conversa.cor }">
      <img v-if="conversa.foto" :src="conversa.foto" />
      <span v-else>{{ inicial }}</span>
    </div>
    <div class="ci-chat-body">
      <div class="ci-chat-row1">
        <span class="ci-chat-nome">{{ conversa.nome }}</span>
        <span class="ci-chat-hora" :class="{ verde: conversa.naoLidas }">{{ conversa.hora }}</span>
      </div>
      <div class="ci-chat-row2">
        <span class="ci-chat-msg">{{ conversa.previa }}</span>
        <span v-if="conversa.naoLidas" class="ci-chat-badge">{{ conversa.naoLidas }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Conversa {
  id: number
  nome: string
  foto: string
  cor: string
  hora: string
  previa: string
  naoLidas?: number
  grupo?: boolean
  favorita?: boolean
}

const props = defineProps<{ conversa: Conversa; ativa: boolean }>()
defineEmits<{ (e: 'selecionar'): void }>()

const inicial = computed(() => props.conversa.nome.replace(/[^A-Za-zÀ-ú]/g, '').charAt(0).toUpperCase() || '#')
</script>
