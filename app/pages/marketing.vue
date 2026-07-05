<template>
  <div class="min-h-full p-4 sm:p-8">
    <!-- Header -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
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
              <p class="text-sm text-white/80 mt-1.5">Gestão de leads e campanhas</p>
            </div>
          </div>
          <button class="inline-flex items-center gap-2 text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl bg-white text-gray-800 hover:bg-gray-50 shadow-lg transition-all duration-200 hover:scale-[1.02]" @click="showModal = true">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Novo Lead
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p class="text-[11px] text-white/60 font-medium">Total Leads</p>
            <p class="text-xl sm:text-2xl font-bold text-white">{{ stats.total }}</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p class="text-[11px] text-white/60 font-medium">Novos (7d)</p>
            <p class="text-xl sm:text-2xl font-bold text-white">{{ stats.novos7d }}</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p class="text-[11px] text-white/60 font-medium">Qualificados</p>
            <p class="text-xl sm:text-2xl font-bold text-emerald-300">{{ stats.qualificados }}</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p class="text-[11px] text-white/60 font-medium">Convertidos</p>
            <p class="text-xl sm:text-2xl font-bold text-amber-300">{{ stats.convertidos }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button v-for="f in filtrosStatus" :key="f.value" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" :class="filtroStatus === f.value ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)]' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'" @click="filtroStatus = f.value">{{ f.label }}</button>
      <select v-model="filtroCanal" class="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600">
        <option value="">Todos canais</option>
        <option v-for="c in canais" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <!-- Lista de leads -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="w-6 h-6 border-2 rounded-full animate-spin" style="border-color: var(--color-primary); border-top-color: transparent;"></div>
      </div>
      <div v-else-if="!leadsFiltrados.length" class="text-center py-16 text-gray-400 text-sm">
        Nenhum lead encontrado. Clique em "Novo Lead" para começar.
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
          <tr>
            <th class="px-4 py-3 text-left font-semibold">Lead</th>
            <th class="px-4 py-3 text-left font-semibold hidden sm:table-cell">Canal</th>
            <th class="px-4 py-3 text-left font-semibold hidden md:table-cell">Score</th>
            <th class="px-4 py-3 text-left font-semibold">Status</th>
            <th class="px-4 py-3 text-left font-semibold hidden lg:table-cell">Data</th>
            <th class="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="lead in leadsFiltrados" :key="lead.id" class="hover:bg-gray-50/50 cursor-pointer" @click="editarLead(lead)">
            <td class="px-4 py-3">
              <p class="font-semibold text-gray-800">{{ lead.nome }}</p>
              <p class="text-xs text-gray-400">{{ lead.email || lead.telefone || '—' }}</p>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="canalClass(lead.canal)">{{ lead.canal }}</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <div class="flex items-center gap-2">
                <div class="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div class="h-full rounded-full" :class="scoreColor(lead.score)" :style="{ width: lead.score + '%' }"></div>
                </div>
                <span class="text-xs font-bold text-gray-500">{{ lead.score }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase" :class="statusClass(lead.status)">{{ statusLabel(lead.status) }}</span>
            </td>
            <td class="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">{{ formatDate(lead.created_at) }}</td>
            <td class="px-4 py-3">
              <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Novo/Editar Lead -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showModal = false">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-bold text-gray-800">{{ editingLead ? 'Editar Lead' : 'Novo Lead' }}</h2>
              <button @click="showModal = false" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form @submit.prevent="salvarLead" class="p-6 space-y-4">
              <div>
                <label class="text-xs font-semibold text-gray-600 mb-1 block">Nome *</label>
                <input v-model="form.nome" type="text" required class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="Nome do lead" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
                  <input v-model="form.email" type="email" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="email@..." />
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-600 mb-1 block">Telefone</label>
                  <input v-model="form.telefone" type="tel" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="+55..." />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-semibold text-gray-600 mb-1 block">Canal</label>
                  <select v-model="form.canal" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                    <option v-for="c in canais" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
                  <select v-model="form.status" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                    <option value="novo">Novo</option>
                    <option value="qualificado">Qualificado</option>
                    <option value="proposta">Proposta</option>
                    <option value="convertido">Convertido</option>
                    <option value="perdido">Perdido</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 mb-1 block">Score (0-100)</label>
                <input v-model.number="form.score" type="range" min="0" max="100" class="w-full" style="accent-color: var(--color-primary)" />
                <div class="flex justify-between text-[10px] text-gray-400 mt-1"><span>Frio</span><span>{{ form.score }}</span><span>Quente</span></div>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-600 mb-1 block">Notas</label>
                <textarea v-model="form.notas" rows="2" class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" placeholder="Observações..."></textarea>
              </div>
              <div class="flex items-center justify-end gap-3 pt-2">
                <button type="button" @click="showModal = false" class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">Cancelar</button>
                <button type="submit" :disabled="salvando" class="px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all" :style="{ background: 'var(--color-btn)', color: 'var(--color-btn-text)' }">
                  {{ salvando ? 'Salvando...' : 'Salvar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'

definePageMeta({ layout: 'default' })

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()

const leads = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const salvando = ref(false)
const editingLead = ref<any>(null)
const filtroStatus = ref('')
const filtroCanal = ref('')

const canais = ['manual', 'google', 'instagram', 'facebook', 'indicacao', 'site', 'whatsapp']
const filtrosStatus = [
  { value: '', label: 'Todos' },
  { value: 'novo', label: 'Novos' },
  { value: 'qualificado', label: 'Qualificados' },
  { value: 'proposta', label: 'Proposta' },
  { value: 'convertido', label: 'Convertidos' },
  { value: 'perdido', label: 'Perdidos' },
]

const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  canal: 'manual',
  status: 'novo',
  score: 50,
  notas: '',
})

const stats = computed(() => {
  const total = leads.value.length
  const now = Date.now()
  const novos7d = leads.value.filter(l => now - new Date(l.created_at).getTime() < 7 * 86400000).length
  const qualificados = leads.value.filter(l => l.status === 'qualificado').length
  const convertidos = leads.value.filter(l => l.status === 'convertido').length
  return { total, novos7d, qualificados, convertidos }
})

const leadsFiltrados = computed(() => {
  let arr = leads.value
  if (filtroStatus.value) arr = arr.filter(l => l.status === filtroStatus.value)
  if (filtroCanal.value) arr = arr.filter(l => l.canal === filtroCanal.value)
  return arr
})

onMounted(async () => {
  await loadEmpresa()
  await carregarLeads()
})

async function carregarLeads() {
  if (!empresaId.value) return
  loading.value = true
  const { data } = await supabase
    .from('leads')
    .select('*')
    .eq('empresa_id', empresaId.value)
    .order('created_at', { ascending: false })
  leads.value = data || []
  loading.value = false
}

function editarLead(lead: any) {
  editingLead.value = lead
  form.nome = lead.nome
  form.email = lead.email || ''
  form.telefone = lead.telefone || ''
  form.canal = lead.canal
  form.status = lead.status
  form.score = lead.score
  form.notas = lead.notas || ''
  showModal.value = true
}

async function salvarLead() {
  if (!empresaId.value || !form.nome.trim()) return
  salvando.value = true

  const payload = {
    empresa_id: empresaId.value,
    nome: form.nome.trim(),
    email: form.email || null,
    telefone: form.telefone || null,
    canal: form.canal,
    status: form.status,
    score: form.score,
    notas: form.notas || null,
  }

  if (editingLead.value) {
    await supabase.from('leads').update(payload).eq('id', editingLead.value.id)
  } else {
    await supabase.from('leads').insert(payload)
  }

  salvando.value = false
  showModal.value = false
  editingLead.value = null
  resetForm()
  await carregarLeads()
}

function resetForm() {
  form.nome = ''
  form.email = ''
  form.telefone = ''
  form.canal = 'manual'
  form.status = 'novo'
  form.score = 50
  form.notas = ''
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function statusLabel(s: string) {
  return { novo: 'Novo', qualificado: 'Qualificado', proposta: 'Proposta', convertido: 'Convertido', perdido: 'Perdido' }[s] || s
}

function statusClass(s: string) {
  return {
    novo: 'bg-blue-50 text-blue-600',
    qualificado: 'bg-emerald-50 text-emerald-600',
    proposta: 'bg-amber-50 text-amber-600',
    convertido: 'bg-green-50 text-green-700',
    perdido: 'bg-red-50 text-red-600',
  }[s] || 'bg-gray-50 text-gray-600'
}

function canalClass(c: string) {
  return {
    google: 'bg-blue-50 text-blue-600',
    instagram: 'bg-pink-50 text-pink-600',
    facebook: 'bg-indigo-50 text-indigo-600',
    indicacao: 'bg-emerald-50 text-emerald-600',
    site: 'bg-cyan-50 text-cyan-600',
    whatsapp: 'bg-green-50 text-green-600',
    manual: 'bg-gray-50 text-gray-600',
  }[c] || 'bg-gray-50 text-gray-600'
}

function scoreColor(score: number) {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 40) return 'bg-amber-400'
  return 'bg-gray-300'
}
</script>
