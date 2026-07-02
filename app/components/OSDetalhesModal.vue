<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="show && ordemServico" class="fixed inset-0 z-50 flex flex-col" @click.self="emit('close')">
        <!-- Backdrop com blur -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="emit('close')" />

        <!-- Modal container -->
        <div class="relative z-10 flex flex-col w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:mx-auto sm:my-auto sm:rounded-2xl bg-theme-card overflow-hidden shadow-2xl" style="color: var(--color-card-texto)">

          <!-- ═══ CLEAN WHITE HEADER ═══ -->
          <div class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-primary-10 bg-theme-card">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-primary-20">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-lg font-bold" style="color: var(--color-card-texto)">{{ ordemServico.numero_os }}</h2>
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
                    :class="statusBadgeClasses"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass" />
                    {{ statusLabel }}
                  </span>
                </div>
                <p class="text-xs text-gray-400">Ordem de serviço em andamento</p>
              </div>
            </div>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-5 text-gray-400 hover:text-gray-500 transition-colors"
              @click="emit('close')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- ═══ BODY: SINGLE COLUMN ═══ -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              <!-- ═══ HEADER ESCURO (estilo os-print) ═══ -->
              <div class="rounded-2xl bg-gray-900 text-white px-6 py-5 flex items-center justify-between">
                <p class="text-xs text-gray-400 uppercase tracking-wider">{{ personalizacao.nome_empresa || 'Empresa' }}</p>
                <h2 class="text-lg font-bold">{{ ordemServico.nome_trabalho || 'Ordem de Serviço' }}</h2>
                <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <span class="w-2 h-2 rounded-full" :class="statusDotClass" />
                  <span class="text-sm font-bold">{{ statusLabel }}</span>
                </div>
              </div>

              <!-- DATAS -->
              <div class="flex justify-center gap-12 text-center">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
                  <div>
                    <p class="text-[10px] text-gray-500 uppercase font-bold">Emitido em</p>
                    <p class="text-sm font-bold">{{ formatDataPrint(ordemServico.data_aprovacao) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <div>
                    <p class="text-[10px] text-gray-500 uppercase font-bold">Previsão de Entrega</p>
                    <p class="text-sm font-bold">{{ formatDataPrint(ordemServico.data_entrega || ordemServico.prazo_estimado) }}</p>
                  </div>
                </div>
              </div>

              <!-- CLIENTE + ENDEREÇO (2 colunas) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="border rounded-xl p-4">
                  <p class="text-[10px] text-gray-400 uppercase font-bold mb-1">Cliente</p>
                  <p class="text-base font-bold">{{ ordemServico.cliente_nome || '—' }}</p>
                  <p v-if="ordemServico.cliente_telefone" class="text-xs text-gray-500">{{ ordemServico.cliente_telefone }}</p>
                </div>
                <div v-if="ordemServico.endereco_instalacao" class="border rounded-xl p-4">
                  <p class="text-[10px] text-gray-400 uppercase font-bold mb-1">Endereço de Instalação</p>
                  <p class="text-sm font-bold">{{ ordemServico.endereco_instalacao }}</p>
                </div>
              </div>

              <!-- TIMELINE HORIZONTAL (clicável) -->
              <div v-if="etapasProducao.length > 0" class="border rounded-xl p-5">
                <p class="text-[10px] font-bold uppercase text-gray-400 mb-4 tracking-wider">Acompanhamento do Pedido</p>
                <div class="flex items-center justify-between">
                  <template v-for="(etapa, idx) in etapasProducao" :key="etapa.id">
                    <button type="button" class="flex flex-col items-center gap-1.5 flex-shrink-0 group" :disabled="atualizandoStatus" @click="moverParaEtapa(etapa)">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all group-hover:scale-110" :class="etapaAtual && etapa.posicao <= etapaAtual.posicao ? 'border-transparent text-white bg-primary' : 'border-gray-200 text-gray-400 bg-white group-hover:border-primary group-hover:text-primary'">
                        <span class="text-xs font-bold">{{ idx + 1 }}</span>
                      </div>
                      <span class="text-[10px] font-bold text-center max-w-[70px] leading-tight" :class="etapaAtual && etapa.posicao <= etapaAtual.posicao ? 'text-gray-800' : 'text-gray-400'">{{ etapa.nome }}</span>
                    </button>
                    <div v-if="idx < etapasProducao.length - 1" class="flex-1 h-0.5 mx-1" :style="{ backgroundColor: etapaAtual && idx < etapaAtual.posicao ? 'var(--color-primary, #374151)' : '#e5e7eb' }" />
                  </template>
                </div>
              </div>

              <!-- TABELA DE ITENS (clicável para expandir) -->
              <div>
                <p class="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-wider">Itens da Ordem de Serviço</p>
                <!-- Cabeçalho da tabela -->
                <div class="grid grid-cols-12 gap-2 px-4 py-2 border-b-2 border-primary">
                  <span class="col-span-1 text-[10px] font-bold uppercase text-gray-500">#</span>
                  <span class="col-span-5 text-[10px] font-bold uppercase text-gray-500">Descrição</span>
                  <span class="col-span-3 text-[10px] font-bold uppercase text-gray-500 text-center">Dimensões</span>
                  <span class="col-span-3 text-[10px] font-bold uppercase text-gray-500 text-center">Qtd</span>
                </div>
                <!-- Linhas -->
                <div v-for="(item, idx) in itensOS" :key="item.id" class="border border-gray-200 rounded-xl mt-2 overflow-hidden">
                  <!-- Linha da tabela (clicável) -->
                  <button type="button" class="w-full grid grid-cols-12 gap-2 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors items-center" @click="toggleItem(item.id)">
                    <span class="col-span-1 text-sm font-bold text-gray-500">{{ idx + 1 }}</span>
                    <span class="col-span-5 text-sm font-bold text-gray-800">{{ item.descricao }}</span>
                    <span class="col-span-3 text-sm text-gray-600 text-center">{{ item.largura_cm }} × {{ item.altura_cm }} cm</span>
                    <span class="col-span-2 text-sm font-bold text-primary text-center">{{ item.quantidade }} un</span>
                    <span class="col-span-1 flex justify-end">
                      <svg class="w-4 h-4 text-gray-400 transition-transform" :class="expandedItems.includes(item.id) ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                    </span>
                  </button>
                  <!-- Item expandido (fotos) -->
                  <div v-if="expandedItems.includes(item.id)" class="px-4 pb-4 space-y-3">
                    <!-- Fotos Arte + Local -->
                    <div v-if="item.foto_arte_url || item.foto_local_url" class="flex gap-4 flex-wrap pt-1">
                      <div v-if="item.foto_arte_url && !isPdf(item.foto_arte_url)" class="flex flex-col items-center gap-1">
                        <button type="button" @click="openLightbox(item.foto_arte_url!)"><img :src="item.foto_arte_url" class="w-36 h-44 object-contain rounded-lg border border-gray-200 hover:border-primary transition-colors" /></button>
                        <span class="text-[9px] font-bold text-gray-400 uppercase">Arte</span>
                      </div>
                      <div v-if="item.foto_local_url && !isPdf(item.foto_local_url)" class="flex flex-col items-center gap-1">
                        <button type="button" @click="openLightbox(item.foto_local_url!)"><img :src="item.foto_local_url" class="w-36 h-44 object-contain rounded-lg border border-gray-200 hover:border-primary transition-colors" /></button>
                        <span class="text-[9px] font-bold text-gray-400 uppercase">Local</span>
                      </div>
                    </div>
                    <!-- Fotos da Instalação -->
                    <div class="pt-2">
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Fotos da Instalação Feita</label>
                      <div class="flex flex-wrap gap-2">
                        <div v-for="(fotoUrl, fIdx) in getInstalacaoFotos(item.id)" :key="fIdx" class="relative group">
                          <button type="button" @click="openLightbox(fotoUrl)"><img :src="fotoUrl" class="w-20 h-20 rounded-lg object-cover border-2 border-emerald-100 group-hover:border-emerald-400 transition-colors shadow-sm" /></button>
                          <button type="button" @click="removerFotoInstalacao(item.id, fIdx)" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
                        </div>
                        <label class="w-20 h-20 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                          <span class="text-[9px] text-gray-400 font-bold mt-0.5">Foto</span>
                          <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onAddFotoInstalacao(item.id, $event)" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- COMENTÁRIOS (estilo rede social) -->
              <div class="border-t border-gray-100 pt-4">
                <p class="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-wider">Comentários</p>

                <!-- Lista de comentários -->
                <div v-if="comentarios.length > 0" class="space-y-3 mb-4">
                  <div v-for="com in comentarios" :key="com.id" class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {{ com.autor_nome ? com.autor_nome.charAt(0).toUpperCase() : '?' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-gray-800">{{ com.autor_nome || 'Usuário' }}</span>
                        <span class="text-[10px] text-gray-400">{{ formatTempoComentario(com.created_at) }}</span>
                      </div>
                      <p class="text-sm text-gray-600 mt-0.5 whitespace-pre-wrap">{{ com.conteudo }}</p>
                    </div>
                  </div>
                </div>

                <!-- Input novo comentário -->
                <div class="flex gap-3">
                  <div class="w-8 h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {{ currentUserInitial }}
                  </div>
                  <div class="flex-1 relative">
                    <div class="flex gap-2">
                      <input
                        ref="mencoesInputRef"
                        v-model="novoComentario"
                        type="text"
                        placeholder="Escreva um comentário... use @ para mencionar"
                        class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        @input="onComentarioInput"
                        @keyup.enter="enviarComentario"
                      />
                      <button
                        type="button"
                        :disabled="!novoComentario.trim() || enviandoComentario"
                        class="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
                        @click="enviarComentario"
                      >
                        <span v-if="enviandoComentario" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                        <span v-else>Enviar</span>
                      </button>
                    </div>
                    <!-- Dropdown de menções -->
                    <div v-if="mostrarMencoes" class="absolute bottom-full mb-1 left-0 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10">
                      <div v-if="mencoesFiltradas.length === 0" class="px-3 py-2 text-xs text-gray-400">Nenhum membro encontrado</div>
                      <button
                        v-for="m in mencoesFiltradas"
                        :key="m.id"
                        type="button"
                        class="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                        @mousedown.prevent="selecionarMencao(m)"
                      >
                        <div class="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{{ m.nome.charAt(0).toUpperCase() }}</div>
                        <span class="text-sm font-medium text-gray-700">{{ m.nome }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ACTION BUTTONS -->
              <div class="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                <button
                  v-if="nextEtapa"
                  type="button"
                  :disabled="atualizandoStatus"
                  class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="nextStatusButtonClass"
                  :style="nextStatusButtonStyle"
                  @click="avancarStatus"
                >
                  <span v-if="atualizandoStatus" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                  {{ nextStatusLabel }}
                </button>
                <button
                  type="button"
                  :disabled="salvandoObs"
                  class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  @click="salvarObservacoes"
                >
                  <span v-if="salvandoObs" class="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"/></svg>
                  Salvar observações
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
                  @click="gerarOsPdf"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                  Gerar PDF
                </button>
              </div>

          </div>
        </div>
      </div>
    </transition>

    <!-- PHOTO LIGHTBOX -->
    <transition name="fade">
      <div
        v-if="lightboxUrl"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click="closeLightbox"
      >
        <button
          type="button"
          class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
          @click.stop="closeLightbox"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          :src="lightboxUrl"
          alt="Foto em tela cheia"
          class="max-w-[95vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          @click.stop
        />
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { createSupabaseClient } from '~/lib/supabase'
import type { OrdemServico, ItemOS, StatusOS } from '~/composables/useOrdensServico'

// ─── Props ───────────────────────────────────────────────────────────────────
const props = defineProps<{
  show: boolean
  ordemServico: (OrdemServico & { cliente_nome?: string | null; cliente_telefone?: string | null; endereco_instalacao?: string | null; nome_trabalho?: string | null; data_entrega?: string | null }) | null
  itensOS: ItemOS[]
}>()

// ─── Emits ───────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'statusUpdated', os: OrdemServico): void
  (e: 'pagamentoUpdated', os: OrdemServico): void
}>()

// ─── Composables ─────────────────────────────────────────────────────────────
const { atualizarStatusOS } = useOrdensServico()
const { empresaId } = useEmpresa()
const { formatCurrency } = useLocale()
const { config: personalizacao } = usePersonalizacao()
const supabase = createSupabaseClient()

// ─── State ───────────────────────────────────────────────────────────────────
const expandedItems = ref<number[]>([])
const lightboxUrl = ref<string | null>(null)
const observacoes = ref('')
const salvandoObs = ref(false)
const atualizandoStatus = ref(false)

// Comentários
const comentarios = ref<any[]>([])
const novoComentario = ref('')
const enviandoComentario = ref(false)
const currentUserName = ref('')
const currentUserId = ref('')

// Menções @
const membrosEquipe = ref<{ id: string; nome: string; email: string | null }[]>([])
const mostrarMencoes = ref(false)
const mencoesQuery = ref('')
const mencoesInputRef = ref<HTMLInputElement | null>(null)

const mencoesFiltradas = computed(() => {
  if (!mencoesQuery.value) return membrosEquipe.value.slice(0, 5)
  const q = mencoesQuery.value.toLowerCase()
  return membrosEquipe.value.filter(m => m.nome.toLowerCase().includes(q)).slice(0, 5)
})

const currentUserInitial = computed(() => {
  return currentUserName.value ? currentUserName.value.charAt(0).toUpperCase() : '?'
})
const instalacaoFotosMap = ref<Record<number, string[]>>({})

// ─── Watchers ────────────────────────────────────────────────────────────────
watch(() => props.ordemServico, (os) => {
  if (os) {
    observacoes.value = os.observacoes || ''
    expandedItems.value = []
    // Inicializar fotos de instalação existentes por item
    instalacaoFotosMap.value = {}
    for (const item of props.itensOS) {
      if (item.foto_instalacao_url) {
        try {
          const parsed = JSON.parse(item.foto_instalacao_url)
          instalacaoFotosMap.value[item.id] = Array.isArray(parsed) ? parsed : [item.foto_instalacao_url]
        } catch {
          instalacaoFotosMap.value[item.id] = [item.foto_instalacao_url]
        }
      } else {
        instalacaoFotosMap.value[item.id] = []
      }
    }
    // Carregar comentários e dados do usuário
    carregarComentarios()
    carregarUsuarioAtual()
  }
}, { immediate: true })

// ─── Status config ───────────────────────────────────────────────────────────
const statusConfig: Record<StatusOS, { bg: string; text: string; dot: string; label: string }> = {
  aguardando_producao: { bg: 'bg-amber-500/10 border border-amber-500/30', text: 'text-amber-500', dot: 'bg-amber-400', label: 'Aguardando Produção' },
  em_producao: { bg: 'bg-primary text-primary-text', text: 'text-primary-text', dot: 'bg-primary-text', label: 'Em Produção' },
  pronto: { bg: 'bg-green-600/10 border border-green-600/30', text: 'text-green-500', dot: 'bg-green-400', label: 'Pronto' },
  entregue: { bg: 'bg-emerald-600/10 border border-emerald-600/30', text: 'text-emerald-500', dot: 'bg-emerald-400', label: 'Entregue' },
  cancelado: { bg: 'bg-red-600/10 border border-red-600/30', text: 'text-red-500', dot: 'bg-red-400', label: 'Cancelado' },
}

// ─── Computed ────────────────────────────────────────────────────────────────
const statusLabel = computed(() => {
  if (!props.ordemServico) return ''
  // Usar nome da etapa do kanban se disponível
  if (etapaAtual.value) return etapaAtual.value.nome
  return statusConfig[props.ordemServico.status]?.label ?? props.ordemServico.status
})

const statusBadgeClasses = computed(() => {
  if (!props.ordemServico) return ''
  const config = statusConfig[props.ordemServico.status]
  return `${config.bg} ${config.text}`
})

const statusDotClass = computed(() => {
  if (!props.ordemServico) return ''
  return statusConfig[props.ordemServico.status]?.dot ?? 'bg-gray-400'
})

function formatDataEntrega(val: string | null): string {
  if (!val) return ''
  // Suporta tanto "2026-07-15" quanto "2026-07-15T00:00:00+00:00"
  const iso = val.includes('T') ? val.split('T')[0] : val
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function formatDataPrint(val: string | null | undefined): string {
  if (!val) return '—'
  const iso = val.includes('T') ? val.split('T')[0] : val
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const whatsappLink = computed(() => {
  const tel = props.ordemServico?.cliente_telefone
  if (!tel) return null
  const digits = tel.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/55${digits}`
})

const nextStatus = computed<StatusOS | null>(() => {
  if (!props.ordemServico) return null
  if (!nextEtapa.value) return null
  // Determinar status baseado na posição/is_final (não no nome)
  if (nextEtapa.value.is_final) return 'entregue'
  if (nextEtapa.value.posicao === 0) return 'aguardando_producao'
  return 'em_producao'
})

// ─── Etapas do Kanban (dinâmicas) ────────────────────────────────────────────
const etapasProducao = ref<any[]>([])

// Carregar etapas do pipeline de produção
watch(() => props.show, async (show) => {
  if (show && etapasProducao.value.length === 0) {
    try {
      const { data } = await supabase
        .from('pipeline_etapas')
        .select('id, nome, posicao, is_final, cor')
        .eq('pipeline_tipo', 'producao')
        .order('posicao', { ascending: true })
      etapasProducao.value = data ?? []
    } catch (e) {
      console.warn('[OSDetalhesModal] Erro ao carregar etapas:', e)
    }
  }
}, { immediate: true })

// Etapa atual da OS no kanban
const etapaAtual = computed(() => {
  if (!props.ordemServico) return null
  const osEtapaId = (props.ordemServico as any).etapa_id
  if (osEtapaId) {
    return etapasProducao.value.find(e => e.id === osEtapaId) ?? null
  }
  // Fallback: mapear pelo status
  const statusToNome: Record<string, string> = {
    aguardando_producao: 'Aguardando',
    em_producao: 'Em Produção',
    pronto: 'Pronto',
    entregue: 'Entregue',
  }
  const nome = statusToNome[props.ordemServico.status]
  return etapasProducao.value.find(e => e.nome === nome) ?? null
})

// Próxima etapa no kanban (baseada na posição)
const nextEtapa = computed(() => {
  if (!etapaAtual.value || etapaAtual.value.is_final) return null
  const posicaoAtual = etapaAtual.value.posicao
  return etapasProducao.value.find(e => e.posicao === posicaoAtual + 1) ?? null
})

const nextStatusLabel = computed(() => {
  if (!nextEtapa.value) return ''
  return `Mover para ${nextEtapa.value.nome}`
})

const nextStatusButtonClass = computed(() => {
  if (!nextEtapa.value) return ''
  // Usar a cor da próxima etapa como cor do botão
  return 'hover:opacity-90'
})

const nextStatusButtonStyle = computed(() => {
  if (!nextEtapa.value) return {}
  return { background: nextEtapa.value.cor || '#374151' }
})

// ─── Methods ─────────────────────────────────────────────────────────────────
function toggleItem(idx: number) {
  const i = expandedItems.value.indexOf(idx)
  if (i === -1) {
    expandedItems.value.push(idx)
  } else {
    expandedItems.value.splice(i, 1)
  }
}

function openLightbox(url: string) {
  lightboxUrl.value = url
}

function closeLightbox() {
  lightboxUrl.value = null
}

async function onFotoInstalacaoItemUpdated(itemId: number, url: string | null) {
  try {
    await supabase
      .from('itens_ordem_servico')
      .update({ foto_instalacao_url: url })
      .eq('id', itemId)
  } catch (err) {
    console.error('Erro ao salvar foto da instalação:', err)
  }
}

function getInstalacaoFotos(itemId: number): string[] {
  return instalacaoFotosMap.value[itemId] ?? []
}

async function onAddFotoInstalacao(itemId: number, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''

  // Validar
  if (file.size > 10 * 1024 * 1024) {
    console.error('Arquivo muito grande')
    return
  }

  // Upload
  const empId = empresaId.value ?? 0
  const osId = props.ordemServico?.id ?? 0
  const idx = (instalacaoFotosMap.value[itemId]?.length ?? 0) + 1
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${empId}/${osId}/itens/${itemId}/instalacao-${idx}.${ext}`

  const { data, error } = await supabase.storage
    .from('orcamentos')
    .upload(path, file, { cacheControl: '3600', upsert: true })

  if (error) {
    console.error('Erro no upload da foto de instalação:', error)
    return
  }

  const { data: urlData } = supabase.storage.from('orcamentos').getPublicUrl(data.path)
  const publicUrl = urlData.publicUrl

  // Adicionar ao array local
  if (!instalacaoFotosMap.value[itemId]) instalacaoFotosMap.value[itemId] = []
  instalacaoFotosMap.value[itemId].push(publicUrl)

  // Persistir array JSON no banco
  await salvarFotosInstalacaoItem(itemId)
}

async function removerFotoInstalacao(itemId: number, fotoIdx: number) {
  const fotos = instalacaoFotosMap.value[itemId]
  if (!fotos) return
  fotos.splice(fotoIdx, 1)
  await salvarFotosInstalacaoItem(itemId)
}

async function salvarFotosInstalacaoItem(itemId: number) {
  const fotos = instalacaoFotosMap.value[itemId] ?? []
  const valor = fotos.length > 0 ? JSON.stringify(fotos) : null
  try {
    await supabase
      .from('itens_ordem_servico')
      .update({ foto_instalacao_url: valor })
      .eq('id', itemId)
  } catch (err) {
    console.error('Erro ao salvar fotos de instalação:', err)
  }
}

async function avancarStatus() {
  if (!props.ordemServico || !nextEtapa.value) return
  atualizandoStatus.value = true
  try {
    // Montar payload: atualizar etapa_id + status + timestamps
    // Determinar status baseado na posição/is_final (não no nome)
    let novoStatus: string
    if (nextEtapa.value.is_final) {
      novoStatus = 'entregue'
    } else if (nextEtapa.value.posicao === 0) {
      novoStatus = 'aguardando_producao'
    } else {
      novoStatus = 'em_producao'
    }

    const updatePayload: Record<string, unknown> = {
      etapa_id: nextEtapa.value.id,
      status: novoStatus,
    }

    // Registrar timestamps de transição
    if (novoStatus === 'em_producao') updatePayload.data_inicio_producao = new Date().toISOString()
    else if (novoStatus === 'entregue') updatePayload.data_entrega = new Date().toISOString()

    const { data, error } = await supabase
      .from('ordens_servico_adesivo')
      .update(updatePayload)
      .eq('id', props.ordemServico.id)
      .select()
      .single()

    if (error) throw error

    emit('statusUpdated', data as OrdemServico)
  } catch (err) {
    console.error('Erro ao avançar status:', err)
  } finally {
    atualizandoStatus.value = false
  }
}

async function moverParaEtapa(etapa: any) {
  if (!props.ordemServico || atualizandoStatus.value) return
  // Se já está nessa etapa, não faz nada
  if (etapaAtual.value && etapa.id === etapaAtual.value.id) return

  atualizandoStatus.value = true
  try {
    let novoStatus: string
    if (etapa.is_final) {
      novoStatus = 'entregue'
    } else if (etapa.posicao === 0) {
      novoStatus = 'aguardando_producao'
    } else {
      novoStatus = 'em_producao'
    }

    const updatePayload: Record<string, unknown> = {
      etapa_id: etapa.id,
      status: novoStatus,
    }

    if (novoStatus === 'em_producao') updatePayload.data_inicio_producao = new Date().toISOString()
    else if (novoStatus === 'entregue') updatePayload.data_entrega = new Date().toISOString()

    const { data, error } = await supabase
      .from('ordens_servico_adesivo')
      .update(updatePayload)
      .eq('id', props.ordemServico.id)
      .select()
      .single()

    if (error) throw error

    emit('statusUpdated', data as OrdemServico)
  } catch (err) {
    console.error('Erro ao mover para etapa:', err)
  } finally {
    atualizandoStatus.value = false
  }
}

async function salvarObservacoes() {
  if (!props.ordemServico) return
  salvandoObs.value = true
  try {
    await supabase
      .from('ordens_servico_adesivo')
      .update({ observacoes: observacoes.value || null })
      .eq('id', props.ordemServico.id)
  } catch (err) {
    console.error('Erro ao salvar observações:', err)
  } finally {
    salvandoObs.value = false
  }
}

// ─── Comentários ─────────────────────────────────────────────────────────────
async function carregarComentarios() {
  if (!props.ordemServico) return
  const { data } = await supabase
    .from('os_comentarios')
    .select('id, conteudo, autor_nome, created_at')
    .eq('ordem_servico_id', props.ordemServico.id)
    .order('created_at', { ascending: true })
  comentarios.value = data ?? []
}

async function carregarUsuarioAtual() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    currentUserId.value = session.user.id
    currentUserName.value = session.user.user_metadata?.full_name || session.user.email || ''
    // Carregar membros da equipe (funcionários) para menções
    let empId = empresaId.value || session.user.user_metadata?.empresa_id
    if (!empId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', session.user.id)
        .maybeSingle()
      empId = profile?.empresa_id
    }
    if (empId) {
      const { data } = await supabase
        .from('funcionarios')
        .select('id, nome, email')
        .eq('empresa_id', empId)
      membrosEquipe.value = (data ?? []).map((f: any) => ({
        id: String(f.id),
        nome: f.nome || f.email || 'Sem nome',
        email: f.email || null,
      }))
    }
  }
}

async function enviarComentario() {
  if (!novoComentario.value.trim() || !props.ordemServico) return
  enviandoComentario.value = true
  try {
    const conteudo = novoComentario.value.trim()
    const { error } = await supabase
      .from('os_comentarios')
      .insert({
        ordem_servico_id: props.ordemServico.id,
        autor_id: currentUserId.value,
        autor_nome: currentUserName.value,
        conteudo,
      })
    if (error) throw error

    // Detectar menções (@NomeDoUsuário) e criar notificações
    const mencionados = membrosEquipe.value.filter(m =>
      conteudo.includes(`@${m.nome}`)
    )
    for (const mencionado of mencionados) {
      if (mencionado.email) {
        await supabase.rpc('criar_notificacao', {
          p_email: mencionado.email,
          p_tipo: 'mencao',
          p_titulo: `${currentUserName.value} mencionou você`,
          p_mensagem: `Em OS ${props.ordemServico.numero_os}: "${conteudo.substring(0, 80)}${conteudo.length > 80 ? '...' : ''}"`,
          p_link: `os:${props.ordemServico.id}`,
        })
      }
    }

    novoComentario.value = ''
    mostrarMencoes.value = false
    await carregarComentarios()
  } catch (err) {
    console.error('Erro ao enviar comentário:', err)
  } finally {
    enviandoComentario.value = false
  }
}

function onComentarioInput(e: Event) {
  const input = e.target as HTMLInputElement
  const val = input.value
  const cursorPos = input.selectionStart ?? val.length
  // Verificar se está digitando uma menção
  const textBeforeCursor = val.substring(0, cursorPos)
  const lastAt = textBeforeCursor.lastIndexOf('@')
  if (lastAt >= 0) {
    const textAfterAt = textBeforeCursor.substring(lastAt + 1)
    // Mostrar menções se não tem espaço depois do @
    if (!textAfterAt.includes(' ')) {
      mencoesQuery.value = textAfterAt
      mostrarMencoes.value = true
      return
    }
  }
  mostrarMencoes.value = false
}

function selecionarMencao(membro: { id: string; nome: string }) {
  const val = novoComentario.value
  const lastAt = val.lastIndexOf('@')
  if (lastAt >= 0) {
    novoComentario.value = val.substring(0, lastAt) + `@${membro.nome} `
  }
  mostrarMencoes.value = false
}

function formatTempoComentario(dataStr: string): string {
  if (!dataStr) return ''
  const data = new Date(dataStr)
  const agora = new Date()
  const diffMs = agora.getTime() - data.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMs / 3600000)
  const diffDias = Math.floor(diffMs / 86400000)
  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min`
  if (diffHoras < 24) return `${diffHoras}h`
  if (diffDias < 7) return `${diffDias}d`
  return data.toLocaleDateString('pt-BR')
}

function isPdf(url: string | null | undefined): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}

// ─── Gerar PDF da OS ─────────────────────────────────────────────────────────
async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace('#', '')
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
}

async function gerarOsPdf() {
  if (!props.ordemServico) return

  // Abre a página de impressão premium em nova aba
  const url = `/os-print?id=${props.ordemServico.id}`
  window.open(url, '_blank')
  return

  // Legacy jsPDF code below (kept for reference)
  const { jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF('p', 'mm', 'a4')
  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const m = 20 // margem generosa
  let y = 0

  // Cor primária do tema
  const primaryHex = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#ea580c'
  const rgb = hexToRgb(primaryHex)
  const lightRgb: [number, number, number] = [Math.min(255, rgb[0] + 180), Math.min(255, rgb[1] + 180), Math.min(255, rgb[2] + 180)]

  const os = props.ordemServico
  const nomeEmpresa = personalizacao.value.nome_empresa || 'SignPRO'

  // ═══ HEADER PREMIUM ═══════════════════════════════════════════════════════
  // Fundo do header: retângulo com cor primária suave
  doc.setFillColor(rgb[0], rgb[1], rgb[2])
  doc.rect(0, 0, pw, 42, 'F')

  // Logo
  const logoUrl = personalizacao.value.logo_url
  if (logoUrl) {
    const logoBase64 = await loadImageAsBase64(logoUrl)
    if (logoBase64) {
      try { doc.addImage(logoBase64, 'PNG', m, 8, 28, 28) } catch {}
    }
  }

  // Texto no header (direita, sobre fundo colorido)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(nomeEmpresa, pw - m, 16, { align: 'right' })

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('Ordem de Serviço', pw - m, 26, { align: 'right' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`${os.numero_os}`, pw - m, 34, { align: 'right' })

  y = 52

  // ═══ INFO GRID (OS + Status + Data) ═══════════════════════════════════════
  doc.setFillColor(lightRgb[0], lightRgb[1], lightRgb[2])
  doc.roundedRect(m, y, pw - m * 2, 18, 3, 3, 'F')

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(rgb[0], rgb[1], rgb[2])

  const colW = (pw - m * 2) / 4
  const infoY = y + 6
  const valY = y + 12

  // Col 1: Status
  doc.text('STATUS', m + 5, infoY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(10)
  doc.text(statusLabel.value || os.status, m + 5, valY)

  // Col 2: Trabalho
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
  doc.text('TRABALHO', m + colW + 5, infoY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(10)
  doc.text(os.nome_trabalho || '—', m + colW + 5, valY)

  // Col 3: Data
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
  doc.text('DATA', m + colW * 2 + 5, infoY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(10)
  doc.text(os.created_at ? new Date(os.created_at).toLocaleDateString('pt-BR') : '—', m + colW * 2 + 5, valY)

  // Col 4: Entrega
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
  doc.text('ENTREGA', m + colW * 3 + 5, infoY)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(10)
  doc.text(os.data_entrega ? formatDataEntrega(os.data_entrega) : '—', m + colW * 3 + 5, valY)

  y += 28

  // ═══ HELPER: Section title ═══
  function sectionTitle(num: string, title: string) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(rgb[0], rgb[1], rgb[2])
    // Número circular
    doc.setFillColor(rgb[0], rgb[1], rgb[2])
    doc.circle(m + 3.5, y + 1, 3.5, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.text(num, m + 3.5, y + 2, { align: 'center' })
    // Título
    doc.setTextColor(rgb[0], rgb[1], rgb[2])
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(title, m + 10, y + 2)
    // Linha
    doc.setDrawColor(lightRgb[0], lightRgb[1], lightRgb[2])
    doc.setLineWidth(0.5)
    const titleWidth = doc.getTextWidth(title)
    doc.line(m + 12 + titleWidth, y + 2, pw - m, y + 2)
    y += 8
  }

  // ═══ 1. CLIENTE ════════════════════════════════════════════════════════════
  sectionTitle('1', 'Cliente')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text(os.cliente_nome || '—', m + 2, y)
  y += 5
  if (os.cliente_telefone) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(os.cliente_telefone, m + 2, y)
    y += 5
  }
  y += 5

  // ═══ 2. ENDEREÇO ══════════════════════════════════════════════════════════
  if (os.endereco_instalacao) {
    sectionTitle('2', 'Endereço de Instalação')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(50, 50, 50)
    doc.text(os.endereco_instalacao, m + 2, y)
    y += 10
  }

  // ═══ 3. ITENS ═════════════════════════════════════════════════════════════
  const itens = props.itensOS
  if (itens.length > 0) {
    sectionTitle(os.endereco_instalacao ? '3' : '2', 'Itens da Ordem de Serviço')

    const tableBody = itens.map((item, idx) => [
      String(idx + 1),
      item.descricao || '—',
      item.material_id ? String(item.material_id) : '—',
      `${item.largura_cm || 0} × ${item.altura_cm || 0} cm`,
      String(item.quantidade || 1),
    ])

    autoTable(doc, {
      startY: y,
      margin: { left: m, right: m },
      head: [['#', 'Descrição', 'Material', 'Dimensões', 'Qtd']],
      body: tableBody,
      headStyles: {
        fillColor: rgb,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 4,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50],
        cellPadding: 3.5,
      },
      alternateRowStyles: {
        fillColor: [lightRgb[0], lightRgb[1], lightRgb[2]],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 30 },
        3: { cellWidth: 35, halign: 'center' },
        4: { cellWidth: 18, halign: 'center' },
      },
      styles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      theme: 'grid',
    })

    y = (doc as any).lastAutoTable.finalY + 10
  }

  // ═══ 4. OBSERVAÇÕES ═══════════════════════════════════════════════════════
  if (observacoes.value) {
    if (y > 240) { doc.addPage(); y = 20 }
    const obsNum = os.endereco_instalacao ? '4' : '3'
    sectionTitle(obsNum, 'Observações')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    const splitObs = doc.splitTextToSize(observacoes.value, pw - m * 2 - 4)
    doc.text(splitObs, m + 2, y)
    y += splitObs.length * 4.5 + 8
  }

  // ═══ FOOTER ═══════════════════════════════════════════════════════════════
  // Barra de cor no rodapé
  doc.setFillColor(rgb[0], rgb[1], rgb[2])
  doc.rect(0, ph - 8, pw, 8, 'F')

  doc.setFontSize(7)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'normal')
  const dataGerado = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  doc.text(`Gerado em ${dataGerado}  •  ${nomeEmpresa}  •  SignPRO`, pw / 2, ph - 3, { align: 'center' })

  // ─── Salvar ────────────────────────────────────────────────────────────────
  doc.save(`OS-${os.numero_os}.pdf`)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
