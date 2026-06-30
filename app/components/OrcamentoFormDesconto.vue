<template>
  <div class="flex flex-col gap-4">
    <!-- Card: Discriminação de valores com desconto -->
    <div class="bg-transparent rounded-xl border border-primary-10 p-4">
      <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Descontos</h4>

      <!-- Subtotal (material + mão de obra) -->
      <div class="flex justify-between items-center py-1.5 text-sm">
        <span class="text-gray-600">Subtotal (Material + Mão de Obra)</span>
        <span class="font-semibold text-gray-800">{{ formatCurrency(subtotal) }}</span>
      </div>

      <!-- Desconto de Volume (automático) -->
      <div v-if="regraAplicada" class="flex justify-between items-center py-1.5 text-sm">
        <span class="text-amber-600 font-medium flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.5 5.5a.5.5 0 10-1 0 .5.5 0 001 0zm2 5a.5.5 0 10-1 0 .5.5 0 001 0zM8.1 7.1a.5.5 0 01.707 0l3 3a.5.5 0 01-.707.707l-3-3a.5.5 0 010-.707z" clip-rule="evenodd"/>
          </svg>
          Desconto por Volume ({{ regraAplicada.desconto_percentual }}%)
        </span>
        <span class="font-semibold text-amber-600">-{{ formatCurrency(valorDescontoVolume) }}</span>
      </div>

      <!-- Sem desconto de volume -->
      <div v-else class="flex justify-between items-center py-1.5 text-sm">
        <span class="text-gray-400 italic">Sem desconto de volume aplicável</span>
        <span class="text-gray-400">—</span>
      </div>

      <!-- Após desconto de volume -->
      <div v-if="regraAplicada" class="flex justify-between items-center py-1.5 text-sm border-t border-gray-200 mt-1 pt-2">
        <span class="text-gray-600">Após desconto de volume</span>
        <span class="font-semibold text-gray-800">{{ formatCurrency(subtotalAposVolume) }}</span>
      </div>
    </div>

    <!-- Desconto Manual -->
    <div class="flex flex-col gap-3">
      <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Desconto Manual (cumulativo)</label>

      <!-- Toggle: percentual / fixo -->
      <div class="flex rounded-xl border-2 border-gray-200 overflow-hidden">
        <button
          type="button"
          class="flex-1 py-2.5 text-sm font-bold transition-colors duration-200 focus:outline-none"
          :class="descontoTipo === 'percentual'
            ? 'bg-primary text-primary-text shadow-sm'
            : 'bg-transparent text-gray-500 hover:bg-primary-5'"
          @click="setDescontoTipo('percentual')"
        >
          Percentual (%)
        </button>
        <button
          type="button"
          class="flex-1 py-2.5 text-sm font-bold transition-colors duration-200 focus:outline-none"
          :class="descontoTipo === 'fixo'
            ? 'bg-primary text-primary-text shadow-sm'
            : 'bg-transparent text-gray-500 hover:bg-primary-5'"
          @click="setDescontoTipo('fixo')"
        >
          Valor Fixo ({{ locale.simboloMoeda }})
        </button>
      </div>

      <!-- Input: Desconto percentual -->
      <div v-if="descontoTipo === 'percentual'" class="flex flex-col gap-1.5">
        <div class="relative">
          <input
            :value="descontoManualPercentual"
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="0"
            class="w-full rounded-xl border-2 px-4 py-3 pr-10 text-sm font-semibold text-theme-card-text bg-transparent focus:outline-none focus:ring-0 transition-all"
            :class="erroValorFinal ? 'border-red-400 bg-red-50' : 'border-primary-10 focus:border-primary'"
            @input="onDescontoPercentualInput"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">%</span>
        </div>
      </div>

      <!-- Input: Desconto valor fixo -->
      <div v-if="descontoTipo === 'fixo'" class="flex flex-col gap-1.5">
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">{{ locale.simboloMoeda }}</span>
          <input
            :value="descontoManualValor"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            class="w-full rounded-xl border-2 pl-10 pr-4 py-3 text-sm font-semibold text-theme-card-text bg-transparent focus:outline-none focus:ring-0 transition-all"
            :class="erroValorFinal ? 'border-red-400 bg-red-50' : 'border-primary-10 focus:border-primary'"
            @input="onDescontoValorInput"
          />
        </div>
      </div>

      <!-- Erro: valor final <= 0 -->
      <p v-if="erroValorFinal" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
        </svg>
        O desconto excede o valor do orçamento
      </p>
    </div>

    <!-- Valor Final Destacado -->
    <div class="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold text-indigo-700">Valor Final</span>
        <span class="text-2xl font-black text-indigo-700" :class="{ 'text-red-600': erroValorFinal }">
          {{ formatCurrency(valorFinalCalculado) }}
        </span>
      </div>
      <p v-if="regraAplicada" class="text-[10px] text-indigo-500 mt-1">
        Desconto de volume ({{ regraAplicada.desconto_percentual }}%) aplicado automaticamente para {{ quantidade }} unidades
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = withDefaults(
  defineProps<{
    /** Valor do material calculado */
    valorMaterial: number
    /** Valor de mão de obra */
    maoObra: number
    /** Quantidade de unidades do pedido */
    quantidade: number
    /** ID da empresa para buscar regras */
    empresaId: number
  }>(),
  {
    valorMaterial: 0,
    maoObra: 0,
    quantidade: 0,
    empresaId: 0,
  }
)

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'update:descontoVolumePercentual', value: number): void
  (e: 'update:descontoManualPercentual', value: number): void
  (e: 'update:descontoManualValor', value: number): void
  (e: 'update:valorFinal', value: number): void
}>()

