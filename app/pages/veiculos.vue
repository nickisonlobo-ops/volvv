<template>
  <div class="min-h-full bg-gray-50/60 p-3 sm:p-8">

    <!-- ═══════════════════════════════ CABEÇALHO ═══════════════════════════════ -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #ec4899, #f43f5e))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Estoque</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">AutoFlow</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Veículos</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${veiculosFiltrados.length} de ${veiculos.length} veículo(s) exibido(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
              :class="filtroAberto
                ? 'bg-amber-500 text-gray-950 shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
              @click="filtroAberto = !filtroAberto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="hidden sm:inline">Filtros</span>
              <span v-if="filtrosAtivos > 0" class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gray-950 text-amber-400 text-xs font-black">{{ filtrosAtivos }}</span>
            </button>
            <button
              v-if="isAdminOrGerente"
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirAdicionar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Adicionar Veículo</span>
            </button>
          </div>
        </div>

        <div class="h-px bg-white/[0.08] my-4 sm:my-6" />

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="flex flex-col gap-1 bg-white/[0.07] backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Total</span>
            <span class="text-xl font-black text-white leading-tight">{{ veiculos.length }}</span>
            <span class="text-xs text-white/50">veículo(s)</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Disponíveis</span>
            <span class="text-xl font-black text-white leading-tight">{{ disponiveis }}</span>
            <span class="text-xs text-white/50">para venda</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Vendidos</span>
            <span class="text-xl font-black text-white leading-tight">{{ vendidos }}</span>
            <span class="text-xs text-white/50">concluídos</span>
          </div>
          <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10">
            <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Valor em Estoque</span>
            <span class="text-xl font-black text-white leading-tight truncate">{{ formatCurrency(valorEstoque) }}</span>
            <span class="text-xs text-white/50">preços de venda</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════ FILTROS ═══════════════════════════════ -->
    <Transition name="slide-fade">
      <div v-show="filtroAberto" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/70">
          <span class="text-sm font-bold text-gray-700">Filtros</span>
          <button v-if="filtrosAtivos > 0" type="button" class="text-xs font-semibold text-amber-600 hover:underline" @click="limparFiltros">Limpar todos</button>
        </div>
        <div class="p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="sm:col-span-2 flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Busca</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
              <input v-model="filtros.busca" type="text" placeholder="Marca, modelo, placa, ano..." class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo</label>
            <select v-model="filtros.tipo" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="">Todos</option>
              <option v-for="t in tiposUnicos" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="op in [{ label: 'Todos', value: '' }, { label: 'Disponível', value: 'disponivel' }, { label: 'Vendido', value: 'vendido' }, { label: 'Reservado', value: 'reservado' }]"
                :key="op.value"
                type="button"
                class="flex-1 text-xs font-bold py-2 rounded-xl border transition-colors"
                :class="filtros.status === op.value
                  ? 'bg-amber-500 border-amber-500 text-gray-950'
                  : 'border-gray-200 text-gray-500 hover:border-amber-400 hover:text-amber-700 bg-white'"
                @click="filtros.status = op.value"
              >
                {{ op.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════ LOADING ═══════════════════════════════ -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando veículos...</span>
    </div>

    <!-- ═══════════════════════════════ ERRO ═══════════════════════════════ -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- ═══════════════════════════════ GRID DE CARDS ═══════════════════════════════ -->
    <div v-else>
      <div v-if="veiculosFiltrados.length === 0" class="flex flex-col items-center justify-center gap-3 py-24">
        <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
        <span class="text-base font-semibold text-gray-400">Nenhum veículo encontrado</span>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <div
          v-for="v in veiculosFiltrados"
          :key="v.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col"
        >
          <!-- Foto -->
          <div class="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
            <img
              v-if="v.fotos && v.fotos.length > 0"
              :src="v.fotos[0]"
              :alt="`${v.marca} ${v.modelo}`"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <svg v-else class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
            <!-- Status badge -->
            <span
              class="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide"
              :class="statusBadgeClass(v.status)"
            >
              {{ statusLabel(v.status) }}
            </span>
            <!-- Tipo badge -->
            <span v-if="v.tipo" class="absolute top-3 right-3 text-[10px] font-semibold bg-gray-900/70 text-white px-2 py-0.5 rounded-full">
              {{ v.tipo }}
            </span>
            <!-- Contador de fotos -->
            <span v-if="v.fotos && v.fotos.length > 1" class="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
              {{ v.fotos.length }}
            </span>
          </div>

          <div class="flex flex-col gap-2 p-4 flex-1">
            <div>
              <p class="font-black text-gray-900 text-base leading-tight">{{ v.marca }} {{ v.modelo }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ v.ano_fabricacao }}{{ v.ano_modelo && v.ano_modelo !== v.ano_fabricacao ? `/${v.ano_modelo}` : '' }} • {{ v.cor ?? '—' }}</p>
            </div>

            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span v-if="v.km != null" class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"/></svg>
                {{ v.km.toLocaleString('pt-BR') }} km
              </span>
              <span v-if="v.cilindrada" class="flex items-center gap-1 font-mono font-bold text-gray-600">
                {{ v.cilindrada }} cc
              </span>
              <span v-if="v.combustivel" class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/></svg>
                {{ v.combustivel }}
              </span>
              <span v-if="v.placa" class="font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">{{ v.placa }}</span>
            </div>

            <div class="mt-auto pt-2 border-t border-gray-50 flex items-end justify-between">
              <div>
                <p v-if="v.preco_custo != null" class="text-xs text-gray-400">Custo: {{ formatCurrency(v.preco_custo) }}</p>
                <p class="text-lg font-black text-gray-900">{{ formatCurrency(v.preco_venda) }}</p>
              </div>
              <div v-if="isAdminOrGerente" class="flex gap-1">
                <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-amber-500 hover:bg-amber-50 transition-colors" @click="editVeiculo(v)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                </button>
                <button v-if="isAdmin" type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-50 transition-colors" @click="confirmarExclusao(v)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════ MODAL ADICIONAR / EDITAR ═══════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="editando !== null || adicionando"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">{{ adicionando ? 'Adicionar Veículo' : 'Editar Veículo' }}</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto max-h-[70vh]" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">
              <!-- Marca + Modelo -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.marca" label="Marca *" placeholder="Ex: Toyota" :error="formErrors.marca" required />
                <AppInput v-model="form.modelo" label="Modelo *" placeholder="Ex: Corolla XEi" :error="formErrors.modelo" required />
              </div>
              <!-- Ano fab + Ano modelo -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Ano Fab. <span class="text-red-500 ml-0.5">*</span></label>
                  <select v-model="form.ano_fabricacao" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="">Selecione</option>
                    <option v-for="ano in anoOptions" :key="ano" :value="String(ano)">{{ ano }}</option>
                  </select>
                  <p v-if="formErrors.ano_fabricacao" class="text-xs text-red-500">{{ formErrors.ano_fabricacao }}</p>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Ano Modelo</label>
                  <select v-model="form.ano_modelo" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="">Selecione</option>
                    <option v-for="ano in anoOptions" :key="ano" :value="String(ano)">{{ ano }}</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Quilometragem</label>
                  <input
                    :value="formDisplay.km"
                    type="text"
                    inputmode="numeric"
                    placeholder="0"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    @input="onKmInput"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Tipo</label>
                  <select v-model="form.tipo" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="">Selecione</option>
                    <option>Sedan</option>
                    <option>Hatch</option>
                    <option>SUV</option>
                    <option>Pickup</option>
                    <option>Van</option>
                    <option>Coupé</option>
                    <option>Conversível</option>
                    <option>Minivan</option>
                    <option>Caminhonete</option>
                    <option>Moto — Naked</option>
                    <option>Moto — Sport</option>
                    <option>Moto — Custom / Cruiser</option>
                    <option>Moto — Trail / Adventure</option>
                    <option>Moto — Scooter</option>
                    <option>Moto — Enduro / Off-Road</option>
                    <option>Moto — Touring</option>
                    <option>Moto — Elétrica</option>
                    <option>Caminhão</option>
                    <option>Ônibus</option>
                  </select>
                </div>
              </div>
              <!-- Campos específicos de Moto -->
              <Transition name="slide-fade">
                <div v-if="isMoto" class="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <AppInput v-model="form.cilindrada" label="Cilindrada (cc)" type="number" placeholder="160" />
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-semibold text-gray-700">Transmissão</label>
                    <select v-model="form.cambio" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                      <option value="">—</option>
                      <option>Manual (sequencial)</option>
                      <option>Automático / CVT</option>
                      <option>Cardã</option>
                    </select>
                  </div>
                </div>
              </Transition>

              <!-- Placa + Cor + Combustivel + Cambio-->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <AppInput v-model="form.placa" label="Placa" placeholder="ABC-1D23" />
                <AppInput v-model="form.cor" label="Cor" placeholder="Prata" />
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Combustível</label>
                  <select v-model="form.combustivel" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="">—</option>
                    <option>Gasolina</option>
                    <option>Flex</option>
                    <option>Etanol</option>
                    <option>Diesel</option>
                    <option>Elétrico</option>
                    <option>Híbrido</option>
                    <option>GNV</option>
                  </select>
                </div>
                <div v-if="!isMoto" class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Câmbio</label>
                  <select v-model="form.cambio" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
                    <option value="">—</option>
                    <option>Manual</option>
                    <option>Automático</option>
                    <option>Automatizado</option>
                    <option>CVT</option>
                    <option>Dual-clutch</option>
                  </select>
                </div>
                <div v-if="isMoto" class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Quilometragem</label>
                  <input
                    :value="formDisplay.km"
                    type="text"
                    inputmode="numeric"
                    placeholder="0"
                    class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    @input="onKmInput"
                  />
                </div>
              </div>
              <!-- Preços -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Preço de Custo</label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none select-none">{{ locale.simboloMoeda }}</span>
                    <input
                      :value="formDisplay.preco_custo"
                      type="text"
                      inputmode="numeric"
                      placeholder="0,00"
                      class="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      @input="onPrecoCustoInput"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Preço de Venda <span class="text-red-500 ml-0.5">*</span></label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold pointer-events-none select-none">{{ locale.simboloMoeda }}</span>
                    <input
                      :value="formDisplay.preco_venda"
                      type="text"
                      inputmode="numeric"
                      placeholder="0,00"
                      class="w-full rounded-xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      @input="onPrecoVendaInput"
                    />
                  </div>
                  <p v-if="formErrors.preco_venda" class="text-xs text-red-500">{{ formErrors.preco_venda }}</p>
                </div>
              </div>
              <!-- Chassis + Renavam -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.chassi" label="Chassi" placeholder="9BWZZZ377VT004251" />
                <AppInput v-model="form.renavam" label="Renavam" placeholder="00000000000" />
              </div>
              <!-- Status -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Status</label>
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="s in ['disponivel', 'reservado', 'vendido', 'manutencao']"
                    :key="s"
                    type="button"
                    class="flex-1 text-xs font-bold py-2.5 rounded-xl border transition-colors capitalize"
                    :class="form.status === s
                      ? statusBadgeClass(s) + ' border-transparent'
                      : 'border-gray-200 text-gray-500 hover:border-gray-400 bg-white'"
                    @click="form.status = s"
                  >
                    {{ statusLabel(s) }}
                  </button>
                </div>
              </div>
              <!-- Fotos -->
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">Fotos do veículo</label>
                <div v-if="fotosExistentes.length > 0 || fotoPreviewUrls.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-1">
                  <div
                    v-for="(url, i) in fotosExistentes" :key="`ex-${i}`"
                    class="relative rounded-xl overflow-hidden bg-gray-100 group/foto"
                    style="aspect-ratio:16/9"
                  >
                    <img :src="url" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      class="absolute inset-0 bg-black/50 opacity-0 group-hover/foto:opacity-100 flex items-center justify-center transition-opacity"
                      @click="removerFotoExistente(i)"
                    >
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div
                    v-for="(url, i) in fotoPreviewUrls" :key="`new-${i}`"
                    class="relative rounded-xl overflow-hidden bg-gray-100 group/foto ring-2 ring-amber-400 ring-offset-1"
                    style="aspect-ratio:16/9"
                  >
                    <img :src="url" class="w-full h-full object-cover" />
                    <button
                      type="button"
                      class="absolute inset-0 bg-black/50 opacity-0 group-hover/foto:opacity-100 flex items-center justify-center transition-opacity"
                      @click="removerNovaFoto(i)"
                    >
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
                <label class="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-400 text-gray-400 hover:text-amber-500 cursor-pointer transition-colors text-sm font-semibold">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                  Selecionar fotos
                  <input type="file" accept="image/*" multiple class="hidden" @change="handleFotoInput" />
                </label>
                <p class="text-xs text-gray-400">JPEG, PNG, WEBP — máx. 5 MB por foto. Borda âmbar = nova foto pendente de salvar.</p>
              </div>

              <!-- Observação -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Observações</label>
                <textarea v-model="form.observacao" rows="2" placeholder="Informações adicionais..." class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none" />
              </div>

              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <div class="flex gap-3 pt-1">
                <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="fecharModal">Cancelar</button>
                <AppButton variant="primary" size="md" type="submit" :loading="saving" class="flex-1">
                  {{ adicionando ? 'Adicionar' : 'Salvar alterações' }}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════ MODAL EXCLUIR ═══════════════════════════════ -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="excluindo"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4"
          @click.self="excluindo = null"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="px-8 pt-8 pb-6 text-center">
              <div class="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Excluir veículo?</h2>
              <p class="text-sm text-gray-500 mt-2">
                <strong>{{ excluindo.marca }} {{ excluindo.modelo }}</strong><br />
                <span class="text-red-500 text-xs font-semibold">Essa ação não pode ser desfeita.</span>
              </p>
            </div>
            <p v-if="deleteError" class="text-sm text-red-600 bg-red-50 border-t border-b border-red-200 px-8 py-3 text-center">{{ deleteError }}</p>
            <div class="flex gap-3 px-8 pb-8 pt-4">
              <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-semibold" @click="excluindo = null">Cancelar</button>
              <button type="button" class="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-60" :disabled="deleting" @click="executarExclusao">
                <span v-if="deleting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                {{ deleting ? 'Excluindo...' : 'Excluir' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useAdmin } from '~/composables/useAdmin'
import { useEmpresa } from '~/composables/useEmpresa'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'

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
  created_at: string | null
}

