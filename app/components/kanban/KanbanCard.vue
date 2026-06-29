<template>
  <div
    :data-card-id="card.id"
    :draggable="card.info_extra?.faturado !== 'sim'"
    class="kanban-card group relative rounded-xl border p-3 shadow-sm transition-all duration-150 select-none hover:shadow-md active:scale-[0.98]"
    :class="card.info_extra?.faturado === 'sim' ? 'cursor-default' : 'cursor-pointer'"
    @click="emit('click', card)"
    @dragstart="card.info_extra?.faturado === 'sim' ? $event.preventDefault() : emit('dragstart', $event)"
  >
    <slot :card="card" />
  </div>
</template>

<script setup lang="ts">
import type { KanbanCard as KanbanCardType } from '~/composables/useKanban'

defineOptions({ name: 'KanbanCard' })

const props = defineProps<{
  card: KanbanCardType
}>()

const emit = defineEmits<{
  (e: 'click', card: KanbanCardType): void
  (e: 'dragstart', event: DragEvent): void
}>()
</script>

<style scoped>
.kanban-card {
  background: var(--color-card, #ffffff);
  color: var(--color-card-texto, #1e293b);
  border-color: var(--color-card-border, rgba(0,0,0,0.06));
}

.kanban-card:hover {
  border-color: var(--color-primary-border, rgba(55,65,81,0.30));
}
</style>