// ─── Composable ──────────────────────────────────────────────────────────────
const { selecionarDescontoVolume, calcularValorFinal } = useOrcamentos()
const { formatCurrency, locale } = useLocale()

// ─── State ───────────────────────────────────────────────────────────────────
interface RegraDesconto {
  quantidade_minima: number
  desconto_percentual: number
}

const regrasDesconto = ref<RegraDesconto[]>([])
const descontoTipo = ref<'percentual' | 'fixo'>('percentual')
const descontoManualPercentual = ref<number>(0)
const descontoManualValor = ref<number>(0)
const loading = ref(false)

// ─── Fetch regras de desconto da empresa ─────────────────────────────────────
async function fetchRegrasDesconto() {
  if (!props.empresaId) return
  loading.value = true
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('regras_desconto_volume')
      .select('quantidade_minima, desconto_percentual')
      .eq('empresa_id', props.empresaId)
      .eq('ativo', true)
      .order('quantidade_minima', { ascending: true })

    if (error) {
      console.error('[OrcamentoFormDesconto] Erro ao buscar regras de desconto:', error.message)
      return
    }
    regrasDesconto.value = data ?? []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRegrasDesconto()
})

// Refetch when empresaId changes
watch(() => props.empresaId, (newVal) => {
  if (newVal) fetchRegrasDesconto()
})

// ─── Computed: regra aplicada ────────────────────────────────────────────────
const regraAplicada = computed<RegraDesconto | null>(() => {
  return selecionarDescontoVolume(regrasDesconto.value, props.quantidade)
})

const descontoVolumePercentual = computed<number>(() => {
  return regraAplicada.value?.desconto_percentual ?? 0
})

// ─── Computed: cálculos de valores ───────────────────────────────────────────
const subtotal = computed<number>(() => {
  return props.valorMaterial + props.maoObra
})

const valorDescontoVolume = computed<number>(() => {
  return subtotal.value * (descontoVolumePercentual.value / 100)
})

const subtotalAposVolume = computed<number>(() => {
  return subtotal.value - valorDescontoVolume.value
})

const valorFinalCalculado = computed<number>(() => {
  return calcularValorFinal(
    props.valorMaterial,
    props.maoObra,
    descontoVolumePercentual.value,
    descontoTipo.value === 'percentual' ? descontoManualPercentual.value : 0,
    descontoTipo.value === 'fixo' ? descontoManualValor.value : 0
  )
})

// ─── Computed: validação valor final > 0 ─────────────────────────────────────
const erroValorFinal = computed<boolean>(() => {
  // Calcula o valor real sem o Math.max(0.01) do composable
  const sub = subtotal.value
  const descVol = sub * (descontoVolumePercentual.value / 100)
  const aposVol = sub - descVol
  const descManualPerc = descontoTipo.value === 'percentual'
    ? aposVol * (descontoManualPercentual.value / 100)
    : 0
  const descManualFixo = descontoTipo.value === 'fixo' ? descontoManualValor.value : 0
  const total = aposVol - descManualPerc - descManualFixo
  return total <= 0
})

// ─── Handlers ────────────────────────────────────────────────────────────────
function setDescontoTipo(tipo: 'percentual' | 'fixo') {
  descontoTipo.value = tipo
  // Reset the other type
  if (tipo === 'percentual') {
    descontoManualValor.value = 0
    emit('update:descontoManualValor', 0)
  } else {
    descontoManualPercentual.value = 0
    emit('update:descontoManualPercentual', 0)
  }
}

function onDescontoPercentualInput(event: Event) {
  const input = event.target as HTMLInputElement
  let valor = parseFloat(input.value) || 0
  if (valor < 0) valor = 0
  if (valor > 100) valor = 100
  descontoManualPercentual.value = valor
  emit('update:descontoManualPercentual', valor)
}

function onDescontoValorInput(event: Event) {
  const input = event.target as HTMLInputElement
  let valor = parseFloat(input.value) || 0
  if (valor < 0) valor = 0
  descontoManualValor.value = valor
  emit('update:descontoManualValor', valor)
}

// ─── Watchers: emit changes ──────────────────────────────────────────────────
watch(descontoVolumePercentual, (newVal) => {
  emit('update:descontoVolumePercentual', newVal)
}, { immediate: true })

watch(valorFinalCalculado, (newVal) => {
  emit('update:valorFinal', newVal)
}, { immediate: true })

</script>
