<template>
  <div class="min-h-full bg-gray-50/60 p-3 sm:p-8">

    <!-- CABEÇALHO -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Adesivos</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">Pedidos</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Pedidos</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${totalPedidos} pedido(s) encontrado(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirModalVendaCatalogo"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
              <span class="hidden sm:inline">Venda Catálogo</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirModalNovoPedido"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Novo Pedido</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- BUSCA -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Buscar Pedidos</label>
        <div class="relative">
          <input
            v-model="filtros.busca"
            type="text"
            placeholder="Pesquisar por cliente, descrição ou número do pedido (min. 3 caracteres)..."
            class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-10 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-400"
            @input="debounceFetch"
          />
          <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
        </div>
        <p v-if="filtros.busca.length > 0 && filtros.busca.length < 3" class="text-xs text-amber-600 font-medium">Digite pelo menos 3 caracteres para pesquisar</p>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <!-- Status -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</label>
          <select v-model="filtros.status" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors" @change="fetchPedidos">
            <option value="">Todos</option>
            <option v-for="(label, key) in statusLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <!-- Tipo -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tipo</label>
          <select v-model="filtros.tipo" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors" @change="fetchPedidos">
            <option value="">Todos</option>
            <option value="encomenda">Encomenda</option>
            <option value="catalogo">Catálogo</option>
          </select>
        </div>
        <!-- Data Início -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Data Início</label>
          <input v-model="filtros.dataInicio" type="date" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors" @change="fetchPedidos" />
        </div>
        <!-- Data Fim -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Data Fim</label>
          <input v-model="filtros.dataFim" type="date" class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors" @change="fetchPedidos" />
        </div>
        <!-- Cliente -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Cliente</label>
          <input v-model="filtros.cliente" type="text" placeholder="Buscar cliente..." class="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors placeholder:text-gray-400" @input="debounceFetch" />
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando pedidos...</span>
    </div>

    <!-- ERRO -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
      <button type="button" class="ml-auto text-xs font-bold text-red-600 hover:text-red-800 underline" @click="fetchPedidos">Tentar novamente</button>
    </div>

    <!-- TABELA DE PEDIDOS -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-indigo-600 font-black">{{ totalPedidos }}</span> pedido(s)
        </span>
        <span class="text-xs text-gray-400">Ordenado por data (mais recente)</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">#</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Cliente</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Descrição</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Tipo</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Data</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="pedidos.length === 0">
              <td colspan="6" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                  <span v-if="hasActiveFilters" class="text-base font-semibold text-gray-400">Nenhum pedido encontrado com os critérios selecionados</span>
                  <span v-else class="text-base font-semibold text-gray-400">Nenhum pedido encontrado</span>
                  <span v-if="!hasActiveFilters" class="text-sm text-gray-400">Clique em "Novo Pedido" para criar</span>
                  <span v-else class="text-sm text-gray-400">Tente ajustar os filtros ou termos de busca</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="pedido in pedidos"
              :key="pedido.id"
              class="hover:bg-indigo-50/30 transition-colors duration-150 cursor-pointer group"
              @click="abrirDetalhe(pedido)"
            >
              <td class="px-6 py-4">
                <span class="font-bold text-indigo-600">#{{ pedido.id }}</span>
              </td>
              <td class="px-5 py-4">
                <span class="font-semibold text-gray-800">{{ pedido.clientes?.nome ?? '—' }}</span>
              </td>
              <td class="px-5 py-4">
                <span class="text-gray-500 max-w-[250px] block truncate">{{ truncate(pedido.descricao, 80) }}</span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full" :class="pedido.tipo === 'encomenda' ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'">
                  {{ pedido.tipo === 'encomenda' ? 'Encomenda' : 'Catálogo' }}
                </span>
              </td>
              <td class="px-5 py-4 text-center">
                <span class="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full" :class="statusColors[pedido.status] ?? 'bg-gray-100 text-gray-600'">
                  {{ statusLabels[pedido.status] ?? pedido.status }}
                </span>
              </td>
              <td class="px-5 py-4">
                <span class="text-gray-500 text-xs">{{ formatDate(pedido.created_at) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINAÇÃO -->
      <div v-if="totalPedidos > pageSize" class="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/50">
        <span class="text-xs text-gray-500">Página {{ currentPage }} de {{ totalPages }}</span>
        <div class="flex gap-2">
          <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">Anterior</button>
          <button type="button" class="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">Próxima</button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- FILA DE PRODUÇÃO -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <div class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden mt-6">
      <!-- Header colapsável -->
      <button
        type="button"
        class="w-full flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors"
        @click="filaAberta = !filaAberta"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </div>
          <div class="text-left">
            <h2 class="text-lg font-bold text-gray-800">Fila de Produção</h2>
            <p class="text-xs text-gray-500 mt-0.5">{{ filaProducao.length }} pedido(s) na fila</p>
          </div>
        </div>
        <svg
          class="w-5 h-5 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': filaAberta }"
          fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <!-- Conteúdo da fila -->
      <Transition name="fade">
        <div v-if="filaAberta">
          <!-- Loading fila -->
          <div v-if="filaLoading" class="flex items-center justify-center gap-3 py-12">
            <span class="inline-block w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span class="text-sm text-gray-400">Carregando fila...</span>
          </div>

          <!-- Fila vazia -->
          <div v-else-if="filaProducao.length === 0" class="flex flex-col items-center gap-3 py-12">
            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            <span class="text-sm font-semibold text-gray-400">Nenhum pedido na fila de produção</span>
            <span class="text-xs text-gray-400">Pedidos aprovados aparecerão aqui automaticamente</span>
          </div>

          <!-- Lista de itens da fila -->
          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="(item, idx) in filaProducao"
              :key="item.id"
              class="px-7 py-4 transition-colors duration-150"
              :class="getFilaItemClasses(item)"
            >
              <div class="flex items-start gap-4">
                <!-- Posição e botões de reordenação -->
                <div class="flex flex-col items-center gap-1 shrink-0 pt-1">
                  <span class="text-xs font-black text-gray-400 w-6 text-center">{{ idx + 1 }}</span>
                  <button
                    type="button"
                    class="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="idx === 0 || filaReordenando"
                    title="Mover para cima"
                    @click="moverFilaItem(idx, 'up')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>
                  </button>
                  <button
                    type="button"
                    class="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="idx === filaProducao.length - 1 || filaReordenando"
                    title="Mover para baixo"
                    @click="moverFilaItem(idx, 'down')"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                  </button>
                </div>

                <!-- Conteúdo do item -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-gray-800 text-sm">{{ item.clientes?.nome ?? '—' }}</span>
                    <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full" :class="statusColors[item.status] ?? 'bg-gray-100 text-gray-600'">
                      {{ statusLabels[item.status] ?? item.status }}
                    </span>
                    <!-- Badge de urgência -->
                    <span v-if="getUrgencia(item) === 'overdue'" class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      VENCIDO
                    </span>
                    <span v-else-if="getUrgencia(item) === 'urgent'" class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      URGENTE
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 truncate max-w-[500px]">{{ truncate(item.descricao, 80) }}</p>
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    <span v-if="item.materiais_adesivo?.nome" class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"/></svg>
                      {{ item.materiais_adesivo.nome }}
                    </span>
                    <span v-if="item.largura_cm && item.altura_cm" class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>
                      {{ item.largura_cm }} × {{ item.altura_cm }} cm
                    </span>
                    <span v-if="item.data_entrada_fila" class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
                      Entrada: {{ formatDateTime(item.data_entrada_fila) }}
                    </span>
                    <span v-if="item.prazo_estimado" class="flex items-center gap-1" :class="getUrgencia(item) === 'overdue' ? 'text-red-600 font-bold' : getUrgencia(item) === 'urgent' ? 'text-amber-600 font-bold' : ''">
                      <svg class="w-3.5 h-3.5" :class="getUrgencia(item) === 'overdue' ? 'text-red-500' : getUrgencia(item) === 'urgent' ? 'text-amber-500' : 'text-gray-400'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Prazo: {{ formatDateTime(item.prazo_estimado) }}
                    </span>
                  </div>
                </div>

                <!-- Ações -->
                <div class="flex items-center gap-2 shrink-0">
                  <!-- Iniciar Produção (só para status aprovado) -->
                  <button
                    v-if="item.status === 'aprovado'"
                    type="button"
                    class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-colors disabled:opacity-50"
                    :disabled="filaActionLoading === item.id"
                    title="Iniciar Produção"
                    @click="iniciarProducao(item)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/></svg>
                    <span class="hidden sm:inline">Iniciar</span>
                  </button>

                  <!-- Concluir Produção (só para status em_producao) -->
                  <button
                    v-if="item.status === 'em_producao'"
                    type="button"
                    class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-colors disabled:opacity-50"
                    :disabled="filaActionLoading === item.id"
                    title="Concluir Produção"
                    @click="concluirProducao(item)"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span class="hidden sm:inline">Concluir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- DETALHE DO PEDIDO (inline section) -->
    <Transition name="fade">
      <div v-if="pedidoDetalhe" class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden mt-6">
        <div class="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h2 class="text-lg font-bold text-gray-800">Pedido #{{ pedidoDetalhe.id }}</h2>
            <p class="text-xs text-gray-500 mt-0.5">Detalhes completos do pedido</p>
          </div>
          <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white transition-colors" @click="pedidoDetalhe = null">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-7 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Cliente</span><p class="text-sm font-semibold text-gray-800 mt-1">{{ pedidoDetalhe.clientes?.nome ?? '—' }}</p></div>
          <div><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Tipo</span><p class="text-sm font-semibold text-gray-800 mt-1">{{ pedidoDetalhe.tipo === 'encomenda' ? 'Encomenda' : 'Catálogo' }}</p></div>
          <div><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</span><p class="mt-1"><span class="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full" :class="statusColors[pedidoDetalhe.status]">{{ statusLabels[pedidoDetalhe.status] }}</span></p></div>
          <div><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Material</span><p class="text-sm font-semibold text-gray-800 mt-1">{{ pedidoDetalhe.materiais_adesivo?.nome ?? '—' }}</p></div>
          <div><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Dimensões</span><p class="text-sm font-semibold text-gray-800 mt-1">{{ pedidoDetalhe.largura_cm }} × {{ pedidoDetalhe.altura_cm }} cm</p></div>
          <div><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Quantidade</span><p class="text-sm font-semibold text-gray-800 mt-1">{{ pedidoDetalhe.quantidade }}</p></div>
          <div><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Área Total</span><p class="text-sm font-semibold text-gray-800 mt-1">{{ pedidoDetalhe.area_total_m2?.toFixed(4) ?? '—' }} m²</p></div>
          <div v-if="detalheOrcamento"><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Valor do Orçamento</span><p class="text-sm font-semibold text-emerald-700 mt-1">{{ formatCurrency(detalheOrcamento.valor_total) }}</p></div>
          <div v-if="pedidoDetalhe.forma_pagamento"><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Forma de Pagamento</span><p class="text-sm font-semibold text-gray-800 mt-1 capitalize">{{ pedidoDetalhe.forma_pagamento }}</p></div>
          <div class="sm:col-span-2"><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Descrição</span><p class="text-sm text-gray-700 mt-1">{{ pedidoDetalhe.descricao }}</p></div>
          <div v-if="pedidoDetalhe.observacoes" class="sm:col-span-3"><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Observações</span><p class="text-sm text-gray-700 mt-1">{{ pedidoDetalhe.observacoes }}</p></div>
          <div><span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Criado em</span><p class="text-sm text-gray-700 mt-1">{{ formatDateTime(pedidoDetalhe.created_at) }}</p></div>
        </div>

        <!-- Ações do Pedido -->
        <div class="px-7 pb-4 flex flex-wrap gap-3">
          <button
            v-if="pedidoDetalhe.status === 'novo'"
            type="button"
            class="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200/40 transition-all duration-200 hover:scale-[1.02]"
            @click="abrirModalOrcamento"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
            Gerar Orçamento
          </button>

          <!-- Registrar Entrega: visível quando status é "pronto" -->
          <button
            v-if="pedidoDetalhe.status === 'pronto'"
            type="button"
            class="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-200/40 transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
            :disabled="savingEntrega"
            @click="registrarEntrega"
          >
            <svg v-if="!savingEntrega" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span v-if="savingEntrega" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {{ savingEntrega ? 'Registrando...' : 'Registrar Entrega' }}
          </button>

          <!-- Cancelar Pedido: visível quando status NÃO é "entregue" e NÃO é "cancelado" -->
          <button
            v-if="pedidoDetalhe.status !== 'entregue' && pedidoDetalhe.status !== 'cancelado'"
            type="button"
            class="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200/40 transition-all duration-200 hover:scale-[1.02]"
            @click="abrirModalCancelamento"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
            Cancelar Pedido
          </button>
        </div>

        <!-- Ações: Aprovar / Rejeitar (status orcamento_enviado) -->
        <div v-if="pedidoDetalhe.status === 'orcamento_enviado'" class="px-7 pb-4 flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow-sm shadow-green-200/40 transition-all duration-200 hover:scale-[1.02]"
            @click="abrirModalAprovacao"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Aprovar Orçamento
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200/40 transition-all duration-200 hover:scale-[1.02]"
            @click="abrirModalRejeicao"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Rejeitar Orçamento
          </button>
        </div>

        <!-- Histórico de Status -->
        <div class="px-7 pb-6">
          <h3 class="text-sm font-bold text-gray-700 mb-3">Histórico de Status</h3>
          <div v-if="historicoLoading" class="text-xs text-gray-400">Carregando histórico...</div>
          <div v-else-if="historico.length === 0" class="text-xs text-gray-400">Nenhuma mudança de status registrada.</div>
          <div v-else class="space-y-2">
            <div v-for="h in historico" :key="h.id" class="flex items-center gap-3 text-xs">
              <span class="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
              <span class="text-gray-500 w-36 shrink-0">{{ formatDateTime(h.data_mudanca) }}</span>
              <span v-if="h.status_anterior" class="inline-flex items-center px-2 py-0.5 rounded-full font-bold" :class="statusColors[h.status_anterior] ?? 'bg-gray-100 text-gray-600'">{{ statusLabels[h.status_anterior] ?? h.status_anterior }}</span>
              <svg v-if="h.status_anterior" class="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full font-bold" :class="statusColors[h.status_novo] ?? 'bg-gray-100 text-gray-600'">{{ statusLabels[h.status_novo] ?? h.status_novo }}</span>
              <span v-if="h.observacao" class="text-gray-400 italic truncate max-w-[200px]">{{ h.observacao }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MODAL NOVO PEDIDO ENCOMENDA -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalNovoPedido"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModalNovoPedido"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header escuro -->
            <div class="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Cadastrar</p>
                    <h2 class="text-xl font-black text-white leading-none">Novo Pedido Encomenda</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModalNovoPedido">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto" @submit.prevent="salvarPedido">

              <!-- Cliente -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Cliente *</label>
                <select
                  v-model.number="formPedido.cliente_id"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.cliente_id ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                >
                  <option :value="null" disabled>Selecione o cliente</option>
                  <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }}</option>
                </select>
                <p v-if="formErrors.cliente_id" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ formErrors.cliente_id }}
                </p>
              </div>

              <!-- Descrição -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Descrição do Serviço *</label>
                <textarea
                  v-model="formPedido.descricao"
                  rows="3"
                  maxlength="500"
                  placeholder="Descreva o serviço solicitado..."
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none transition-colors resize-none"
                  :class="formErrors.descricao ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                />
                <p v-if="formErrors.descricao" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ formErrors.descricao }}
                </p>
              </div>

              <!-- Dimensões + Quantidade (grid) -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <!-- Largura -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Largura (cm) *</label>
                  <input
                    v-model.number="formPedido.largura_cm"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="9999.9"
                    placeholder="0.0"
                    class="w-full rounded-xl border-2 px-3 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                    :class="formErrors.largura_cm ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                  />
                  <p v-if="formErrors.largura_cm" class="text-xs text-red-500 font-semibold">{{ formErrors.largura_cm }}</p>
                </div>
                <!-- Altura -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Altura (cm) *</label>
                  <input
                    v-model.number="formPedido.altura_cm"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="9999.9"
                    placeholder="0.0"
                    class="w-full rounded-xl border-2 px-3 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                    :class="formErrors.altura_cm ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                  />
                  <p v-if="formErrors.altura_cm" class="text-xs text-red-500 font-semibold">{{ formErrors.altura_cm }}</p>
                </div>
                <!-- Quantidade -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Quantidade *</label>
                  <input
                    v-model.number="formPedido.quantidade"
                    type="number"
                    step="1"
                    min="1"
                    max="99999"
                    placeholder="1"
                    class="w-full rounded-xl border-2 px-3 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                    :class="formErrors.quantidade ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                  />
                  <p v-if="formErrors.quantidade" class="text-xs text-red-500 font-semibold">{{ formErrors.quantidade }}</p>
                </div>
                <!-- Área calculada -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Área Total (m²)</label>
                  <div class="w-full rounded-xl border-2 border-indigo-200 px-3 py-3 text-sm font-bold text-indigo-700 bg-indigo-50">
                    {{ areaCalculada }}
                  </div>
                </div>
              </div>

              <!-- Material -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Material *</label>
                <select
                  v-model.number="formPedido.material_id"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.material_id ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-indigo-400'"
                >
                  <option :value="null" disabled>Selecione o material</option>
                  <option v-for="m in materiaisAtivos" :key="m.id" :value="m.id">{{ m.nome }} ({{ formatCurrency(m.preco_m2) }}/m²)</option>
                </select>
                <p v-if="formErrors.material_id" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ formErrors.material_id }}
                </p>
              </div>

              <!-- Observações -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Observações</label>
                <textarea
                  v-model="formPedido.observacoes"
                  rows="2"
                  maxlength="1000"
                  placeholder="Informações adicionais (opcional)..."
                  class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:border-indigo-400 transition-colors resize-none"
                />
                <p v-if="formErrors.observacoes" class="text-xs text-red-500 font-semibold">{{ formErrors.observacoes }}</p>
              </div>

              <!-- Upload de Artes -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Artes do Cliente (máx. 5 arquivos, 20MB)</label>
                <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-indigo-300 transition-colors">
                  <input
                    ref="fileInputRef"
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.svg,.ai"
                    class="hidden"
                    @change="handleFileSelect"
                  />
                  <div class="flex flex-col items-center gap-2 cursor-pointer" @click="($refs.fileInputRef as HTMLInputElement)?.click()">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                    <span class="text-xs text-gray-500 font-medium">Clique para selecionar arquivos (PNG, JPG, PDF, SVG, AI)</span>
                  </div>
                </div>
                <!-- Lista de arquivos selecionados -->
                <div v-if="artesFiles.length > 0" class="space-y-2 mt-2">
                  <div v-for="(file, idx) in artesFiles" :key="idx" class="flex items-center justify-between bg-indigo-50 rounded-lg px-3 py-2">
                    <div class="flex items-center gap-2 min-w-0">
                      <svg class="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                      <span class="text-xs font-medium text-gray-700 truncate">{{ file.name }}</span>
                      <span class="text-[10px] text-gray-400">({{ (file.size / 1024 / 1024).toFixed(1) }} MB)</span>
                    </div>
                    <button type="button" class="text-red-400 hover:text-red-600 shrink-0" @click="removerArte(idx)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
                <p v-if="formErrors.artes" class="text-xs text-red-500 font-semibold">{{ formErrors.artes }}</p>
              </div>

              <!-- Erro geral do modal -->
              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <!-- Botões -->
              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModalNovoPedido"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-sm shadow-indigo-200 disabled:opacity-60"
                  :disabled="saving"
                >
                  <span v-if="saving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  {{ saving ? 'Salvando...' : 'Criar Pedido' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL GERAR ORÇAMENTO -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalOrcamento"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModalOrcamento"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-0.5">Gerar</p>
                    <h2 class="text-xl font-black text-white leading-none">Orçamento</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModalOrcamento">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto" @submit.prevent="gerarOrcamento">

              <!-- Dados do pedido (read-only) -->
              <div class="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-3">Dados do Pedido</h4>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div><span class="text-gray-400 text-xs">Cliente:</span><p class="font-semibold text-gray-800">{{ pedidoDetalhe?.clientes?.nome ?? '—' }}</p></div>
                  <div><span class="text-gray-400 text-xs">Material:</span><p class="font-semibold text-gray-800">{{ pedidoDetalhe?.materiais_adesivo?.nome ?? '—' }}</p></div>
                  <div><span class="text-gray-400 text-xs">Descrição:</span><p class="font-semibold text-gray-800">{{ truncate(pedidoDetalhe?.descricao ?? '', 60) }}</p></div>
                  <div><span class="text-gray-400 text-xs">Dimensões:</span><p class="font-semibold text-gray-800">{{ pedidoDetalhe?.largura_cm }} × {{ pedidoDetalhe?.altura_cm }} cm ({{ pedidoDetalhe?.area_total_m2?.toFixed(4) }} m²)</p></div>
                </div>
              </div>

              <!-- Modalidade de Precificação -->
              <OrcamentoFormPrecificacao
                :area-m2="pedidoDetalhe?.area_total_m2 ?? null"
                :preco-m2="materiaisAtivos.find(m => m.id === pedidoDetalhe?.material_id)?.preco_m2 ?? null"
                :quantidade="pedidoDetalhe?.quantidade ?? null"
                :initial-modalidade="formOrcamento.modalidade"
                :initial-preco-unitario="formOrcamento.precoUnitario"
                @update:modalidade="formOrcamento.modalidade = $event"
                @update:preco-unitario="formOrcamento.precoUnitario = $event"
                @update:valor-material="formOrcamento.valorMaterialCalculado = $event"
              />

              <!-- Mão de Obra -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Mão de Obra (R$) *</label>
                <input
                  v-model.number="formOrcamento.maoObra"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="orcamentoErrors.maoObra ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-emerald-400'"
                />
                <p v-if="orcamentoErrors.maoObra" class="text-xs text-red-500 font-semibold">{{ orcamentoErrors.maoObra }}</p>
              </div>

              <!-- Descontos (Volume automático + Manual) -->
              <OrcamentoFormDesconto
                :valor-material="formOrcamento.valorMaterialCalculado"
                :mao-obra="formOrcamento.maoObra || 0"
                :quantidade="pedidoDetalhe?.quantidade ?? 0"
                :empresa-id="empresaId ?? 0"
                @update:desconto-volume-percentual="formOrcamento.descontoVolumePercentual = $event"
                @update:desconto-manual-percentual="formOrcamento.descontoManualPercentual = $event"
                @update:desconto-manual-valor="formOrcamento.descontoManualValor = $event"
                @update:valor-final="formOrcamento.valorFinalCalculado = $event"
              />

              <!-- Validade e Prazo -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Validade -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Validade (dias) *</label>
                  <input
                    v-model.number="formOrcamento.validadeDias"
                    type="number"
                    step="1"
                    min="1"
                    max="90"
                    placeholder="7"
                    class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                    :class="orcamentoErrors.validade ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-emerald-400'"
                  />
                  <p v-if="orcamentoErrors.validade" class="text-xs text-red-500 font-semibold">{{ orcamentoErrors.validade }}</p>
                </div>
                <!-- Prazo Estimado -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Prazo Estimado (dias)</label>
                  <input
                    v-model.number="formOrcamento.prazoEstimadoDias"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="Ex: 5"
                    class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 focus:border-emerald-400 transition-all"
                  />
                </div>
              </div>

              <!-- Erro geral -->
              <p v-if="orcamentoModalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ orcamentoModalError }}</p>

              <!-- Botões -->
              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModalOrcamento"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-sm shadow-emerald-200 disabled:opacity-60"
                  :disabled="savingOrcamento"
                >
                  <span v-if="savingOrcamento" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  {{ savingOrcamento ? 'Gerando...' : 'Gerar PDF e Salvar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL APROVAR ORÇAMENTO -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalAprovacao"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModalAprovacao"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-green-500/20 border border-green-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-green-400 uppercase tracking-[0.2em] mb-0.5">Confirmar</p>
                    <h2 class="text-xl font-black text-white leading-none">Aprovar Orçamento</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModalAprovacao">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto" @submit.prevent="confirmarAprovacao">

              <!-- Aviso de orçamento vencido -->
              <div v-if="aprovacaoOrcamentoVencido" class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
                <div>
                  <p class="text-sm font-bold text-amber-800">Orçamento Vencido</p>
                  <p class="text-xs text-amber-700 mt-1">Este orçamento está com a validade expirada. Deseja prosseguir com a aprovação mesmo assim?</p>
                </div>
              </div>

              <!-- Forma de Pagamento -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Forma de Pagamento *</label>
                <select
                  v-model="formAprovacao.formaPagamento"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="aprovacaoErrors.formaPagamento ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-400'"
                >
                  <option value="" disabled>Selecione a forma de pagamento</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartão</option>
                  <option value="boleto">Boleto</option>
                  <option value="parcelado">Parcelado</option>
                </select>
                <p v-if="aprovacaoErrors.formaPagamento" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ aprovacaoErrors.formaPagamento }}
                </p>
              </div>

              <!-- Erro geral -->
              <p v-if="aprovacaoModalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ aprovacaoModalError }}</p>

              <!-- Botões -->
              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModalAprovacao"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors shadow-sm shadow-green-200 disabled:opacity-60"
                  :disabled="savingAprovacao"
                >
                  <span v-if="savingAprovacao" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  {{ savingAprovacao ? 'Aprovando...' : 'Confirmar Aprovação' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL REJEITAR ORÇAMENTO -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalRejeicao"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModalRejeicao"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="relative bg-gradient-to-br from-red-900 via-red-800 to-rose-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-0.5">Confirmar</p>
                    <h2 class="text-xl font-black text-white leading-none">Rejeitar Orçamento</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModalRejeicao">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto" @submit.prevent="confirmarRejeicao">

              <!-- Motivo -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Motivo da Rejeição *</label>
                <textarea
                  v-model="formRejeicao.motivo"
                  rows="4"
                  maxlength="500"
                  placeholder="Informe o motivo da rejeição pelo cliente..."
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none transition-colors resize-none"
                  :class="rejeicaoErrors.motivo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-400'"
                />
                <div class="flex items-center justify-between">
                  <p v-if="rejeicaoErrors.motivo" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                    {{ rejeicaoErrors.motivo }}
                  </p>
                  <span class="text-[10px] text-gray-400 ml-auto">{{ formRejeicao.motivo.length }}/500</span>
                </div>
              </div>

              <!-- Erro geral -->
              <p v-if="rejeicaoModalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ rejeicaoModalError }}</p>

              <!-- Botões -->
              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModalRejeicao"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-sm shadow-red-200 disabled:opacity-60"
                  :disabled="savingRejeicao"
                >
                  <span v-if="savingRejeicao" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  {{ savingRejeicao ? 'Rejeitando...' : 'Confirmar Rejeição' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL CANCELAMENTO DE PEDIDO -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalCancelamento"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModalCancelamento"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="relative bg-gradient-to-br from-red-900 via-red-800 to-rose-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-0.5">Confirmar</p>
                    <h2 class="text-xl font-black text-white leading-none">Cancelar Pedido</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModalCancelamento">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto" @submit.prevent="confirmarCancelamento">

              <!-- Warning -->
              <div class="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
                <div>
                  <p class="text-sm font-bold text-amber-800">Atenção: Esta ação não pode ser desfeita.</p>
                  <p class="text-xs text-amber-700 mt-1">O pedido será marcado como cancelado. Se o pedido estava em produção ou pronto, o estoque do material será estornado.</p>
                </div>
              </div>

              <!-- Motivo -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Motivo do Cancelamento *</label>
                <textarea
                  v-model="formCancelamento.motivo"
                  rows="4"
                  maxlength="500"
                  placeholder="Informe o motivo do cancelamento (mínimo 5 caracteres)..."
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none transition-colors resize-none"
                  :class="cancelamentoErrors.motivo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-red-400'"
                />
                <div class="flex items-center justify-between">
                  <p v-if="cancelamentoErrors.motivo" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                    {{ cancelamentoErrors.motivo }}
                  </p>
                  <span class="text-[10px] text-gray-400 ml-auto">{{ formCancelamento.motivo.length }}/500</span>
                </div>
              </div>

              <!-- Erro geral -->
              <p v-if="cancelamentoModalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ cancelamentoModalError }}</p>

              <!-- Botões -->
              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModalCancelamento"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-sm shadow-red-200 disabled:opacity-60"
                  :disabled="savingCancelamento"
                >
                  <span v-if="savingCancelamento" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  {{ savingCancelamento ? 'Cancelando...' : 'Confirmar Cancelamento' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL VENDA CATÁLOGO (POS) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalVendaCatalogo"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModalVendaCatalogo"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="relative bg-gradient-to-br from-orange-900 via-orange-800 to-amber-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] mb-0.5">Venda Direta</p>
                    <h2 class="text-xl font-black text-white leading-none">Venda Catálogo</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModalVendaCatalogo">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto" @submit.prevent="confirmarVendaCatalogo">

              <!-- Cliente -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Cliente *</label>
                <select
                  v-model.number="formVendaCatalogo.cliente_id"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="vendaCatalogoErrors.cliente_id ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'"
                >
                  <option :value="null" disabled>Selecione o cliente</option>
                  <option v-for="c in clientesVenda" :key="c.id" :value="c.id">{{ c.nome }}</option>
                </select>
                <p v-if="vendaCatalogoErrors.cliente_id" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ vendaCatalogoErrors.cliente_id }}
                </p>
              </div>

              <!-- Busca de Produtos -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Adicionar Produto</label>
                <div class="relative">
                  <input
                    v-model="buscaProdutoCatalogo"
                    type="text"
                    placeholder="Buscar produto pelo nome..."
                    class="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:border-orange-400 transition-colors pr-10"
                  />
                  <svg class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
                </div>
                <!-- Lista de produtos disponíveis para adicionar -->
                <div v-if="produtosCatalogoFiltrados.length > 0 && buscaProdutoCatalogo.length > 0" class="border border-gray-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-gray-100 bg-white shadow-sm">
                  <button
                    v-for="produto in produtosCatalogoFiltrados"
                    :key="produto.id"
                    type="button"
                    class="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-orange-50 transition-colors text-left"
                    @click="adicionarProdutoCarrinho(produto)"
                  >
                    <div class="min-w-0">
                      <p class="font-semibold text-gray-800 truncate">{{ produto.nome }}</p>
                      <p class="text-xs text-gray-500">{{ produto.largura_cm }} × {{ produto.altura_cm }} cm • {{ produto.materiais_adesivo?.nome ?? '—' }}</p>
                    </div>
                    <span class="text-sm font-bold text-orange-600 shrink-0 ml-3">{{ formatCurrency(produto.preco_venda) }}</span>
                  </button>
                </div>
                <p v-if="buscaProdutoCatalogo.length > 0 && produtosCatalogoFiltrados.length === 0" class="text-xs text-gray-400">Nenhum produto ativo encontrado</p>
              </div>

              <!-- Carrinho de Produtos -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Produtos Selecionados</label>
                <p v-if="vendaCatalogoErrors.itens" class="text-xs text-red-500 font-semibold flex items-center gap-1.5 mb-1">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ vendaCatalogoErrors.itens }}
                </p>

                <div v-if="carrinhoVenda.length === 0" class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <svg class="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
                  <span class="text-sm text-gray-400 font-medium">Nenhum produto adicionado</span>
                </div>

                <div v-else class="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                  <div v-for="(item, idx) in carrinhoVenda" :key="item.produto_id" class="flex items-center gap-3 px-4 py-3 bg-white">
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-800 text-sm truncate">{{ item.nome }}</p>
                      <p class="text-xs text-gray-500">{{ formatCurrency(item.preco_unitario) }} un.</p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <input
                        v-model.number="item.quantidade"
                        type="number"
                        min="1"
                        max="9999"
                        step="1"
                        class="w-20 rounded-lg border-2 border-gray-200 px-2 py-1.5 text-sm font-semibold text-center text-gray-800 bg-gray-50 focus:outline-none focus:border-orange-400"
                        @input="validarQuantidadeCarrinho(idx)"
                      />
                    </div>
                    <div class="text-right shrink-0 w-24">
                      <span class="text-sm font-bold text-gray-800">{{ formatCurrency(item.preco_unitario * item.quantidade) }}</span>
                    </div>
                    <button type="button" class="text-red-400 hover:text-red-600 shrink-0" @click="removerProdutoCarrinho(idx)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Desconto -->
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Tipo de Desconto</label>
                  <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input v-model="formVendaCatalogo.descontoTipo" type="radio" value="percentual" class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                      <span class="text-sm font-medium text-gray-700">% Percentual</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input v-model="formVendaCatalogo.descontoTipo" type="radio" value="fixo" class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                      <span class="text-sm font-medium text-gray-700">R$ Fixo</span>
                    </label>
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                    {{ formVendaCatalogo.descontoTipo === 'percentual' ? 'Desconto (%)' : 'Desconto (R$)' }}
                  </label>
                  <input
                    v-model.number="formVendaCatalogo.descontoValor"
                    type="number"
                    step="0.01"
                    min="0"
                    :max="formVendaCatalogo.descontoTipo === 'percentual' ? 100 : undefined"
                    placeholder="0.00"
                    class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                    :class="vendaCatalogoErrors.desconto ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'"
                  />
                  <p v-if="vendaCatalogoErrors.desconto" class="text-xs text-red-500 font-semibold">{{ vendaCatalogoErrors.desconto }}</p>
                </div>
              </div>

              <!-- Forma de Pagamento -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Forma de Pagamento *</label>
                <select
                  v-model="formVendaCatalogo.formaPagamento"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="vendaCatalogoErrors.formaPagamento ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-orange-400'"
                >
                  <option value="" disabled>Selecione a forma de pagamento</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pix">PIX</option>
                  <option value="cartao">Cartão</option>
                  <option value="boleto">Boleto</option>
                  <option value="parcelado">Parcelado</option>
                </select>
                <p v-if="vendaCatalogoErrors.formaPagamento" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>
                  {{ vendaCatalogoErrors.formaPagamento }}
                </p>
              </div>

              <!-- Total da Venda -->
              <div class="bg-orange-50 rounded-xl border border-orange-200 p-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600">Subtotal</span>
                  <span class="text-sm font-semibold text-gray-700">{{ formatCurrency(vendaCatalogoSubtotal) }}</span>
                </div>
                <div v-if="vendaCatalogoDescontoAplicado > 0" class="flex items-center justify-between mb-1">
                  <span class="text-sm text-gray-600">Desconto</span>
                  <span class="text-sm font-semibold text-red-600">- {{ formatCurrency(vendaCatalogoDescontoAplicado) }}</span>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-orange-200">
                  <span class="text-sm font-bold text-orange-700">Total da Venda</span>
                  <span class="text-2xl font-black text-orange-700">{{ formatCurrency(vendaCatalogoTotal) }}</span>
                </div>
                <p v-if="vendaCatalogoTotal <= 0 && carrinhoVenda.length > 0" class="text-xs text-red-500 font-semibold mt-1">
                  O valor total deve ser maior que zero.
                </p>
              </div>

              <!-- Erro geral -->
              <p v-if="vendaCatalogoModalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ vendaCatalogoModalError }}</p>

              <!-- Botões -->
              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModalVendaCatalogo"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-colors shadow-sm shadow-orange-200 disabled:opacity-60"
                  :disabled="savingVendaCatalogo"
                >
                  <span v-if="savingVendaCatalogo" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  {{ savingVendaCatalogo ? 'Processando...' : 'Confirmar Venda' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- TOAST DE SUCESSO -->
    <Transition name="slide-fade">
      <div
        v-if="successMsg"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-green-200/40"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span class="text-sm font-semibold">{{ successMsg }}</span>
      </div>
    </Transition>

    <!-- TOAST DE ERRO -->
    <Transition name="slide-fade">
      <div
        v-if="toastError"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-red-200/40"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
        <span class="text-sm font-semibold">{{ toastError }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import { createSupabaseClient } from '~/lib/supabase'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Pedido {
  id: number
  empresa_id: number
  cliente_id: number
  tipo: string
  descricao: string
  material_id: number | null
  largura_cm: number | null
  altura_cm: number | null
  quantidade: number
  area_total_m2: number | null
  observacoes: string | null
  status: string
  forma_pagamento: string | null
  venda_id: number | null
  created_at: string
  clientes: { nome: string } | null
  materiais_adesivo: { nome: string } | null
}

interface Historico {
  id: number
  status_anterior: string | null
  status_novo: string
  data_mudanca: string
  observacao: string | null
}

interface Cliente {
  id: number
  nome: string
}

interface MaterialAtivo {
  id: number
  nome: string
  preco_m2: number
}

interface FilaItem {
  id: number
  empresa_id: number
  cliente_id: number
  tipo: string
  descricao: string
  material_id: number | null
  largura_cm: number | null
  altura_cm: number | null
  quantidade: number
  status: string
  posicao_fila: number | null
  data_entrada_fila: string | null
  prazo_estimado: string | null
  data_inicio_producao: string | null
  clientes: { nome: string } | null
  materiais_adesivo: { nome: string } | null
}

// ─── Composables ─────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { calcularArea, calcularOrcamento, calcularTotalCarrinho, statusLabels, statusColors, validarPedidoEncomenda, validarArquivoArte, podeTransitar, classificarUrgencia } = useAdesivos()

// ─── State: Listagem ─────────────────────────────────────────────────────────
const pedidos = ref<Pedido[]>([])
const totalPedidos = ref(0)
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = 20

const filtros = reactive({
  status: '',
  tipo: '',
  dataInicio: '',
  dataFim: '',
  cliente: '',
  busca: '',
})

const totalPages = computed(() => Math.max(1, Math.ceil(totalPedidos.value / pageSize)))

const hasActiveFilters = computed(() => {
  return filtros.status !== '' ||
    filtros.tipo !== '' ||
    filtros.dataInicio !== '' ||
    filtros.dataFim !== '' ||
    filtros.cliente.trim().length >= 3 ||
    filtros.busca.trim().length >= 3
})

// ─── State: Detalhe ──────────────────────────────────────────────────────────
const pedidoDetalhe = ref<Pedido | null>(null)
const historico = ref<Historico[]>([])
const historicoLoading = ref(false)
const detalheOrcamento = ref<{ valor_total: number; valor_material: number; valor_mao_obra: number; desconto_percentual: number; desconto_valor: number } | null>(null)

// ─── State: Modal Novo Pedido ────────────────────────────────────────────────
const modalNovoPedido = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const toastError = ref<string | null>(null)

const clientes = ref<Cliente[]>([])
const materiaisAtivos = ref<MaterialAtivo[]>([])
const artesFiles = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const formPedido = reactive({
  cliente_id: null as number | null,
  descricao: '',
  largura_cm: null as number | null,
  altura_cm: null as number | null,
  material_id: null as number | null,
  quantidade: 1,
  observacoes: '',
})

// ─── State: Entrega ──────────────────────────────────────────────────────────
const savingEntrega = ref(false)

// ─── State: Fila de Produção ─────────────────────────────────────────────────
const filaAberta = ref(true)
const filaProducao = ref<FilaItem[]>([])
const filaLoading = ref(false)
const filaReordenando = ref(false)
const filaActionLoading = ref<number | null>(null)

const formErrors = reactive({
  cliente_id: '',
  descricao: '',
  largura_cm: '',
  altura_cm: '',
  material_id: '',
  quantidade: '',
  observacoes: '',
  artes: '',
})

// ─── Computed: Área calculada em tempo real ──────────────────────────────────
const areaCalculada = computed(() => {
  const l = formPedido.largura_cm
  const a = formPedido.altura_cm
  const q = formPedido.quantidade
  if (l && a && q && l > 0 && a > 0 && q > 0) {
    return calcularArea(l, a, q).toFixed(4) + ' m²'
  }
  return '—'
})

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return '—'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function truncate(text: string | null, max: number): string {
  if (!text) return '—'
  return text.length > max ? text.slice(0, max) + '…' : text
}

function showSuccess(msg: string) {
  successMsg.value = msg
  setTimeout(() => { successMsg.value = null }, 3500)
}

function showToastError(msg: string) {
  toastError.value = msg
  setTimeout(() => { toastError.value = null }, 4000)
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
function debounceFetch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { fetchPedidos() }, 400)
}

// ─── Fetch Pedidos ───────────────────────────────────────────────────────────
onMounted(async () => {
  await loadEmpresa()
  await Promise.all([fetchPedidos(), fetchFilaProducao()])
})

async function fetchPedidos() {
  loading.value = true
  error.value = null

  const from = (currentPage.value - 1) * pageSize
  const to = from + pageSize - 1

  // Check if search term is active (min 3 characters)
  const buscaTerm = filtros.busca.trim()
  const buscaAtiva = buscaTerm.length >= 3

  let query = supabase
    .from('pedidos_adesivo')
    .select('id, empresa_id, cliente_id, tipo, descricao, material_id, largura_cm, altura_cm, quantidade, area_total_m2, observacoes, status, forma_pagamento, venda_id, created_at, clientes(nome), materiais_adesivo(nome)', { count: 'exact' })
    .eq('empresa_id', empresaId.value!)
    .order('created_at', { ascending: false })
    .range(from, to)

  // Apply filters
  if (filtros.status) {
    query = query.eq('status', filtros.status)
  }
  if (filtros.tipo) {
    query = query.eq('tipo', filtros.tipo)
  }
  if (filtros.dataInicio) {
    query = query.gte('created_at', filtros.dataInicio + 'T00:00:00')
  }
  if (filtros.dataFim) {
    query = query.lte('created_at', filtros.dataFim + 'T23:59:59')
  }
  if (filtros.cliente && filtros.cliente.trim().length >= 3) {
    query = query.ilike('clientes.nome', `%${filtros.cliente.trim()}%`)
  }

  // Apply search: search across description and pedido ID
  // Client name search is handled via the joined table filter above
  if (buscaAtiva) {
    // Check if the search term is a number (potential pedido ID)
    const isNumericSearch = /^\d+$/.test(buscaTerm)
    if (isNumericSearch) {
      // Search by pedido ID OR description
      query = query.or(`id.eq.${buscaTerm},descricao.ilike.%${buscaTerm}%`)
    } else {
      // Search by description OR client name (via joined table)
      query = query.or(`descricao.ilike.%${buscaTerm}%,clientes.nome.ilike.%${buscaTerm}%`)
    }
  }

  const { data, error: fetchErr, count } = await query

  loading.value = false
  if (fetchErr) { error.value = fetchErr.message; return }

  // Client-side filter for search across client name when using OR (PostgREST limitation)
  let filteredData = (data ?? []) as unknown as Pedido[]
  if (buscaAtiva && !(/^\d+$/.test(buscaTerm))) {
    // PostgREST may return rows where client join doesn't match but description does,
    // or vice-versa. We do a final client-side filter to ensure all results contain the term
    // in at least one of the three fields.
    const termoLower = buscaTerm.toLowerCase()
    filteredData = filteredData.filter(p =>
      (p.clientes?.nome?.toLowerCase().includes(termoLower)) ||
      (p.descricao?.toLowerCase().includes(termoLower)) ||
      (String(p.id).includes(buscaTerm))
    )
  }

  pedidos.value = filteredData
  // When using client-side filtering, adjust the count
  if (buscaAtiva && !(/^\d+$/.test(buscaTerm))) {
    totalPedidos.value = filteredData.length
  } else {
    totalPedidos.value = count ?? 0
  }
}

function goToPage(page: number) {
  currentPage.value = page
  fetchPedidos()
}

// ─── Detalhe do Pedido ───────────────────────────────────────────────────────
async function abrirDetalhe(pedido: Pedido) {
  pedidoDetalhe.value = pedido
  historicoLoading.value = true
  historico.value = []
  detalheOrcamento.value = null

  // Load historico and orcamento in parallel
  const [historicoRes, orcamentoRes] = await Promise.all([
    supabase
      .from('pedidos_adesivo_historico')
      .select('id, status_anterior, status_novo, data_mudanca, observacao')
      .eq('pedido_id', pedido.id)
      .order('data_mudanca', { ascending: true }),
    supabase
      .from('orcamentos_adesivo')
      .select('valor_total, valor_material, valor_mao_obra, desconto_percentual, desconto_valor')
      .eq('pedido_id', pedido.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  historicoLoading.value = false
  if (!historicoRes.error && historicoRes.data) {
    historico.value = historicoRes.data as Historico[]
  }
  if (!orcamentoRes.error && orcamentoRes.data) {
    detalheOrcamento.value = orcamentoRes.data as { valor_total: number; valor_material: number; valor_mao_obra: number; desconto_percentual: number; desconto_valor: number }
  }
}

// ─── Modal Novo Pedido ───────────────────────────────────────────────────────
function resetFormPedido() {
  formPedido.cliente_id = null
  formPedido.descricao = ''
  formPedido.largura_cm = null
  formPedido.altura_cm = null
  formPedido.material_id = null
  formPedido.quantidade = 1
  formPedido.observacoes = ''
  artesFiles.value = []
  Object.keys(formErrors).forEach(k => { (formErrors as any)[k] = '' })
  modalError.value = null
}

async function abrirModalNovoPedido() {
  resetFormPedido()
  modalNovoPedido.value = true

  // Load clientes and materiais ativos
  const [clientesRes, materiaisRes] = await Promise.all([
    supabase
      .from('clientes')
      .select('id, nome')
      .eq('empresa_id', empresaId.value!)
      .order('nome', { ascending: true }),
    supabase
      .from('materiais_adesivo')
      .select('id, nome, preco_m2')
      .eq('empresa_id', empresaId.value!)
      .eq('ativo', true)
      .order('nome', { ascending: true }),
  ])

  clientes.value = (clientesRes.data ?? []) as Cliente[]
  materiaisAtivos.value = (materiaisRes.data ?? []) as MaterialAtivo[]
}

function fecharModalNovoPedido() {
  modalNovoPedido.value = false
}

// ─── Upload de Artes ─────────────────────────────────────────────────────────
function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const newFiles = Array.from(input.files)

  // Validate each file
  for (const file of newFiles) {
    const validation = validarArquivoArte({ name: file.name, size: file.size, type: file.type })
    if (!validation.valid) {
      const msgs = Object.values(validation.errors).join('. ')
      showToastError(`${file.name}: ${msgs}`)
      input.value = ''
      return
    }
  }

  // Check max 5 total
  if (artesFiles.value.length + newFiles.length > 5) {
    showToastError('Máximo de 5 arquivos de arte permitidos')
    input.value = ''
    return
  }

  artesFiles.value = [...artesFiles.value, ...newFiles]
  input.value = ''
}

function removerArte(idx: number) {
  artesFiles.value = artesFiles.value.filter((_, i) => i !== idx)
}

// ─── Salvar Pedido ───────────────────────────────────────────────────────────
async function salvarPedido() {
  // Reset errors
  Object.keys(formErrors).forEach(k => { (formErrors as any)[k] = '' })
  modalError.value = null

  // Validate with composable
  const validation = validarPedidoEncomenda({
    cliente_id: formPedido.cliente_id,
    descricao: formPedido.descricao,
    largura_cm: formPedido.largura_cm,
    altura_cm: formPedido.altura_cm,
    material_id: formPedido.material_id,
    quantidade: formPedido.quantidade,
    observacoes: formPedido.observacoes || null,
  })

  if (!validation.valid) {
    Object.entries(validation.errors).forEach(([key, msg]) => {
      if (key in formErrors) (formErrors as any)[key] = msg
    })
    return
  }

  saving.value = true

  // 1. Insert pedido
  const { data: pedidoData, error: insertErr } = await supabase
    .from('pedidos_adesivo')
    .insert({
      empresa_id: empresaId.value!,
      cliente_id: formPedido.cliente_id!,
      tipo: 'encomenda',
      descricao: formPedido.descricao.trim(),
      material_id: formPedido.material_id!,
      largura_cm: formPedido.largura_cm!,
      altura_cm: formPedido.altura_cm!,
      quantidade: formPedido.quantidade,
      observacoes: formPedido.observacoes.trim() || null,
      status: 'novo',
    })
    .select('id')
    .single()

  if (insertErr || !pedidoData) {
    saving.value = false
    modalError.value = insertErr?.message ?? 'Erro ao criar pedido'
    return
  }

  const pedidoId = pedidoData.id

  // 2. Upload artes to Storage and insert records
  if (artesFiles.value.length > 0) {
    for (const file of artesFiles.value) {
      const filePath = `${empresaId.value}/${pedidoId}/${Date.now()}_${file.name}`
      const { error: uploadErr } = await supabase.storage
        .from('artes-cliente')
        .upload(filePath, file)

      if (uploadErr) {
        console.error('Upload error:', uploadErr.message)
        showToastError(`Erro ao enviar ${file.name}: ${uploadErr.message}`)
        continue
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('artes-cliente')
        .getPublicUrl(filePath)

      // Insert record in pedidos_adesivo_artes
      await supabase
        .from('pedidos_adesivo_artes')
        .insert({
          pedido_id: pedidoId,
          nome_arquivo: file.name,
          url: urlData.publicUrl,
          tamanho_bytes: file.size,
          tipo_mime: file.type || null,
        })
    }
  }

  // 3. Insert status history entry
  await supabase
    .from('pedidos_adesivo_historico')
    .insert({
      pedido_id: pedidoId,
      status_anterior: null,
      status_novo: 'novo',
      observacao: 'Pedido criado',
    })

  saving.value = false
  fecharModalNovoPedido()
  showSuccess('Pedido criado com sucesso!')
  await fetchPedidos()
}

// ─── Fila de Produção ────────────────────────────────────────────────────────
async function fetchFilaProducao() {
  filaLoading.value = true

  const { data, error: fetchErr } = await supabase
    .from('pedidos_adesivo')
    .select('id, empresa_id, cliente_id, tipo, descricao, material_id, largura_cm, altura_cm, quantidade, status, posicao_fila, data_entrada_fila, prazo_estimado, data_inicio_producao, clientes(nome), materiais_adesivo(nome)')
    .eq('empresa_id', empresaId.value!)
    .in('status', ['aprovado', 'em_producao'])
    .order('posicao_fila', { ascending: true, nullsFirst: false })
    .order('data_entrada_fila', { ascending: true })

  filaLoading.value = false
  if (fetchErr) {
    showToastError('Erro ao carregar fila de produção: ' + fetchErr.message)
    return
  }
  filaProducao.value = (data ?? []) as unknown as FilaItem[]
}

function getUrgencia(item: FilaItem): 'overdue' | 'urgent' | 'normal' | null {
  return classificarUrgencia(item.prazo_estimado)
}

function getFilaItemClasses(item: FilaItem): string {
  const urgencia = getUrgencia(item)
  if (urgencia === 'overdue') return 'bg-red-50 border-l-4 border-l-red-500'
  if (urgencia === 'urgent') return 'bg-amber-50 border-l-4 border-l-amber-400'
  return 'hover:bg-gray-50'
}

async function moverFilaItem(idx: number, direction: 'up' | 'down') {
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1
  if (targetIdx < 0 || targetIdx >= filaProducao.value.length) return

  filaReordenando.value = true

  // Swap items in local state (optimistic)
  const items = [...filaProducao.value]
  const temp = items[idx]
  items[idx] = items[targetIdx]
  items[targetIdx] = temp
  filaProducao.value = items

  // Persist new positions to DB
  const updates = items.map((item, i) => ({
    id: item.id,
    posicao_fila: i + 1,
  }))

  let hasError = false
  for (const update of updates) {
    const { error: upErr } = await supabase
      .from('pedidos_adesivo')
      .update({ posicao_fila: update.posicao_fila })
      .eq('id', update.id)

    if (upErr) {
      hasError = true
      break
    }
  }

  if (hasError) {
    showToastError('Erro ao reordenar fila. Recarregando...')
    await fetchFilaProducao()
  }

  filaReordenando.value = false
}

async function iniciarProducao(item: FilaItem) {
  // Validar transição
  if (!podeTransitar(item.status, 'em_producao')) {
    showToastError('Operação não permitida: apenas pedidos aprovados podem entrar em produção')
    return
  }

  filaActionLoading.value = item.id
  const agora = new Date().toISOString()

  // Update status
  const { error: updateErr } = await supabase
    .from('pedidos_adesivo')
    .update({
      status: 'em_producao',
      data_inicio_producao: agora,
    })
    .eq('id', item.id)

  if (updateErr) {
    filaActionLoading.value = null
    showToastError('Erro ao iniciar produção: ' + updateErr.message)
    return
  }

  // Insert historico
  await supabase
    .from('pedidos_adesivo_historico')
    .insert({
      pedido_id: item.id,
      status_anterior: 'aprovado',
      status_novo: 'em_producao',
      observacao: 'Produção iniciada',
    })

  filaActionLoading.value = null
  showSuccess('Produção iniciada!')
  await fetchFilaProducao()
  await fetchPedidos()
}

async function concluirProducao(item: FilaItem) {
  // Validar transição
  if (!podeTransitar(item.status, 'pronto')) {
    showToastError('Operação não permitida: apenas pedidos em produção podem ser concluídos')
    return
  }

  filaActionLoading.value = item.id
  const agora = new Date().toISOString()

  // Update status, clear fila fields
  const { error: updateErr } = await supabase
    .from('pedidos_adesivo')
    .update({
      status: 'pronto',
      data_fim_producao: agora,
      posicao_fila: null,
      data_entrada_fila: null,
    })
    .eq('id', item.id)

  if (updateErr) {
    filaActionLoading.value = null
    showToastError('Erro ao concluir produção: ' + updateErr.message)
    return
  }

  // Insert historico
  await supabase
    .from('pedidos_adesivo_historico')
    .insert({
      pedido_id: item.id,
      status_anterior: 'em_producao',
      status_novo: 'pronto',
      observacao: 'Produção concluída',
    })

  filaActionLoading.value = null
  showSuccess('Produção concluída! Pedido pronto para entrega.')
  await fetchFilaProducao()
  await fetchPedidos()
}

// ─── Registrar Entrega ───────────────────────────────────────────────────────
async function registrarEntrega() {
  if (!pedidoDetalhe.value) return

  const pedido = pedidoDetalhe.value

  // Validação: só permite para status "pronto"
  if (pedido.status !== 'pronto') {
    showToastError('Apenas pedidos com status "pronto" podem ser entregues')
    return
  }

  // Impedir entrega duplicada: verificar venda_id existente
  if (pedido.venda_id) {
    showToastError('Entrega já registrada para este pedido')
    return
  }

  savingEntrega.value = true

  try {
    // Buscar o orçamento aprovado para obter valor_total e forma de pagamento do pedido
    const { data: orcamentoData, error: orcErr } = await supabase
      .from('orcamentos_adesivo')
      .select('valor_total')
      .eq('pedido_id', pedido.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (orcErr || !orcamentoData) {
      savingEntrega.value = false
      showToastError('Erro ao buscar dados do orçamento: ' + (orcErr?.message ?? 'Orçamento não encontrado'))
      return
    }

    const valorTotal = orcamentoData.valor_total
    const formaPagamento = pedido.forma_pagamento
    const agora = new Date().toISOString()

    // 1. Inserir registro na tabela vendas
    const { data: vendaData, error: vendaErr } = await supabase
      .from('vendas')
      .insert({
        empresa_id: empresaId.value!,
        cliente_id: pedido.cliente_id,
        preco_veiculo: valorTotal,
        data_venda: new Date().toISOString().split('T')[0],
        status: 'concluida',
        forma_pagamento: formaPagamento,
        observacoes: `Entrega pedido adesivo #${pedido.id}`,
      })
      .select('id')
      .single()

    if (vendaErr || !vendaData) {
      savingEntrega.value = false
      showToastError('Erro ao registrar venda: ' + (vendaErr?.message ?? 'Falha ao criar venda'))
      return
    }

    const vendaId = vendaData.id

    // 2. Atualizar pedido: status = 'entregue', data_entrega, venda_id
    const { error: updateErr } = await supabase
      .from('pedidos_adesivo')
      .update({
        status: 'entregue',
        data_entrega: agora,
        venda_id: vendaId,
      })
      .eq('id', pedido.id)

    if (updateErr) {
      savingEntrega.value = false
      showToastError('Erro ao atualizar pedido: ' + updateErr.message)
      return
    }

    // 3. Inserir registro no histórico de status
    await supabase
      .from('pedidos_adesivo_historico')
      .insert({
        pedido_id: pedido.id,
        status_anterior: 'pronto',
        status_novo: 'entregue',
        observacao: `Entrega registrada - Venda #${vendaId}`,
      })

    // Atualizar estado local
    pedidoDetalhe.value = { ...pedido, status: 'entregue', venda_id: vendaId }
    savingEntrega.value = false
    showSuccess('Entrega registrada com sucesso!')
    await fetchPedidos()
  } catch (err: any) {
    savingEntrega.value = false
    showToastError('Erro inesperado ao registrar entrega: ' + (err?.message ?? 'Falha desconhecida'))
  }
}

// ─── State: Modal Orçamento ──────────────────────────────────────────────────
const modalOrcamento = ref(false)
const savingOrcamento = ref(false)
const orcamentoModalError = ref<string | null>(null)

const formOrcamento = reactive({
  maoObra: 0,
  descontoTipo: 'percentual' as 'percentual' | 'fixo',
  descontoValor: 0,
  descontoVolumePercentual: 0,
  descontoManualPercentual: 0,
  descontoManualValor: 0,
  valorFinalCalculado: 0,
  validadeDias: 7,
  prazoEstimadoDias: null as number | null,
  modalidade: 'm2' as 'm2' | 'unidade',
  precoUnitario: null as number | null,
  valorMaterialCalculado: 0,
})

const orcamentoErrors = reactive({
  maoObra: '',
  desconto: '',
  validade: '',
})

// ─── State: Modal Aprovação ──────────────────────────────────────────────────
const modalAprovacao = ref(false)
const savingAprovacao = ref(false)
const aprovacaoModalError = ref<string | null>(null)
const aprovacaoOrcamentoVencido = ref(false)

const formAprovacao = reactive({
  formaPagamento: '',
})

const aprovacaoErrors = reactive({
  formaPagamento: '',
})

// ─── State: Modal Rejeição ───────────────────────────────────────────────────
const modalRejeicao = ref(false)
const savingRejeicao = ref(false)
const rejeicaoModalError = ref<string | null>(null)

const formRejeicao = reactive({
  motivo: '',
})

const rejeicaoErrors = reactive({
  motivo: '',
})

// ─── State: Modal Cancelamento ───────────────────────────────────────────────
const modalCancelamento = ref(false)
const savingCancelamento = ref(false)
const cancelamentoModalError = ref<string | null>(null)

const formCancelamento = reactive({
  motivo: '',
})

const cancelamentoErrors = reactive({
  motivo: '',
})

// ─── Computed: Total calculado em tempo real ─────────────────────────────────
const orcamentoTotalCalculado = computed<number | null>(() => {
  if (!pedidoDetalhe.value) return null

  // Use valor material from OrcamentoFormPrecificacao component (reactive)
  const valorMaterial = formOrcamento.valorMaterialCalculado
  if (valorMaterial <= 0 && formOrcamento.modalidade === 'm2') {
    // Fallback: check if area/material exist for m2 mode
    const area = pedidoDetalhe.value.area_total_m2
    if (!area || area <= 0) return null
    const material = materiaisAtivos.value.find(m => m.id === pedidoDetalhe.value!.material_id)
    if (!material) return null
  }

  if (formOrcamento.modalidade === 'unidade') {
    // Validate preco_unitario for unidade mode
    if (!formOrcamento.precoUnitario || formOrcamento.precoUnitario < 0.01 || formOrcamento.precoUnitario > 99999.99) {
      return null
    }
  }

  // Use the value from OrcamentoFormDesconto component
  const total = formOrcamento.valorFinalCalculado
  return total > 0 ? Number(total.toFixed(2)) : null
})

// ─── Modal Orçamento: Abrir/Fechar ───────────────────────────────────────────
async function abrirModalOrcamento() {
  if (!pedidoDetalhe.value) return

  // Validate status
  if (!podeTransitar(pedidoDetalhe.value.status, 'orcamento_enviado')) {
    showToastError('Orçamentos só podem ser gerados para pedidos com status "novo"')
    return
  }

  // Reset form
  formOrcamento.maoObra = 0
  formOrcamento.descontoTipo = 'percentual'
  formOrcamento.descontoValor = 0
  formOrcamento.descontoVolumePercentual = 0
  formOrcamento.descontoManualPercentual = 0
  formOrcamento.descontoManualValor = 0
  formOrcamento.valorFinalCalculado = 0
  formOrcamento.validadeDias = 7
  formOrcamento.prazoEstimadoDias = null
  formOrcamento.modalidade = 'm2'
  formOrcamento.precoUnitario = null
  formOrcamento.valorMaterialCalculado = 0
  orcamentoErrors.maoObra = ''
  orcamentoErrors.desconto = ''
  orcamentoErrors.validade = ''
  orcamentoModalError.value = null

  // Load materiais if not already loaded
  if (materiaisAtivos.value.length === 0) {
    const { data } = await supabase
      .from('materiais_adesivo')
      .select('id, nome, preco_m2')
      .eq('empresa_id', empresaId.value!)
      .eq('ativo', true)
      .order('nome', { ascending: true })
    materiaisAtivos.value = (data ?? []) as MaterialAtivo[]
  }

  modalOrcamento.value = true
}

function fecharModalOrcamento() {
  modalOrcamento.value = false
}

// ─── Gerar Orçamento ─────────────────────────────────────────────────────────
async function gerarOrcamento() {
  // Reset errors
  orcamentoErrors.maoObra = ''
  orcamentoErrors.desconto = ''
  orcamentoErrors.validade = ''
  orcamentoModalError.value = null

  if (!pedidoDetalhe.value) return

  // Validate status again
  if (!podeTransitar(pedidoDetalhe.value.status, 'orcamento_enviado')) {
    orcamentoModalError.value = 'Orçamentos só podem ser gerados para pedidos com status "novo"'
    return
  }

  // Validate mão de obra
  if (formOrcamento.maoObra < 0 || formOrcamento.maoObra === null || formOrcamento.maoObra === undefined) {
    orcamentoErrors.maoObra = 'Mão de obra deve ser >= 0'
    return
  }

  // Validate preco_unitario when modalidade is 'unidade'
  if (formOrcamento.modalidade === 'unidade') {
    if (!formOrcamento.precoUnitario || formOrcamento.precoUnitario < 0.01 || formOrcamento.precoUnitario > 99999.99) {
      orcamentoModalError.value = 'Preço unitário deve estar entre R$ 0,01 e R$ 99.999,99'
      return
    }
  }

  // Validate discount — final value must be > 0
  if (formOrcamento.valorFinalCalculado <= 0) {
    orcamentoErrors.desconto = 'O desconto excede o valor do orçamento'
    return
  }

  // Validate validade
  if (!formOrcamento.validadeDias || formOrcamento.validadeDias < 1 || formOrcamento.validadeDias > 90) {
    orcamentoErrors.validade = 'Validade deve estar entre 1 e 90 dias'
    return
  }

  // Calculate total
  const total = orcamentoTotalCalculado.value
  if (total === null || total <= 0) {
    orcamentoModalError.value = 'O valor total do orçamento deve ser maior que zero'
    return
  }

  savingOrcamento.value = true

  const pedido = pedidoDetalhe.value
  const material = materiaisAtivos.value.find(m => m.id === pedido.material_id)
  const area = pedido.area_total_m2 ?? 0
  const valorMaterial = formOrcamento.valorMaterialCalculado
  const descontoPerc = formOrcamento.descontoManualPercentual
  const descontoFix = formOrcamento.descontoManualValor

  const now = new Date()
  const dataValidade = new Date(now)
  dataValidade.setDate(dataValidade.getDate() + formOrcamento.validadeDias)

  // Calculate prazo_estimado as a date
  let prazoEstimadoDate: Date | null = null
  if (formOrcamento.prazoEstimadoDias && formOrcamento.prazoEstimadoDias > 0) {
    prazoEstimadoDate = new Date(now)
    prazoEstimadoDate.setDate(prazoEstimadoDate.getDate() + formOrcamento.prazoEstimadoDias)
  }

  // 1. Insert orcamento record
  const { error: orcInsertErr } = await supabase
    .from('orcamentos_adesivo')
    .insert({
      pedido_id: pedido.id,
      empresa_id: empresaId.value!,
      valor_material: Number(valorMaterial.toFixed(2)),
      valor_mao_obra: Number((formOrcamento.maoObra || 0).toFixed(2)),
      desconto_percentual: descontoPerc,
      desconto_valor: descontoFix,
      desconto_volume_percentual: formOrcamento.descontoVolumePercentual,
      valor_total: Number(total.toFixed(2)),
      prazo_estimado_dias: formOrcamento.prazoEstimadoDias || null,
      validade_dias: formOrcamento.validadeDias,
      data_validade: dataValidade.toISOString(),
      modalidade_preco: formOrcamento.modalidade,
      preco_unitario: formOrcamento.modalidade === 'unidade' ? formOrcamento.precoUnitario : null,
    })

  if (orcInsertErr) {
    savingOrcamento.value = false
    orcamentoModalError.value = 'Erro ao salvar orçamento: ' + orcInsertErr.message
    return
  }

  // 2. Generate PDF
  try {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('ORÇAMENTO', 105, 20, { align: 'center' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Pedido #${pedido.id}`, 105, 28, { align: 'center' })
    doc.text(`Data: ${now.toLocaleDateString('pt-BR')}`, 105, 34, { align: 'center' })

    // Divider
    doc.setDrawColor(200)
    doc.line(20, 40, 190, 40)

    // Client Info
    let y = 50
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Dados do Cliente', 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Cliente: ${pedido.clientes?.nome ?? '—'}`, 20, y)

    // Service Details
    y += 14
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Detalhes do Serviço', 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Descrição: ${pedido.descricao}`, 20, y)
    y += 6
    doc.text(`Material: ${material?.nome ?? '—'}`, 20, y)
    y += 6
    doc.text(`Dimensões: ${pedido.largura_cm} × ${pedido.altura_cm} cm`, 20, y)
    y += 6
    doc.text(`Quantidade: ${pedido.quantidade}`, 20, y)
    y += 6
    doc.text(`Área Total: ${area.toFixed(4)} m²`, 20, y)

    // Values
    y += 14
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Valores', 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Material (${formOrcamento.modalidade === 'm2' ? `${area.toFixed(4)} m² × ${formatCurrency(material?.preco_m2 ?? 0)}/m²` : `${pedido.quantidade} un × ${formatCurrency(formOrcamento.precoUnitario ?? 0)}/un`}): ${formatCurrency(valorMaterial)}`, 20, y)
    y += 6
    doc.text(`Mão de Obra: ${formatCurrency(formOrcamento.maoObra || 0)}`, 20, y)
    y += 6
    if (formOrcamento.descontoVolumePercentual > 0) {
      doc.text(`Desconto Volume: ${formOrcamento.descontoVolumePercentual}%`, 20, y)
      y += 6
    }
    if (descontoPerc > 0) {
      doc.text(`Desconto Manual: ${descontoPerc}%`, 20, y)
      y += 6
    } else if (descontoFix > 0) {
      doc.text(`Desconto Manual: ${formatCurrency(descontoFix)}`, 20, y)
      y += 6
    }

    // Total
    y += 4
    doc.setDrawColor(200)
    doc.line(20, y, 190, y)
    y += 8
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`TOTAL: ${formatCurrency(total)}`, 20, y)

    // Validity and deadline
    y += 14
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Validade do orçamento: ${formOrcamento.validadeDias} dia(s) (até ${dataValidade.toLocaleDateString('pt-BR')})`, 20, y)
    if (prazoEstimadoDate) {
      y += 6
      doc.text(`Prazo estimado de entrega: ${formOrcamento.prazoEstimadoDias} dia(s) (até ${prazoEstimadoDate.toLocaleDateString('pt-BR')})`, 20, y)
    }

    // Footer
    y += 20
    doc.setFontSize(8)
    doc.setTextColor(128)
    doc.text('Este orçamento é válido pelo período indicado acima.', 20, y)

    // Download PDF
    doc.save(`orcamento_pedido_${pedido.id}.pdf`)
  } catch (pdfError: any) {
    savingOrcamento.value = false
    showToastError('Erro ao gerar PDF: ' + (pdfError?.message ?? 'Falha desconhecida'))
    // PDF failed - DON'T change status. Remove orcamento record since PDF failed.
    await supabase
      .from('orcamentos_adesivo')
      .delete()
      .eq('pedido_id', pedido.id)
      .eq('empresa_id', empresaId.value!)
    return
  }

  // 3. Update pedido status to "orcamento_enviado"
  const { error: updateErr } = await supabase
    .from('pedidos_adesivo')
    .update({
      status: 'orcamento_enviado',
      prazo_estimado: prazoEstimadoDate?.toISOString() ?? null,
    })
    .eq('id', pedido.id)

  if (updateErr) {
    savingOrcamento.value = false
    showToastError('Erro ao atualizar status: ' + updateErr.message)
    return
  }

  // 4. Insert status change in historico
  await supabase
    .from('pedidos_adesivo_historico')
    .insert({
      pedido_id: pedido.id,
      status_anterior: 'novo',
      status_novo: 'orcamento_enviado',
      observacao: `Orçamento gerado - ${formatCurrency(total)}`,
    })

  savingOrcamento.value = false
  fecharModalOrcamento()

  // Update local state
  pedidoDetalhe.value = { ...pedidoDetalhe.value!, status: 'orcamento_enviado' }
  showSuccess('Orçamento gerado com sucesso! PDF baixado.')
  await fetchPedidos()
}

// ─── Modal Aprovação: Abrir/Fechar ───────────────────────────────────────────
async function abrirModalAprovacao() {
  if (!pedidoDetalhe.value) return

  // Validate status
  if (!podeTransitar(pedidoDetalhe.value.status, 'aprovado')) {
    showToastError('Apenas pedidos com orçamento enviado podem ser aprovados')
    return
  }

  // Reset form
  formAprovacao.formaPagamento = ''
  aprovacaoErrors.formaPagamento = ''
  aprovacaoModalError.value = null
  aprovacaoOrcamentoVencido.value = false

  // Check if orçamento is expired
  const { data: orcamentoData } = await supabase
    .from('orcamentos_adesivo')
    .select('data_validade')
    .eq('pedido_id', pedidoDetalhe.value.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (orcamentoData?.data_validade) {
    const dataValidade = new Date(orcamentoData.data_validade)
    if (dataValidade < new Date()) {
      aprovacaoOrcamentoVencido.value = true
    }
  }

  modalAprovacao.value = true
}

function fecharModalAprovacao() {
  modalAprovacao.value = false
}

async function confirmarAprovacao() {
  // Reset errors
  aprovacaoErrors.formaPagamento = ''
  aprovacaoModalError.value = null

  if (!pedidoDetalhe.value) return

  // Validate status
  if (!podeTransitar(pedidoDetalhe.value.status, 'aprovado')) {
    aprovacaoModalError.value = 'Apenas pedidos com orçamento enviado podem ser aprovados'
    return
  }

  // Validate forma de pagamento
  if (!formAprovacao.formaPagamento) {
    aprovacaoErrors.formaPagamento = 'Selecione a forma de pagamento'
    return
  }

  savingAprovacao.value = true
  const agora = new Date().toISOString()

  // Get next posicao_fila
  const { data: maxPosData } = await supabase
    .from('pedidos_adesivo')
    .select('posicao_fila')
    .eq('empresa_id', empresaId.value!)
    .in('status', ['aprovado', 'em_producao'])
    .order('posicao_fila', { ascending: false, nullsFirst: false })
    .limit(1)

  const nextPosicao = (maxPosData && maxPosData.length > 0 && maxPosData[0].posicao_fila)
    ? maxPosData[0].posicao_fila + 1
    : 1

  // Update pedido: status → aprovado, set forma_pagamento, data_entrada_fila, posicao_fila
  const { error: updateErr } = await supabase
    .from('pedidos_adesivo')
    .update({
      status: 'aprovado',
      forma_pagamento: formAprovacao.formaPagamento,
      data_entrada_fila: agora,
      posicao_fila: nextPosicao,
    })
    .eq('id', pedidoDetalhe.value.id)

  if (updateErr) {
    savingAprovacao.value = false
    aprovacaoModalError.value = 'Erro ao aprovar orçamento: ' + updateErr.message
    return
  }

  // Insert historico
  await supabase
    .from('pedidos_adesivo_historico')
    .insert({
      pedido_id: pedidoDetalhe.value.id,
      status_anterior: 'orcamento_enviado',
      status_novo: 'aprovado',
      observacao: `Orçamento aprovado - Pagamento: ${formAprovacao.formaPagamento}`,
    })

  savingAprovacao.value = false
  fecharModalAprovacao()

  // Update local state
  pedidoDetalhe.value = { ...pedidoDetalhe.value!, status: 'aprovado', forma_pagamento: formAprovacao.formaPagamento }
  showSuccess('Orçamento aprovado! Pedido inserido na fila de produção.')
  await Promise.all([fetchPedidos(), fetchFilaProducao()])
}

// ─── Modal Rejeição: Abrir/Fechar ────────────────────────────────────────────
function abrirModalRejeicao() {
  if (!pedidoDetalhe.value) return

  // Validate status
  if (!podeTransitar(pedidoDetalhe.value.status, 'cancelado') || pedidoDetalhe.value.status !== 'orcamento_enviado') {
    showToastError('Apenas pedidos com orçamento enviado podem ser rejeitados')
    return
  }

  // Reset form
  formRejeicao.motivo = ''
  rejeicaoErrors.motivo = ''
  rejeicaoModalError.value = null

  modalRejeicao.value = true
}

function fecharModalRejeicao() {
  modalRejeicao.value = false
}

async function confirmarRejeicao() {
  // Reset errors
  rejeicaoErrors.motivo = ''
  rejeicaoModalError.value = null

  if (!pedidoDetalhe.value) return

  // Validate status
  if (pedidoDetalhe.value.status !== 'orcamento_enviado') {
    rejeicaoModalError.value = 'Apenas pedidos com orçamento enviado podem ser rejeitados'
    return
  }

  // Validate motivo
  if (!formRejeicao.motivo.trim()) {
    rejeicaoErrors.motivo = 'O motivo da rejeição é obrigatório'
    return
  }
  if (formRejeicao.motivo.trim().length > 500) {
    rejeicaoErrors.motivo = 'O motivo não pode exceder 500 caracteres'
    return
  }

  savingRejeicao.value = true
  const agora = new Date().toISOString()

  // Update pedido: status → cancelado, set motivo_cancelamento
  const { error: updateErr } = await supabase
    .from('pedidos_adesivo')
    .update({
      status: 'cancelado',
      motivo_cancelamento: formRejeicao.motivo.trim(),
      data_cancelamento: agora,
    })
    .eq('id', pedidoDetalhe.value.id)

  if (updateErr) {
    savingRejeicao.value = false
    rejeicaoModalError.value = 'Erro ao rejeitar orçamento: ' + updateErr.message
    return
  }

  // Insert historico
  await supabase
    .from('pedidos_adesivo_historico')
    .insert({
      pedido_id: pedidoDetalhe.value.id,
      status_anterior: 'orcamento_enviado',
      status_novo: 'cancelado',
      observacao: `Orçamento rejeitado: ${formRejeicao.motivo.trim()}`,
    })

  savingRejeicao.value = false
  fecharModalRejeicao()

  // Update local state
  pedidoDetalhe.value = { ...pedidoDetalhe.value!, status: 'cancelado' }
  showSuccess('Orçamento rejeitado. Pedido cancelado.')
  await fetchPedidos()
}

// ─── Modal Cancelamento: Abrir/Fechar ────────────────────────────────────────
function abrirModalCancelamento() {
  if (!pedidoDetalhe.value) return

  // Cannot cancel if already entregue or cancelado
  if (pedidoDetalhe.value.status === 'entregue' || pedidoDetalhe.value.status === 'cancelado') {
    showToastError('Este pedido não pode ser cancelado no status atual')
    return
  }

  // Reset form
  formCancelamento.motivo = ''
  cancelamentoErrors.motivo = ''
  cancelamentoModalError.value = null

  modalCancelamento.value = true
}

function fecharModalCancelamento() {
  modalCancelamento.value = false
}

async function confirmarCancelamento() {
  // Reset errors
  cancelamentoErrors.motivo = ''
  cancelamentoModalError.value = null

  if (!pedidoDetalhe.value) return

  // Validate status
  if (pedidoDetalhe.value.status === 'entregue' || pedidoDetalhe.value.status === 'cancelado') {
    cancelamentoModalError.value = 'Este pedido não pode ser cancelado no status atual'
    return
  }

  // Validate motivo (min 5, max 500)
  const motivoTrimmed = formCancelamento.motivo.trim()
  if (!motivoTrimmed || motivoTrimmed.length < 5) {
    cancelamentoErrors.motivo = 'O motivo deve ter no mínimo 5 caracteres'
    return
  }
  if (motivoTrimmed.length > 500) {
    cancelamentoErrors.motivo = 'O motivo não pode exceder 500 caracteres'
    return
  }

  savingCancelamento.value = true
  const agora = new Date().toISOString()
  const statusAnterior = pedidoDetalhe.value.status

  // If the pedido was em_producao or pronto, we need to reverse the stock (estorno)
  if ((statusAnterior === 'em_producao' || statusAnterior === 'pronto') && pedidoDetalhe.value.material_id && pedidoDetalhe.value.area_total_m2) {
    // Get current stock
    const { data: materialData } = await supabase
      .from('materiais_adesivo')
      .select('estoque_atual')
      .eq('id', pedidoDetalhe.value.material_id)
      .single()

    if (materialData) {
      const novoEstoque = Number(materialData.estoque_atual) + Number(pedidoDetalhe.value.area_total_m2)

      // Update stock
      await supabase
        .from('materiais_adesivo')
        .update({ estoque_atual: Number(novoEstoque.toFixed(2)) })
        .eq('id', pedidoDetalhe.value.material_id)

      // Register stock movement (estorno)
      await supabase
        .from('estoque_movimentacoes')
        .insert({
          empresa_id: empresaId.value!,
          material_id: pedidoDetalhe.value.material_id,
          tipo: 'entrada',
          quantidade_m2: Number(Number(pedidoDetalhe.value.area_total_m2).toFixed(2)),
          saldo_resultante: Number(novoEstoque.toFixed(2)),
          referencia_pedido_id: pedidoDetalhe.value.id,
          observacoes: 'Estorno por cancelamento de pedido',
        })
    }
  }

  // Update pedido: status → cancelado, motivo, data, clear fila
  const { error: updateErr } = await supabase
    .from('pedidos_adesivo')
    .update({
      status: 'cancelado',
      motivo_cancelamento: motivoTrimmed,
      data_cancelamento: agora,
      posicao_fila: null,
      data_entrada_fila: null,
    })
    .eq('id', pedidoDetalhe.value.id)

  if (updateErr) {
    savingCancelamento.value = false
    cancelamentoModalError.value = 'Erro ao cancelar pedido: ' + updateErr.message
    return
  }

  // Insert historico
  await supabase
    .from('pedidos_adesivo_historico')
    .insert({
      pedido_id: pedidoDetalhe.value.id,
      status_anterior: statusAnterior,
      status_novo: 'cancelado',
      observacao: `Cancelado: ${motivoTrimmed}`,
    })

  savingCancelamento.value = false
  fecharModalCancelamento()

  // Update local state
  pedidoDetalhe.value = { ...pedidoDetalhe.value!, status: 'cancelado' }
  showSuccess('Pedido cancelado com sucesso.')
  await Promise.all([fetchPedidos(), fetchFilaProducao()])
}

// ─── Types: Venda Catálogo ───────────────────────────────────────────────────
interface ProdutoCatalogo {
  id: number
  nome: string
  categoria: string
  material_id: number
  largura_cm: number
  altura_cm: number
  preco_venda: number
  ativo: boolean
  materiais_adesivo: { nome: string } | null
}

interface CarrinhoItem {
  produto_id: number
  nome: string
  preco_unitario: number
  quantidade: number
  largura_cm: number
  altura_cm: number
  material_id: number
}

// ─── State: Modal Venda Catálogo ─────────────────────────────────────────────
const modalVendaCatalogo = ref(false)
const savingVendaCatalogo = ref(false)
const vendaCatalogoModalError = ref<string | null>(null)
const buscaProdutoCatalogo = ref('')
const produtosCatalogo = ref<ProdutoCatalogo[]>([])
const carrinhoVenda = ref<CarrinhoItem[]>([])
const clientesVenda = ref<Cliente[]>([])

const formVendaCatalogo = reactive({
  cliente_id: null as number | null,
  descontoTipo: 'percentual' as 'percentual' | 'fixo',
  descontoValor: 0,
  formaPagamento: '',
})

const vendaCatalogoErrors = reactive({
  cliente_id: '',
  itens: '',
  desconto: '',
  formaPagamento: '',
})

// ─── Computed: Venda Catálogo ────────────────────────────────────────────────
const produtosCatalogoFiltrados = computed<ProdutoCatalogo[]>(() => {
  if (!buscaProdutoCatalogo.value.trim()) return []
  const termo = buscaProdutoCatalogo.value.trim().toLowerCase()
  return produtosCatalogo.value
    .filter(p => p.ativo && p.nome.toLowerCase().includes(termo))
    .filter(p => !carrinhoVenda.value.some(c => c.produto_id === p.id))
    .slice(0, 10)
})

const vendaCatalogoSubtotal = computed<number>(() => {
  return calcularTotalCarrinho(
    carrinhoVenda.value.map(item => ({ preco: item.preco_unitario, quantidade: item.quantidade }))
  )
})

const vendaCatalogoDescontoAplicado = computed<number>(() => {
  const subtotal = vendaCatalogoSubtotal.value
  if (subtotal <= 0) return 0
  if (formVendaCatalogo.descontoTipo === 'percentual') {
    return subtotal * ((formVendaCatalogo.descontoValor || 0) / 100)
  }
  return formVendaCatalogo.descontoValor || 0
})

const vendaCatalogoTotal = computed<number>(() => {
  return vendaCatalogoSubtotal.value - vendaCatalogoDescontoAplicado.value
})

// ─── Venda Catálogo: Funções ─────────────────────────────────────────────────
async function abrirModalVendaCatalogo() {
  // Reset state
  carrinhoVenda.value = []
  buscaProdutoCatalogo.value = ''
  formVendaCatalogo.cliente_id = null
  formVendaCatalogo.descontoTipo = 'percentual'
  formVendaCatalogo.descontoValor = 0
  formVendaCatalogo.formaPagamento = ''
  vendaCatalogoErrors.cliente_id = ''
  vendaCatalogoErrors.itens = ''
  vendaCatalogoErrors.desconto = ''
  vendaCatalogoErrors.formaPagamento = ''
  vendaCatalogoModalError.value = null

  modalVendaCatalogo.value = true

  // Load clientes and active products
  const [clientesRes, produtosRes] = await Promise.all([
    supabase
      .from('clientes')
      .select('id, nome')
      .eq('empresa_id', empresaId.value!)
      .order('nome', { ascending: true }),
    supabase
      .from('catalogo_adesivos')
      .select('id, nome, categoria, material_id, largura_cm, altura_cm, preco_venda, ativo, materiais_adesivo(nome)')
      .eq('empresa_id', empresaId.value!)
      .eq('ativo', true)
      .order('nome', { ascending: true }),
  ])

  clientesVenda.value = (clientesRes.data ?? []) as Cliente[]
  produtosCatalogo.value = (produtosRes.data ?? []) as unknown as ProdutoCatalogo[]
}

function fecharModalVendaCatalogo() {
  modalVendaCatalogo.value = false
}

function adicionarProdutoCarrinho(produto: ProdutoCatalogo) {
  // Check if product is inactive (extra safety)
  if (!produto.ativo) {
    showToastError('Este produto não está disponível para venda (inativo)')
    return
  }

  // Check if already in cart
  if (carrinhoVenda.value.some(c => c.produto_id === produto.id)) {
    return
  }

  carrinhoVenda.value.push({
    produto_id: produto.id,
    nome: produto.nome,
    preco_unitario: produto.preco_venda,
    quantidade: 1,
    largura_cm: produto.largura_cm,
    altura_cm: produto.altura_cm,
    material_id: produto.material_id,
  })

  buscaProdutoCatalogo.value = ''
}

function removerProdutoCarrinho(idx: number) {
  carrinhoVenda.value = carrinhoVenda.value.filter((_, i) => i !== idx)
}

function validarQuantidadeCarrinho(idx: number) {
  const item = carrinhoVenda.value[idx]
  if (!item) return
  if (item.quantidade < 1) item.quantidade = 1
  if (item.quantidade > 9999) item.quantidade = 9999
  item.quantidade = Math.floor(item.quantidade)
}

async function confirmarVendaCatalogo() {
  // Reset errors
  vendaCatalogoErrors.cliente_id = ''
  vendaCatalogoErrors.itens = ''
  vendaCatalogoErrors.desconto = ''
  vendaCatalogoErrors.formaPagamento = ''
  vendaCatalogoModalError.value = null

  // Validate cliente
  if (!formVendaCatalogo.cliente_id) {
    vendaCatalogoErrors.cliente_id = 'Selecione o cliente'
    return
  }

  // Validate at least 1 product
  if (carrinhoVenda.value.length === 0) {
    vendaCatalogoErrors.itens = 'Adicione ao menos 1 produto ao carrinho'
    return
  }

  // Validate forma de pagamento
  if (!formVendaCatalogo.formaPagamento) {
    vendaCatalogoErrors.formaPagamento = 'Selecione a forma de pagamento'
    return
  }

  // Validate discount
  if (formVendaCatalogo.descontoTipo === 'percentual' && (formVendaCatalogo.descontoValor < 0 || formVendaCatalogo.descontoValor > 100)) {
    vendaCatalogoErrors.desconto = 'Desconto percentual deve estar entre 0 e 100'
    return
  }
  if (formVendaCatalogo.descontoTipo === 'fixo' && formVendaCatalogo.descontoValor < 0) {
    vendaCatalogoErrors.desconto = 'Desconto em valor não pode ser negativo'
    return
  }

  // Validate total > 0
  if (vendaCatalogoTotal.value <= 0) {
    vendaCatalogoModalError.value = 'O valor total da venda deve ser maior que zero'
    return
  }

  savingVendaCatalogo.value = true

  try {
    // 1. Create venda record
    const { data: vendaData, error: vendaErr } = await supabase
      .from('vendas')
      .insert({
        empresa_id: empresaId.value!,
        cliente_id: formVendaCatalogo.cliente_id,
        preco_veiculo: Number(vendaCatalogoTotal.value.toFixed(2)),
        data_venda: new Date().toISOString().split('T')[0],
        status: 'concluida',
        forma_pagamento: formVendaCatalogo.formaPagamento,
        observacoes: `Venda catálogo - ${carrinhoVenda.value.length} produto(s)`,
      })
      .select('id')
      .single()

    if (vendaErr || !vendaData) {
      savingVendaCatalogo.value = false
      vendaCatalogoModalError.value = 'Erro ao registrar venda: ' + (vendaErr?.message ?? 'Falha ao criar venda')
      return
    }

    const vendaId = vendaData.id

    // 2. Insert vendas_itens for each product
    const itensToInsert = carrinhoVenda.value.map(item => ({
      venda_id: vendaId,
      produto_id: item.produto_id,
      descricao: item.nome,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
    }))

    const { error: itensErr } = await supabase
      .from('vendas_itens')
      .insert(itensToInsert)

    if (itensErr) {
      savingVendaCatalogo.value = false
      vendaCatalogoModalError.value = 'Erro ao registrar itens da venda: ' + itensErr.message
      return
    }

    // 3. Subtract stock for each product sold and register movements
    for (const item of carrinhoVenda.value) {
      // Calculate area consumed: (largura_cm * altura_cm * quantity) / 10000
      const areaConsumida = calcularArea(item.largura_cm, item.altura_cm, item.quantidade)

      // Get current stock for the material
      const { data: materialData } = await supabase
        .from('materiais_adesivo')
        .select('estoque_atual')
        .eq('id', item.material_id)
        .single()

      if (materialData) {
        const novoEstoque = Number(materialData.estoque_atual) - areaConsumida
        const novoEstoqueFormatado = Number(novoEstoque.toFixed(2))

        // Update stock
        await supabase
          .from('materiais_adesivo')
          .update({ estoque_atual: novoEstoqueFormatado })
          .eq('id', item.material_id)

        // Register stock movement
        await supabase
          .from('estoque_movimentacoes')
          .insert({
            empresa_id: empresaId.value!,
            material_id: item.material_id,
            tipo: 'saida',
            quantidade_m2: Number(areaConsumida.toFixed(2)),
            saldo_resultante: novoEstoqueFormatado,
            referencia_venda_id: vendaId,
            observacoes: `Venda catálogo - ${item.nome} (${item.quantidade}x)`,
          })
      }
    }

    savingVendaCatalogo.value = false
    fecharModalVendaCatalogo()
    showSuccess('Venda de catálogo registrada com sucesso!')
    await fetchPedidos()
  } catch (err: any) {
    savingVendaCatalogo.value = false
    vendaCatalogoModalError.value = 'Erro inesperado: ' + (err?.message ?? 'Falha desconhecida')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s ease-in; }
.slide-fade-enter-from { transform: translateY(10px); opacity: 0; }
.slide-fade-leave-to { transform: translateY(-5px); opacity: 0; }
</style>
