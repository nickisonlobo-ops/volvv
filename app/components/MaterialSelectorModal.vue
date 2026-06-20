<template>
  <Teleport to="body">
    <transition name="sheet">
      <div v-if="show" class="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center sm:items-center" @click.self="emit('close')">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')" />

        <!-- Sheet / Modal -->
        <div class="relative z-10 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl bg-white overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">

          <!-- Header com busca -->
          <div class="flex-shrink-0 px-4 pt-4 pb-3 border-b border-gray-100">
            <!-- Drag handle (mobile) -->
            <div class="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-3 sm:hidden" />
            <h3 class="text-sm font-bold text-gray-800 mb-2.5">Selecionar Material</h3>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Buscar material..."
                class="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm text-gray-800 bg-gray-50/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <!-- Lista de materiais -->
          <div class="flex-1 overflow-y-auto px-3 py-2">
            <div v-if="materiaisFiltrados.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <p class="text-xs">Nenhum material encontrado</p>
            </div>

            <div class="space-y-1.5">
              <button
                v-for="mat in materiaisFiltrados"
                :key="mat.id"
                type="button"
                class="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-150"
                :class="mat.id === selectedId
                  ? 'bg-indigo-50 border-2 border-indigo-300 shadow-sm'
                  : 'bg-gray-50/60 border border-gray-100 hover:bg-indigo-50/50 hover:border-indigo-200 active:scale-[0.98]'"
                @click="selectMaterial(mat)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <!-- Ícone material -->
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="mat.id === selectedId ? 'bg-indigo-100' : 'bg-gray-100'">
                    <svg class="w-4.5 h-4.5" :class="mat.id === selectedId ? 'text-indigo-600' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75l-5.571-3m11.142 0l4.179 2.25L12 17.25l-9.75-5.25 4.179-2.25" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-800 truncate">{{ mat.nome }}</p>
                    <p v-if="mat.preco_m2" class="text-[11px] text-gray-400">R$ {{ mat.preco_m2.toFixed(2) }}/m²</p>
                  </div>
                </div>
                <!-- Check icon -->
                <div v-if="mat.id === selectedId" class="flex-shrink-0">
                  <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Footer com ação -->
          <div class="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              class="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 active:scale-[0.97] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              :disabled="!selectedId"
              @click="confirm"
            >
              Confirmar seleção
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Material {
  id: number
  nome: string
  preco_m2?: number
}

const props = defineProps<{
  show: boolean
  materiais: Material[]
  currentMaterialId?: number | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', material: Material): void
}>()

const searchQuery = ref('')
const selectedId = ref<number | null>(props.currentMaterialId ?? null)
const searchInputRef = ref<HTMLInputElement | null>(null)

// Focus search on open
watch(() => props.show, (val) => {
  if (val) {
    selectedId.value = props.currentMaterialId ?? null
    searchQuery.value = ''
    nextTick(() => searchInputRef.value?.focus())
  }
})

const materiaisFiltrados = computed(() => {
  if (!searchQuery.value.trim()) return props.materiais
  const q = searchQuery.value.toLowerCase()
  return props.materiais.filter(m => m.nome.toLowerCase().includes(q))
})

function selectMaterial(mat: Material) {
  selectedId.value = mat.id
}

function confirm() {
  const mat = props.materiais.find(m => m.id === selectedId.value)
  if (mat) {
    emit('select', mat)
    emit('close')
  }
}
</script>

<style scoped>
.sheet-enter-active {
  transition: opacity 0.2s ease;
}
.sheet-enter-active .relative {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sheet-leave-active {
  transition: opacity 0.15s ease;
}
.sheet-leave-active .relative {
  transition: transform 0.15s ease;
}
.sheet-enter-from {
  opacity: 0;
}
.sheet-enter-from .relative {
  transform: translateY(100%);
}
@media (min-width: 640px) {
  .sheet-enter-from .relative {
    transform: translateY(24px) scale(0.95);
  }
}
.sheet-leave-to {
  opacity: 0;
}
.sheet-leave-to .relative {
  transform: translateY(100%);
}
@media (min-width: 640px) {
  .sheet-leave-to .relative {
    transform: translateY(24px) scale(0.95);
  }
}
</style>