const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdmin, isAdminOrGerente } = useAdmin()
const { formatCurrency, locale } = useLocale()

const veiculos   = ref<Veiculo[]>([])
const loading    = ref(true)
const error      = ref<string | null>(null)

const editando   = ref<Veiculo | null>(null)
const adicionando = ref(false)
const saving     = ref(false)
const modalError = ref<string | null>(null)

const excluindo  = ref<Veiculo | null>(null)
const deleting   = ref(false)
const deleteError = ref<string | null>(null)

const filtroAberto = ref(false)
const filtros = reactive({ busca: '', tipo: '', status: '' })

const form = reactive({
  marca: '', modelo: '', ano_fabricacao: '', ano_modelo: '', tipo: '',
  placa: '', cor: '', km: '', combustivel: '', cambio: '',
  chassi: '', renavam: '', preco_custo: '', preco_venda: '',
  status: 'disponivel', observacao: '',
  cilindrada: '', tipo_moto: '',
})

const isMoto = computed(() => form.tipo === 'Moto')
const anoOptions = computed(() => {
  const anos: number[] = []
  for (let y = new Date().getFullYear() + 1; y >= 1950; y--) anos.push(y)
  return anos
})
const formErrors = reactive({ marca: '', modelo: '', ano_fabricacao: '', preco_venda: '' })
const formDisplay = reactive({ km: '', preco_custo: '', preco_venda: '' })

