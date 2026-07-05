<template>
  <div class="min-h-full p-4 sm:p-8">
    <!-- Header -->
    <div class="relative rounded-3xl overflow-hidden mb-6 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #7c3aed, #4f46e5))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/></svg>
            </div>
            <div>
              <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Módulo</span>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Marketing</h1>
              <p class="text-sm text-white/80 mt-1">Dashboard, Campanhas e Relatórios</p>
            </div>
          </div>
          <button class="inline-flex items-center gap-2 text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl bg-white text-gray-800 hover:bg-gray-50 shadow-lg transition-all duration-200 hover:scale-[1.02]" @click="showNovaCompanha = true">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Nova Campanha
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
      <button v-for="tab in tabs" :key="tab.id" class="px-4 py-2 rounded-lg text-xs font-bold transition-all"
        :class="activeTab === tab.id ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow-md' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'"
        @click="activeTab = tab.id">{{ tab.label }}</button>
    </div>

    <!-- ═══ TAB: DASHBOARD ═══ -->
    <div v-show="activeTab === 'dashboard'">
      <!-- Stats row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Leads</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.total }}</p>
          <p class="text-[10px] text-emerald-500 font-bold mt-1">↑ {{ stats.novos7d }} esta semana</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Conversões</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.convertidos }}</p>
          <p class="text-[10px] text-gray-400 font-bold mt-1">{{ stats.taxaConversao }}% taxa</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Custo/Lead</p>
          <p class="text-2xl font-bold text-gray-800">{{ stats.custoLead }}</p>
          <p class="text-[10px] text-gray-400 font-bold mt-1">média mensal</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Campanhas Ativas</p>
          <p class="text-2xl font-bold text-gray-800">{{ campanhasAtivas }}</p>
          <p class="text-[10px] text-amber-500 font-bold mt-1">{{ campanhasAgendadas }} agendadas</p>
        </div>
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <!-- Leads por canal -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-800 mb-4">Leads por Canal</h3>
          <div class="space-y-3">
            <div v-for="canal in canalStats" :key="canal.nome" class="flex items-center gap-3">
              <span class="w-20 text-xs font-medium text-gray-500 truncate">{{ canal.nome }}</span>
              <div class="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :style="{ width: canal.pct + '%', background: canal.cor }"></div>
              </div>
              <span class="text-xs font-bold text-gray-600 w-8 text-right">{{ canal.qtd }}</span>
            </div>
          </div>
        </div>

        <!-- Funil de conversão -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="text-sm font-bold text-gray-800 mb-4">Funil de Conversão</h3>
          <div class="space-y-2">
            <div v-for="(etapa, i) in funilEtapas" :key="etapa.nome" class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" :style="{ background: etapa.cor }"></div>
              <span class="text-xs font-medium text-gray-600 w-28">{{ etapa.nome }}</span>
              <div class="flex-1 h-5 bg-gray-50 rounded overflow-hidden">
                <div class="h-full rounded transition-all duration-700" :style="{ width: etapa.pct + '%', background: etapa.cor, opacity: 0.8 }"></div>
              </div>
              <span class="text-xs font-bold text-gray-700 w-10 text-right">{{ etapa.qtd }}</span>
              <span v-if="i > 0" class="text-[10px] text-gray-400 w-10 text-right">{{ etapa.taxa }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tempo médio de conversão -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-bold text-gray-800 mb-3">Tempo Médio de Conversão</h3>
        <div class="flex items-center gap-6 flex-wrap">
          <div class="text-center">
            <p class="text-3xl font-bold text-gray-800">{{ tempoMedio.dias }}</p>
            <p class="text-[10px] text-gray-400 font-semibold uppercase">dias</p>
          </div>
          <div class="flex-1 flex items-center gap-2 text-xs text-gray-500">
            <span class="px-2 py-1 rounded bg-blue-50 text-blue-600 font-bold">Lead</span>
            <span>→</span>
            <span class="px-2 py-1 rounded bg-amber-50 text-amber-600 font-bold">Orçamento</span>
            <span>→</span>
            <span class="px-2 py-1 rounded bg-emerald-50 text-emerald-600 font-bold">Venda</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TAB: CAMPANHAS ═══ -->
    <div v-show="activeTab === 'campanhas'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <!-- Card tipo de campanha -->
        <div v-for="tipo in tiposCampanha" :key="tipo.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer" @click="iniciarCampanha(tipo.id)">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" :class="tipo.bgClass">
            <svg class="w-5 h-5" :class="tipo.iconClass" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="tipo.svg"></svg>
          </div>
          <h4 class="text-sm font-bold text-gray-800 mb-1">{{ tipo.nome }}</h4>
          <p class="text-xs text-gray-400 leading-relaxed">{{ tipo.desc }}</p>
        </div>
      </div>

      <!-- Lista de campanhas -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-800">Campanhas Recentes</h3>
        </div>
        <div v-if="!campanhas.length" class="text-center py-12 text-gray-400 text-sm">Nenhuma campanha criada ainda.</div>
        <div v-else class="divide-y divide-gray-50">
          <div v-for="c in campanhas" :key="c.id" class="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/50">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="c.tipo === 'whatsapp' ? 'bg-green-50' : c.tipo === 'email' ? 'bg-blue-50' : 'bg-amber-50'">
              <span class="text-sm">{{ c.tipo === 'whatsapp' ? '💬' : c.tipo === 'email' ? '📧' : '📱' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ c.nome }}</p>
              <p class="text-[11px] text-gray-400">{{ c.destinatarios }} destinatários · {{ formatDate(c.created_at) }}</p>
            </div>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase" :class="campanhaStatusClass(c.status)">{{ c.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TAB: INTEGRAÇÕES ═══ -->
    <div v-show="activeTab === 'integracoes'">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="integ in integracoes" :key="integ.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="integ.bgClass">
              <span class="text-lg">{{ integ.emoji }}</span>
            </div>
            <div>
              <h4 class="text-sm font-bold text-gray-800">{{ integ.nome }}</h4>
              <p class="text-[11px] text-gray-400">{{ integ.desc }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase" :class="integ.ativo ? 'text-emerald-500' : 'text-gray-400'">{{ integ.ativo ? '● Conectado' : '○ Desconectado' }}</span>
            <button class="px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all" :class="integ.ativo ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'">
              {{ integ.ativo ? 'Desconectar' : 'Conectar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pixel / UTM -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-5">
        <h3 class="text-sm font-bold text-gray-800 mb-3">Pixel de Conversão</h3>
        <p class="text-xs text-gray-400 mb-3">Cole este código no seu e-commerce/catálogo para rastrear conversões.</p>
        <div class="bg-gray-50 rounded-xl p-3 font-mono text-[11px] text-gray-600 break-all">
          &lt;script&gt;!function(s,i,g,n){s.SignPRO=n;s[n]=s[n]||function(){(s[n].q=s[n].q||[]).push(arguments)};var e=i.createElement('script');e.async=1;e.src=g;i.head.appendChild(e)}(window,document,'https://app-volvv.arepen.easypanel.host/pixel.js','sp');sp('init','{{ empresaId }}');sp('track','PageView');&lt;/script&gt;
        </div>
      </div>
    </div>

    <!-- ═══ TAB: RELATÓRIOS ═══ -->
    <div v-show="activeTab === 'relatorios'">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-[11px] text-gray-400 font-semibold uppercase mb-1">Custo por Lead</p>
          <p class="text-2xl font-bold text-gray-800">{{ relatorio.custoLead }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-[11px] text-gray-400 font-semibold uppercase mb-1">Melhor Canal</p>
          <p class="text-lg font-bold text-gray-800">{{ relatorio.melhorCanal }}</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-[11px] text-gray-400 font-semibold uppercase mb-1">Tempo Conversão</p>
          <p class="text-2xl font-bold text-gray-800">{{ relatorio.tempoConversao }}d</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <p class="text-[11px] text-gray-400 font-semibold uppercase mb-1">ROI</p>
          <p class="text-2xl font-bold" :class="relatorio.roi >= 0 ? 'text-emerald-600' : 'text-red-500'">{{ relatorio.roi }}%</p>
        </div>
      </div>

      <!-- Comparativo mensal -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 class="text-sm font-bold text-gray-800 mb-4">Comparativo Mensal</h3>
        <div class="grid grid-cols-6 gap-2">
          <div v-for="mes in comparativoMensal" :key="mes.label" class="text-center">
            <div class="h-24 flex items-end justify-center mb-2">
              <div class="w-6 rounded-t transition-all" :style="{ height: mes.pct + '%', background: 'var(--color-primary, #7c3aed)' }"></div>
            </div>
            <p class="text-[10px] font-bold text-gray-500">{{ mes.label }}</p>
            <p class="text-[10px] text-gray-400">{{ mes.qtd }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nova Campanha -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showNovaCompanha" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showNovaCompanha = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-800">Nova Campanha</h2>
              <button @click="showNovaCompanha = false" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="text-xs font-semibold text-gray-600 mb-1 block">Nome da Campanha</label>
                <input type="text" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm" placeholder="Ex: Promoção Julho" />
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 mb-1 block">Tipo</label>
                <select class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm">
                  <option value="whatsapp">WhatsApp em Massa</option>
                  <option value="email">Email Marketing</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 mb-1 block">Mensagem</label>
                <textarea rows="3" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none" placeholder="Olá {nome}, temos uma promoção..."></textarea>
                <p class="text-[10px] text-gray-400 mt-1">Use {nome}, {empresa} como variáveis dinâmicas</p>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 mb-1 block">Segmentação</label>
                <select class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm">
                  <option>Todos os leads</option>
                  <option>Leads quentes (score > 70)</option>
                  <option>Novos (últimos 7 dias)</option>
                  <option>Por nicho</option>
                </select>
              </div>
              <div class="flex items-center justify-end gap-3 pt-2">
                <button @click="showNovaCompanha = false" class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">Cancelar</button>
                <button class="px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg" :style="{ background: 'var(--color-btn)', color: 'var(--color-btn-text)' }">Criar Campanha</button>
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
import { useEmpresa } from '~/composables/useEmpresa'

definePageMeta({ layout: 'default' })

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()

const activeTab = ref('dashboard')
const showNovaCompanha = ref(false)
const leads = ref<any[]>([])
const campanhas = ref<any[]>([])

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'campanhas', label: 'Campanhas' },
  { id: 'integracoes', label: 'Integrações' },
  { id: 'relatorios', label: 'Relatórios' },
]

onMounted(async () => {
  await loadEmpresa()
  await carregarDados()
})

async function carregarDados() {
  if (!empresaId.value) return
  const { data } = await supabase
    .from('leads')
    .select('*')
    .eq('empresa_id', empresaId.value)
    .order('created_at', { ascending: false })
  leads.value = data || []
}

// Stats computados
const stats = computed(() => {
  const total = leads.value.length
  const now = Date.now()
  const novos7d = leads.value.filter(l => now - new Date(l.created_at).getTime() < 7 * 86400000).length
  const convertidos = leads.value.filter(l => l.status === 'convertido').length
  const taxaConversao = total > 0 ? Math.round((convertidos / total) * 100) : 0
  return { total, novos7d, convertidos, taxaConversao, custoLead: 'R$ 12' }
})

const campanhasAtivas = computed(() => campanhas.value.filter(c => c.status === 'ativa').length)
const campanhasAgendadas = computed(() => campanhas.value.filter(c => c.status === 'agendada').length)

// Leads por canal
const canalStats = computed(() => {
  const canais: Record<string, { nome: string; cor: string; qtd: number }> = {
    google: { nome: 'Google', cor: '#4285f4', qtd: 0 },
    instagram: { nome: 'Instagram', cor: '#e1306c', qtd: 0 },
    facebook: { nome: 'Facebook', cor: '#1877f2', qtd: 0 },
    indicacao: { nome: 'Indicação', cor: '#22c55e', qtd: 0 },
    site: { nome: 'Site', cor: '#06b6d4', qtd: 0 },
    whatsapp: { nome: 'WhatsApp', cor: '#25d366', qtd: 0 },
    manual: { nome: 'Manual', cor: '#94a3b8', qtd: 0 },
  }
  for (const l of leads.value) {
    if (canais[l.canal]) canais[l.canal].qtd++
  }
  const max = Math.max(...Object.values(canais).map(c => c.qtd), 1)
  return Object.values(canais)
    .filter(c => c.qtd > 0)
    .sort((a, b) => b.qtd - a.qtd)
    .map(c => ({ ...c, pct: Math.round((c.qtd / max) * 100) }))
})

// Funil de conversão
const funilEtapas = computed(() => {
  const total = leads.value.length || 1
  const novo = leads.value.filter(l => l.status === 'novo').length
  const qual = leads.value.filter(l => l.status === 'qualificado').length
  const prop = leads.value.filter(l => l.status === 'proposta').length
  const conv = leads.value.filter(l => l.status === 'convertido').length
  return [
    { nome: 'Lead', cor: '#6366f1', qtd: leads.value.length, pct: 100, taxa: '' },
    { nome: 'Qualificado', cor: '#0ea5e9', qtd: qual + prop + conv, pct: Math.round(((qual + prop + conv) / total) * 100), taxa: Math.round(((qual + prop + conv) / total) * 100) },
    { nome: 'Proposta', cor: '#f59e0b', qtd: prop + conv, pct: Math.round(((prop + conv) / total) * 100), taxa: Math.round(((prop + conv) / total) * 100) },
    { nome: 'Convertido', cor: '#22c55e', qtd: conv, pct: Math.round((conv / total) * 100), taxa: Math.round((conv / total) * 100) },
  ]
})

const tempoMedio = computed(() => ({ dias: 14 })) // TODO: calcular real

// Relatórios
const relatorio = computed(() => ({
  custoLead: 'R$ 12,50',
  melhorCanal: canalStats.value[0]?.nome || '—',
  tempoConversao: 14,
  roi: 320,
}))

const comparativoMensal = computed(() => {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  const vals = [8, 12, 18, 15, 22, 28]
  const max = Math.max(...vals)
  return meses.map((label, i) => ({ label, qtd: vals[i], pct: Math.round((vals[i] / max) * 100) }))
})

// Tipos de campanha
const tiposCampanha = [
  { id: 'whatsapp', nome: 'WhatsApp em Massa', desc: 'Envie mensagens para todos os leads ou segmentos via WhatsApp.', bgClass: 'bg-green-50', iconClass: 'text-green-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>' },
  { id: 'email', nome: 'Email Marketing', desc: 'Templates visuais com segmentação por nicho e tags.', bgClass: 'bg-blue-50', iconClass: 'text-blue-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>' },
  { id: 'sms', nome: 'SMS', desc: 'Mensagens curtas de texto para ações rápidas.', bgClass: 'bg-amber-50', iconClass: 'text-amber-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>' },
  { id: 'landing', nome: 'Landing Page', desc: 'Crie páginas de captura simples com link compartilhável.', bgClass: 'bg-purple-50', iconClass: 'text-purple-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/>' },
  { id: 'automacao', nome: 'Automação', desc: 'Sequências automáticas baseadas em ações do lead.', bgClass: 'bg-cyan-50', iconClass: 'text-cyan-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>' },
  { id: 'agendamento', nome: 'Agendamento', desc: 'Programe campanhas recorrentes ou em datas específicas.', bgClass: 'bg-rose-50', iconClass: 'text-rose-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>' },
]

// Integrações
const integracoes = [
  { id: 'meta', nome: 'Meta Ads', desc: 'Importar leads do Facebook/Instagram Ads', emoji: '📘', bgClass: 'bg-blue-50', ativo: false },
  { id: 'google', nome: 'Google Ads', desc: 'Tracking de UTMs e conversões', emoji: '🔍', bgClass: 'bg-red-50', ativo: false },
  { id: 'pixel', nome: 'Pixel SignPRO', desc: 'Rastreamento no e-commerce/catálogo', emoji: '📊', bgClass: 'bg-purple-50', ativo: true },
  { id: 'whatsapp', nome: 'WhatsApp (Datafy)', desc: 'Integração para disparos e recebimento', emoji: '💬', bgClass: 'bg-green-50', ativo: true },
]

function iniciarCampanha(tipo: string) {
  showNovaCompanha.value = true
}

function campanhaStatusClass(s: string) {
  return { ativa: 'bg-emerald-50 text-emerald-600', agendada: 'bg-amber-50 text-amber-600', rascunho: 'bg-gray-50 text-gray-500', concluida: 'bg-blue-50 text-blue-600' }[s] || 'bg-gray-50 text-gray-500'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
</script>
