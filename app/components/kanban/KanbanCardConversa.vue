<template>
  <KanbanCard :card="card" @click="emit('click', card)" @dragstart="emit('dragstart', $event)">
    <template #default>
      <div class="space-y-1.5">
        <!-- Nome do contato -->
        <p class="text-sm font-semibold truncate" style="color: var(--color-card-texto, #1e293b)">
          {{ card.titulo }}
        </p>

        <!-- Última mensagem -->
        <div class="flex items-center gap-1.5 text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
          </svg>
          <span class="truncate">{{ card.info_extra?.preview ?? '—' }}</span>
        </div>

        <!-- Tempo -->
        <div class="flex items-center gap-1.5 text-xs" style="color: var(--color-card-texto, #64748b); opacity: 0.7">
          <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ card.info_extra?.time ?? '—' }}</span>
        </div>
      </div>
    </template>
  </KanbanCard>
</template>

<script setup lang="ts">
import type { KanbanCard as KanbanCardType } from '~/composables/useKanban'
import KanbanCard from './KanbanCard.vue'

defineOptions({ name: 'KanbanCardConversa' })

defineProps<{ card: KanbanCardType }>()

const emit = defineEmits<{
  (e: 'click', card: KanbanCardType): void
  (e: 'dragstart', event: DragEvent): void
}>()
</script>
