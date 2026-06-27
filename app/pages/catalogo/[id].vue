<template>
  <div class="min-h-full bg-gray-50/60 p-3 sm:p-8">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <span class="inline-block w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" :style="{ borderColor: 'var(--color-primary, #ec4899)', borderTopColor: 'transparent' }" />
    </div>

    <!-- Erro / não encontrado -->
    <div v-else-if="!veiculo" class="flex flex-col items-center justify-center py-32 gap-4">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
      </div>
      <div class="text-center">
        <p class="font-bold text-gray-700">Veículo não encontrado</p>
        <p class="text-sm text-gray-400 mt-1">Este veículo pode ter sido removido ou não está disponível.</p>
      </div>
      <NuxtLink to="/catalogo" class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
        Voltar ao catálogo
      </NuxtLink>
    </div>

    <template v-else>
      <!-- ═══════ CABEÇALHO ═══════ -->
      <div class="relative rounded-3xl overflow-hidden mb-6 shadow-xl">
        <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #ec4899, #f43f5e))' }" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />

        <div class="relative px-4 sm:px-8 pt-5 pb-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <!-- Breadcrumb + título -->
            <div class="flex items-center gap-3">
              <NuxtLink
                to="/catalogo"
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.12] hover:bg-white/20 border border-white/20 transition-colors"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
              </NuxtLink>
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Catálogo</span>
                  <svg class="w-3 h-3 text-white/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                  <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Detalhes</span>
                </div>
                <h1 class="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {{ veiculo.marca }} {{ veiculo.modelo }}
                </h1>
                <p class="text-sm text-white/70 mt-0.5">
                  {{ veiculo.ano_fabricacao }}{{ veiculo.ano_modelo && veiculo.ano_modelo !== veiculo.ano_fabricacao ? `/${veiculo.ano_modelo}` : '' }}
                  <span v-if="veiculo.cor"> • {{ veiculo.cor }}</span>
                </p>
              </div>
            </div>

            <!-- Status + badge -->
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wide shadow"
                :class="statusBadgeClass(veiculo.status)"
              >
                {{ statusLabel(veiculo.status) }}
              </span>
              <span v-if="veiculo.tipo" class="inline-flex items-center text-xs font-semibold bg-white/15 text-white px-3 py-1.5 rounded-xl border border-white/20">
                {{ veiculo.tipo }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════ CONTEÚDO ═══════ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Coluna esquerda: galeria de fotos -->
        <div class="lg:col-span-2 flex flex-col gap-4">

          <!-- Foto principal -->
          <div class="relative rounded-2xl overflow-hidden bg-gray-100 shadow-md aspect-[16/9]">
            <img
              v-if="fotoAtiva"
              :src="fotoAtiva"
              :alt="`${veiculo.marca} ${veiculo.modelo}`"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center flex-col gap-3">
              <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
              <p class="text-sm text-gray-400 font-medium">Sem fotos cadastradas</p>
            </div>
            <!-- Contador -->
            <span v-if="fotos.length > 1" class="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-bold bg-black/60 text-white px-2.5 py-1 rounded-full">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
              {{ fotoIndex + 1 }} / {{ fotos.length }}
            </span>
            <!-- Setas navegação -->
            <template v-if="fotos.length > 1">
              <button type="button" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors" @click="fotoIndex = (fotoIndex - 1 + fotos.length) % fotos.length">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              </button>
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors" @click="fotoIndex = (fotoIndex + 1) % fotos.length">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
              </button>
            </template>
          </div>

          <!-- Miniaturas -->
          <div v-if="fotos.length > 1" class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="(foto, i) in fotos"
              :key="i"
              type="button"
              class="shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all"
              :class="i === fotoIndex ? 'border-pink-500 shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'"
              @click="fotoIndex = i"
            >
              <img :src="foto" :alt="`Foto ${i + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>

          <!-- Especificações técnicas -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 class="text-sm font-black text-gray-700 uppercase tracking-widest mb-4">Especificações</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div v-if="veiculo.km != null" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quilometragem</span>
                <span class="text-sm font-bold text-gray-800">{{ veiculo.km.toLocaleString('pt-BR') }} km</span>
              </div>
              <div v-if="veiculo.combustivel" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Combustível</span>
                <span class="text-sm font-bold text-gray-800">{{ veiculo.combustivel }}</span>
              </div>
              <div v-if="veiculo.cambio" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Câmbio</span>
                <span class="text-sm font-bold text-gray-800">{{ veiculo.cambio }}</span>
              </div>
              <div v-if="veiculo.cor" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cor</span>
                <span class="text-sm font-bold text-gray-800">{{ veiculo.cor }}</span>
              </div>
              <div v-if="veiculo.tipo" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</span>
                <span class="text-sm font-bold text-gray-800">{{ veiculo.tipo }}</span>
              </div>
              <div v-if="veiculo.ano_fabricacao" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ano</span>
                <span class="text-sm font-bold text-gray-800">
                  {{ veiculo.ano_fabricacao }}{{ veiculo.ano_modelo && veiculo.ano_modelo !== veiculo.ano_fabricacao ? `/${veiculo.ano_modelo}` : '' }}
                </span>
              </div>
              <div v-if="veiculo.cilindrada" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cilindrada</span>
                <span class="text-sm font-bold text-gray-800">{{ veiculo.cilindrada }} cc</span>
              </div>
              <div v-if="veiculo.tipo_moto" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo Moto</span>
                <span class="text-sm font-bold text-gray-800">{{ veiculo.tipo_moto }}</span>
              </div>
              <div v-if="veiculo.placa" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Placa</span>
                <span class="text-sm font-bold text-gray-800 font-mono tracking-widest">{{ veiculo.placa }}</span>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div v-if="veiculo.observacao" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 class="text-sm font-black text-gray-700 uppercase tracking-widest mb-3">Observações</h2>
            <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ veiculo.observacao }}</p>
          </div>
        </div>

        <!-- Coluna direita: preço + ações -->
        <div class="flex flex-col gap-4">

          <!-- Card de preço -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preço de venda</p>
            <p class="text-3xl font-black text-gray-900 mb-4">{{ formatCurrency(veiculo.preco_venda) }}</p>

            <div class="flex flex-col gap-2">
              <NuxtLink
                to="/propostas"
                class="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg"
                :style="{ backgroundColor: 'var(--color-primary, #ec4899)', color: '#ffffff' }"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                Gerar Proposta
              </NuxtLink>
              <NuxtLink
                to="/catalogo"
                class="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                Voltar ao catálogo
              </NuxtLink>
            </div>

            <!-- Dados internos (admin) -->
            <template v-if="isAdminOrGerente">
              <div class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Dados internos</p>
                <div class="flex flex-col gap-1.5 text-xs text-gray-500">
                  <div v-if="veiculo.preco_custo" class="flex justify-between">
                    <span>Custo</span>
                    <span class="font-semibold text-gray-700">{{ formatCurrency(veiculo.preco_custo) }}</span>
                  </div>
                  <div v-if="veiculo.preco_custo && veiculo.preco_venda" class="flex justify-between">
                    <span>Margem</span>
                    <span class="font-semibold" :class="margem >= 0 ? 'text-green-600' : 'text-red-500'">
                      {{ margem >= 0 ? '+' : '' }}{{ margem.toFixed(1) }}%
                    </span>
                  </div>
                  <div v-if="veiculo.chassi" class="flex justify-between">
                    <span>Chassi</span>
                    <span class="font-mono font-semibold text-gray-700 text-[10px]">{{ veiculo.chassi }}</span>
                  </div>
                  <div v-if="veiculo.renavam" class="flex justify-between">
                    <span>RENAVAM</span>
                    <span class="font-mono font-semibold text-gray-700">{{ veiculo.renavam }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <NuxtLink
                  to="/veiculos"
                  class="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  Editar no inventário
                </NuxtLink>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'
import { useAdmin } from '~/composables/useAdmin'

interface Veiculo {
  id: number
  marca: string
  modelo: string
  ano_fabricacao: number | null
  ano_modelo: number | null
  tipo: string | null
  placa: string | null
  cor: string | null
  km: number | null
  combustivel: string | null
  cambio: string | null
  chassi: string | null
  renavam: string | null
  cilindrada: number | null
  tipo_moto: string | null
  preco_custo: number | null
  preco_venda: number
  status: string | null
  fotos: string[] | null
  observacao: string | null
  empresa_id: number
}

const route = useRoute()
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdminOrGerente } = useAdmin()
const { formatCurrency } = useLocale()

