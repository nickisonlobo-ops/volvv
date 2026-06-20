<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="fechar">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">

        <!-- Close button -->
        <button
          type="button"
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
          @click="fechar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- Header -->
        <div class="mb-6">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">Regras de Desconto por Volume</h2>
          <p class="text-sm text-gray-400 mt-1">Configure faixas de desconto automático baseadas na quantidade do pedido</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
          <span class="inline-block w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span class="text-sm text-gray-400">Carregando regras...</span>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Tabela de Regras -->
          <div class="overflow-x-auto mb-4">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="text-left px-4 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Qtd. Mínima</th>
                  <th class="text-left px-4 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Desconto (%)</th>
                  <th class="text-center px-4 py-3 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <!-- Empty state -->
                <tr v-if="regras.length === 0 && !showAddForm">
                  <td colspan="3" class="text-center py-10">
                    <div class="flex flex-col items-center gap-2">
                      <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l3-3m0 0l3 3m-3-3v8.25M3.75 6.75h16.5M6.75 3h10.5a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0117.25 21H6.75a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 016.75 3z" />
                      </svg>
                      <span class="text-sm font-semibold text-gray-400">Nenhuma regra cadastrada</span>
                      <span class="text-xs text-gray-400">Adicione faixas de desconto por volume</span>
                    </div>
                  </td>
                </tr>

                <!-- Existing rules -->
                <tr v-for="regra in regras" :key="regra.id" class="hover:bg-gray-50/50 transition-colors">
                  <!-- View mode -->
                  <template v-if="editandoId !== regra.id">
                    <td class="px-4 py-3">
                      <span class="font-semibold text-gray-800">{{ regra.quantidade_minima }}</span>
                      <span class="text-xs text-gray-400 ml-1">un</span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="font-semibold text-gray-800">{{ regra.desconto_percentual }}%</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          class="p-1.5 rounded-lg text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                          title="Editar"
                          @click="iniciarEdicao(regra)"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                        </button>
                        <button
                          type="button"
                          class="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          title="Excluir"
                          :disabled="salvando"
                          @click="excluirRegra(regra)"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                        </button>
                      </div>
                    </td>
                  </template>

                  <!-- Edit mode -->
                  <template v-else>
                    <td class="px-4 py-2">
                      <input
                        v-model.number="editForm.quantidade_minima"
                        type="number"
                        min="2"
                        max="99999"
                        step="1"
                        class="w-full rounded-xl border-2 px-3 py-2.5 text-sm bg-gray-50 focus:outline-none transition-colors"
                        :class="editErrors.quantidade_minima ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                      />
                      <p v-if="editErrors.quantidade_minima" class="text-xs text-red-500 mt-1">{{ editErrors.quantidade_minima }}</p>
                    </td>
                    <td class="px-4 py-2">
                      <input
                        v-model.number="editForm.desconto_percentual"
                        type="number"
                        min="0.01"
                        max="99.99"
                        step="0.01"
                        class="w-full rounded-xl border-2 px-3 py-2.5 text-sm bg-gray-50 focus:outline-none transition-colors"
                        :class="editErrors.desconto_percentual ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                      />
                      <p v-if="editErrors.desconto_percentual" class="text-xs text-red-500 mt-1">{{ editErrors.desconto_percentual }}</p>
                    </td>
                    <td class="px-4 py-2 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          class="p-1.5 rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                          title="Salvar"
                          :disabled="salvando"
                          @click="salvarEdicao"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                        </button>
                        <button
                          type="button"
                          class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          title="Cancelar"
                          @click="cancelarEdicao"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                    </td>
                  </template>
                </tr>

                <!-- Add new rule inline form -->
                <tr v-if="showAddForm" class="bg-indigo-50/30">
                  <td class="px-4 py-2">
                    <input
                      v-model.number="addForm.quantidade_minima"
                      type="number"
                      min="2"
                      max="99999"
                      step="1"
                      placeholder="Ex: 10"
                      class="w-full rounded-xl border-2 px-3 py-2.5 text-sm bg-gray-50 focus:outline-none transition-colors"
                      :class="addErrors.quantidade_minima ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                    />
                    <p v-if="addErrors.quantidade_minima" class="text-xs text-red-500 mt-1">{{ addErrors.quantidade_minima }}</p>
                  </td>
                  <td class="px-4 py-2">
                    <input
                      v-model.number="addForm.desconto_percentual"
                      type="number"
                      min="0.01"
                      max="99.99"
                      step="0.01"
                      placeholder="Ex: 5.00"
                      class="w-full rounded-xl border-2 px-3 py-2.5 text-sm bg-gray-50 focus:outline-none transition-colors"
                      :class="addErrors.desconto_percentual ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                    />
                    <p v-if="addErrors.desconto_percentual" class="text-xs text-red-500 mt-1">{{ addErrors.desconto_percentual }}</p>
                  </td>
                  <td class="px-4 py-2 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        class="p-1.5 rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                        title="Salvar"
                        :disabled="salvando"
                        @click="salvarNovaRegra"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                      </button>
                      <button
                        type="button"
                        class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Cancelar"
                        @click="cancelarAdicao"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Overlap error -->
          <p v-if="overlapError" class="text-xs text-red-500 font-semibold flex items-center gap-1.5 mb-4 px-1">
            <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
            {{ overlapError }}
          </p>

          <!-- Add button -->
          <div class="flex items-center justify-between">
            <button
              v-if="!showAddForm"
              type="button"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 shadow-lg shadow-indigo-900/20 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="editandoId !== null"
              @click="mostrarFormAdicao"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              Adicionar Faixa
            </button>
            <span v-else />

            <!-- Toast inline -->
            <Transition name="fade">
              <span v-if="toastMessage" class="text-xs font-semibold px-3 py-1.5 rounded-lg" :class="toastType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
                {{ toastMessage }}
              </span>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────
