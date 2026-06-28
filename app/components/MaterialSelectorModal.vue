<template>
  <Teleport to="body">
    <transition name="sheet">
      <div v-if="show" class="fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center sm:items-center" @click.self="emit('close')">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')" />

        <!-- Sheet / Modal -->
        <div class="relative z-10 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col" :style="{ background: 'var(--color-card, #ffffff)' }">

          <!-- Header -->
          <div class="flex-shrink-0 px-4 pt-4 pb-3 border-b" :style="{ borderColor: 'var(--color-card-border, rgba(0,0,0,0.06))' }">
            <!-- Drag handle (mobile) -->
            <div class="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-3 sm:hidden" />

            <div class="flex items-center gap-2 mb-2.5">
              <!-- Back button (step 2 → step 1) -->
              <button
                v-if="step === 2"
                type="button"
                class="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                @click="goBack"
              >
                <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h3 class="text-sm font-bold" :style="{ color: 'var(--color-card-texto, #1f2937)' }">
                {{ step === 1 ? 'Selecionar Produto' : selectedCategory?.nome ?? 'Produtos' }}
              </h3>
            </div>

            <!-- Search (only on step 2) -->
            <div v-if="step === 2" class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Buscar produto..."
                class="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2.5 text-sm text-gray-800 bg-gray-50/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-3 py-3">

            <!-- ═══ STEP 1: Categories ═══ -->
            <div v-if="step === 1">
              <!-- Loading -->
              <div v-if="loadingCategories" class="flex items-center justify-center py-12">
                <div class="w-6 h-6 border-2 rounded-full animate-spin" style="border-color: var(--color-primary-5, rgba(79,70,229,0.2)); border-top-color: var(--color-primary, #4f46e5)" />
              </div>

              <!-- Empty -->
              <div v-else-if="categories.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM2.25 16.875c0-.621.504-1.125 1.125-1.125h6c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-2.25z" />
                </svg>
                <p class="text-xs">Nenhuma categoria encontrada</p>
              </div>

              <!-- Category grid -->
              <div v-else class="grid grid-cols-2 gap-2.5">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  type="button"
                  class="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border active:scale-[0.97] transition-all duration-150"
                  :style="{ borderColor: 'var(--color-card-border, rgba(0,0,0,0.06))' }"
                  @click="selectCategory(cat)"
                >
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center"
                    :style="{ backgroundColor: (cat.cor ?? '#6b7280') + '18' }"
                  >
                    <svg class="w-5 h-5" :style="{ color: cat.cor ?? '#6b7280' }" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <span class="text-xs font-semibold text-center leading-tight" :style="{ color: 'var(--color-card-texto, #374151)' }">{{ cat.nome }}</span>
                </button>
              </div>
            </div>

            <!-- ═══ STEP 2: Products ═══ -->
            <div v-if="step === 2">
              <!-- Loading -->
              <div v-if="loadingProducts" class="flex items-center justify-center py-12">
                <div class="w-6 h-6 border-2 rounded-full animate-spin" style="border-color: var(--color-primary-5, rgba(79,70,229,0.2)); border-top-color: var(--color-primary, #4f46e5)" />
              </div>

              <!-- Empty -->
              <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p class="text-xs">Nenhum produto encontrado</p>
              </div>

              <!-- Product list -->
              <div v-else class="space-y-1.5">
                <button
                  v-for="product in filteredProducts"
                  :key="product.id"
                  type="button"
                  class="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-150 border"
                  :style="product.id === selectedProductId
                    ? { background: 'var(--color-primary-5, rgba(79,70,229,0.08))', borderColor: 'var(--color-primary, #4f46e5)', borderWidth: '2px' }
                    : { borderColor: 'var(--color-card-border, rgba(0,0,0,0.06))' }"
                  @click="selectProduct(product)"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                      :style="{ background: product.id === selectedProductId ? 'var(--color-primary-5, rgba(79,70,229,0.1))' : 'rgba(0,0,0,0.03)' }">
                      <img
                        v-if="product.imagem_url"
                        :src="product.imagem_url"
                        :alt="product.nome"
                        class="w-full h-full object-cover rounded-lg"
                      />
                      <svg v-else class="w-5 h-5" :style="{ color: product.id === selectedProductId ? 'var(--color-primary, #4f46e5)' : 'var(--color-card-texto, #9ca3af)' }" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75l-5.571-3m11.142 0l4.179 2.25L12 17.25l-9.75-5.25 4.179-2.25" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold truncate" :style="{ color: 'var(--color-card-texto, #1f2937)' }">{{ product.nome }}</p>
                      <p v-if="product.preco_venda" class="text-[11px]" :style="{ color: 'var(--color-card-texto, #9ca3af)', opacity: '0.6' }">
                        R$ {{ product.preco_venda.toFixed(2) }}
                      </p>
                    </div>
                  </div>
                  <div v-if="product.id === selectedProductId" class="flex-shrink-0">
                    <svg class="w-5 h-5" :style="{ color: 'var(--color-primary, #4f46e5)' }" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer (only on step 2 when a product is selected) -->
          <div v-if="step === 2" class="flex-shrink-0 px-4 py-3 border-t" :style="{ borderColor: 'var(--color-card-border, rgba(0,0,0,0.06))' }">
            <button
              type="button"
              class="w-full py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              :style="{ background: 'var(--color-primary, #4f46e5)', color: '#ffffff' }"
              :disabled="!selectedProductId"
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
import { createSupabaseClient } from '~/lib/supabase'

