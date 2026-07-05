<template>
  <div class="min-h-screen" :style="{ background: bgColor }">
    <!-- Header -->
    <header class="sticky top-0 z-30 backdrop-blur-md border-b" :style="{ background: headerBg, borderColor: 'rgba(0,0,0,0.06)' }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img v-if="tema.logo_url" :src="tema.logo_url" class="h-8 w-auto object-contain" />
          <span class="text-lg font-bold" :style="{ color: textColor }">{{ tema.nome_empresa || 'Loja' }}</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <button class="w-10 h-10 rounded-full flex items-center justify-center" :style="{ background: primaryColor + '15', color: primaryColor }" @click="carrinhoAberto = !carrinhoAberto">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
            </button>
            <span v-if="carrinho.length" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center text-white" :style="{ background: primaryColor }">{{ carrinho.length }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Busca e Filtros -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
          <input v-model="busca" type="text" placeholder="Buscar produto..." class="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2" :style="{ borderColor: primaryColor + '30', '--tw-ring-color': primaryColor + '40' }" />
        </div>
        <div class="flex gap-2 overflow-x-auto">
          <button class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors" :class="!categoriaAtiva ? 'text-white' : ''" :style="!categoriaAtiva ? { background: primaryColor } : { background: primaryColor + '10', color: primaryColor }" @click="categoriaAtiva = null">Todos</button>
          <button v-for="cat in categorias" :key="cat.id" class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors" :class="categoriaAtiva === cat.id ? 'text-white' : ''" :style="categoriaAtiva === cat.id ? { background: primaryColor } : { background: primaryColor + '10', color: primaryColor }" @click="categoriaAtiva = cat.id">{{ cat.nome }}</button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-8 h-8 border-3 rounded-full animate-spin" :style="{ borderColor: primaryColor + '30', borderTopColor: primaryColor }"></div>
      </div>

      <!-- Grid de Produtos -->
      <div v-else-if="produtosFiltrados.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="p in produtosFiltrados" :key="p.id" class="rounded-2xl overflow-hidden shadow-sm border cursor-pointer hover:shadow-lg transition-shadow" :style="{ background: cardBg, borderColor: 'rgba(0,0,0,0.06)' }" @click="$router.push(`/catalogo/${empresaId}/produto/${p.id}`)">
          <div class="aspect-square bg-gray-100 overflow-hidden">
            <img v-if="p.imagem_url" :src="p.imagem_url" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            </div>
          </div>
          <div class="p-3">
            <p class="text-sm font-bold truncate" :style="{ color: textColor }">{{ p.nome }}</p>
            <p v-if="p.preco" class="text-lg font-black mt-1" :style="{ color: primaryColor }">{{ formatCurrency(p.preco) }}</p>
          </div>
        </div>
      </div>

      <!-- Vazio -->
      <div v-else class="text-center py-20">
        <p class="text-gray-400">Nenhum produto encontrado</p>
      </div>
    </div>

    <!-- Modal Produto -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="produtoSelecionado" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="produtoSelecionado = null">
          <div class="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" :style="{ background: cardBg }">
            <div v-if="produtoSelecionado.imagem_url" class="aspect-video overflow-hidden rounded-t-2xl">
              <img :src="produtoSelecionado.imagem_url" class="w-full h-full object-cover" />
            </div>
            <div class="p-6">
              <h2 class="text-xl font-bold" :style="{ color: textColor }">{{ produtoSelecionado.nome }}</h2>
              <p v-if="produtoSelecionado.descricao" class="text-sm mt-2 opacity-70" :style="{ color: textColor }">{{ produtoSelecionado.descricao }}</p>
              <p v-if="produtoSelecionado.preco" class="text-2xl font-black mt-4" :style="{ color: primaryColor }">{{ formatCurrency(produtoSelecionado.preco) }}</p>
              <div class="flex gap-3 mt-6">
                <button class="flex-1 py-3 rounded-xl text-sm font-bold text-white" :style="{ background: '#25d366' }" @click="comprarWhatsApp(produtoSelecionado)">
                  Comprar via WhatsApp
                </button>
                <button class="flex-1 py-3 rounded-xl text-sm font-bold border" :style="{ borderColor: primaryColor, color: primaryColor }" @click="addCarrinho(produtoSelecionado)">
                  Adicionar ao Carrinho
                </button>
              </div>
              <button class="w-full mt-3 py-2 text-xs text-gray-400 hover:text-gray-600" @click="produtoSelecionado = null">Fechar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Carrinho Drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="carrinhoAberto" class="fixed inset-0 z-50 flex justify-end bg-black/40" @click.self="carrinhoAberto = false">
          <div class="w-full max-w-sm h-full overflow-y-auto shadow-2xl p-6" :style="{ background: cardBg }">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold" :style="{ color: textColor }">Carrinho</h3>
              <button @click="carrinhoAberto = false" class="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div v-if="!carrinho.length" class="text-center py-10 text-gray-400 text-sm">Carrinho vazio</div>
            <div v-else class="space-y-3">
              <div v-for="(item, i) in carrinho" :key="i" class="flex items-center gap-3 p-3 rounded-xl" :style="{ background: primaryColor + '08' }">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img v-if="item.imagem_url" :src="item.imagem_url" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold truncate" :style="{ color: textColor }">{{ item.nome }}</p>
                  <p class="text-xs" :style="{ color: primaryColor }">{{ formatCurrency(item.preco) }}</p>
                </div>
                <button @click="carrinho.splice(i, 1); salvarCarrinho()" class="text-red-400 hover:text-red-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div class="border-t pt-4 mt-4" :style="{ borderColor: primaryColor + '20' }">
                <div class="flex justify-between text-lg font-black" :style="{ color: textColor }">
                  <span>Total</span>
                  <span>{{ formatCurrency(totalCarrinho) }}</span>
                </div>
                <button class="w-full mt-4 py-3 rounded-xl text-sm font-bold text-white" :style="{ background: '#25d366' }" @click="finalizarWhatsApp">Finalizar via WhatsApp</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