interface RegraDesconto {
  id: number
  empresa_id: number
  quantidade_minima: number
  desconto_percentual: number
  ativo: boolean
  created_at: string
}

// ─── Props & Emits ───────────────────────────────────────────────────────────
const props = defineProps<{
  show: boolean
  empresaId: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

// ─── Composables ─────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { validarRegraDesconto, detectarSobreposicao } = useOrcamentos()

// ─── State ───────────────────────────────────────────────────────────────────
const regras = ref<RegraDesconto[]>([])
const loading = ref(false)
const salvando = ref(false)
const showAddForm = ref(false)
const editandoId = ref<number | null>(null)
const overlapError = ref('')
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
let toastTimer: ReturnType<typeof setTimeout> | null = null

// ─── Add form ────────────────────────────────────────────────────────────────
const addForm = ref({ quantidade_minima: null as number | null, desconto_percentual: null as number | null })
const addErrors = ref<Record<string, string>>({})

// ─── Edit form ───────────────────────────────────────────────────────────────
const editForm = ref({ quantidade_minima: null as number | null, desconto_percentual: null as number | null })
const editErrors = ref<Record<string, string>>({})

// ─── Watch: load rules when modal opens ──────────────────────────────────────
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await fetchRegras()
  } else {
    resetState()
  }
})

// ─── Fetch rules ─────────────────────────────────────────────────────────────
async function fetchRegras() {
  loading.value = true
  overlapError.value = ''

  try {
    const { data, error } = await supabase
      .from('regras_desconto_volume')
      .select('*')
      .eq('empresa_id', props.empresaId)
      .eq('ativo', true)
      .order('quantidade_minima', { ascending: true })

    if (error) {
      showToast('Erro ao carregar regras', 'error')
      console.error('Erro ao buscar regras:', error)
      return
    }

    regras.value = data ?? []
  } catch (e) {
    showToast('Erro inesperado ao carregar regras', 'error')
    console.error(e)
  } finally {
    loading.value = false
  }
}

// ─── Add new rule ────────────────────────────────────────────────────────────
function mostrarFormAdicao() {
  showAddForm.value = true
  addForm.value = { quantidade_minima: null, desconto_percentual: null }
  addErrors.value = {}
  overlapError.value = ''
}

function cancelarAdicao() {
  showAddForm.value = false
  addForm.value = { quantidade_minima: null, desconto_percentual: null }
  addErrors.value = {}
  overlapError.value = ''
}

