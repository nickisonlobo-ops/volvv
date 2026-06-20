<template>
  <div class="min-h-full p-3 sm:p-6">

    <!-- CABEÇALHO -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #0d9488, #059669))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />

      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Produção</span>
                <span class="w-1 h-1 rounded-full bg-white/40" />
                <span class="text-xs text-white/50 hidden sm:inline">Catálogo</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Catálogo de Produtos</h1>
              <p class="text-sm text-gray-300/80 mt-1.5">
                {{ loading ? 'Carregando...' : `${totalItems} produto(s) cadastrado(s)` }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
              :class="filtroAberto
                ? 'bg-white/20 text-white shadow-lg scale-[1.02]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
              @click="filtroAberto = !filtroAberto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              <span class="hidden sm:inline">Filtros</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-200 hover:scale-[1.02]"
              @click="abrirCriar"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span class="hidden sm:inline">Novo Produto</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FILTROS -->
    <Transition name="slide-fade">
      <div v-show="filtroAberto" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/70">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            <span class="text-sm font-bold text-gray-700">Filtros</span>
          </div>
          <button type="button" class="text-xs font-semibold text-teal-500 hover:text-teal-700 hover:underline" @click="limparFiltros">
            Limpar todos
          </button>
        </div>
        <div class="p-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Categoria</label>
            <select v-model="filtroCategoria" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">Todas</option>
              <option v-for="cat in categoriasUnicas" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Material</label>
            <select v-model="filtroMaterial" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">Todos</option>
              <option v-for="m in materiaisLista" :key="m.id" :value="m.id">{{ m.nome }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <select v-model="filtroStatus" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>
      </div>
    </Transition>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      <span class="text-sm text-gray-400 font-medium">Carregando catálogo...</span>
    </div>

    <!-- ERRO -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- TABELA / GRID -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-teal-600 font-black">{{ produtos.length }}</span>
          resultado(s) — Página {{ paginaAtual }} de {{ totalPaginas }}
        </span>
        <span class="text-xs text-gray-400">Ordenado por nome (A-Z)</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest w-16">Img</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Nome</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Categoria</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Material</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Dimensões</th>
              <th class="text-right px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Preço</th>
              <th class="text-center px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest w-24">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="produtos.length === 0">
              <td colspan="8" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  </svg>
                  <span class="text-base font-semibold text-gray-400">Nenhum produto encontrado</span>
                  <span class="text-sm text-gray-400">Tente ajustar os filtros ou adicione um novo produto</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="produto in produtos"
              :key="produto.id"
              class="hover:bg-teal-50/30 transition-colors duration-150 group"
            >
              <!-- Img -->
              <td class="px-5 py-3">
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img v-if="produto.imagem_url" :src="produto.imagem_url" :alt="produto.nome" class="w-full h-full object-cover" loading="lazy" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"/></svg>
                  </div>
                </div>
              </td>
              <!-- Nome -->
              <td class="px-5 py-3">
                <span class="font-semibold text-gray-800">{{ produto.nome }}</span>
              </td>
              <!-- Categoria -->
              <td class="px-5 py-3">
                <span class="text-sm text-gray-600">{{ produto.categoria }}</span>
              </td>
              <!-- Material -->
              <td class="px-5 py-3">
                <span class="text-sm text-gray-600">{{ produto.materiais_adesivo?.nome ?? '—' }}</span>
              </td>
              <!-- Dimensões -->
              <td class="px-5 py-3">
                <span class="text-sm text-gray-500">{{ produto.largura_cm }} × {{ produto.altura_cm }} cm</span>
              </td>
              <!-- Preço -->
              <td class="px-5 py-3 text-right">
                <span class="font-bold text-gray-800">{{ formatCurrency(produto.preco_venda) }}</span>
              </td>
              <!-- Status -->
              <td class="px-5 py-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                  :class="produto.ativo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'"
                  :title="produto.ativo ? 'Clique para desativar' : 'Clique para ativar'"
                  @click="toggleAtivo(produto)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="produto.ativo ? 'bg-green-500' : 'bg-red-500'" />
                  {{ produto.ativo ? 'Ativo' : 'Inativo' }}
                </button>
              </td>
              <!-- Ações -->
              <td class="px-6 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button type="button" class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-teal-500 hover:bg-teal-100 transition-colors" title="Editar" @click="abrirEditar(produto)">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINAÇÃO -->
      <div v-if="totalPaginas > 1" class="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/50">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="paginaAtual <= 1"
          @click="irParaPagina(paginaAtual - 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
          Anterior
        </button>
        <span class="text-sm text-gray-500 font-medium">
          Página <span class="font-bold text-gray-700">{{ paginaAtual }}</span> de <span class="font-bold text-gray-700">{{ totalPaginas }}</span>
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="paginaAtual >= totalPaginas"
          @click="irParaPagina(paginaAtual + 1)"
        >
          Próxima
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
        </button>
      </div>
    </div>

    <!-- MODAL CRIAR / EDITAR -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalAberto"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style="max-height:92vh">

            <!-- Header -->
            <div class="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 px-8 py-6 shrink-0">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.12),transparent_60%)] pointer-events-none" />
              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-teal-400 uppercase tracking-[0.2em] mb-0.5">{{ editandoProduto ? 'Editar' : 'Cadastrar' }}</p>
                    <h2 class="text-xl font-black text-white leading-none">{{ editandoProduto ? 'Editar Produto' : 'Novo Produto' }}</h2>
                  </div>
                </div>
                <button type="button" class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Form -->
            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto" @submit.prevent="salvar">

              <!-- Nome -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Nome *</label>
                <input
                  v-model="form.nome"
                  type="text"
                  maxlength="100"
                  placeholder="Nome do produto"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.nome ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                />
                <p v-if="formErrors.nome" class="text-xs text-red-500 font-semibold">{{ formErrors.nome }}</p>
              </div>

              <!-- Categoria -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Categoria *</label>
                <input
                  v-model="form.categoria"
                  type="text"
                  placeholder="Ex: Decorativo, Automotivo, Personalizado..."
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.categoria ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                />
                <p v-if="formErrors.categoria" class="text-xs text-red-500 font-semibold">{{ formErrors.categoria }}</p>
              </div>

              <!-- Material -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Material *</label>
                <select
                  v-model="form.material_id"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.material_id ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                >
                  <option :value="null">Selecione o material...</option>
                  <option v-for="m in materiaisAtivos" :key="m.id" :value="m.id">{{ m.nome }}</option>
                </select>
                <p v-if="formErrors.material_id" class="text-xs text-red-500 font-semibold">{{ formErrors.material_id }}</p>
              </div>

              <!-- Dimensões -->
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Largura (cm) *</label>
                  <input
                    v-model.number="form.largura_cm"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="500"
                    placeholder="0.0"
                    class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                    :class="formErrors.largura_cm ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                  />
                  <p v-if="formErrors.largura_cm" class="text-xs text-red-500 font-semibold">{{ formErrors.largura_cm }}</p>
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Altura (cm) *</label>
                  <input
                    v-model.number="form.altura_cm"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="500"
                    placeholder="0.0"
                    class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                    :class="formErrors.altura_cm ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                  />
                  <p v-if="formErrors.altura_cm" class="text-xs text-red-500 font-semibold">{{ formErrors.altura_cm }}</p>
                </div>
              </div>

              <!-- Preço -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Preço de Venda (R$) *</label>
                <input
                  v-model.number="form.preco_venda"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="999999.99"
                  placeholder="0.00"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-0 transition-all"
                  :class="formErrors.preco_venda ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-400'"
                />
                <p v-if="formErrors.preco_venda" class="text-xs text-red-500 font-semibold">{{ formErrors.preco_venda }}</p>
              </div>

              <!-- Descrição -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Descrição</label>
                <textarea
                  v-model="form.descricao"
                  rows="3"
                  maxlength="500"
                  placeholder="Descrição opcional do produto (máx 500 caracteres)"
                  class="w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:border-teal-400 transition-colors resize-none"
                  :class="formErrors.descricao ? 'border-red-400 bg-red-50' : 'border-gray-200'"
                />
                <p v-if="formErrors.descricao" class="text-xs text-red-500 font-semibold">{{ formErrors.descricao }}</p>
              </div>

              <!-- Upload Imagem -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Imagem de Referência *</label>
                <div class="flex items-center gap-4">
                  <!-- Preview -->
                  <div v-if="imagemPreview || form.imagem_url" class="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0">
                    <img :src="imagemPreview || form.imagem_url!" alt="Preview" class="w-full h-full object-cover" />
                  </div>
                  <!-- Input -->
                  <div class="flex-1">
                    <label
                      class="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed px-4 py-4 text-sm font-semibold cursor-pointer transition-all"
                      :class="formErrors.imagem_url ? 'border-red-300 text-red-400 hover:border-red-400 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/></svg>
                      <span>{{ imagemArquivo ? imagemArquivo.name : 'Selecionar imagem (PNG, JPG, WEBP - max 5MB)' }}</span>
                      <input type="file" accept="image/png,image/jpeg,image/webp" class="hidden" @change="onImagemSelecionada" />
                    </label>
                  </div>
                </div>
                <p v-if="formErrors.imagem_url" class="text-xs text-red-500 font-semibold">{{ formErrors.imagem_url }}</p>
              </div>

              <!-- Erro geral -->
              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <!-- Ações -->
              <div class="flex gap-3 pb-1">
                <button
                  type="button"
                  class="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-bold"
                  @click="fecharModal"
                >
                  Cancelar
                </button>
                <AppButton variant="primary" size="md" type="submit" :loading="saving" class="flex-1">
                  {{ editandoProduto ? 'Salvar Alterações' : 'Cadastrar Produto' }}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- TOAST DE SUCESSO -->
    <Transition name="slide-fade">
      <div v-if="toastMsg" class="fixed bottom-6 right-6 z-[100] bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg>
        {{ toastMsg }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from '~/composables/useEmpresa'
import { useAdesivos } from '~/composables/useAdesivos'
import AppButton from '~/components/AppButton.vue'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Produto {
  id: number
  nome: string
  descricao: string | null
  categoria: string
  material_id: number
  largura_cm: number
  altura_cm: number
  preco_venda: number
  imagem_url: string | null
  ativo: boolean
  materiais_adesivo?: { nome: string } | null
}

interface Material {
  id: number
  nome: string
  ativo: boolean
}

// ─── Composables ──────────────────────────────────────────────────────────────
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()
const { validarProdutoCatalogo, validarImagemProduto } = useAdesivos()

// ─── State ────────────────────────────────────────────────────────────────────
const produtos = ref<Produto[]>([])
const materiaisLista = ref<Material[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const toastMsg = ref('')

// Paginação
const PAGE_SIZE = 20
const paginaAtual = ref(1)
const totalItems = ref(0)
const totalPaginas = computed(() => Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE)))

