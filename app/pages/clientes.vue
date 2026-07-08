<template>
  <PageShell
    title="Clientes"
    eyebrow="CRM"
    eyebrow-muted="UpStudio"
    :subtitle="loading ? 'Carregando...' : `${clientesFiltrados.length} de ${clientes.length} cliente(s) exibido(s)`"
  >

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� CABE�?ALHO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <template #icon>
      <svg class="w-5 sm:w-7 h-5 sm:h-7" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.5 0a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-1.5 6.75a3.375 3.375 0 00-6.75 0h6.75z"/></svg>
    </template>

    <template #actions>
      <button
        type="button"
        class="inline-flex items-center gap-2 text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl transition-all duration-200"
        :class="filtroAberto
          ? 'bg-white text-primary shadow-lg scale-[1.02]'
          : 'bg-white/10 text-white hover:bg-white/20 border border-white/15 backdrop-blur-sm'"
        @click="filtroAberto = !filtroAberto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
        <span class="hidden sm:inline">Filtros</span>
        <span v-if="filtrosAtivos > 0" class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-white text-primary text-xs font-black">{{ filtrosAtivos }}</span>
      </button>
      <button
        v-if="isAdminOrGerente"
        type="button"
        class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02]"
        @click="abrirAdicionar"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        <span class="hidden sm:inline">Adicionar Cliente</span>
      </button>
    </template>

    <!-- Stats (cards claros no painel) -->
    <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <div style="background:#fff;border:1px solid #ecece9;border-radius:16px;padding:15px 16px;box-shadow:0 1px 2px rgba(0,0,0,.02)">
        <div style="font-size:11px;font-weight:700;color:#6b7079;text-transform:uppercase;letter-spacing:.5px">Total</div>
        <div style="font-size:24px;font-weight:800;color:#0f1216;letter-spacing:-.5px;margin:6px 0 2px">{{ clientes.length }}</div>
        <div style="font-size:11.5px;color:#8b9099">cliente(s)</div>
      </div>
      <div style="background:#fff;border:1px solid #ecece9;border-radius:16px;padding:15px 16px;box-shadow:0 1px 2px rgba(0,0,0,.02)">
        <div style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:#16a34a"></span><div style="font-size:11px;font-weight:700;color:#6b7079;text-transform:uppercase;letter-spacing:.5px">Ativos</div></div>
        <div style="font-size:24px;font-weight:800;color:#0f1216;letter-spacing:-.5px;margin:6px 0 2px">{{ clientesAtivos }}</div>
        <div style="font-size:11.5px;color:#8b9099">habilitados</div>
      </div>
      <div style="background:#fff;border:1px solid #ecece9;border-radius:16px;padding:15px 16px;box-shadow:0 1px 2px rgba(0,0,0,.02)">
        <div style="font-size:11px;font-weight:700;color:#6b7079;text-transform:uppercase;letter-spacing:.5px">Com E-mail</div>
        <div style="font-size:24px;font-weight:800;color:#0f1216;letter-spacing:-.5px;margin:6px 0 2px">{{ comEmail }}</div>
        <div style="font-size:11.5px;color:#8b9099">de {{ clientes.length }} cadastrados</div>
      </div>
      <div style="background:#fff;border:1px solid #ecece9;border-radius:16px;padding:15px 16px;box-shadow:0 1px 2px rgba(0,0,0,.02)">
        <div style="font-size:11px;font-weight:700;color:#6b7079;text-transform:uppercase;letter-spacing:.5px">Cidades</div>
        <div style="font-size:24px;font-weight:800;color:#0f1216;letter-spacing:-.5px;margin:6px 0 2px">{{ cidadesUnicas.length }}</div>
        <div style="font-size:11.5px;color:#8b9099">distintas</div>
      </div>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� FILTRO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Transition name="slide-fade">
      <div v-show="filtroAberto" class="bg-white rounded-3xl border border-gray-100 shadow-md mb-6 overflow-hidden">
        <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/70">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
            <span class="text-sm font-bold text-gray-700">Filtros</span>
          </div>
          <button v-if="filtrosAtivos > 0" type="button" class="text-xs font-semibold text-primary hover:text-primary hover:underline" @click="limparFiltros">
            Limpar todos
          </button>
        </div>
        <div class="p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          <div class="sm:col-span-2 flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Busca</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
              <input v-model="filtros.busca" type="text" :placeholder="locale.pais === 'PT' ? 'Nome, NIF, telefone ou e-mail...' : 'Nome, CPF/CNPJ, telefone ou e-mail...'" class="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)] transition-shadow" />
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Cidade</label>
            <select v-model="filtros.cidade" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Todas</option>
              <option v-for="c in cidadesUnicas" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Nicho</label>
            <select v-model="filtros.nicho" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Todos</option>
              <option v-for="n in nichos" :key="n.id" :value="n.nome">{{ n.nome }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">País</label>
            <select v-model="filtros.pais" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
              <option value="">Todos</option>
              <option v-for="p in paisesUnicos" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <div class="flex gap-2">
              <button
                v-for="op in [{ label: 'Todos', value: '' }, { label: 'Ativo', value: 'true' }, { label: 'Inativo', value: 'false' }]"
                :key="op.value"
                type="button"
                class="flex-1 text-xs font-bold py-2 rounded-xl border transition-colors"
                :class="filtros.ativo === op.value
                  ? 'bg-primary border-primary text-white'
                  : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white'"
                @click="filtros.ativo = op.value"
              >
                {{ op.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══ Toggle Lista / Kanban ═══ -->
    <div class="flex items-center justify-end mb-4">
      <div class="flex rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
          :class="viewMode === 'list' ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
          :style="viewMode === 'list' ? { background: 'var(--color-primary)' } : {}"
          @click="viewMode = 'list'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
          Lista
        </button>
        <button type="button" class="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
          :class="viewMode === 'kanban' ? 'text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
          :style="viewMode === 'kanban' ? { background: 'var(--color-primary)' } : {}"
          @click="viewMode = 'kanban'">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>
          Kanban
        </button>
      </div>
    </div>

    <!-- ═══ MODO LISTA ═══ -->
    <div v-if="viewMode === 'list'">
      <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-32">
      <span class="spinner spinner-lg" />
      <span class="text-sm text-gray-400 font-medium">Carregando clientes...</span>
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� ERRO �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else-if="error" class="flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
      {{ error }}
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� TABELA �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <div v-else class="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden">
      <div class="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
        <span class="text-sm font-semibold text-gray-600">
          <span class="text-primary font-black">{{ clientesFiltrados.length }}</span>
          resultado(s)
          <span v-if="filtrosAtivos > 0" class="text-gray-400 font-normal"> �?" filtros aplicados</span>
        </span>
        <span class="text-xs text-gray-400">Ordenado por nome</span>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm whitespace-nowrap">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="text-left px-7 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">#</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Nome</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">{{ locale.pais === 'PT' ? 'NIF' : 'CPF / CNPJ' }}</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Telefone</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">E-mail</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">{{ locale.pais === 'PT' ? 'Cidade / Distrito' : 'Cidade / Estado' }}</th>
              <th class="text-left px-5 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-7 py-4 text-right text-xs font-extrabold text-gray-400 uppercase tracking-widest sm:sticky sm:right-0 bg-gray-50">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="clientesFiltrados.length === 0">
              <td colspan="8" class="text-center py-20">
                <div class="flex flex-col items-center gap-3">
                  <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.5 0a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-1.5 6.75a3.375 3.375 0 00-6.75 0h6.75z"/></svg>
                  <span class="text-base font-semibold text-gray-400">Nenhum cliente encontrado</span>
                  <span v-if="filtrosAtivos > 0" class="text-sm text-gray-400">Tente ajustar os filtros</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="cli in clientesFiltrados"
              :key="cli.id"
              class="hover:bg-primary-5/40 transition-colors duration-150 group"
            >
              <td class="px-7 py-4">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-10 text-primary font-black text-xs">
                  {{ cli.id }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-text font-black text-sm shrink-0 shadow-sm select-none">
                    {{ initials(cli.nome) }}
                  </div>
                  <button
                    type="button"
                    class="font-semibold text-gray-800 max-w-[160px] block truncate hover:text-primary transition-colors cursor-pointer"
                    @click="abrirDetalhesCliente(cli)"
                  >
                    {{ cli.nome }}
                  </button>
                </div>
              </td>
              <td class="px-5 py-4">
                <span v-if="cli.cpf_cnpj" class="font-mono text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{{ cli.cpf_cnpj }}</span>
                <span v-else class="text-gray-300">-</span>
              </td>
              <td class="px-5 py-4 text-gray-500 font-medium">{{ cli.telefone ?? '-' }}</td>
              <td class="px-5 py-4 text-gray-500 font-medium">
                <span class="max-w-[180px] block truncate">{{ cli.email ?? '-' }}</span>
              </td>
              <td class="px-5 py-4">
                <span v-if="cli.cidade || cli.estado" class="text-gray-600 font-medium">
                  {{ [cli.cidade, cli.estado].filter(Boolean).join(' / ') }}
                </span>
                <span v-else class="text-gray-300">-</span>
              </td>
              <td class="px-5 py-4">
                <span
                  :class="['inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full',
                    cli.ativo !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']"
                >
                  <span :class="['w-1.5 h-1.5 rounded-full', cli.ativo !== false ? 'bg-green-500' : 'bg-gray-400']" />
                  {{ cli.ativo !== false ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-7 py-4 text-right sm:sticky sm:right-0 group-hover:bg-primary-5/40 transition-colors">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-if="cli.telefone"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-green-500 hover:bg-green-50 transition-colors"
                    title="WhatsApp"
                    @click="abrirWhatsApp(cli)"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </button>
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-primary hover:bg-primary-10 transition-colors"
                    title="Editar"
                    @click="editCliente(cli)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125L18 8.625"/></svg>
                  </button>
                  <button
                    v-if="isAdminOrGerente"
                    type="button"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm text-red-400 hover:bg-red-50 transition-colors"
                    title="Excluir"
                    @click="confirmarExclusao(cli)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <!-- ═══ MODO KANBAN ═══ -->
    <div v-else-if="viewMode === 'kanban'">
      <KanbanBoard pipeline-tipo="crm" :filter-fn="kanbanFilterFn" @card-click="onKanbanCardClick" />
    </div>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� MODAL ADICIONAR / EDITAR �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="editando !== null || adicionando"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="fecharModal"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.5 0a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm-1.5 6.75a3.375 3.375 0 00-6.75 0h6.75z"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">{{ adicionando ? 'Adicionar Cliente' : 'Editar Cliente' }}</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="fecharModal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form class="flex flex-col gap-5 px-8 py-7 overflow-y-auto max-h-[70vh]" @submit.prevent="adicionando ? salvarAdicao() : salvarEdicao()">
              <!-- Nome + CPF/CNPJ -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.nome" label="Nome *" placeholder="Ex: João da Silva" :error="formErrors.nome" required />
                <AppInput v-model="form.cpf_cnpj" :label="locale.pais === 'PT' ? 'NIF' : 'CPF / CNPJ'" :placeholder="locale.pais === 'PT' ? '123 456 789' : '000.000.000-00'" :error="formErrors.cpf_cnpj" />
              </div>
              <!-- Nome da Empresa -->
              <AppInput v-model="form.nome_empresa" label="Nome da Empresa" placeholder="Ex: Clínica Veterinária ABC" />
              <!-- Telefone + E-mail -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.telefone" label="Telefone" placeholder="Ex: (11) 99999-9999" />
                <AppInput v-model="form.email" label="E-mail" type="email" placeholder="Ex: joao@email.com" :error="formErrors.email" />
              </div>
              <!-- Endereço + Número -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <AppInput v-model="form.endereco" :label="locale.pais === 'PT' ? 'Morada' : 'Endereço'" :placeholder="locale.pais === 'PT' ? 'Ex: Rua Augusta' : 'Ex: Rua das Flores'" />
                </div>
                <AppInput v-model="form.numero" label="Número" placeholder="Ex: 123" />
              </div>
              <!-- Bairro/Localidade + CEP/Código Postal -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.bairro" :label="locale.pais === 'PT' ? 'Localidade' : 'Bairro'" :placeholder="locale.pais === 'PT' ? 'Ex: Alfama' : 'Ex: Centro'" />
                <AppInput v-model="form.cep" :label="locale.pais === 'PT' ? 'Código Postal' : 'CEP'" :placeholder="locale.pais === 'PT' ? '1000-001' : '00000-000'" />
              </div>
              <!-- Cidade + Estado/Distrito -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppInput v-model="form.cidade" label="Cidade" placeholder="Ex: São Paulo" />
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">{{ locale.pais === 'PT' ? 'Distrito' : 'Estado' }}</label>
                  <select v-model="form.estado" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Selecione</option>
                    <option v-for="uf in locale.pais === 'PT' ? distritosPortugal : ufs" :key="uf" :value="uf">{{ uf }}</option>
                  </select>
                </div>
              </div>
              <!-- País -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">País</label>
                <select v-model="form.pais" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Selecione</option>
                  <option v-for="p in paises" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
              <!-- Observação -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Observação</label>
                <textarea
                  v-model="form.observacao"
                  rows="2"
                  placeholder="Informações adicionais..."
                  class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#6b7280)] focus:border-[var(--color-primary,#6b7280)] resize-none"
                />
              </div>
              <!-- Nicho -->
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-semibold text-gray-700">Nicho</label>
                  <button type="button" class="text-xs font-semibold text-primary hover:underline" @click="modalNichosAberto = true">Gerenciar nichos</button>
                </div>
                <select v-model="form.nicho" class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Selecione um nicho</option>
                  <option v-for="n in nichos" :key="n.id" :value="n.nome">{{ n.nome }}</option>
                </select>
              </div>
              <!-- Ativo -->
              <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <button
                  type="button"
                  class="relative w-11 h-6 rounded-full transition-colors duration-200"
                  :class="form.ativo ? 'bg-green-500' : 'bg-gray-300'"
                  @click="form.ativo = !form.ativo"
                >
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200" :class="form.ativo ? 'translate-x-5' : 'translate-x-0'" />
                </button>
                <div>
                  <p class="text-sm font-semibold text-gray-700">Cliente ativo</p>
                  <p class="text-xs text-gray-400">{{ form.ativo ? 'Habilitado para novas vendas' : 'Desativado' }}</p>
                </div>
              </div>

              <p v-if="modalError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{{ modalError }}</p>

              <!-- Botões de ação rápida (só no modo edição) -->
              <div v-if="editando" class="flex flex-wrap gap-2 pt-2">
                <button
                  v-if="editando.telefone"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors"
                  @click="abrirWhatsApp(editando)"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
                <a
                  v-if="editando.telefone"
                  :href="`tel:${editando.telefone.replace(/\\D/g, '')}`"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  Ligar
                </a>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-500 text-white rounded-xl text-xs font-bold hover:bg-purple-600 transition-colors"
                  @click="abrirHistoricoDoEdit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Histórico
                </button>
              </div>

              <div class="flex gap-3 pt-1">
                <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="fecharModal">
                  Cancelar
                </button>
                <AppButton variant="primary" size="md" type="submit" :loading="saving" class="flex-1">
                  {{ adicionando ? 'Adicionar' : 'Salvar alterações' }}
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� MODAL EXCLUIR �.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.��.� -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="excluindo"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="excluindo = null"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div class="px-8 pt-8 pb-6 text-center">
              <div class="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-1-1V5a1 1 0 011-1h8a1 1 0 011 1v1a1 1 0 01-1 1H9z"/></svg>
              </div>
              <h2 class="text-xl font-bold text-gray-800">Excluir cliente?</h2>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed">
                Tem certeza que deseja excluir <br /><strong class="text-gray-800">{{ excluindo.nome }}</strong>?<br />
                <span class="text-red-500 text-xs font-semibold">Essa ação não pode ser desfeita.</span>
              </p>
            </div>
            <p v-if="deleteError" class="text-sm text-red-600 bg-red-50 border-t border-b border-red-200 px-8 py-3 text-center">{{ deleteError }}</p>
            <div class="flex gap-3 px-8 pb-8 pt-4">
              <button type="button" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm font-semibold" @click="excluindo = null">
                Cancelar
              </button>
              <button
                type="button"
                class="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-sm shadow-red-200 disabled:opacity-60"
                :disabled="deleting"
                @click="executarExclusao"
              >
                <span v-if="deleting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                {{ deleting ? 'Excluindo...' : 'Excluir' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 🏷️ MODAL GERENCIAR NICHOS -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalNichosAberto"
          class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="modalNichosAberto = false"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div class="flex items-center justify-between px-8 py-6 border-b border-white/10" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))' }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"/></svg>
                </div>
                <h2 class="text-lg font-bold text-white">Gerenciar Nichos</h2>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors" @click="modalNichosAberto = false">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="px-8 py-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              <!-- Adicionar novo nicho -->
              <div class="flex gap-2">
                <input
                  v-model="novoNicho"
                  type="text"
                  placeholder="Novo nicho..."
                  class="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  @keyup.enter="adicionarNicho"
                />
                <button
                  type="button"
                  class="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  :disabled="nichoSaving || !novoNicho.trim()"
                  @click="adicionarNicho"
                >
                  Adicionar
                </button>
              </div>

              <p v-if="nichoError" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{{ nichoError }}</p>

              <!-- Lista de nichos -->
              <div v-if="nichos.length === 0" class="text-center text-sm text-gray-400 py-6">
                Nenhum nicho cadastrado.
              </div>
              <ul class="flex flex-col gap-2">
                <li v-for="n in nichos" :key="n.id" class="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <template v-if="nichoEditando?.id === n.id">
                    <input
                      v-model="nichoEditandoNome"
                      type="text"
                      class="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      @keyup.enter="salvarEdicaoNicho"
                    />
                    <button type="button" class="text-green-600 hover:text-green-700 text-xs font-semibold" @click="salvarEdicaoNicho">Salvar</button>
                    <button type="button" class="text-gray-400 hover:text-gray-600 text-xs font-semibold" @click="cancelarEdicaoNicho">Cancelar</button>
                  </template>
                  <template v-else>
                    <span class="flex-1 text-sm text-gray-700 font-medium">{{ n.nome }}</span>
                    <button type="button" class="text-gray-400 hover:text-primary text-xs font-semibold" @click="iniciarEdicaoNicho(n)">Editar</button>
                    <button type="button" class="text-gray-400 hover:text-red-500 text-xs font-semibold" @click="removerNicho(n)">Remover</button>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL DE DETALHES DO CLIENTE -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalDetalhesAberto"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          @click.self="fecharDetalhes"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <!-- CABEÇALHO -->
            <div class="sticky top-0 flex items-center justify-between px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ clienteSelecionado?.nome }}</h2>
                <p class="text-sm text-gray-500 mt-1">Detalhes do cliente</p>
              </div>
              <button
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                @click="fecharDetalhes"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- CONTEÚDO -->
            <div class="px-6 sm:px-8 py-6 space-y-6">
              <!-- INFORMAÇÕES BÁSICAS -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-2xl p-4">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Telefone</span>
                  <p class="text-lg font-bold text-gray-900 mt-2">{{ clienteSelecionado?.telefone || '—' }}</p>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</span>
                  <p class="text-lg font-bold text-gray-900 mt-2 truncate">{{ clienteSelecionado?.email || '—' }}</p>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{ locale.pais === 'PT' ? 'NIF' : 'CPF/CNPJ' }}</span>
                  <p class="text-lg font-bold text-gray-900 mt-2">{{ clienteSelecionado?.cpf_cnpj || '—' }}</p>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4 sm:col-span-2">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{ locale.pais === 'PT' ? 'Morada' : 'Endereço' }}</span>
                  <p class="text-lg font-bold text-gray-900 mt-2">
                    {{ clienteSelecionado ? formatarEndereco(clienteSelecionado) : '—' }}
                  </p>
                </div>
                <div class="bg-gray-50 rounded-2xl p-4">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
                  <div class="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                    :class="clienteSelecionado?.ativo
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'"
                  >
                    <span class="w-2 h-2 rounded-full"
                      :class="clienteSelecionado?.ativo ? 'bg-green-600' : 'bg-red-600'"
                    />
                    {{ clienteSelecionado?.ativo ? 'Ativo' : 'Inativo' }}
                  </div>
                </div>
              </div>

              <!-- BOTÕES DE AÇÃO -->
              <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <button
                  v-if="clienteSelecionado?.telefone"
                  @click="abrirWhatsApp(clienteSelecionado!)"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
                <a
                  v-if="clienteSelecionado?.telefone"
                  :href="`tel:${clienteSelecionado.telefone.replace(/\D/g, '')}`"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  Ligar
                </a>
                <button
                  @click="modalHistoricoAberto = true"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Histórico
                </button>
                <button
                  v-if="isAdminOrGerente"
                  @click="editCliente(clienteSelecionado!)"
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              </div>

              <!-- HISTÓRICO DE ATENDIMENTOS -->
              <div class="border-t border-gray-100 pt-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
                  <span>Histórico de Atendimentos</span>
                  <span class="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg bg-primary-10 text-primary text-sm font-bold">
                    {{ atendimentosCliente.length }}
                  </span>
                </h3>

                <div v-if="carregandoAtendimentos" class="flex items-center justify-center gap-3 py-8">
                  <span class="spinner spinner-md" />
                  <span class="text-sm text-gray-500">Carregando atendimentos...</span>
                </div>

                <div v-else-if="atendimentosCliente.length === 0" class="py-8 text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm">Nenhum atendimento registrado</p>
                </div>

                <div v-else class="space-y-3 max-h-[300px] overflow-y-auto">
                  <div
                    v-for="atendimento in atendimentosCliente"
                    :key="atendimento.id"
                    class="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div class="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p class="text-sm font-bold text-gray-500 uppercase tracking-widest">
                          {{ formatarData(atendimento.data_hora) }}
                        </p>
                        <p class="text-base font-bold text-gray-900">
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
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                      <div v-if="atendimento.funcionario">
                        <span class="text-gray-500 text-xs">Profissional</span>
                        <p class="font-semibold text-gray-900">{{ atendimento.funcionario }}</p>
                      </div>
                      <div>
                        <span class="text-gray-500 text-xs">Valor</span>
                        <p class="font-semibold text-gray-900">{{ formatarValor(atendimento.valor_total) }}</p>
                      </div>
                      <div v-if="atendimento.observacoes" class="sm:col-span-3">
                        <span class="text-gray-500 text-xs">Observações</span>
                        <p class="font-semibold text-gray-900 line-clamp-2">{{ atendimento.observacoes }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- MODAL ENVIAR MENSAGEM (DENTRO DO MODAL PRINCIPAL) -->
              <div v-if="modalMensagem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
                  <div class="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gray-50/50">
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
                  <div class="px-6 sm:px-8 py-6 space-y-4">
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Para</label>
                      <p class="text-lg font-bold text-gray-900 mt-2">{{ clienteSelecionado?.nome }}</p>
                    </div>
                    <div>
                      <label class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Mensagem</label>
                      <textarea
                        v-model="formularioMensagem.conteudo"
                        placeholder="Digite sua mensagem aqui..."
                        rows="5"
                        class="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
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
                  <div class="flex gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                      type="button"
                      class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-bold text-sm"
                      @click="fecharModalMensagem"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      class="flex-1 py-3 rounded-xl bg-primary text-primary-text hover:shadow-lg hover:scale-[1.02] transition-all font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 🕐 MODAL HISTÓRICO -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modalHistoricoAberto"
          class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          @click.self="modalHistoricoAberto = false"
        >
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Histórico de Atendimentos</h2>
                <p class="text-sm text-gray-500 mt-0.5">{{ clienteSelecionado?.nome }}</p>
              </div>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors" @click="modalHistoricoAberto = false">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto px-8 py-6">
              <div v-if="carregandoHistorico" class="flex items-center justify-center gap-3 py-8">
                <span class="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span class="text-sm text-gray-500">Carregando...</span>
              </div>
              <div v-else-if="historicoMovimentacoes.length === 0" class="py-12 text-center">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p class="text-sm text-gray-400">Nenhuma movimentação registrada</p>
              </div>
              <div v-else class="space-y-3">
                <div v-for="mov in historicoMovimentacoes" :key="mov.id" class="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div class="w-8 h-8 rounded-full bg-primary-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-800">
                      <span class="font-semibold text-red-500">{{ mov.etapa_origem }}</span>
                      <span class="text-gray-400 mx-1.5">→</span>
                      <span class="font-semibold text-green-600">{{ mov.etapa_destino }}</span>
                    </p>
                    <p class="text-xs text-gray-400 mt-1">{{ formatarDataHistorico(mov.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </PageShell>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useAdmin } from '~/composables/useAdmin'
import { useEmpresa } from '~/composables/useEmpresa'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'
import KanbanBoard from '~/components/kanban/KanbanBoard.vue'
import type { KanbanCard } from '~/composables/useKanban'

interface Nicho {
  id: number
  nome: string
  empresa_id: number
}

interface Cliente {
  id: number
  nome: string
  cpf_cnpj: string | null
  telefone: string | null
  email: string | null
  endereco: string | null
  numero: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  observacao: string | null
  ativo: boolean | null
  created_at: string | null
  nicho: string | null
  nome_empresa: string | null
  pais: string | null
}

const supabase = createSupabaseClient()
const router = useRouter()
const { empresaId, loadEmpresa } = useEmpresa()
const { isAdminOrGerente } = useAdmin()
const { locale } = useLocale()

const clientes = ref<Cliente[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const viewMode = ref<'list' | 'kanban'>('kanban')

const editando = ref<Cliente | null>(null)
const adicionando = ref(false)
const saving = ref(false)
const modalError = ref<string | null>(null)

const excluindo = ref<Cliente | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

const clienteSelecionado = ref<Cliente | null>(null)
const modalDetalhesAberto = ref(false)
const modalHistoricoAberto = ref(false)
const historicoMovimentacoes = ref<any[]>([])
const carregandoHistorico = ref(false)
const carregandoAtendimentos = ref(false)
const atendimentosCliente = ref<any[]>([])
const modalMensagem = ref(false)
const formularioMensagem = reactive({ conteudo: '' })
const enviarMensagemLoading = ref(false)
const erroMensagem = ref<string | null>(null)

const form = reactive({
  nome: '',
  cpf_cnpj: '',
  telefone: '',
  email: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  observacao: '',
  ativo: true,
  nicho: '',
  nome_empresa: '',
  pais: '',
})

const formErrors = reactive({ nome: '', cpf_cnpj: '', email: '' })

const filtroAberto = ref(false)
const filtros = reactive({ busca: '', cidade: '', ativo: '', nicho: '', pais: '' })

const distritosPortugal = ['Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre', 'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu', 'Açores', 'Madeira']

// 🏷️ Nichos (categorias)
const nichos = ref<Nicho[]>([])
const modalNichosAberto = ref(false)
const novoNicho = ref('')
const nichoEditando = ref<Nicho | null>(null)
const nichoEditandoNome = ref('')
const nichoSaving = ref(false)
const nichoError = ref<string | null>(null)

async function fetchNichos() {
  if (!empresaId.value) return
  const { data } = await supabase
    .from('nichos')
    .select('*')
    .eq('empresa_id', empresaId.value)
    .order('nome', { ascending: true })
  nichos.value = (data ?? []) as Nicho[]
}

async function adicionarNicho() {
  if (!novoNicho.value.trim() || !empresaId.value) return
  nichoSaving.value = true
  nichoError.value = null
  const { error: insertErr } = await supabase
    .from('nichos')
    .insert({ nome: novoNicho.value.trim(), empresa_id: empresaId.value })
  nichoSaving.value = false
  if (insertErr) { nichoError.value = insertErr.message; return }
  novoNicho.value = ''
  await fetchNichos()
}

function iniciarEdicaoNicho(nicho: Nicho) {
  nichoEditando.value = nicho
  nichoEditandoNome.value = nicho.nome
}

async function salvarEdicaoNicho() {
  if (!nichoEditando.value || !nichoEditandoNome.value.trim()) return
  nichoSaving.value = true
  nichoError.value = null
  const { error: updateErr } = await supabase
    .from('nichos')
    .update({ nome: nichoEditandoNome.value.trim() })
    .eq('id', nichoEditando.value.id)
  nichoSaving.value = false
  if (updateErr) { nichoError.value = updateErr.message; return }
  nichoEditando.value = null
  nichoEditandoNome.value = ''
  await fetchNichos()
}

function cancelarEdicaoNicho() {
  nichoEditando.value = null
  nichoEditandoNome.value = ''
}

async function removerNicho(nicho: Nicho) {
  nichoError.value = null
  const { error: deleteErr } = await supabase
    .from('nichos')
    .delete()
    .eq('id', nicho.id)
  if (deleteErr) { nichoError.value = deleteErr.message; return }
  await fetchNichos()
}

const ufs = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

const paises = [
  'Brasil', 'Portugal', 'Angola', 'Moçambique', 'Cabo Verde',
  'Estados Unidos', 'Espanha', 'França', 'Alemanha', 'Itália',
  'Reino Unido', 'Argentina', 'Uruguai', 'Paraguai', 'Chile',
  'Colômbia', 'México', 'Canadá', 'Japão', 'Austrália',
  'Índia', 'China', 'Coreia do Sul', 'Guiné-Bissau', 'Timor-Leste',
  'São Tomé e Príncipe', 'Outro',
]

// �"?�"? Stats �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const clientesAtivos = computed(() =>
  clientes.value.filter(c => c.ativo !== false).length
)
const comEmail = computed(() =>
  clientes.value.filter(c => c.email).length
)
const cidadesUnicas = computed(() => {
  const set = new Set(clientes.value.map(c => c.cidade).filter(Boolean) as string[])
  return Array.from(set).sort()
})

const paisesUnicos = computed(() => {
  const set = new Set(clientes.value.map(c => c.pais).filter(Boolean) as string[])
  return Array.from(set).sort()
})

// �"?�"? Filtros �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const filtrosAtivos = computed(() => {
  let c = 0
  if (filtros.busca) c++
  if (filtros.cidade) c++
  if (filtros.ativo) c++
  if (filtros.nicho) c++
  if (filtros.pais) c++
  return c
})

const clientesFiltrados = computed(() => {
  return clientes.value.filter(c => {
    if (filtros.cidade && c.cidade !== filtros.cidade) return false
    if (filtros.nicho && (c.nicho ?? '') !== filtros.nicho) return false
    if (filtros.pais && (c.pais ?? '') !== filtros.pais) return false
    if (filtros.ativo === 'true' && c.ativo === false) return false
    if (filtros.ativo === 'false' && c.ativo !== false) return false
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      return (
        c.nome.toLowerCase().includes(q) ||
        (c.cpf_cnpj ?? '').includes(q) ||
        (c.telefone ?? '').includes(q) ||
        (c.email ?? '').toLowerCase().includes(q)
      )
    }
    return true
  })
})

function limparFiltros() {
  filtros.busca = ''
  filtros.cidade = ''
  filtros.ativo = ''
  filtros.nicho = ''
  filtros.pais = ''
}

// Filtro para o Kanban
const kanbanFilterFn = computed(() => {
  return (card: any) => {
    if (filtros.nicho && (card.nicho ?? '') !== filtros.nicho) return false
    if (filtros.pais && (card.pais ?? '') !== filtros.pais) return false
    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      return card.titulo.toLowerCase().includes(q) || (card.subtitulo ?? '').toLowerCase().includes(q)
    }
    return true
  }
})

// �"?�"? Helpers �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
function initials(nome: string): string {
  const parts = nome.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return (nome[0] ?? '?').toUpperCase()
}

// �"?�"? CRUD �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
onMounted(async () => { await loadEmpresa(); await fetchClientes(); await fetchNichos() })

async function abrirDetalhesCliente(cliente: Cliente) {
  clienteSelecionado.value = cliente
  modalDetalhesAberto.value = true
  await fetchAtendimentosCliente(cliente.id)
}

async function onKanbanCardClick(card: KanbanCard) {
  // Fetch full client data and open edit modal
  const { data, error: fetchError } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', card.id)
    .single()

  if (fetchError || !data) {
    console.error('Erro ao carregar cliente do kanban:', fetchError?.message)
    return
  }

  editCliente(data as Cliente)
}

function fecharDetalhes() {
  clienteSelecionado.value = null
  modalDetalhesAberto.value = false
  atendimentosCliente.value = []
}

async function abrirHistoricoDoEdit() {
  if (!editando.value) return
  clienteSelecionado.value = editando.value
  modalHistoricoAberto.value = true
  await fetchHistoricoCliente(editando.value.id)
}

async function fetchHistoricoCliente(clienteId: number) {
  carregandoHistorico.value = true
  const { data, error: fetchErr } = await supabase
    .from('cliente_historico')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })

  carregandoHistorico.value = false
  if (fetchErr) {
    console.error('Erro ao carregar histórico:', fetchErr.message)
    historicoMovimentacoes.value = []
    return
  }
  historicoMovimentacoes.value = data ?? []
}