async function salvarNovaRegra() {
  addErrors.value = {}
  overlapError.value = ''

  // Validate fields
  const validacao = validarRegraDesconto({
    quantidade_minima: addForm.value.quantidade_minima,
    desconto_percentual: addForm.value.desconto_percentual,
  })

  if (!validacao.valid) {
    addErrors.value = validacao.errors
    return
  }

  // Validate overlap
  const qtd = addForm.value.quantidade_minima!
  if (detectarSobreposicao(regras.value, qtd)) {
    overlapError.value = 'Já existe uma regra com essa quantidade mínima'
    return
  }

  salvando.value = true

  try {
    const { error } = await supabase
      .from('regras_desconto_volume')
      .insert({
        empresa_id: props.empresaId,
        quantidade_minima: qtd,
        desconto_percentual: addForm.value.desconto_percentual!,
      })

    if (error) {
      if (error.code === '23505') {
        overlapError.value = 'Já existe uma regra com essa quantidade mínima'
      } else {
        showToast('Erro ao salvar regra', 'error')
        console.error('Erro ao inserir regra:', error)
      }
      return
    }

    showToast('Regra adicionada com sucesso', 'success')
    cancelarAdicao()
    await fetchRegras()
    emit('updated')
  } catch (e) {
    showToast('Erro inesperado ao salvar', 'error')
    console.error(e)
  } finally {
    salvando.value = false
  }
}

// ─── Edit rule ───────────────────────────────────────────────────────────────
function iniciarEdicao(regra: RegraDesconto) {
  showAddForm.value = false
  editandoId.value = regra.id
  editForm.value = {
    quantidade_minima: regra.quantidade_minima,
    desconto_percentual: regra.desconto_percentual,
  }
  editErrors.value = {}
  overlapError.value = ''
}

function cancelarEdicao() {
  editandoId.value = null
  editForm.value = { quantidade_minima: null, desconto_percentual: null }
  editErrors.value = {}
  overlapError.value = ''
}

async function salvarEdicao() {
  editErrors.value = {}
  overlapError.value = ''

  // Validate fields
  const validacao = validarRegraDesconto({
    quantidade_minima: editForm.value.quantidade_minima,
    desconto_percentual: editForm.value.desconto_percentual,
  })

  if (!validacao.valid) {
    editErrors.value = validacao.errors
    return
  }

  // Validate overlap (exclude current rule)
  const qtd = editForm.value.quantidade_minima!
  const outrasRegras = regras.value.filter(r => r.id !== editandoId.value)
  if (detectarSobreposicao(outrasRegras, qtd)) {
    overlapError.value = 'Já existe uma regra com essa quantidade mínima'
    return
  }

  salvando.value = true

  try {
    const { error } = await supabase
      .from('regras_desconto_volume')
      .update({
        quantidade_minima: qtd,
        desconto_percentual: editForm.value.desconto_percentual!,
      })
      .eq('id', editandoId.value!)
      .eq('ativo', true)

    if (error) {
      if (error.code === '23505') {
        overlapError.value = 'Já existe uma regra com essa quantidade mínima'
      } else {
        showToast('Erro ao atualizar regra', 'error')
        console.error('Erro ao atualizar regra:', error)
      }
      return
    }

    showToast('Regra atualizada com sucesso', 'success')
    cancelarEdicao()
    await fetchRegras()
    emit('updated')
  } catch (e) {
    showToast('Erro inesperado ao atualizar', 'error')
    console.error(e)
  } finally {
    salvando.value = false
  }
}

// ─── Delete rule ─────────────────────────────────────────────────────────────
async function excluirRegra(regra: RegraDesconto) {
  if (!confirm(`Excluir a regra de ${regra.quantidade_minima}+ unidades (${regra.desconto_percentual}% desconto)?`)) {
    return
  }

  salvando.value = true

  try {
    const { error } = await supabase
      .from('regras_desconto_volume')
      .delete()
      .eq('id', regra.id)

    if (error) {
      showToast('Erro ao excluir regra', 'error')
      console.error('Erro ao excluir regra:', error)
      return
    }

    showToast('Regra excluída com sucesso', 'success')
    await fetchRegras()
    emit('updated')
  } catch (e) {
    showToast('Erro inesperado ao excluir', 'error')
    console.error(e)
  } finally {
    salvando.value = false
  }
}

// ─── Toast helper ────────────────────────────────────────────────────────────
function showToast(message: string, type: 'success' | 'error') {
  toastMessage.value = message
  toastType.value = type
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// ─── Reset state ─────────────────────────────────────────────────────────────
function resetState() {
  regras.value = []
  showAddForm.value = false
  editandoId.value = null
  overlapError.value = ''
  toastMessage.value = ''
  addForm.value = { quantidade_minima: null, desconto_percentual: null }
  addErrors.value = {}
  editForm.value = { quantidade_minima: null, desconto_percentual: null }
  editErrors.value = {}
}

// ─── Close ───────────────────────────────────────────────────────────────────
function fechar() {
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