// ── Fotos ─────────────────────────────────────────────────────────────────────
const fotosExistentes = ref<string[]>([])
const novosArquivos   = ref<File[]>([])
const fotoPreviewUrls = ref<string[]>([])

function handleFotoInput(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const file of Array.from(files)) {
    novosArquivos.value.push(file)
    fotoPreviewUrls.value.push(URL.createObjectURL(file))
  }
  ;(e.target as HTMLInputElement).value = ''
}
function removerFotoExistente(i: number) {
  fotosExistentes.value.splice(i, 1)
}
function removerNovaFoto(i: number) {
  URL.revokeObjectURL(fotoPreviewUrls.value[i])
  fotoPreviewUrls.value.splice(i, 1)
  novosArquivos.value.splice(i, 1)
}
function resetFotos() {
  fotoPreviewUrls.value.forEach(u => URL.revokeObjectURL(u))
  fotosExistentes.value = []
  novosArquivos.value   = []
  fotoPreviewUrls.value = []
}
async function uploadFotos(veiculoId: number): Promise<{ urls: string[]; erro: string | null }> {
  const urls: string[] = []
  console.log('[upload] arquivos para enviar:', novosArquivos.value.length)
  for (const file of novosArquivos.value) {
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${empresaId.value}/veiculos/${veiculoId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    console.log('[upload] enviando:', path)
    const { data: upData, error: upErr } = await supabase.storage
      .from('veiculos-fotos')
      .upload(path, file, { upsert: false })
    console.log('[upload] resultado:', upData, upErr)
    if (upErr) {
      return { urls, erro: `Erro ao enviar foto "${file.name}": ${upErr.message}` }
    }
    const { data } = supabase.storage.from('veiculos-fotos').getPublicUrl(path)
    console.log('[upload] URL pública:', data.publicUrl)
    urls.push(data.publicUrl)
  }
  console.log('[upload] URLs finais:', urls)
  return { urls, erro: null }
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const disponiveis = computed(() => veiculos.value.filter(v => v.status === 'disponivel').length)
const vendidos    = computed(() => veiculos.value.filter(v => v.status === 'vendido').length)
const valorEstoque = computed(() =>
  veiculos.value.filter(v => v.status !== 'vendido').reduce((s, v) => s + v.preco_venda, 0)
)

// ── Filtros ───────────────────────────────────────────────────────────────────
const tiposUnicos = computed(() => {
  const set = new Set(veiculos.value.map(v => v.tipo).filter(Boolean) as string[])
  return Array.from(set).sort()
})
const filtrosAtivos = computed(() => [filtros.busca, filtros.tipo, filtros.status].filter(Boolean).length)
const veiculosFiltrados = computed(() => {
  return veiculos.value.filter(v => {
    if (filtros.tipo && v.tipo !== filtros.tipo) return false
    if (filtros.status && v.status !== filtros.status) return false
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      return (
        v.marca.toLowerCase().includes(q) ||
        v.modelo.toLowerCase().includes(q) ||
        (v.placa ?? '').toLowerCase().includes(q) ||
        (v.cor ?? '').toLowerCase().includes(q) ||
        String(v.ano_fabricacao ?? '').includes(q)
      )
    }
    return true
  })
})
function limparFiltros() { filtros.busca = ''; filtros.tipo = ''; filtros.status = '' }

// ── Formatação de campos numéricos ────────────────────────────────────────────
function onKmInput(e: Event) {
  const input = e.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '')
  form.km = digits
  formDisplay.km = digits ? Number(digits).toLocaleString('pt-BR') : ''
  input.value = formDisplay.km
}
function onPrecoCustoInput(e: Event) {
  const input = e.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '')
  form.preco_custo = digits
  const display = digits ? (Number(digits) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
  formDisplay.preco_custo = display
  input.value = display
}
function onPrecoVendaInput(e: Event) {
  const input = e.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '')
  form.preco_venda = digits
  const display = digits ? (Number(digits) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
  formDisplay.preco_venda = display
  input.value = display
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusLabel(s: string | null) {
  const map: Record<string, string> = { disponivel: 'Disponível', vendido: 'Vendido', reservado: 'Reservado', manutencao: 'Manutenção' }
  return map[s ?? ''] ?? s ?? '—'
}
function statusBadgeClass(s: string | null) {
  if (s === 'disponivel') return 'bg-emerald-500 text-white'
  if (s === 'vendido')    return 'bg-red-500 text-white'
  if (s === 'reservado')  return 'bg-blue-500 text-white'
  if (s === 'manutencao') return 'bg-orange-500 text-white'
  return 'bg-gray-500 text-white'
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
onMounted(async () => { await loadEmpresa(); await fetchVeiculos() })

async function fetchVeiculos() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('veiculos')
    .select('*')
    .eq('empresa_id', empresaId.value!)
    .order('created_at', { ascending: false })
  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }
  veiculos.value = (data ?? []) as Veiculo[]
}

