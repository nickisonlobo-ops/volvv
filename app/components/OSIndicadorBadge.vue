<template>
  <button
    type="button"
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all duration-150 hover:opacity-80 hover:shadow-sm"
    :class="badgeClasses"
    @click="emit('click')"
  >
    <span class="w-2 h-2 rounded-full" :class="dotClass" />
    <span>{{ numeroOs }}</span>
  </button>
</template>

<script setup lang="ts">
import type { StatusOS } from '~/composables/useOrdensServico'

const props = defineProps<{
  numeroOs: string
  status: StatusOS
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const statusConfig: Record<StatusOS, { bg: string; text: string; dot: string }> = {
  aguardando_producao: {
    bg: 'bg-amber-50 border border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  em_producao: {
    bg: 'bg-blue-50 border border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-400',
  },
  pronto: {
    bg: 'bg-green-50 border border-green-200',
    text: 'text-green-700',
    dot: 'bg-green-400',
  },
  faturamento: {
    bg: 'bg-cyan-50 border border-cyan-200',
    text: 'text-cyan-700',
    dot: 'bg-cyan-400',
  },
  entregue: {
    bg: 'bg-emerald-50 border border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-400',
  },
  cancelado: {
    bg: 'bg-red-50 border border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-400',
  },
}

const badgeClasses = computed(() => {
  const config = statusConfig[props.status]
  return `${config.bg} ${config.text}`
})

const dotClass = computed(() => {
  return statusConfig[props.status].dot
})
</script>