const veiculo  = ref<Veiculo | null>(null)
const loading  = ref(true)
const fotoIndex = ref(0)

const fotos = computed(() => veiculo.value?.fotos?.filter(Boolean) ?? [])
const fotoAtiva = computed(() => fotos.value[fotoIndex.value] ?? null)

const margem = computed(() => {
  if (!veiculo.value?.preco_custo || !veiculo.value?.preco_venda) return 0
  return ((veiculo.value.preco_venda - veiculo.value.preco_custo) / veiculo.value.preco_custo) * 100
})

onMounted(async () => {
  await loadEmpresa()
  const id = Number(route.params.id)
  if (!id || isNaN(id)) { loading.value = false; return }

  const { data } = await supabase
    .from('veiculos')
    .select('*')
    .eq('id', id)
    .eq('empresa_id', empresaId.value!)
    .single()

  veiculo.value = data ?? null
  loading.value = false
})

function statusLabel(s: string | null) {
  const map: Record<string, string> = { disponivel: 'Disponível', vendido: 'Vendido', reservado: 'Reservado', manutencao: 'Manutenção' }
  return map[s ?? ''] ?? s ?? '—'
}

function statusBadgeClass(s: string | null) {
  if (s === 'disponivel') return 'bg-amber-400 text-gray-950'
  if (s === 'reservado')  return 'bg-blue-500 text-white'
  if (s === 'vendido')    return 'bg-gray-200 text-gray-700'
  return 'bg-gray-200 text-gray-700'
}
</script>
