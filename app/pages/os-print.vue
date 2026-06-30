<template>
  <div class="print-page bg-white min-h-screen text-gray-800">
    <!-- Print button (hidden when printing) -->
    <div class="print:hidden fixed top-4 right-4 z-50 flex gap-2">
      <button
        @click="handlePrint"
        :disabled="downloading"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold shadow-lg hover:bg-gray-800 transition-colors disabled:opacity-60"
      >
        <svg v-if="!downloading" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span v-if="downloading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        {{ downloading ? 'Gerando...' : 'Baixar PDF' }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
        <p class="text-sm text-gray-500">Carregando ordem de serviço...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="errorMsg" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-red-500 font-bold mb-2">Erro ao carregar OS</p>
        <p class="text-sm text-gray-500">{{ errorMsg }}</p>
      </div>
    </div>

    <!-- Page content -->
    <div v-else-if="os" class="print-content max-w-[210mm] mx-auto p-8">

      <!-- HEADER: dark bg with logo + title + status -->
      <div class="rounded-2xl bg-gray-900 text-white px-8 py-6 flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <img v-if="logoUrl" :src="logoUrl" class="h-12 w-auto object-contain" />
          <div>
            <p class="text-xs text-gray-400 uppercase tracking-wider">{{ nomeEmpresa }}</p>
          </div>
        </div>
        <div class="text-right">
          <h1 class="text-xl font-bold">Ordem de Serviço</h1>
          <p class="font-bold text-lg" :style="{ color: primaryColor }">{{ os.numero_os }}</p>
        </div>
        <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
          <span class="w-2 h-2 rounded-full" :class="statusDotClass" />
          <span class="text-sm font-bold">{{ statusLabel }}</span>
        </div>
      </div>

      <!-- DATES ROW -->
      <div class="flex justify-center gap-12 mb-6 text-center">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <div>
            <p class="text-[10px] text-gray-500 uppercase font-bold">Emitido em</p>
            <p class="text-base font-bold">{{ dataEmissao }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-[10px] text-gray-500 uppercase font-bold">Previsão de Entrega</p>
            <p class="text-base font-bold">{{ dataEntrega }}</p>
          </div>
        </div>
      </div>

      <!-- INFO CARDS (4 columns) -->
      <div class="grid grid-cols-4 gap-3 mb-6">
        <!-- Status -->
        <div class="border rounded-xl p-3 text-center">
          <div class="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" :style="{ backgroundColor: primaryColor + '15' }">
            <svg class="w-4 h-4" :style="{ color: primaryColor }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-[10px] text-gray-400 uppercase font-bold">Status</p>
          <p class="text-sm font-bold">{{ statusLabel }}</p>
          <p class="text-[10px] text-gray-400">Situação atual</p>
        </div>
        <!-- Trabalho -->
        <div class="border rounded-xl p-3 text-center">
          <div class="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" :style="{ backgroundColor: primaryColor + '15' }">
            <svg class="w-4 h-4" :style="{ color: primaryColor }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <p class="text-[10px] text-gray-400 uppercase font-bold">Trabalho</p>
          <p class="text-sm font-bold truncate">{{ os.nome_trabalho || '—' }}</p>
          <p class="text-[10px] text-gray-400">Nome do serviço</p>
        </div>
        <!-- Emissão -->
        <div class="border rounded-xl p-3 text-center">
          <div class="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" :style="{ backgroundColor: primaryColor + '15' }">
            <svg class="w-4 h-4" :style="{ color: primaryColor }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <p class="text-[10px] text-gray-400 uppercase font-bold">Emissão</p>
          <p class="text-sm font-bold">{{ dataEmissao }}</p>
          <p class="text-[10px] text-gray-400">Data de aprovação</p>
        </div>
        <!-- Entrega -->
        <div class="border rounded-xl p-3 text-center">
          <div class="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" :style="{ backgroundColor: primaryColor + '15' }">
            <svg class="w-4 h-4" :style="{ color: primaryColor }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <p class="text-[10px] text-gray-400 uppercase font-bold">Entrega</p>
          <p class="text-sm font-bold">{{ dataEntrega }}</p>
          <p class="text-[10px] text-gray-400">Previsão</p>
        </div>
      </div>

      <!-- CLIENT + ADDRESS (2 columns) -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="border rounded-xl p-4">
          <p class="text-[10px] text-gray-400 uppercase font-bold mb-1">Cliente</p>
          <p class="text-lg font-bold">{{ os.cliente_nome }}</p>
          <p class="text-sm text-gray-500">{{ os.cliente_telefone || '' }}</p>
        </div>
        <div v-if="os.endereco_instalacao" class="border rounded-xl p-4">
          <p class="text-[10px] text-gray-400 uppercase font-bold mb-1">Endereço de Instalação</p>
          <p class="text-base font-bold">{{ os.endereco_instalacao }}</p>
        </div>
      </div>

      <!-- TIMELINE -->
      <div class="border rounded-xl p-6 mb-6">
        <p class="text-[10px] font-bold uppercase text-gray-400 mb-4 tracking-wider">Acompanhamento do Pedido</p>
        <div class="flex items-center justify-between">
          <template v-for="(step, idx) in timelineSteps" :key="step.key">
            <!-- Step circle + label -->
            <div class="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                :class="idx <= activeStepIndex ? 'border-transparent text-white' : 'border-gray-200 text-gray-400 bg-white'"
                :style="idx <= activeStepIndex ? { backgroundColor: primaryColor } : {}"
              >
                <svg v-if="step.icon === 'clipboard'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <svg v-else-if="step.icon === 'pencil'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                </svg>
                <svg v-else-if="step.icon === 'cog'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg v-else-if="step.icon === 'truck'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <svg v-else-if="step.icon === 'check'" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-[10px] font-bold text-center" :class="idx <= activeStepIndex ? 'text-gray-800' : 'text-gray-400'">{{ step.label }}</span>
            </div>
            <!-- Connecting line -->
            <div
              v-if="idx < timelineSteps.length - 1"
              class="flex-1 h-0.5 mx-1"
              :style="{ backgroundColor: idx < activeStepIndex ? primaryColor : '#e5e7eb' }"
            />
          </template>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <div class="mb-6">
        <p class="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-wider">Itens da Ordem de Serviço</p>
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b-2" :style="{ borderColor: primaryColor }">
              <th class="py-2 px-3 text-left text-[10px] font-bold uppercase text-gray-500">#</th>
              <th class="py-2 px-3 text-left text-[10px] font-bold uppercase text-gray-500">Descrição</th>
              <th class="py-2 px-3 text-center text-[10px] font-bold uppercase text-gray-500">Material</th>
              <th class="py-2 px-3 text-center text-[10px] font-bold uppercase text-gray-500">Dimensões</th>
              <th class="py-2 px-3 text-center text-[10px] font-bold uppercase text-gray-500">Qtd</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in itens" :key="item.id" class="border-b border-gray-100">
              <td class="py-3 px-3 text-gray-500 font-bold">{{ idx + 1 }}</td>
              <td class="py-3 px-3 font-semibold text-gray-800">{{ item.descricao }}</td>
              <td class="py-3 px-3 text-center text-gray-600">{{ item.material_id || '—' }}</td>
              <td class="py-3 px-3 text-center text-gray-600">{{ item.largura_cm }} × {{ item.altura_cm }} cm</td>
              <td class="py-3 px-3 text-center font-bold">{{ item.quantidade }} un</td>
            </tr>
          </tbody>
        </table>

        <!-- Fotos dos itens -->
        <div v-for="(item, idx) in itens" :key="'foto-' + item.id">
          <div v-if="item.foto_arte_url || item.foto_local_url" class="mt-4 border-t border-gray-100 pt-4">
            <p class="text-[10px] font-bold uppercase text-gray-400 mb-2">Anexos do Item {{ idx + 1 }} — {{ item.descricao }}</p>
            <div class="flex gap-4 flex-wrap">
              <button v-if="item.foto_arte_url" type="button" class="flex flex-col items-center gap-1 print:pointer-events-none" @click="lightboxUrl = item.foto_arte_url">
                <img :src="item.foto_arte_url" class="w-40 h-40 object-cover rounded-lg border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer" />
                <span class="text-[9px] font-bold text-gray-400 uppercase">Arte</span>
              </button>
              <button v-if="item.foto_local_url" type="button" class="flex flex-col items-center gap-1 print:pointer-events-none" @click="lightboxUrl = item.foto_local_url">
                <img :src="item.foto_local_url" class="w-40 h-40 object-cover rounded-lg border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer" />
                <span class="text-[9px] font-bold text-gray-400 uppercase">Local</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- OBSERVAÇÕES -->
      <div v-if="os.observacoes" class="mb-6 border rounded-xl p-4">
        <p class="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Observações</p>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ os.observacoes }}</p>
      </div>

      <!-- FOOTER -->
      <div class="border-t pt-6 flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-gray-800">{{ nomeEmpresa }}</p>
          <p class="text-xs text-gray-400">Qualidade, prazo e excelência em cada etapa do seu projeto.</p>
        </div>
        <div class="text-right">
          <p class="text-base font-bold italic" :style="{ color: primaryColor }">
            Obrigado por escolher a {{ nomeEmpresa }}!
          </p>
        </div>
      </div>

    </div>

    <!-- Lightbox modal (hidden on print) -->
    <Teleport to="body">
      <div v-if="lightboxUrl" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 print:hidden" @click="lightboxUrl = null">
        <button type="button" class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white" @click.stop="lightboxUrl = null">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <img :src="lightboxUrl" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" @click.stop />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { createSupabaseClient } from '~/lib/supabase'
import type { StatusOS, ItemOS } from '~/composables/useOrdensServico'

definePageMeta({ layout: false })

const route = useRoute()
const supabase = createSupabaseClient()
const { config, loadPersonalizacao } = usePersonalizacao()

// ─── State ───────────────────────────────────────────────────────────────────
const loading = ref(true)
const errorMsg = ref<string | null>(null)
const os = ref<any>(null)
const itens = ref<ItemOS[]>([])
const lightboxUrl = ref<string | null>(null)

// ─── Personalization ─────────────────────────────────────────────────────────
const logoUrl = computed(() => config.value.logo_url)
const nomeEmpresa = computed(() => config.value.nome_empresa || 'SignPRO')
const primaryColor = computed(() => config.value.cor_primaria || '#ea580c')

// ─── Status helpers ──────────────────────────────────────────────────────────
const statusLabels: Record<StatusOS, string> = {
  aguardando_producao: 'Aguardando Produção',
  em_producao: 'Em Produção',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

const statusLabel = computed(() => {
  if (!os.value) return ''
  return statusLabels[os.value.status as StatusOS] || os.value.status
})

const statusDotClass = computed(() => {
  if (!os.value) return 'bg-gray-400'
  const map: Record<StatusOS, string> = {
    aguardando_producao: 'bg-amber-400',
    em_producao: 'bg-blue-400',
    pronto: 'bg-green-400',
    entregue: 'bg-emerald-400',
    cancelado: 'bg-red-400',
  }
  return map[os.value.status as StatusOS] || 'bg-gray-400'
})

// ─── Timeline ────────────────────────────────────────────────────────────────
const timelineSteps = [
  { key: 'aguardando_producao', label: 'Pedido Recebido', icon: 'clipboard' },
  { key: 'projeto', label: 'Projeto', icon: 'pencil' },
  { key: 'em_producao', label: 'Produção', icon: 'cog' },
  { key: 'pronto', label: 'Instalação', icon: 'truck' },
  { key: 'entregue', label: 'Finalizado', icon: 'check' },
]

const activeStepIndex = computed(() => {
  if (!os.value) return 0
  const statusMap: Record<string, number> = {
    aguardando_producao: 0,
    em_producao: 2,
    pronto: 3,
    entregue: 4,
    cancelado: 4,
  }
  return statusMap[os.value.status] ?? 0
})

// ─── Dates ───────────────────────────────────────────────────────────────────
const dataEmissao = computed(() => {
  if (!os.value?.data_aprovacao) return '—'
  return new Date(os.value.data_aprovacao).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
})

const dataEntrega = computed(() => {
  if (!os.value?.data_entrega && !os.value?.prazo_estimado) return '—'
  const d = os.value.data_entrega || os.value.prazo_estimado
  return new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
})

// ─── Download PDF direto ─────────────────────────────────────────────────────
const downloading = ref(false)

async function handlePrint() {
  if (downloading.value) return
  downloading.value = true

  try {
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const element = document.querySelector('.print-content') as HTMLElement
    if (!element) { downloading.value = false; return }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.95)
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * pdfWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Primeira página
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    // Páginas adicionais se necessário
    while (heightLeft > 0) {
      position -= pdfHeight
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    pdf.save(`OS-${os.value?.numero_os || 'sem-numero'}.pdf`)
  } catch (e) {
    console.error('Erro ao gerar PDF:', e)
    // Fallback: usar window.print()
    window.print()
  } finally {
    downloading.value = false
  }
}

// ─── Data fetching ───────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    // Load personalization
    await loadPersonalizacao()

    // Get OS ID from query
    const osId = Number(route.query.id)
    if (!osId) {
      errorMsg.value = 'ID da OS não fornecido. Use ?id=123 na URL.'
      loading.value = false
      return
    }

    // Fetch OS with client join
    const { data: osData, error: osError } = await supabase
      .from('ordens_servico_adesivo')
      .select('*, clientes(nome, telefone)')
      .eq('id', osId)
      .single()

    if (osError || !osData) {
      errorMsg.value = osError?.message || 'OS não encontrada.'
      loading.value = false
      return
    }

    // Map client data
    os.value = {
      ...osData,
      cliente_nome: osData.clientes?.nome || '—',
      cliente_telefone: osData.clientes?.telefone || '',
    }

    // Fetch items
    const { data: itensData } = await supabase
      .from('itens_ordem_servico')
      .select('id, item_orcamento_id, descricao, material_id, largura_cm, altura_cm, quantidade, valor_item, foto_arte_url, foto_local_url, arquivo_url, foto_instalacao_url')
      .eq('ordem_servico_id', osId)

    itens.value = (itensData || []) as ItemOS[]

    loading.value = false
  } catch (e: any) {
    errorMsg.value = e?.message || 'Erro inesperado.'
    loading.value = false
  }
})
</script>

<style>
@media print {
  @page {
    margin: 10mm;
    size: A4;
  }

  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .print\:hidden {
    display: none !important;
  }

  .print-page {
    min-height: auto !important;
  }
}

/* Screen-only styles for better preview */
.print-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