function buildPayload() {
  return {
    marca:          form.marca.trim(),
    modelo:         form.modelo.trim(),
    ano_fabricacao: form.ano_fabricacao ? Number(form.ano_fabricacao) : null,
    ano_modelo:     form.ano_modelo ? Number(form.ano_modelo) : null,
    tipo:           form.tipo || null,
    placa:          form.placa.trim() || null,
    cor:            form.cor.trim() || null,
    km:             form.km ? Number(form.km) : null,
    combustivel:    form.combustivel || null,
    cambio:         form.cambio || null,
    chassi:         form.chassi.trim() || null,
    renavam:        form.renavam.trim() || null,
    cilindrada:     form.cilindrada ? Number(form.cilindrada) : null,
    preco_custo:    form.preco_custo ? Number(form.preco_custo) / 100 : null,
    preco_venda:    form.preco_venda ? Number(form.preco_venda) / 100 : 0,
    status:         form.status,
    observacao:     form.observacao.trim() || null,
    empresa_id:     empresaId.value!,
  }
}

function validateForm(): boolean {
  formErrors.marca = ''; formErrors.modelo = ''; formErrors.preco_venda = ''
  let ok = true
  if (!form.marca.trim())     { formErrors.marca = 'Obrigatório.'; ok = false }
  if (!form.modelo.trim())    { formErrors.modelo = 'Obrigatório.'; ok = false }
  if (!form.preco_venda || Number(form.preco_venda) < 0) { formErrors.preco_venda = 'Informe o preço de venda.'; ok = false }
  return ok
}

