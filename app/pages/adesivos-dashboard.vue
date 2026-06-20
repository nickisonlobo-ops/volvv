<template>
  <div class="min-h-full bg-gray-50/60 p-3 sm:p-8">

    <!-- CABEÇALHO -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Adesivos</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">Dashboard</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Dashboard Adesivos</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">Indicadores e visão geral do negócio</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="space-y-6">
      <!-- Skeleton KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div class="h-3 bg-gray-200 rounded w-2/3 mb-4" />
          <div class="h-7 bg-gray-200 rounded w-1/2 mb-2" />
          <div class="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <!-- Skeleton Alerts -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
      <!-- Skeleton Queue -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="error" class="flex flex-col items-center justify-center gap-4 py-24">
      <div class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4 max-w-lg">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/>
          <path stroke-linecap="round" d="M12 8v4m0 4h.01"/>
        </svg>
        <span>{{ error }}</span>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all duration-200"
        @click="retryLoad"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Tentar novamente
      </button>
    </div>

    <!-- CONTEÚDO PRINCIPAL -->
    <div v-else class="space-y-6">

      <!-- KPI CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Pedidos por Status -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Pedidos</span>
          </div>
          <div class="space-y-1.5">
            <div v-for="(count, status) in statusCounts" :key="status" class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ statusLabels[status] || status }}</span>
              <span class="text-xs font-bold" :class="statusTextColors[status] || 'text-gray-700'">{{ count }}</span>
            </div>
            <div v-if="Object.keys(statusCounts).length === 0" class="text-xs text-gray-400">Nenhum pedido</div>
          </div>
        </div>

        <!-- Faturamento do Mês -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Faturamento</span>
          </div>
          <p class="text-2xl font-black text-gray-800">{{ formatCurrency(faturamentoMes) }}</p>
          <p class="text-xs text-gray-400 mt-1">Mês atual</p>
        </div>

        <!-- Quantidade Entregues -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Entregues</span>
          </div>
          <p class="text-2xl font-black text-gray-800">{{ qtdEntreguesMes }}</p>
          <p class="text-xs text-gray-400 mt-1">Mês atual</p>
        </div>

        <!-- Valor Médio -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor Médio</span>
          </div>
          <p class="text-2xl font-black text-gray-800">{{ formatCurrency(valorMedio) }}</p>
          <p class="text-xs text-gray-400 mt-1">Por pedido entregue</p>
        </div>
      </div>

      <!-- ALERTAS DE ESTOQUE BAIXO -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span class="text-sm font-semibold text-gray-600">Alertas de Estoque Baixo</span>
          </div>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="alertasEstoque.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
            {{ alertasEstoque.length > 0 ? `${alertasEstoque.length} alerta(s)` : 'Tudo OK' }}
          </span>
        </div>

        <div v-if="alertasEstoque.length === 0" class="px-6 py-8 text-center">
          <svg class="w-10 h-10 mx-auto text-green-300 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-gray-400">Todos os materiais estão com estoque adequado</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="alerta in alertasEstoque"
            :key="alerta.id"
            class="flex items-center justify-between px-6 py-3.5 hover:bg-red-50/30 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span class="text-sm font-semibold text-gray-800">{{ alerta.nome }}</span>
            </div>
            <div class="flex items-center gap-4 text-xs">
              <span class="text-red-600 font-bold">{{ formatNumber(alerta.estoque_atual) }} m²</span>
              <span class="text-gray-400">mín: {{ formatNumber(alerta.estoque_minimo) }} m²</span>
            </div>
          </div>
        </div>
      </div>

      <!-- PRÓXIMOS PEDIDOS DA FILA -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            <span class="text-sm font-semibold text-gray-600">Próximos da Fila</span>
          </div>
          <span class="text-xs text-gray-400">Top 5 por urgência</span>
        </div>

        <div v-if="proximosFila.length === 0" class="px-6 py-8 text-center">
          <svg class="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p class="text-sm text-gray-400">Nenhum pedido na fila de produção</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="pedido in proximosFila"
            :key="pedido.id"
            class="flex items-center justify-between px-6 py-3.5 hover:bg-indigo-50/30 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <span
                class="w-2.5 h-2.5 rounded-full shrink-0"
                :class="getUrgencyDotClass(pedido.prazo_estimado)"
              />
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 truncate">{{ pedido.cliente_nome }}</p>
                <p class="text-xs text-gray-400 truncate">{{ truncate(pedido.descricao, 60) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-3">
              <span
                class="text-xs font-bold px-2 py-0.5 rounded-full"
                :class="getUrgencyBadgeClass(pedido.prazo_estimado)"
              >
                {{ getUrgencyLabel(pedido.prazo_estimado) }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────
interface AlertaEstoque {
  id: number
  nome: string
  estoque_atual: number
  estoque_minimo: number
}

interface PedidoFila {
  id: number
  cliente_nome: string
  descricao: string
  prazo_estimado: string | null
}

// ─── Composables ─────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()

// ─── State ───────────────────────────────────────────────────────────────────
const loading = ref(true)
const error = ref<string | null>(null)

// KPIs
const statusCounts = ref<Record<string, number>>({})
const faturamentoMes = ref(0)
const qtdEntreguesMes = ref(0)
const valorMedio = computed(() => qtdEntreguesMes.value > 0 ? faturamentoMes.value / qtdEntreguesMes.value : 0)

// Low stock alerts
const alertasEstoque = ref<AlertaEstoque[]>([])

// Production queue
const proximosFila = ref<PedidoFila[]>([])

// ─── Status Labels ───────────────────────────────────────────────────────────
const statusLabels: Record<string, string> = {
  novo: 'Novo',
  orcamento_enviado: 'Orçamento Enviado',
  aprovado: 'Aprovado',
  em_producao: 'Em Produção',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

const statusTextColors: Record<string, string> = {
  novo: 'text-blue-600',
  orcamento_enviado: 'text-yellow-600',
  aprovado: 'text-green-600',
  em_producao: 'text-purple-600',
  pronto: 'text-teal-600',
  entregue: 'text-gray-600',
  cancelado: 'text-red-600',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatNumber(val: number | null | undefined): string {
  if (val == null) return '0,00'
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null || val === 0) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function truncate(text: string | null, maxLen: number): string {
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}

function getUrgencyClass(prazo: string | null): 'overdue' | 'urgent' | 'normal' {
  if (!prazo) return 'normal'
  const now = new Date()
  const deadline = new Date(prazo)
  if (now > deadline) return 'overdue'
  const diffMs = deadline.getTime() - now.getTime()
  if (diffMs < 24 * 60 * 60 * 1000) return 'urgent'
  return 'normal'
}

function getUrgencyDotClass(prazo: string | null): string {
  const u = getUrgencyClass(prazo)
  if (u === 'overdue') return 'bg-red-500 animate-pulse'
  if (u === 'urgent') return 'bg-amber-500 animate-pulse'
  return 'bg-green-500'
}

function getUrgencyBadgeClass(prazo: string | null): string {
  const u = getUrgencyClass(prazo)
  if (u === 'overdue') return 'bg-red-100 text-red-700'
  if (u === 'urgent') return 'bg-amber-100 text-amber-700'
  return 'bg-green-100 text-green-700'
}

function getUrgencyLabel(prazo: string | null): string {
  if (!prazo) return 'Sem prazo'
  const u = getUrgencyClass(prazo)
  if (u === 'overdue') return 'Atrasado'
  if (u === 'urgent') return '< 24h'
  const d = new Date(prazo)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

// ─── Data Fetching ───────────────────────────────────────────────────────────
onMounted(async () => {
  await loadEmpresa()
  await fetchDashboard()
})

async function fetchDashboard() {
  loading.value = true
  error.value = null

  try {
    await Promise.all([
      fetchStatusCounts(),
      fetchFaturamento(),
      fetchAlertasEstoque(),
      fetchProximosFila(),
    ])
  } catch (e: any) {
    error.value = e?.message || 'Não foi possível carregar os indicadores do dashboard'
  } finally {
    loading.value = false
  }
}

async function retryLoad() {
  await fetchDashboard()
}

async function fetchStatusCounts() {
  const { data, error: fetchError } = await supabase
    .from('pedidos_adesivo')
    .select('status')
    .eq('empresa_id', empresaId.value!)

  if (fetchError) throw fetchError

  const counts: Record<string, number> = {}
  for (const row of (data ?? [])) {
    counts[row.status] = (counts[row.status] || 0) + 1
  }
  statusCounts.value = counts
}

async function fetchFaturamento() {
  // Get current month boundaries
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()

  // Query pedidos entregues no mês atual
  const { data: pedidosEntregues, error: pedidosError } = await supabase
    .from('pedidos_adesivo')
    .select('id')
    .eq('empresa_id', empresaId.value!)
    .eq('status', 'entregue')
    .gte('data_entrega', startOfMonth)
    .lte('data_entrega', endOfMonth)

  if (pedidosError) throw pedidosError

  const pedidoIds = (pedidosEntregues ?? []).map(p => p.id)
  qtdEntreguesMes.value = pedidoIds.length

  if (pedidoIds.length === 0) {
    faturamentoMes.value = 0
    return
  }

  // Query orcamentos linked to those pedidos for valor_total
  const { data: orcamentos, error: orcError } = await supabase
    .from('orcamentos_adesivo')
    .select('valor_total')
    .in('pedido_id', pedidoIds)

  if (orcError) throw orcError

  faturamentoMes.value = (orcamentos ?? []).reduce((sum, o) => sum + (o.valor_total || 0), 0)
}

async function fetchAlertasEstoque() {
  // Supabase doesn't support comparing two columns directly, so we fetch all and filter client-side
  const { data, error: fetchError } = await supabase
    .from('materiais_adesivo')
    .select('id, nome, estoque_atual, estoque_minimo')
    .eq('empresa_id', empresaId.value!)
    .eq('ativo', true)

  if (fetchError) throw fetchError

  // Filter client-side: estoque_atual < estoque_minimo
  alertasEstoque.value = (data ?? [])
    .filter((m: any) => m.estoque_atual < m.estoque_minimo)
    .map((m: any) => ({
      id: m.id,
      nome: m.nome,
      estoque_atual: m.estoque_atual,
      estoque_minimo: m.estoque_minimo,
    }))
}

async function fetchProximosFila() {
  const { data, error: fetchError } = await supabase
    .from('pedidos_adesivo')
    .select('id, descricao, prazo_estimado, clientes(nome)')
    .eq('empresa_id', empresaId.value!)
    .in('status', ['aprovado', 'em_producao'])
    .order('prazo_estimado', { ascending: true, nullsFirst: false })
    .limit(5)

  if (fetchError) throw fetchError

  proximosFila.value = (data ?? []).map((row: any) => ({
    id: row.id,
    cliente_nome: row.clientes?.nome ?? 'Cliente desconhecido',
    descricao: row.descricao,
    prazo_estimado: row.prazo_estimado,
  }))
}
</script>