function formatarDataHistorico(dataStr: string): string {
  if (!dataStr) return '—'
  const data = new Date(dataStr)
  const agora = new Date()
  const diffMs = agora.getTime() - data.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMs / 3600000)
  const diffDias = Math.floor(diffMs / 86400000)

  const dataFormatada = data.toLocaleDateString('pt-BR') + ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} min — ${dataFormatada}`
  if (diffHoras < 24) return `há ${diffHoras}h — ${dataFormatada}`
  if (diffDias === 1) return `há 1 dia — ${dataFormatada}`
  return `há ${diffDias} dias — ${dataFormatada}`
}

function abrirWhatsApp(cliente: Cliente) {
  if (!cliente.telefone) return
  // Remove tudo que não é número
  const numero = cliente.telefone.replace(/\D/g, '')
  // Adiciona 55 (Brasil) se não tiver código de país
  const tel = numero.length <= 11 ? '55' + numero : numero
  const msg = encodeURIComponent(`Olá ${cliente.nome}! `)
  window.open(`https://wa.me/${tel}?text=${msg}`, '_blank')
}

async function fetchAtendimentosCliente(clienteId: string) {
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

    atendimentosCliente.value = data.map((a: any) => ({
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

async function fetchClientes() {
  loading.value = true
  const { data, error: fetchError } = await supabase
    .from('clientes')
    .select('*')
    .eq('empresa_id', empresaId.value!)
    .order('nome', { ascending: true })

  loading.value = false
  if (fetchError) { error.value = fetchError.message; return }
  clientes.value = (data ?? []) as Cliente[]
}

function abrirAdicionar() {
  adicionando.value = true
  editando.value = null
  modalError.value = null
  formErrors.nome = ''; formErrors.cpf_cnpj = ''; formErrors.email = ''
  form.nome = ''; form.cpf_cnpj = ''; form.telefone = ''; form.email = ''
  form.endereco = ''; form.numero = ''; form.bairro = ''; form.cidade = ''
  form.estado = ''; form.cep = ''; form.observacao = ''; form.ativo = true
  form.nicho = ''
  form.nome_empresa = ''
  form.pais = ''
}

function fecharModal() {
  editando.value = null
  adicionando.value = false
}

function editCliente(cli: Cliente) {
  editando.value = cli
  modalError.value = null
  formErrors.nome = ''; formErrors.cpf_cnpj = ''; formErrors.email = ''
  form.nome       = cli.nome
  form.cpf_cnpj   = cli.cpf_cnpj ?? ''
  form.telefone   = cli.telefone ?? ''
  form.email      = cli.email ?? ''
  form.endereco   = cli.endereco ?? ''
  form.numero     = cli.numero ?? ''
  form.bairro     = cli.bairro ?? ''
  form.cidade     = cli.cidade ?? ''
  form.estado     = cli.estado ?? ''
  form.cep        = cli.cep ?? ''
  form.observacao = cli.observacao ?? ''
  form.ativo      = cli.ativo !== false
  form.nicho      = cli.nicho ?? ''
  form.nome_empresa = cli.nome_empresa ?? ''
  form.pais       = cli.pais ?? ''
}

function buildPayload() {
  return {
    nome:       form.nome.trim(),
    cpf_cnpj:   form.cpf_cnpj.trim() || null,
    telefone:   form.telefone.trim() || null,
    email:      form.email.trim() || null,
    endereco:   form.endereco.trim() || null,
    numero:     form.numero.trim() || null,
    bairro:     form.bairro.trim() || null,
    cidade:     form.cidade.trim() || null,
    estado:     form.estado || null,
    cep:        form.cep.trim() || null,
    observacao: form.observacao.trim() || null,
    ativo:      form.ativo,
    nicho:      form.nicho || null,
    nome_empresa: form.nome_empresa.trim() || null,
    pais:       form.pais || null,
    empresa_id: empresaId.value!,
  }
}

function validateForm(): boolean {
  formErrors.nome = ''; formErrors.cpf_cnpj = ''; formErrors.email = ''
  let ok = true
  if (!form.nome.trim()) { formErrors.nome = 'O nome é obrigatório.'; ok = false }
  return ok
}

async function salvarEdicao() {
  if (!editando.value || !validateForm()) return
  saving.value = true
  modalError.value = null

  const { error: updateError } = await supabase
    .from('clientes')
    .update(buildPayload())
    .eq('id', editando.value.id)

  saving.value = false
  if (updateError) {
    modalError.value = updateError.message.includes('clientes_cpf_cnpj_key')
      ? 'Este CPF/CNPJ já está cadastrado.'
      : updateError.message.includes('clientes_email_key')
        ? 'Este e-mail já está cadastrado.'
        : updateError.message
    return
  }

  editando.value = null
  await fetchClientes()
}

async function salvarAdicao() {
  if (!validateForm()) return
  saving.value = true
  modalError.value = null

  const { error: insertError } = await supabase
    .from('clientes')
    .insert(buildPayload())

  saving.value = false
  if (insertError) {
    modalError.value = insertError.message.includes('clientes_cpf_cnpj_key')
      ? 'Este CPF/CNPJ já está cadastrado.'
      : insertError.message.includes('clientes_email_key')
        ? 'Este e-mail já está cadastrado.'
        : insertError.message
    return
  }

  adicionando.value = false
  await fetchClientes()
}

function confirmarExclusao(cli: Cliente) {
  excluindo.value = cli
  deleteError.value = null
}

async function executarExclusao() {
  if (!excluindo.value) return
  deleting.value = true
  deleteError.value = null

  const { error: deleteErr } = await supabase
    .from('clientes')
    .delete()
    .eq('id', excluindo.value.id)

  deleting.value = false
  if (deleteErr) { deleteError.value = deleteErr.message; return }

  excluindo.value = null
  await fetchClientes()
}

// 🔹 Funções para Modal de Detalhes 🔹
function formatarEndereco(cliente: Cliente): string {
  const parts = [
    cliente.endereco,
    cliente.numero,
    cliente.bairro,
    cliente.cidade,
    cliente.estado,
    cliente.cep,
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

async function enviarMensagem() {
  if (!formularioMensagem.conteudo.trim() || !clienteSelecionado.value) return

  enviarMensagemLoading.value = true
  erroMensagem.value = null

  const { error: insertError } = await supabase
    .from('mensagens')
    .insert({
      empresa_id: empresaId.value,
      cliente_id: clienteSelecionado.value.id,
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
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-fade-enter-active { transition: all 0.2s ease; }
.slide-fade-leave-active { transition: all 0.15s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-8px); opacity: 0; }
</style>