// Filtros
const filtroAberto = ref(false)
const filtroCategoria = ref('')
const filtroMaterial = ref<number | string>('')
const filtroStatus = ref('')

// Modal
const modalAberto = ref(false)
const editandoProduto = ref<Produto | null>(null)
const saving = ref(false)
const modalError = ref<string | null>(null)
const imagemArquivo = ref<File | null>(null)
const imagemPreview = ref<string | null>(null)

const form = reactive({
  nome: '',
  categoria: '',
  material_id: null as number | null,
  largura_cm: null as number | null,
  altura_cm: null as number | null,
  preco_venda: null as number | null,
  descricao: '',
  imagem_url: null as string | null,
})

const formErrors = reactive({
  nome: '',
  categoria: '',
  material_id: '',
  largura_cm: '',
  altura_cm: '',
  preco_venda: '',
  descricao: '',
  imagem_url: '',
})

// ─── Computed ─────────────────────────────────────────────────────────────────
const materiaisAtivos = computed(() => materiaisLista.value.filter(m => m.ativo))

const categoriasUnicas = computed(() => {
  const cats = new Set<string>()
  // Use all known categories from the full dataset context
  produtos.value.forEach(p => cats.add(p.categoria))
  return Array.from(cats).sort()
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(val: number | null | undefined): string {
  if (val == null) return 'R$ 0,00'
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function showToast(msg: string) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

function limparFiltros() {
  filtroCategoria.value = ''
  filtroMaterial.value = ''
  filtroStatus.value = ''
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchProdutos() {
  if (!empresaId.value) return
  loading.value = true
  error.value = null

  try {
    let query = supabase
      .from('catalogo_adesivos')
      .select('*, materiais_adesivo(nome)', { count: 'exact' })
      .eq('empresa_id', empresaId.value)
      .order('nome', { ascending: true })

    // Filtros
    if (filtroCategoria.value) {
      query = query.eq('categoria', filtroCategoria.value)
    }
    if (filtroMaterial.value) {
      query = query.eq('material_id', filtroMaterial.value)
    }
    if (filtroStatus.value === 'ativo') {
      query = query.eq('ativo', true)
    } else if (filtroStatus.value === 'inativo') {
      query = query.eq('ativo', false)
    }

    // Paginação
    const from = (paginaAtual.value - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: fetchErr, count } = await query

    if (fetchErr) throw fetchErr

    produtos.value = (data ?? []) as Produto[]
    totalItems.value = count ?? 0
  } catch (e: any) {
    error.value = e.message || 'Erro ao carregar produtos'
    console.error('[adesivos-catalogo] fetchProdutos error:', e)
  } finally {
    loading.value = false
  }
}

async function fetchMateriais() {
  if (!empresaId.value) return

  const { data } = await supabase
    .from('materiais_adesivo')
    .select('id, nome, ativo')
    .eq('empresa_id', empresaId.value)
    .order('nome', { ascending: true })

  materiaisLista.value = (data ?? []) as Material[]
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function irParaPagina(pagina: number) {
  if (pagina < 1 || pagina > totalPaginas.value) return
  paginaAtual.value = pagina
  fetchProdutos()
}

// Reset page on filter change
watch([filtroCategoria, filtroMaterial, filtroStatus], () => {
  paginaAtual.value = 1
  fetchProdutos()
})

// ─── Toggle Ativo ─────────────────────────────────────────────────────────────
async function toggleAtivo(produto: Produto) {
  const novoStatus = !produto.ativo
  const { error: updateErr } = await supabase
    .from('catalogo_adesivos')
    .update({ ativo: novoStatus })
    .eq('id', produto.id)

  if (updateErr) {
    showToast('Erro ao atualizar status')
    console.error(updateErr)
    return
  }

  produto.ativo = novoStatus
  showToast(novoStatus ? 'Produto ativado' : 'Produto desativado')
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function resetForm() {
  form.nome = ''
  form.categoria = ''
  form.material_id = null
  form.largura_cm = null
  form.altura_cm = null
  form.preco_venda = null
  form.descricao = ''
  form.imagem_url = null
  imagemArquivo.value = null
  imagemPreview.value = null
  modalError.value = null
  Object.keys(formErrors).forEach(k => (formErrors as any)[k] = '')
}

function abrirCriar() {
  resetForm()
  editandoProduto.value = null
  modalAberto.value = true
}

function abrirEditar(produto: Produto) {
  resetForm()
  editandoProduto.value = produto
  form.nome = produto.nome
  form.categoria = produto.categoria
  form.material_id = produto.material_id
  form.largura_cm = produto.largura_cm
  form.altura_cm = produto.altura_cm
  form.preco_venda = produto.preco_venda
  form.descricao = produto.descricao ?? ''
  form.imagem_url = produto.imagem_url
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  editandoProduto.value = null
}

// ─── Image handling ───────────────────────────────────────────────────────────
function onImagemSelecionada(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validate using composable
  const validation = validarImagemProduto({ name: file.name, size: file.size, type: file.type })
  if (!validation.valid) {
    formErrors.imagem_url = Object.values(validation.errors).join('. ')
    input.value = ''
    return
  }

  formErrors.imagem_url = ''
  imagemArquivo.value = file
  imagemPreview.value = URL.createObjectURL(file)
}

async function uploadImagem(): Promise<string | null> {
  if (!imagemArquivo.value || !empresaId.value) return null

  const ext = imagemArquivo.value.name.split('.').pop()?.toLowerCase() ?? 'png'
  const fileName = `${empresaId.value}/catalogo/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from('artes-cliente')
    .upload(fileName, imagemArquivo.value, {
      contentType: imagemArquivo.value.type,
      upsert: false,
    })

  if (uploadErr) {
    throw new Error(`Erro no upload: ${uploadErr.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('artes-cliente')
    .getPublicUrl(fileName)

  return urlData.publicUrl
}

// ─── Save ─────────────────────────────────────────────────────────────────────
async function salvar() {
  // Clear errors
  Object.keys(formErrors).forEach(k => (formErrors as any)[k] = '')
  modalError.value = null

  // Validate with composable
  const validation = validarProdutoCatalogo({
    nome: form.nome,
    categoria: form.categoria,
    material_id: form.material_id,
    largura_cm: form.largura_cm,
    altura_cm: form.altura_cm,
    preco_venda: form.preco_venda,
    descricao: form.descricao || null,
    imagem_url: form.imagem_url,
  })

  // Check image requirement (must have image for new products)
  if (!editandoProduto.value && !imagemArquivo.value && !form.imagem_url) {
    validation.valid = false
    validation.errors.imagem_url = 'Imagem é obrigatória'
  }

  if (!validation.valid) {
    // Map errors to formErrors
    Object.entries(validation.errors).forEach(([key, msg]) => {
      if (key in formErrors) (formErrors as any)[key] = msg
    })
    return
  }

  saving.value = true

  try {
    // Upload image if a new file was selected
    let imagemUrl = form.imagem_url
    if (imagemArquivo.value) {
      imagemUrl = await uploadImagem()
    }

    const payload = {
      nome: form.nome.trim(),
      categoria: form.categoria.trim(),
      material_id: form.material_id!,
      largura_cm: form.largura_cm!,
      altura_cm: form.altura_cm!,
      preco_venda: form.preco_venda!,
      descricao: form.descricao?.trim() || null,
      imagem_url: imagemUrl,
      empresa_id: empresaId.value!,
    }

    if (editandoProduto.value) {
      // UPDATE
      const { error: updateErr } = await supabase
        .from('catalogo_adesivos')
        .update(payload)
        .eq('id', editandoProduto.value.id)

      if (updateErr) throw updateErr
      showToast('Produto atualizado com sucesso')
    } else {
      // INSERT
      const { error: insertErr } = await supabase
        .from('catalogo_adesivos')
        .insert(payload)

      if (insertErr) throw insertErr
      showToast('Produto cadastrado com sucesso')
    }

    fecharModal()
    await fetchProdutos()
  } catch (e: any) {
    modalError.value = e.message || 'Erro ao salvar produto'
    console.error('[adesivos-catalogo] salvar error:', e)
  } finally {
    saving.value = false
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadEmpresa()
  await Promise.all([fetchProdutos(), fetchMateriais()])
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


