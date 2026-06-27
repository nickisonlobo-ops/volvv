<template>
  <div class="flex flex-col gap-4">
    <!-- Modalidade de Precificação -->
    <div class="flex flex-col gap-1.5">
      <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Modalidade de Precificação</label>
      <div class="flex rounded-xl border-2 border-gray-200 overflow-hidden">
        <button
          type="button"
          class="flex-1 py-2.5 text-sm font-bold transition-colors duration-200 focus:outline-none"
          :class="modalidade === 'm2'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
          @click="setModalidade('m2')"
        >
          Por m²
        </button>
        <button
          type="button"
          class="flex-1 py-2.5 text-sm font-bold transition-colors duration-200 focus:outline-none"
          :class="modalidade === 'unidade'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'"
          @click="setModalidade('unidade')"
        >
          Por Unidade
        </button>
      </div>
    </div>

    <!-- Preço Unitário (visível apenas quando modalidade = 'unidade') -->
    <div v-if="modalidade === 'unidade'" class="flex flex-col gap-1.5">
      <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Preço Unitário ({{ locale.simboloMoeda }}) *</label>
      <div class="relative">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">{{ locale.simboloMoeda }}</span>
        <input
          :value="precoUnitario"
          type="number"
          step="0.01"
          min="0.01"
          max="99999.99"
          placeholder="0,00"
          class="w-full rounded-xl border-2 pl-10 pr-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
          :class="errorPrecoUnitario ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
          @input="onPrecoUnitarioInput"
        />
      </div>
      <p v-if="errorPrecoUnitario" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
        {{ errorPrecoUnitario }}
      </p>
    </div>

    <!-- Info: Dados de referência (modo m²) -->
    <div v-if="modalidade === 'm2'" class="bg-gray-50 rounded-xl border border-gray-200 p-3">
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span class="text-gray-400">Área total:</span>
          <p class="font-semibold text-gray-700">{{ areaM2?.toFixed(4) ?? '—' }} m²</p>
        </div>
        <div>
          <span class="text-gray-400">Preço/m²:</span>
          <p class="font-semibold text-gray-700">{{ formatCurrency(precoM2 ?? 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Info: Dados de referência (modo unidade) -->
    <div v-if="modalidade === 'unidade'" class="bg-gray-50 rounded-xl border border-gray-200 p-3">
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span class="text-gray-400">Quantidade:</span>
          <p class="font-semibold text-gray-700">{{ quantidade ?? '—' }}</p>
        </div>
        <div>
          <span class="text-gray-400">Preço unitário:</span>
          <p class="font-semibold text-gray-700">{{ formatCurrency(precoUnitario ?? 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Valor do Material Calculado (tempo real) -->
    <div class="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold text-indigo-700">Valor do Material</span>
        <span class="text-xl font-black text-indigo-700">{{ formatCurrency(valorMaterialCalculado) }}</span>
      </div>
      <p class="text-[10px] text-indigo-500 mt-1">
        {{ modalidade === 'm2'
          ? `${areaM2?.toFixed(4) ?? '0'} m² × ${formatCurrency(precoM2 ?? 0)}/m²`
          : `${quantidade ?? 0} un × ${formatCurrency(precoUnitario ?? 0)}/un` }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = withDefaults(
  defineProps<{
    /** Área total em m² do pedido */
    areaM2?: number | null
    /** Preço por m² do material selecionado */
    precoM2?: number | null
    /** Quantidade de unidades do pedido */
    quantidade?: number | null
    /** Modalidade inicial */
    initialModalidade?: 'm2' | 'unidade'
    /** Preço unitário inicial */
    initialPrecoUnitario?: number | null
  }>(),
  {
    areaM2: null,
    precoM2: null,
    quantidade: null,
    initialModalidade: 'm2',
    initialPrecoUnitario: null,
  }
)

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'update:modalidade', value: 'm2' | 'unidade'): void
  (e: 'update:precoUnitario', value: number | null): void
  (e: 'update:valorMaterial', value: number): void
}>()

// ─── Composable ──────────────────────────────────────────────────────────────
const { calcularValorMaterial } = useOrcamentos()
const { formatCurrency, locale } = useLocale()

// ─── State ───────────────────────────────────────────────────────────────────
const modalidade = ref<'m2' | 'unidade'>(props.initialModalidade)
const precoUnitario = ref<number | null>(props.initialPrecoUnitario)
const errorPrecoUnitario = ref<string>('')

// ─── Validation ──────────────────────────────────────────────────────────────
function validarPrecoUnitario(valor: number | null): string {
  if (modalidade.value !== 'unidade') return ''
  if (valor === null || valor === undefined || isNaN(valor)) {
    return 'Informe o preço unitário'
  }
  if (valor < 0.01) {
    return `Preço mínimo: ${locale.value.simboloMoeda} 0,01`
  }
  if (valor > 99999.99) {
    return `Preço máximo: ${locale.value.simboloMoeda} 99.999,99`
  }
  return ''
}

// ─── Computed: Valor do Material ─────────────────────────────────────────────
const valorMaterialCalculado = computed<number>(() => {
  return calcularValorMaterial(modalidade.value, {
    area_m2: props.areaM2 ?? 0,
    preco_m2: props.precoM2 ?? 0,
    preco_unitario: precoUnitario.value ?? 0,
    quantidade: props.quantidade ?? 0,
  })
})

// ─── Handlers ────────────────────────────────────────────────────────────────
function setModalidade(value: 'm2' | 'unidade') {
  modalidade.value = value
  emit('update:modalidade', value)

  // Clear precoUnitario when switching to m2
  if (value === 'm2') {
    precoUnitario.value = null
    errorPrecoUnitario.value = ''
    emit('update:precoUnitario', null)
  } else {
    // Validate on switch to unidade
    errorPrecoUnitario.value = validarPrecoUnitario(precoUnitario.value)
  }
}

function onPrecoUnitarioInput(event: Event) {
  const input = event.target as HTMLInputElement
  const valor = input.value === '' ? null : parseFloat(input.value)
  precoUnitario.value = valor
  errorPrecoUnitario.value = validarPrecoUnitario(valor)
  emit('update:precoUnitario', valor)
}

// ─── Watchers: emit valor material whenever it changes ───────────────────────
watch(valorMaterialCalculado, (newVal) => {
  emit('update:valorMaterial', newVal)
}, { immediate: true })

</script>
