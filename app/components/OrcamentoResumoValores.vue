<template>
  <div class="flex flex-col gap-3">
    <!-- Subtotal dos Itens -->
    <div class="flex items-center justify-between text-sm">
      <span class="text-gray-500 font-medium">Subtotal dos itens</span>
      <span class="font-semibold text-gray-700">{{ formatCurrency(subtotalItens) }}</span>
    </div>

    <!-- Desconto por Volume -->
    <div v-if="descontoVolumePercentual > 0" class="flex items-center justify-between text-sm">
      <span class="text-green-600 font-medium">Desconto por volume</span>
      <span class="font-semibold text-green-600">
        -{{ descontoVolumePercentual }}% → {{ formatCurrency(descontoVolumeValor) }}
      </span>
    </div>

    <!-- Desconto Manual -->
    <div v-if="descontoManualTotal > 0" class="flex items-center justify-between text-sm">
      <span class="text-gray-500 font-medium">Desconto manual</span>
      <span class="font-semibold text-gray-600">-{{ formatCurrency(descontoManualTotal) }}</span>
    </div>

    <!-- Mão de Obra -->
    <div v-if="maoObra > 0" class="flex items-center justify-between text-sm">
      <span class="text-gray-500 font-medium">Mão de obra</span>
      <span class="font-semibold text-gray-700">+{{ formatCurrency(maoObra) }}</span>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200 my-1" />

    <!-- Valor Total Final -->
    <div class="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold text-indigo-700">Valor Total Final</span>
        <span class="text-xl font-black text-indigo-700">{{ formatCurrency(valorTotalFinal) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = withDefaults(
  defineProps<{
    /** Subtotal (soma de todos os itens) */
    subtotalItens: number
    /** Percentual de desconto por volume aplicado */
    descontoVolumePercentual: number
    /** Percentual de desconto manual */
    descontoManualPercentual: number
    /** Valor fixo de desconto manual */
    descontoManualValor: number
    /** Valor de mão de obra */
    maoObra: number
  }>(),
  {
    subtotalItens: 0,
    descontoVolumePercentual: 0,
    descontoManualPercentual: 0,
    descontoManualValor: 0,
    maoObra: 0,
  }
)

// ─── Computed: Valores derivados ─────────────────────────────────────────────
const descontoVolumeValor = computed<number>(() => {
  return props.subtotalItens * (props.descontoVolumePercentual / 100)
})

const descontoManualTotal = computed<number>(() => {
  const aposVolume = props.subtotalItens - descontoVolumeValor.value
  const descPercentual = aposVolume * (props.descontoManualPercentual / 100)
  return descPercentual + props.descontoManualValor
})

const valorTotalFinal = computed<number>(() => {
  const subtotal = props.subtotalItens + props.maoObra
  const descVolume = subtotal * (props.descontoVolumePercentual / 100)
  const aposVolume = subtotal - descVolume
  const descManualPerc = aposVolume * (props.descontoManualPercentual / 100)
  const total = aposVolume - descManualPerc - props.descontoManualValor
  return Math.max(total, 0)
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>