definePageMeta({ layout: 'public' })

const route = useRoute()
const supabase = createSupabaseClient()
const empresaId = Number(route.params.id)

const tema = ref<any>({})
const produtos = ref<any[]>([])
const categorias = ref<any[]>([])
const loading = ref(true)
const busca = ref('')
const categoriaAtiva = ref<number | null>(null)
const produtoSelecionado = ref<any>(null)
const carrinhoAberto = ref(false)
const carrinho = ref<any[]>([])
const telefoneEmpresa = ref('')

// Cores derivadas do tema
const primaryColor = computed(() => tema.value.cor_primaria || '#374151')
const bgColor = computed(() => tema.value.cor_fundo || '#f9fafb')
const cardBg = computed(() => tema.value.cor_card || '#ffffff')
const textColor = computed(() => tema.value.cor_card_texto || '#1e293b')
const headerBg = computed(() => (tema.value.cor_card || '#ffffff') + 'ee')

const produtosFiltrados = computed(() => {
  let arr = produtos.value
  if (categoriaAtiva.value) arr = arr.filter(p => p.categoria_id === categoriaAtiva.value)
  if (busca.value.trim()) {
    const q = busca.value.toLowerCase()
    arr = arr.filter(p => p.nome.toLowerCase().includes(q))
  }
  return arr
})

const totalCarrinho = computed(() => carrinho.value.reduce((s, i) => s + (i.preco || 0), 0))

onMounted(async () => {
  // Carregar tema
  const { data: perso } = await supabase.from('empresa_personalizacao').select('*').eq('empresa_id', empresaId).maybeSingle()
  if (perso) tema.value = perso

  // Carregar nome empresa + telefone
  const { data: emp } = await supabase.from('empresas').select('nome, telefone').eq('id', empresaId).maybeSingle()
  if (emp) {
    if (!tema.value.nome_empresa) tema.value.nome_empresa = emp.nome
    telefoneEmpresa.value = emp.telefone || ''
  }

  // Carregar categorias
  const { data: cats } = await supabase.from('catalogo_categorias').select('id, nome').eq('empresa_id', empresaId).eq('ativo', true)
  categorias.value = cats || []

  // Carregar produtos
  const { data: prods } = await supabase.from('catalogo_adesivos').select('*').eq('empresa_id', empresaId).eq('ativo', true).order('created_at', { ascending: false })
  produtos.value = prods || []
  loading.value = false

  // Carregar carrinho do localStorage
  try {
    const saved = localStorage.getItem(`carrinho_${empresaId}`)
    if (saved) carrinho.value = JSON.parse(saved)
  } catch {}
})

function formatCurrency(val: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

function abrirProduto(p: any) { produtoSelecionado.value = p }

function addCarrinho(p: any) {
  carrinho.value.push({ id: p.id, nome: p.nome, preco: p.preco, imagem_url: p.imagem_url })
  salvarCarrinho()
  produtoSelecionado.value = null
}

function salvarCarrinho() {
  try { localStorage.setItem(`carrinho_${empresaId}`, JSON.stringify(carrinho.value)) } catch {}
}

function comprarWhatsApp(p: any) {
  const tel = telefoneEmpresa.value.replace(/\D/g, '')
  const msg = encodeURIComponent(`Ola! Tenho interesse no produto:\n\n*${p.nome}*\nPreco: ${formatCurrency(p.preco)}\n\nPodemos conversar?`)
  window.open(`https://wa.me/${tel}?text=${msg}`, '_blank')
}

function finalizarWhatsApp() {
  const tel = telefoneEmpresa.value.replace(/\D/g, '')
  const itens = carrinho.value.map((i, idx) => `${idx + 1}. ${i.nome} - ${formatCurrency(i.preco)}`).join('\n')
  const msg = encodeURIComponent(`Ola! Gostaria de fazer o pedido:\n\n${itens}\n\n*Total: ${formatCurrency(totalCarrinho.value)}*\n\nComo posso pagar?`)
  window.open(`https://wa.me/${tel}?text=${msg}`, '_blank')
}
</script>
