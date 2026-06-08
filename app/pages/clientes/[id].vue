<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8">
    <!-- BOTÃO VOLTAR E CABEÇALHO -->
    <div class="flex items-center gap-3 mb-6">
      <button
        @click="$router.back()"
        class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
          {{ cliente?.nome || 'Carregando...' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">Detalhes do cliente</p>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex items-center justify-center gap-3 py-16">
      <span class="inline-block w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-500">Carregando...</span>
    </div>

    <!-- ERRO -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path stroke-linecap="round" d="M12 8v4m0 4h.01" />
      </svg>
      {{ error }}
    </div>

    <!-- CONTEÚDO -->
    <template v-else-if="cliente">
      <!-- CARD DE INFORMAÇÕES DO CLIENTE -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <!-- INFO: Nome -->
        <div class="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome</span>
          <p class="text-lg sm:text-xl font-bold text-gray-900 mt-2">{{ cliente.nome }}</p>
        </div>

        <!-- INFO: Telefone -->
        <div class="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Telefone</span>
          <p class="text-lg sm:text-xl font-bold text-gray-900 mt-2">
            {{ cliente.telefone || '—' }}
          </p>
        </div>

        <!-- INFO: Email -->
        <div class="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</span>
          <p class="text-lg sm:text-xl font-bold text-gray-900 mt-2 truncate">
            {{ cliente.email || '—' }}
          </p>
        </div>

        <!-- INFO: CPF/CNPJ -->
        <div class="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">CPF/CNPJ</span>
          <p class="text-lg sm:text-xl font-bold text-gray-900 mt-2">{{ cliente.cpf_cnpj || '—' }}</p>
        </div>

        <!-- INFO: Endereço -->
        <div class="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 sm:col-span-2">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Endereço</span>
          <p class="text-lg sm:text-xl font-bold text-gray-900 mt-2">
            {{ formatarEndereco() || '—' }}
          </p>
        </div>

        <!-- INFO: Status -->
        <div class="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
          <div class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
            :class="cliente.ativo
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'"
          >
            <span class="w-2 h-2 rounded-full"
              :class="cliente.ativo ? 'bg-green-600' : 'bg-red-600'"
            />
            {{ cliente.ativo ? 'Ativo' : 'Inativo' }}
          </div>
        </div>
      </div>

      <!-- BOTÃO ENVIAR MENSAGEM -->
      <div class="mb-8 flex gap-3">
        <button
          @click="abrirModalMensagem"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Enviar Mensagem
        </button>
        <button
          v-if="isAdmin"
          @click="editarCliente"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
      </div>

      <!-- HISTÓRICO DE ATENDIMENTOS -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
        <div class="px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-bold text-gray-900">Histórico de Atendimentos</h2>
          <span class="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-violet-100 text-violet-700 text-sm font-bold">
            {{ atendimentos.length }}
          </span>
        </div>

        <div v-if="carregandoAtendimentos" class="flex items-center justify-center gap-3 py-16">
          <span class="inline-block w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span class="text-sm text-gray-500">Carregando atendimentos...</span>
        </div>

        <div v-else-if="atendimentos.length === 0" class="px-6 sm:px-8 py-12 text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm">Nenhum atendimento registrado</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="atendimento in atendimentos"
            :key="atendimento.id"
            class="px-6 sm:px-8 py-4 sm:py-6 hover:bg-gray-50/50 transition-colors"
          >
            <div class="flex items-start justify-between gap-4 mb-3">
              <div>
                <p class="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {{ formatarData(atendimento.data_hora) }}
                </p>
                <p class="text-base sm:text-lg font-bold text-gray-900 mt-1">
                  {{ atendimento.servicos?.join(', ') || 'Serviço não especificado' }}
                </p>
              </div>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap"
                :class="statusClass(atendimento.status)"
              >
                <span class="w-2 h-2 rounded-full" :class="statusDotClass(atendimento.status)" />
                {{ formatarStatus(atendimento.status) }}
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-sm">
              <div v-if="atendimento.funcionario">
                <span class="text-gray-500 text-xs">Profissional</span>
                <p class="font-semibold text-gray-900">{{ atendimento.funcionario }}</p>
              </div>
              <div>
                <span class="text-gray-500 text-xs">Valor</span>
                <p class="font-semibold text-gray-900">{{ formatarValor(atendimento.valor_total) }}</p>
              </div>
              <div v-if="atendimento.observacoes" class="sm:col-span-2">
                <span class="text-gray-500 text-xs">Observações</span>
                <p class="font-semibold text-gray-900 line-clamp-2">{{ atendimento.observacoes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- MODAL DE ENVIAR MENSAGEM -->
  <Transition name="fade">
    <div
      v-if="modalMensagem"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click.self="fecharModalMensagem"
    >
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- CABEÇALHO -->
        <div class="sticky top-0 flex items-center justify-between px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/50">
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Enviar Mensagem</h3>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            @click="fecharModalMensagem"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- CONTEÚDO -->
        <div class="px-6 sm:px-8 py-6 space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Para</label>
            <p class="text-lg font-bold text-gray-900 mt-2">{{ cliente?.nome }}</p>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Mensagem</label>
            <textarea
              v-model="formularioMensagem.conteudo"
              placeholder="Digite sua mensagem aqui..."
              rows="6"
              class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600 resize-none"
            />
          </div>

          <div v-if="erroMensagem" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path stroke-linecap="round" d="M12 8v4m0 4h.01" />
            </svg>
            {{ erroMensagem }}
          </div>
        </div>

        <!-- BOTÕES -->
        <div class="sticky bottom-0 flex gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-bold text-sm"
            @click="fecharModalMensagem"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:shadow-lg hover:scale-[1.02] transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!formularioMensagem.conteudo.trim() || enviarMensagemLoading"
            @click="enviarMensagem"
          >
            <span v-if="enviarMensagemLoading" class="inline-flex items-center gap-2">
              <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </span>
            <span v-else>Enviar</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'
import { useAdmin } from '~/composables/useAdmin'
import { useRoute } from 'vue-router'

const supabase = createSupabaseClient()
const route = useRoute()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdmin } = useAdmin()

interface Cliente {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  cpf_cnpj: string | null
  endereco: string | null
  numero: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  ativo: boolean
}

interface Atendimento {
  id: string
  data_hora: string
  status: string
  valor_total: number
  observacoes: string | null
  servicos: string[]
  funcionario: string | null
}

const cliente = ref<Cliente | null>(null)
const atendimentos = ref<Atendimento[]>([])
const loading = ref(true)
const carregandoAtendimentos = ref(true)
const error = ref<string | null>(null)

const modalMensagem = ref(false)
const formularioMensagem = reactive({ conteudo: '' })
const enviarMensagemLoading = ref(false)
const erroMensagem = ref<string | null>(null)

const clienteId = route.params.id as string

function formatarEndereco(): string {
  if (!cliente.value) return ''
  const parts = [
    cliente.value.endereco,
    cliente.value.numero,
    cliente.value.bairro,
    cliente.value.cidade,
    cliente.value.estado,
    cliente.value.cep,
  ].filter(Boolean)
  return parts.join(', ')
}

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatarValor(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0)
}

function formatarStatus(status: string): string {
  const statusMap: Record<string, string> = {
    agendado: 'Agendado',
    confirmado: 'Confirmado',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    faltou: 'Faltou',
  }
  return statusMap[status] || status
}

function statusClass(status: string): string {
  const classes: Record<string, string> = {
    agendado: 'bg-blue-100 text-blue-700',
    confirmado: 'bg-purple-100 text-purple-700',
    concluido: 'bg-green-100 text-green-700',
    cancelado: 'bg-red-100 text-red-700',
    faltou: 'bg-orange-100 text-orange-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function statusDotClass(status: string): string {
  const classes: Record<string, string> = {
    agendado: 'bg-blue-600',
    confirmado: 'bg-purple-600',
    concluido: 'bg-green-600',
    cancelado: 'bg-red-600',
    faltou: 'bg-orange-600',
  }
  return classes[status] || 'bg-gray-600'
}

function abrirModalMensagem() {
  modalMensagem.value = true
  formularioMensagem.conteudo = ''
  erroMensagem.value = null
}

function fecharModalMensagem() {
  modalMensagem.value = false
  formularioMensagem.conteudo = ''
  erroMensagem.value = null
}

function editarCliente() {
  // Será implementado para redirecionar para edição
  console.log('Editar cliente:', clienteId)
}

async function enviarMensagem() {
  if (!formularioMensagem.conteudo.trim()) return

  enviarMensagemLoading.value = true
  erroMensagem.value = null

  const { error: insertError } = await supabase
    .from('mensagens')
    .insert({
      empresa_id: empresaId.value,
      cliente_id: clienteId,
      usuario_id: (await supabase.auth.getUser()).data.user?.id,
      conteudo: formularioMensagem.conteudo.trim(),
      tipo: 'saida',
    })

  enviarMensagemLoading.value = false

  if (insertError) {
    erroMensagem.value = 'Erro ao enviar mensagem: ' + insertError.message
    return
  }

  fecharModalMensagem()
}

async function fetchCliente() {
  const { data, error: fetchError } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', clienteId)
    .eq('empresa_id', empresaId.value!)
    .single()

  if (fetchError) {
    error.value = 'Erro ao carregar cliente: ' + fetchError.message
    return
  }

  cliente.value = data
}

async function fetchAtendimentos() {
  carregandoAtendimentos.value = true

  const { data, error: fetchError } = await supabase
    .from('agendamentos')
    .select(`
      id,
      data_hora,
      status,
      valor_total,
      observacoes,
      funcionario_id,
      agendamento_servicos (
        servico_id,
        servicos (nome)
      )
    `)
    .eq('cliente_id', clienteId)
    .eq('empresa_id', empresaId.value!)
    .order('data_hora', { ascending: false })

  carregandoAtendimentos.value = false

  if (fetchError) {
    console.error('Erro ao carregar atendimentos:', fetchError)
    return
  }

  if (data) {
    // Buscar nomes dos funcionários
    const funcionarioIds = [...new Set(data.map((a: any) => a.funcionario_id).filter(Boolean))]
    let funcionarios: Record<string, string> = {}

    if (funcionarioIds.length > 0) {
      const { data: funcs } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', funcionarioIds)

      if (funcs) {
        funcionarios = Object.fromEntries(funcs.map((f: any) => [f.id, f.full_name]))
      }
    }

    atendimentos.value = data.map((a: any) => ({
      id: a.id,
      data_hora: a.data_hora,
      status: a.status,
      valor_total: a.valor_total,
      observacoes: a.observacoes,
      funcionario: a.funcionario_id ? funcionarios[a.funcionario_id] || 'Não especificado' : null,
      servicos: a.agendamento_servicos?.map((s: any) => s.servicos?.nome).filter(Boolean) || [],
    }))
  }
}

onMounted(async () => {
  await loadEmpresa()
  loading.value = true
  await fetchCliente()
  loading.value = false
  await fetchAtendimentos()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
