<template>
  <div class="min-h-screen" :style="{ background: bgColor }">
    <!-- Header -->
    <header class="sticky top-0 z-30 backdrop-blur-md border-b" :style="{ background: headerBg, borderColor: 'rgba(0,0,0,0.06)' }">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button class="flex items-center gap-2 text-sm font-semibold" :style="{ color: primaryColor }" @click="$router.push(`/catalogo/${empresaId}`)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
          Voltar
        </button>
        <span class="text-lg font-bold" :style="{ color: textColor }">{{ tema.nome_empresa || 'Loja' }}</span>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-8 h-8 border-3 rounded-full animate-spin" :style="{ borderColor: primaryColor + '30', borderTopColor: primaryColor }"></div>
    </div>

    <!-- Produto -->
    <div v-else-if="produto" class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Galeria de Fotos -->
        <div>
          <div class="aspect-square rounded-2xl overflow-hidden mb-3" :style="{ background: cardBg }">
            <img v-if="fotoAtiva" :src="fotoAtiva" class="w-full h-full object-contain" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            </div>
          </div>
          <!-- Thumbnails -->
          <div v-if="todasFotos.length > 1" class="flex gap-2 overflow-x-auto">
            <button v-for="(foto, i) in todasFotos" :key="i" class="w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors" :style="{ borderColor: fotoAtiva === foto ? primaryColor : 'transparent' }" @click="fotoAtiva = foto">
              <img :src="foto" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Info do Produto -->
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold mb-2" :style="{ color: textColor }">{{ produto.nome }}</h1>
          <p v-if="produto.categoria" class="text-sm font-semibold mb-4" :style="{ color: primaryColor }">{{ produto.categoria }}</p>
          <p v-if="produto.preco_venda" class="text-3xl font-black mb-4" :style="{ color: primaryColor }">{{ formatCurrency(produto.preco_venda) }}</p>
          <p v-if="produto.estoque != null" class="text-sm mb-4" :style="{ color: textColor, opacity: 0.7 }">
            Estoque: <strong>{{ produto.estoque }} un</strong>
          </p>
          <p v-if="produto.descricao" class="text-sm leading-relaxed mb-6" :style="{ color: textColor, opacity: 0.8 }">{{ produto.descricao }}</p>

          <!-- Botoes -->
          <div class="space-y-3">
            <button class="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2" style="background: #25d366" @click="comprarWhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Comprar via WhatsApp
            </button>
            <button class="w-full py-3.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2" :style="{ borderColor: primaryColor, color: primaryColor }" @click="addCarrinho">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center py-20">
      <p class="text-gray-400">Produto nao encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

definePageMeta({ layout: 'public' })

const route = useRoute()
const supabase = createSupabaseClient()
const empresaId = Number(route.params.id)
const produtoId = Number(route.params.produtoId)

const tema = ref<any>({})
const produto = ref<any>(null)
const loading = ref(true)
const fotoAtiva = ref<string | null>(null)

const primaryColor = computed(() => tema.value.cor_primaria || '#374151')
const bgColor = computed(() => tema.value.cor_fundo || '#f9fafb')
const cardBg = computed(() => tema.value.cor_card || '#ffffff')
const textColor = computed(() => tema.value.cor_card_texto || '#1e293b')
const headerBg = computed(() => (tema.value.cor_card || '#ffffff') + 'ee')

const todasFotos = computed(() => {
  const fotos: string[] = []
  if (produto.value?.imagem_url) fotos.push(produto.value.imagem_url)
  if (produto.value?.imagens_url?.length) fotos.push(...produto.value.imagens_url)
  return fotos
})

onMounted(async () => {
  const { data: perso } = await supabase.from('empresa_personalizacao').select('*').eq('empresa_id', empresaId).maybeSingle()
  if (perso) tema.value = perso

  const { data: prod } = await supabase.from('catalogo_adesivos').select('*').eq('id', produtoId).eq('empresa_id', empresaId).eq('ativo', true).maybeSingle()
  produto.value = prod
  if (prod?.imagem_url) fotoAtiva.value = prod.imagem_url
  else if (prod?.imagens_url?.[0]) fotoAtiva.value = prod.imagens_url[0]
  loading.value = false
})

function formatCurrency(val: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

function comprarWhatsApp() {
  // TODO: pegar telefone da empresa
  const msg = encodeURIComponent(`Ola! Tenho interesse no produto:\n\n*${produto.value.nome}*\nPreco: ${formatCurrency(produto.value.preco_venda)}\n\nPodemos conversar?`)
  window.open(`https://wa.me/?text=${msg}`, '_blank')
}

function addCarrinho() {
  try {
    const key = `carrinho_${empresaId}`
    const saved = JSON.parse(localStorage.getItem(key) || '[]')
    saved.push({ id: produto.value.id, nome: produto.value.nome, preco: produto.value.preco_venda, imagem_url: produto.value.imagem_url })
    localStorage.setItem(key, JSON.stringify(saved))
    alert('Adicionado ao carrinho!')
  } catch {}
}
</script>
