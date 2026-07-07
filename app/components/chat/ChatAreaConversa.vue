<template>
  <section class="chat-area-conversas">
    <slot name="header"></slot>
    <ChatHeaderConversa v-model:busca="busca" v-model:filtro="filtro" @kanban="$emit('kanban')" />
    <ChatListaConversa :conversas="conversasFiltradas" :ativa-id="ativaId" @selecionar="$emit('selecionar', $event)" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ conversas: any[]; ativaId: number }>()
defineEmits<{ (e: 'selecionar', id: number): void; (e: 'kanban'): void }>()

const busca = ref('')
const filtro = ref('Tudo')

const conversasFiltradas = computed(() => {
  let arr = props.conversas
  if (filtro.value === 'Não lidas') arr = arr.filter(c => c.naoLidas)
  if (filtro.value === 'Grupos') arr = arr.filter(c => c.grupo)
  if (filtro.value === 'Favoritas') arr = arr.filter(c => c.favorita)
  if (busca.value.trim()) arr = arr.filter(c => c.nome.toLowerCase().includes(busca.value.toLowerCase()))
  return arr
})
</script>