interface Category {
  id: number
  nome: string
  cor: string | null
}

interface Product {
  id: number
  nome: string
  preco_venda: number | null
  imagem_url: string | null
  categoria: string | null
  categoria_id: number | null
  tipo_precificacao?: string
}

const props = defineProps<{
  show: boolean
  currentProductId?: number | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', product: { id: number; nome: string; preco_venda: number; tipo_precificacao: string }): void
}>()

// ─── State ───────────────────────────────────────────────────────────────────
const step = ref<1 | 2>(1)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)

const categories = ref<Category[]>([])
const loadingCategories = ref(false)

const selectedCategory = ref<Category | null>(null)
const products = ref<Product[]>([])
const loadingProducts = ref(false)
const selectedProductId = ref<number | null>(null)

// ─── Lifecycle ───────────────────────────────────────────────────────────────
watch(() => props.show, async (val) => {
  if (val) {
    // Reset state on open
    step.value = 1
    searchQuery.value = ''
    selectedCategory.value = null
    products.value = []
    selectedProductId.value = props.currentProductId ?? null
    await fetchCategories()
  }
})

watch(step, (val) => {
  if (val === 2) {
    nextTick(() => searchInputRef.value?.focus())
  }
})

// ─── Data fetching ───────────────────────────────────────────────────────────
async function fetchCategories() {
  loadingCategories.value = true
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('catalogo_categorias')
      .select('id, nome, cor')
      .eq('ativo', true)
      .order('nome')

    if (error) throw error
    categories.value = data ?? []
  } catch (err) {
    console.error('[MaterialSelectorModal] Erro ao carregar categorias:', err)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

async function fetchProducts(category: Category) {
  loadingProducts.value = true
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('catalogo_adesivos')
      .select('id, nome, preco_venda, imagem_url, categoria, categoria_id, tipo_precificacao')
      .eq('ativo', true)
      .or(`categoria_id.eq.${category.id},categoria.eq.${category.nome}`)
      .order('nome')

    if (error) throw error
    products.value = data ?? []
  } catch (err) {
    console.error('[MaterialSelectorModal] Erro ao carregar produtos:', err)
    products.value = []
  } finally {
    loadingProducts.value = false
  }
}

// ─── Computed ────────────────────────────────────────────────────────────────
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => p.nome.toLowerCase().includes(q))
})

// ─── Actions ─────────────────────────────────────────────────────────────────
function selectCategory(cat: Category) {
  selectedCategory.value = cat
  step.value = 2
  searchQuery.value = ''
  fetchProducts(cat)
}

function selectProduct(product: Product) {
  selectedProductId.value = product.id
}

function goBack() {
  step.value = 1
  searchQuery.value = ''
  selectedCategory.value = null
  products.value = []
}

function confirm() {
  const product = products.value.find(p => p.id === selectedProductId.value)
  if (product) {
    emit('select', {
      id: product.id,
      nome: product.nome,
      preco_venda: product.preco_venda ?? 0,
      tipo_precificacao: product.tipo_precificacao ?? 'unidade',
    })
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