function abrirAdicionar() {
  adicionando.value = true; editando.value = null; modalError.value = null
  Object.assign(form, { marca: '', modelo: '', ano_fabricacao: '', ano_modelo: '', tipo: '', placa: '', cor: '', km: '', combustivel: '', cambio: '', chassi: '', renavam: '', preco_custo: '', preco_venda: '', status: 'disponivel', observacao: '', cilindrada: '', tipo_moto: '' })
  Object.assign(formErrors, { marca: '', modelo: '', ano_fabricacao: '', preco_venda: '' })
  Object.assign(formDisplay, { km: '', preco_custo: '', preco_venda: '' })
  resetFotos()
}

function fecharModal() { editando.value = null; adicionando.value = false; resetFotos() }

function editVeiculo(v: Veiculo) {
  resetFotos() // limpa fotos anteriores antes de carregar as novas
  editando.value = v; modalError.value = null
  Object.assign(formErrors, { marca: '', modelo: '', ano_fabricacao: '', preco_venda: '' })
  form.marca          = v.marca
  form.modelo         = v.modelo
  form.ano_fabricacao = v.ano_fabricacao != null ? String(v.ano_fabricacao) : ''
  form.ano_modelo     = v.ano_modelo != null ? String(v.ano_modelo) : ''
  form.tipo           = v.tipo ?? ''
  form.placa          = v.placa ?? ''
  form.cor            = v.cor ?? ''
  form.km             = v.km != null ? String(v.km) : ''
  form.combustivel    = v.combustivel ?? ''
  form.cambio         = v.cambio ?? ''
  form.chassi         = v.chassi ?? ''
  form.renavam        = v.renavam ?? ''
  form.preco_custo    = v.preco_custo != null ? String(Math.round(v.preco_custo * 100)) : ''
  form.preco_venda    = String(Math.round(v.preco_venda * 100))
  form.status         = v.status ?? 'disponivel'
  form.observacao     = v.observacao ?? ''
  form.cilindrada     = v.cilindrada != null ? String(v.cilindrada) : ''
  fotosExistentes.value = [...(v.fotos ?? [])]
  formDisplay.km = v.km != null ? Number(v.km).toLocaleString('pt-BR') : ''
  formDisplay.preco_custo = v.preco_custo != null ? v.preco_custo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
  formDisplay.preco_venda = v.preco_venda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true; modalError.value = null
  const { urls: newUrls, erro: uploadErro } = await uploadFotos(editando.value.id)
  if (uploadErro) { modalError.value = uploadErro; saving.value = false; return }
  const fotosFinais = [...fotosExistentes.value, ...newUrls]
  const payload = { ...buildPayload(), fotos: fotosFinais.length > 0 ? fotosFinais : null }
  const { error: updateError } = await supabase.from('veiculos').update(payload).eq('id', editando.value.id)
  saving.value = false
  if (updateError) { modalError.value = updateError.message; return }
  editando.value = null; resetFotos(); await fetchVeiculos()
}

async function salvarAdicao() {
  if (!validateForm()) return
  // Força reload para garantir empresa_id sincronizado com o banco (evita violação de RLS)
  await loadEmpresa(true)
  if (!empresaId.value) {
    modalError.value = 'Perfil de empresa não encontrado. Faça logout e entre novamente.'
    return
  }
  saving.value = true; modalError.value = null
  const { data: inserted, error: insertError } = await supabase
    .from('veiculos').insert(buildPayload()).select('id').single()
  if (insertError) { modalError.value = insertError.message; saving.value = false; return }
  const novoId = (inserted as { id: number }).id
  const { urls, erro: uploadErro } = await uploadFotos(novoId)
  if (uploadErro) { modalError.value = uploadErro; saving.value = false; return }
  if (urls.length > 0) {
    const { error: fotosErr } = await supabase.from('veiculos').update({ fotos: urls }).eq('id', novoId)
    if (fotosErr) { modalError.value = `Veículo salvo, mas erro ao salvar fotos: ${fotosErr.message}`; saving.value = false; return }
  }
  saving.value = false
  adicionando.value = false; resetFotos(); await fetchVeiculos()
}

function confirmarExclusao(v: Veiculo) { excluindo.value = v; deleteError.value = null }

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true; deleteError.value = null
  const { error: deleteErr } = await supabase.from('veiculos').delete().eq('id', excluindo.value.id)
  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }
  excluindo.value = null; await fetchVeiculos()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
