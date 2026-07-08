<template>
  <div class="min-h-full flex flex-col px-0 pt-2 sm:px-5 sm:pt-4 bg-white sm:bg-[#08090b]">

    <!-- �.��.��.��.��.��.��.��.��.��.��.� VIS�fO FUNCIONÁRIO �.��.��.��.��.��.��.��.��.��.��.� -->
    <template v-if="!adminLoading && !isAdminOrGerente">
      <!-- Cabeçalho funcionário -->
      <div class="relative rounded-3xl overflow-hidden mb-7 shadow-xl">
        <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #ec4899, #f43f5e))' }" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <PageLogo />

        <div class="relative px-4 sm:px-8 pt-6 pb-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-white/[0.15] backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
              </div>
              <div>
                <p class="text-xs font-bold text-white/80 uppercase tracking-widest">UpStudio</p>
                <h1 class="text-2xl font-black text-white leading-tight">
                  {{ funcionarioLogado ? `Olá, ${primeiroNome(funcionarioLogado.nome)}!` : 'Minhas Atividades' }}
                </h1>
                <p class="text-sm text-gray-300/80 mt-0.5">{{ dataHoje }}</p>
              </div>
            </div>
            <div v-if="funcionarioLogado" class="flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 border border-white/15 text-white px-3 py-1.5 rounded-xl">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/></svg>
                {{ funcionarioLogado.cargo ?? 'Funcionário' }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs font-bold bg-white/10 border border-white/15 text-white px-3 py-1.5 rounded-xl">
                <span class="w-2 h-2 rounded-full bg-primary" />
                {{ minhasAtividades.length }} atividade(s)
              </span>
            </div>
          </div>

          <!-- Stats rápidos -->
          <div v-if="funcionarioLogado && !loadingAtividades" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <span class="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Pendentes</span>
              <span class="text-xl font-black text-white">{{ countAtivStatus('pendente') }}</span>
            </div>
            <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <span class="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Em Andamento</span>
              <span class="text-xl font-black text-white">{{ countAtivStatus('em_andamento') }}</span>
            </div>
            <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <span class="text-[10px] font-bold text-green-300 uppercase tracking-widest">Concluídas</span>
              <span class="text-xl font-black text-white">{{ countAtivStatus('concluida') }}</span>
            </div>
            <div class="flex flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
              <span class="text-[10px] font-bold text-red-300 uppercase tracking-widest">Urgentes</span>
              <span class="text-xl font-black text-white">{{ minhasAtividades.filter(a => a.prioridade === 'urgente').length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sem funcionário vinculado -->
      <div v-if="!loadingAtividades && !funcionarioLogado" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-16 h-16 rounded-2xl bg-primary-5 border border-primary-border flex items-center justify-center">
          <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
        </div>
        <div class="text-center">
          <p class="text-base font-bold text-gray-700">Nenhum funcionário vinculado</p>
          <p class="text-sm text-gray-400 mt-1">Peça ao administrador para cadastrar seu e-mail na ficha de funcionário.</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="loadingAtividades" class="flex items-center justify-center py-24">
        <span class="spinner spinner-md" />
      </div>

      <!-- Tabs e lista de atividades -->
      <template v-else-if="funcionarioLogado">
        <!-- ─── Kanban de agendamentos do funcionário ─── -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <svg class="w-5 h-5 shrink-0" :style="{ color: 'var(--color-primary, #ec4899)' }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
            <h2 class="text-base font-bold text-gray-800 capitalize">{{ meuKanbanMesLabel }}</h2>
            <button type="button" class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary-10 text-primary hover:bg-primary-10 transition-colors" @click="meuKanbanIrParaHoje">Hoje</button>
            <div class="ml-auto flex gap-2">
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-primary-5 hover:text-primary transition-colors shadow-sm" @click="meuKanbanSemanaAnterior">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button type="button" class="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-primary-5 hover:text-primary transition-colors shadow-sm" @click="meuKanbanSemanaProxima">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          <div v-if="meuKanbanLoading" class="flex justify-center py-8">
            <div class="w-8 h-8 rounded-full border-4 border-gray-200 animate-spin" :style="{ borderTopColor: 'var(--color-primary, #ec4899)' }" />
          </div>

          <template v-else>
            <!-- Mobile: 4+3 -->
            <div class="sm:hidden space-y-2">
              <div class="grid grid-cols-4 gap-2">
                <div v-for="dia in meuKanbanDias.slice(0, 4)" :key="dia.iso" class="flex flex-col min-w-0">
                  <div class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors" :class="dia.ehHoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'" :style="dia.ehHoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg,#ec4899,#f43f5e))' } : {}">
                    <span class="text-[10px] font-bold tracking-widest" :class="dia.ehHoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
                    <span class="text-xl font-black leading-none mt-0.5" :class="dia.ehHoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
                    <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.ehHoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (meuKanbanPorDia[dia.iso] ?? []).length }}</span>
                  </div>
                  <div class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 min-h-[48px]">
                    <div v-for="ag in meuKanbanPorDia[dia.iso]" :key="ag.id" class="rounded-xl border shadow-sm px-2.5 py-2 bg-white border-gray-200/80">
                      <div class="h-0.5 w-full rounded-full mb-2" :class="agKanbanStatusCor(ag.status)" />
                      <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
                      <p class="text-[10px] font-semibold mt-0.5" :style="{ color: 'var(--color-primary, #ec4899)' }">{{ agKanbanFormatHora(ag.data_hora) }}</p>
                      <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
                      <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
                      <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="agKanbanStatusBadge(ag.status)">{{ agKanbanStatusLabel(ag.status) }}</span>
                      <a v-if="ag.cliente_telefone" :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`" target="_blank" rel="noopener noreferrer" class="mt-1.5 flex items-center justify-center w-full py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-center gap-2">
                <div v-for="dia in meuKanbanDias.slice(4)" :key="dia.iso" class="flex flex-col min-w-0 shrink-0 basis-[calc(25%-6px)]">
                  <div class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors" :class="dia.ehHoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'" :style="dia.ehHoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg,#ec4899,#f43f5e))' } : {}">
                    <span class="text-[10px] font-bold tracking-widest" :class="dia.ehHoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
                    <span class="text-xl font-black leading-none mt-0.5" :class="dia.ehHoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
                    <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.ehHoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (meuKanbanPorDia[dia.iso] ?? []).length }}</span>
                  </div>
                  <div class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 min-h-[48px]">
                    <div v-for="ag in meuKanbanPorDia[dia.iso]" :key="ag.id" class="rounded-xl border shadow-sm px-2.5 py-2 bg-white border-gray-200/80">
                      <div class="h-0.5 w-full rounded-full mb-2" :class="agKanbanStatusCor(ag.status)" />
                      <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
                      <p class="text-[10px] font-semibold mt-0.5" :style="{ color: 'var(--color-primary, #ec4899)' }">{{ agKanbanFormatHora(ag.data_hora) }}</p>
                      <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
                      <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
                      <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="agKanbanStatusBadge(ag.status)">{{ agKanbanStatusLabel(ag.status) }}</span>
                      <a v-if="ag.cliente_telefone" :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`" target="_blank" rel="noopener noreferrer" class="mt-1.5 flex items-center justify-center w-full py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop: 7 colunas -->
            <div class="hidden sm:grid grid-cols-7 gap-2">
              <div v-for="dia in meuKanbanDias" :key="dia.iso" class="flex flex-col min-w-0">
                <div class="flex flex-col items-center py-2 px-1 rounded-2xl mb-2 border transition-colors" :class="dia.ehHoje ? 'border-transparent shadow-md' : 'bg-white border-gray-200'" :style="dia.ehHoje ? { background: 'var(--color-primary-bg, linear-gradient(180deg,#ec4899,#f43f5e))' } : {}">
                  <span class="text-[10px] font-bold tracking-widest" :class="dia.ehHoje ? 'text-white/80' : 'text-gray-400'">{{ dia.diaSemana }}</span>
                  <span class="text-xl font-black leading-none mt-0.5" :class="dia.ehHoje ? 'text-white' : 'text-gray-800'">{{ dia.diaNum }}</span>
                  <span class="text-[10px] font-bold mt-1 rounded-full px-2 py-0.5" :class="dia.ehHoje ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'">{{ (meuKanbanPorDia[dia.iso] ?? []).length }}</span>
                </div>
                <div class="flex flex-col gap-1.5 flex-1 rounded-2xl p-1 min-h-[48px]">
                  <div v-for="ag in meuKanbanPorDia[dia.iso]" :key="ag.id" class="rounded-xl border shadow-sm px-2.5 py-2 bg-white border-gray-200/80">
                    <div class="h-0.5 w-full rounded-full mb-2" :class="agKanbanStatusCor(ag.status)" />
                    <p class="text-xs font-bold text-gray-900 truncate leading-tight">{{ ag.cliente_nome ?? ag.nome_solicitante ?? '\u2014' }}</p>
                    <p class="text-[10px] font-semibold mt-0.5" :style="{ color: 'var(--color-primary, #ec4899)' }">{{ agKanbanFormatHora(ag.data_hora) }}</p>
                    <p v-if="ag.servicos_nomes" class="text-[10px] text-gray-400 mt-0.5 truncate">{{ ag.servicos_nomes }}</p>
                    <p v-if="ag.funcionario_nome" class="text-[10px] text-indigo-500 font-semibold mt-0.5 truncate">👤 {{ ag.funcionario_nome }}</p>
                    <span class="inline-flex mt-1.5 items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold" :class="agKanbanStatusBadge(ag.status)">{{ agKanbanStatusLabel(ag.status) }}</span>
                    <a v-if="ag.cliente_telefone" :href="`https://wa.me/55${ag.cliente_telefone.replace(/\D/g, '')}`" target="_blank" rel="noopener noreferrer" class="mt-1.5 flex items-center justify-center w-full py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Divisor -->
        <div class="flex items-center gap-3 mb-6">
          <div class="flex-1 h-px bg-gray-100" />
          <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Minhas Tarefas</span>
          <div class="flex-1 h-px bg-gray-100" />
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-1">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
            :class="tabAtiva === tab.value
              ? 'bg-primary text-primary-text shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'"
            @click="tabAtiva = tab.value"
          >
            {{ tab.label }}
            <span
              class="inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-xs font-black"
              :class="tabAtiva === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'"
            >
              {{ atividadesPorTab(tab.value).length }}
            </span>
          </button>
        </div>

        <!-- Frase motivacional -->
        <div v-if="funcionarioLogado" class="mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-50 to-primary-5 border border-primary-border">
          <div class="shrink-0 w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
          </div>
          <p class="text-sm font-semibold text-gray-800 leading-snug">{{ fraseAtual }}</p>
        </div>

        <!-- Cards de atividades -->
        <div v-if="atividadesPorTab(tabAtiva).length === 0" class="flex flex-col items-center justify-center py-20 gap-3">
          <svg class="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.25" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span class="text-base font-semibold text-gray-400">Nenhuma atividade para este período</span>
        </div>

        <template v-else>
          <!-- Ativas -->
          <div v-if="ativasTab(tabAtiva).length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
            v-for="at in ativasTab(tabAtiva)"
            :key="at.id"
            class="group bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative"
            :class="at.status === 'em_andamento'
              ? 'border-blue-300 ring-2 ring-blue-100'
              : at.prioridade === 'urgente' ? 'border-red-200' : 'border-gray-100'"
          >
            <!-- Borda topo: barra animada se em andamento, cor de prioridade caso contrário -->
            <div v-if="at.status === 'em_andamento'" class="h-1 w-full bg-blue-100 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 animate-[progress_2s_ease-in-out_infinite]" style="background-size:200% 100%" />
            </div>
            <div v-else class="h-1" :class="prioridadeAccent(at.prioridade)" />

            <!-- Cabeçalho premium do título -->
            <div class="relative px-5 pt-4 pb-3 overflow-hidden" :style="{ background: 'var(--color-primary-bg)' }">
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_65%)]" />
              <div class="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/5" />
              <div class="relative flex items-start justify-between gap-2">
                <h3 class="font-black text-white text-sm leading-snug tracking-tight drop-shadow-sm">{{ at.titulo }}</h3>
                <span :class="['shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border',
                  at.status === 'em_andamento' ? 'bg-blue-500/20 border-blue-400/40 text-blue-200' :
                  at.status === 'pendente'     ? 'bg-primary/20 border-primary/40 text-white/80' :
                  'bg-white/10 border-white/20 text-white/80']">
                  <span v-if="at.status === 'em_andamento'" class="relative flex w-2 h-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
                    <span class="relative inline-flex rounded-full w-2 h-2 bg-blue-300" />
                  </span>
                  <span v-else :class="['w-1.5 h-1.5 rounded-full', statusDotClass(at.status)]" />
                  {{ statusLabel(at.status) }}
                </span>
              </div>
              <p v-if="at.descricao" class="relative mt-1.5 text-xs text-green-100/75 leading-relaxed line-clamp-2">{{ at.descricao }}</p>
            </div>

            <div class="px-5 py-4 flex flex-col gap-3">
              <div class="flex flex-wrap gap-2">
                <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', prioridadeBadgeClass(at.prioridade)]">
                  {{ prioridadeLabel(at.prioridade) }}
                </span>
                <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', periodicidadeBadgeClass(at.periodicidade)]">
                  {{ periodicidadeLabel(at.periodicidade) }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-1 border-t border-gray-50">
                <div class="flex items-center gap-1.5 text-xs text-gray-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"/></svg>
                  {{ at.data_atividade ? formatarData(at.data_atividade) : 'Sem data definida' }}
                </div>
                <div v-if="at.hora_inicio" class="flex items-center gap-1 text-xs text-gray-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75v5.25l3 1.5"/></svg>
                  {{ at.hora_inicio }}{{ at.hora_fim ? ` �?" ${at.hora_fim}` : '' }}
                </div>
              </div>

              <p v-if="at.observacao" class="text-xs text-gray-400 italic border-t border-gray-50 pt-2">{{ at.observacao }}</p>

              <!-- Botão alterar status -->
              <div class="flex gap-2 pt-1" v-if="at.status !== 'concluida' && at.status !== 'cancelada'">
                <button
                  v-if="at.status === 'pendente'"
                  type="button"
                  class="flex-1 text-xs font-bold py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 transition-colors"
                  :disabled="atualizando === at.id"
                  @click="alterarStatus(at, 'em_andamento')"
                >
                  {{ atualizando === at.id ? '...' : 'Iniciar' }}
                </button>
                <button
                  v-if="at.status === 'em_andamento'"
                  type="button"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 border border-green-100 transition-colors"
                  :disabled="atualizando === at.id"
                  @click="alterarStatus(at, 'concluida')"
                >
                  <svg v-if="atualizando !== at.id" class="w-3.5 h-3.5 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  {{ atualizando === at.id ? '...' : 'Concluir' }}
                </button>
              </div>
              <div v-else-if="at.status === 'concluida'" class="flex items-center gap-1.5 text-xs font-bold text-green-600 pt-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Concluída
              </div>
            </div>
          </div>
          </div>

          <!-- Banner: tudo concluído nesta aba -->
          <div
            v-if="ativasTab(tabAtiva).length === 0 && concluidasTab(tabAtiva).length > 0"
            class="mb-6 relative overflow-hidden rounded-2xl p-5 shadow-lg"
            :style="{ background: 'var(--color-primary-bg)' }"
          >
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
            <div class="relative flex items-center gap-4">
              <div class="shrink-0 w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-3xl select-none">
                �Y�?
              </div>
              <div>
                <p class="text-base font-black text-white leading-tight">Parabéns, {{ funcionarioLogado ? primeiroNome(funcionarioLogado.nome) : 'campeão' }}!</p>
                <p class="text-sm text-white/80 mt-0.5">Todas as tarefas desta aba foram concluídas. Excelente trabalho! Continue assim! 🎉</p>
              </div>
            </div>
          </div>

          <!-- Divisor Concluídas -->
          <div v-if="concluidasTab(tabAtiva).length > 0" class="mt-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="flex-1 h-px bg-primary-border" />
              <span class="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-5 border border-primary-border px-3 py-1 rounded-full">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Concluídas ({{ concluidasTab(tabAtiva).length }})
              </span>
              <div class="flex-1 h-px bg-primary-10" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 opacity-70">
              <div
                v-for="at in concluidasTab(tabAtiva)"
                :key="at.id"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <!-- Header concluída neutro -->
                <div class="px-5 pt-4 pb-3 bg-gray-50 border-b border-gray-100">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <h3 class="font-semibold text-gray-400 text-sm leading-snug line-through decoration-gray-300">{{ at.titulo }}</h3>
                    </div>
                    <span class="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Concluída
                    </span>
                  </div>
                  <p v-if="at.descricao" class="mt-1 text-xs text-gray-400 leading-relaxed line-clamp-2">{{ at.descricao }}</p>
                </div>

                <div class="px-5 py-3 flex flex-wrap gap-2">
                  <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', prioridadeBadgeClass(at.prioridade)]">
                    {{ prioridadeLabel(at.prioridade) }}
                  </span>
                  <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full', periodicidadeBadgeClass(at.periodicidade)]">
                    {{ periodicidadeLabel(at.periodicidade) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </template>

    <!-- �.��.��.��.��.��.��.��.��.��.��.� VIS�fO ADMIN �.��.��.��.��.��.��.��.��.��.��.� -->
    <template v-if="!adminLoading && isAdminOrGerente">

      <!-- HEADER CARD — Totalmente preto com borda cinza -->
      <div class="relative rounded-t-3xl overflow-hidden shadow-xl mx-4 sm:mx-3" style="background:#000;border:2px solid rgba(255,255,255,0.16)">
        <div class="absolute inset-0 pointer-events-none" style="background:url('/dashboard-bg.png') 34% center / auto 135% no-repeat;filter:brightness(1.12) contrast(1.03)"></div>
        <div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 70%)"></div>

        <div class="relative px-4 sm:px-8 pt-9 sm:pt-7 pb-9 sm:pb-7">
          <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-6">
            <div class="flex items-center gap-3 sm:gap-5">
              <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 shrink-0">
                <svg class="w-7 sm:w-10 h-7 sm:h-10" style="color: #fc6404" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="13.5" width="3.8" height="7.5" rx="1.4" opacity="0.45" />
                  <rect x="10.1" y="9" width="3.8" height="12" rx="1.4" opacity="0.72" />
                  <rect x="17.2" y="4" width="3.8" height="17" rx="1.4" />
                </svg>
              </div>
              <div>
                <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">Dashboard</h1>
                <p class="text-xs font-semibold text-white/50 uppercase tracking-widest mt-1.5">Visão Geral</p>
              </div>
            </div>

            <!-- Botões Header -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="btn-header btn-header--icon"
                title="Atualizar dados"
                @click="refresh()"
              >
                <svg class="w-5 h-5" :class="loading ? 'animate-spin' : ''" style="color: #fc6404" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
              </button>
              <button
                type="button"
                class="btn-header btn-header--icon-sm"
                title="Filtros"
                @click="filtroAberto = !filtroAberto"
              >
                <svg class="w-5 h-5" style="color: #fc6404" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
                <span class="hidden sm:inline">Filtros</span>
                <span v-if="periodoFiltro !== 'mes_atual'" class="w-2 h-2 rounded-full" style="background: #fc6404" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- FILTRO DE PERÍODO (slide-down panel) -->
      <Transition name="slide-down">
        <div v-if="filtroAberto" class="bg-theme-card rounded-2xl border border-primary-10 shadow-md mb-5 overflow-hidden">
          <div class="flex items-center justify-between px-5 py-3 border-b border-primary-10 bg-primary-5">
            <span class="text-xs font-black" style="color: var(--color-card-texto)">Filtro de Período</span>
            <button type="button" class="text-xs font-bold text-primary hover:text-primary" @click="resetarFiltros">Redefinir</button>
          </div>
          <div class="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Período</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="opt in periodoOpcoes"
                  :key="opt.value"
                  type="button"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all text-left"
                  :class="periodoFiltro === opt.value ? 'bg-primary-5 border-primary-border text-primary' : 'border-primary-10 hover:border-primary-border hover:text-primary'"
                  :style="periodoFiltro !== opt.value ? { color: 'var(--color-card-texto)' } : {}"
                  @click="periodoFiltro = opt.value"
                >
                  <span class="w-3 h-3 rounded-full border-2 flex items-center justify-center shrink-0" :class="periodoFiltro === opt.value ? 'border-primary' : 'border-primary-30'">
                    <span v-if="periodoFiltro === opt.value" class="w-1.5 h-1.5 rounded-full bg-primary" />
                  </span>
                  {{ opt.label }}
                </button>
              </div>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Mês / Ano Específico</p>
              <div class="grid grid-cols-2 gap-3" :class="periodoFiltro !== 'personalizado' ? 'opacity-40 pointer-events-none' : ''">
                <div>
                  <label class="block text-xs font-semibold mb-1" style="color: var(--color-card-texto); opacity: 0.75">Mês</label>
                  <select
                    :value="periodoCustom.mes"
                    class="w-full rounded-lg border border-primary-10 bg-primary-5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    @change="periodoFiltro = 'personalizado'; periodoCustom = { ...periodoCustom, mes: Number(($event.target as HTMLSelectElement).value) }"
                  >
                    <option v-for="m in mesesOpcoes" :key="m.value" :value="m.value">{{ m.label }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1" style="color: var(--color-card-texto); opacity: 0.75">Ano</label>
                  <select
                    :value="periodoCustom.ano"
                    class="w-full rounded-lg border border-primary-10 bg-primary-5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    @change="periodoFiltro = 'personalizado'; periodoCustom = { ...periodoCustom, ano: Number(($event.target as HTMLSelectElement).value) }"
                  >
                    <option v-for="a in anosOpcoes" :key="a" :value="a">{{ a }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ═══════════════════════════════════ PAINEL DE CONTEÚDO (claro) ═══════════════════ -->
      <div style="background:#f1f2f4;border:1px solid #cbd0d8;border-radius:22px 22px 0 0;padding:20px;color:#1a1d21" class="flex-1 sm:-mx-4">

        <!-- Alertas e Prazos -->
        <div v-if="alertas.temAlertas" style="display:flex;align-items:center;gap:14px;background:linear-gradient(90deg,#fdf7ee,#fcf5ef);border:1px solid #f2e7d7;border-radius:14px;padding:12px 18px">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fc6404" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9A6 6 0 1 0 6 9c0 5-2.5 6.5-2.5 6.5h17S18 14 18 9zM10 19a2 2 0 0 0 4 0"/></svg>
          <div>
            <div style="font-weight:700;font-size:13px;color:#1a1d21">Alertas e Prazos</div>
            <div style="font-size:11.5px;color:#9aa1ab;margin-top:1px">{{ totalAlertas }} {{ totalAlertas === 1 ? 'item exige' : 'itens exigem' }} sua atenção</div>
          </div>
          <div style="flex:1;display:flex;justify-content:center">
            <div style="display:flex;align-items:center;gap:9px;background:#fff;border:1px solid #f3ddc3;border-radius:20px;padding:8px 15px;box-shadow:0 1px 3px rgba(0,0,0,.04)">
              <span style="width:7px;height:7px;border-radius:50%;background:#ef4444"></span>
              <span style="font-size:12px;font-weight:700;color:#b45309">
                <template v-if="alertas.osAtrasadas > 0">{{ alertas.osAtrasadas }} OS atrasada{{ alertas.osAtrasadas > 1 ? 's' : '' }} • Prazo vencido</template>
                <template v-else-if="alertas.contasVencidas > 0">{{ alertas.contasVencidas }} conta{{ alertas.contasVencidas > 1 ? 's' : '' }} vencida{{ alertas.contasVencidas > 1 ? 's' : '' }}</template>
                <template v-else>{{ alertas.orcamentosExpirando }} orçamento{{ alertas.orcamentosExpirando > 1 ? 's' : '' }} expirando</template>
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
            </div>
          </div>
          <NuxtLink to="/adesivos-ordens-servico" style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#6b7079">Ver todos <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></NuxtLink>
        </div>

        <!-- KPI CARDS -->
        <div class="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-7 gap-3" :style="{ marginTop: alertas.temAlertas ? '14px' : '0' }">

          <!-- Faturamento -->
          <div style="background:#fff;border:1px solid #e2e5ea;border-radius:16px;padding:15px 14px 10px;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.05)">
            <div style="display:flex;align-items:center;gap:9px">
              <span style="width:36px;height:36px;flex:none;border-radius:50%;background:#e3f7ea;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M10.2 14.2c0 .9.8 1.5 1.8 1.5s1.8-.5 1.8-1.4-.8-1.2-1.8-1.4-1.8-.5-1.8-1.4.8-1.4 1.8-1.4 1.8.6 1.8 1.5"/></svg></span>
              <span style="font-size:10.5px;font-weight:800;letter-spacing:.4px;color:#31363e;white-space:nowrap">FATURAMENTO</span>
            </div>
            <div style="font-size:20.5px;font-weight:800;letter-spacing:-.7px;color:#0f1216;white-space:nowrap;margin:10px 0 4px" class="truncate">{{ formatCurrency(financeiro.faturamento) }}</div>
            <div style="font-size:11px;font-weight:700;white-space:nowrap" :style="{ color: varColor(comparativo.variacaoFaturamento) }">{{ fmtVar(comparativo.variacaoFaturamento) }} <span style="color:#8b9099;font-weight:500">vs. mês anterior</span></div>
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" width="100%" height="38" style="margin-top:8px"><path :d="sparklineFaturamento" fill="none" stroke="#22c55e" stroke-width="1.6" stroke-linecap="round"/></svg>
          </div>

          <!-- Despesas -->
          <div style="background:#fff;border:1px solid #e2e5ea;border-radius:16px;padding:15px 14px 10px;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.05)">
            <div style="display:flex;align-items:center;gap:9px">
              <span style="width:36px;height:36px;flex:none;border-radius:50%;background:#fdeaea;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="13" rx="2.2"/><path d="M4 9.5h16M7.5 14.5h3"/></svg></span>
              <span style="font-size:10.5px;font-weight:800;letter-spacing:.4px;color:#31363e;white-space:nowrap">DESPESAS</span>
            </div>
            <div style="font-size:20.5px;font-weight:800;letter-spacing:-.7px;color:#0f1216;white-space:nowrap;margin:10px 0 4px" class="truncate">{{ formatCurrency(financeiro.despesas) }}</div>
            <div style="font-size:11px;font-weight:700;white-space:nowrap" :style="{ color: varColor(-comparativo.variacaoDespesas) }">{{ fmtVar(comparativo.variacaoDespesas) }} <span style="color:#8b9099;font-weight:500">vs. mês anterior</span></div>
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" width="100%" height="38" style="margin-top:8px"><path :d="sparklineDespesas" fill="none" stroke="#fc6404" stroke-width="1.6" stroke-linecap="round"/></svg>
          </div>

          <!-- Lucro Estimado -->
          <div style="background:#fff;border:1px solid #e2e5ea;border-radius:16px;padding:15px 14px 10px;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.05)">
            <div style="display:flex;align-items:center;gap:9px">
              <span style="width:36px;height:36px;flex:none;border-radius:50%;background:#e4edfd;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5l4.5-4.5 3.5 2.5 6.5-6.5M19 8v4.5h-4.5"/></svg></span>
              <span style="font-size:10.5px;font-weight:800;letter-spacing:.4px;color:#31363e;white-space:nowrap">LUCRO ESTIMADO</span>
            </div>
            <div style="font-size:20.5px;font-weight:800;letter-spacing:-.7px;color:#0f1216;white-space:nowrap;margin:10px 0 4px" class="truncate">{{ formatCurrency(financeiro.lucroEstimado) }}</div>
            <div style="font-size:11px;font-weight:700;white-space:nowrap" :style="{ color: varColor(variacaoLucro) }">{{ fmtVar(variacaoLucro) }} <span style="color:#8b9099;font-weight:500">vs. mês anterior</span></div>
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" width="100%" height="38" style="margin-top:8px"><path :d="sparklineLucro" fill="none" stroke="#3b82f6" stroke-width="1.6" stroke-linecap="round"/></svg>
          </div>

          <!-- A Receber -->
          <div style="background:#fff;border:1px solid #e2e5ea;border-radius:16px;padding:15px 14px;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.05)">
            <div style="display:flex;align-items:center;gap:9px">
              <span style="width:36px;height:36px;flex:none;border-radius:50%;background:#e3f7ea;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M10.2 14.2c0 .9.8 1.5 1.8 1.5s1.8-.5 1.8-1.4-.8-1.2-1.8-1.4-1.8-.5-1.8-1.4.8-1.4 1.8-1.4 1.8.6 1.8 1.5"/></svg></span>
              <span style="font-size:10.5px;font-weight:800;letter-spacing:.4px;color:#31363e;white-space:nowrap">A RECEBER</span>
            </div>
            <div style="font-size:20.5px;font-weight:800;letter-spacing:-.7px;color:#0f1216;white-space:nowrap;margin:10px 0 4px" class="truncate">{{ formatCurrency(previsao.aReceber) }}</div>
            <div style="font-size:11.5px;color:#7c828b;font-weight:500;white-space:nowrap">{{ previsao.qtdReceber }} conta(s) pendente(s)</div>
          </div>

          <!-- A Pagar -->
          <div style="background:#fff;border:1px solid #e2e5ea;border-radius:16px;padding:15px 14px;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.05)">
            <div style="display:flex;align-items:center;gap:9px">
              <span style="width:36px;height:36px;flex:none;border-radius:50%;background:#fdeee2;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="13" rx="2.2"/><path d="M4 9.5h16M7.5 14.5h3"/></svg></span>
              <span style="font-size:10.5px;font-weight:800;letter-spacing:.4px;color:#31363e;white-space:nowrap">A PAGAR</span>
            </div>
            <div style="font-size:20.5px;font-weight:800;letter-spacing:-.7px;color:#0f1216;white-space:nowrap;margin:10px 0 4px" class="truncate">{{ formatCurrency(previsao.aPagar) }}</div>
            <div style="font-size:11.5px;color:#7c828b;font-weight:500;white-space:nowrap">{{ previsao.qtdPagar }} conta(s) pendente(s)</div>
          </div>

          <!-- Contas Vencidas -->
          <div style="background:#fff;border:1px solid #e2e5ea;border-radius:16px;padding:15px 14px;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.05)">
            <div style="display:flex;align-items:center;gap:9px">
              <span style="width:36px;height:36px;flex:none;border-radius:50%;background:#fdeaea;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 3.5 19h17z"/><path d="M12 10v4M12 16.5v.01" stroke-width="2.2"/></svg></span>
              <span style="font-size:10.5px;font-weight:800;letter-spacing:.4px;color:#31363e;white-space:nowrap">CONTAS VENCIDAS</span>
            </div>
            <div style="font-size:20.5px;font-weight:800;letter-spacing:-.7px;color:#0f1216;white-space:nowrap;margin:10px 0 4px">{{ financeiro.contasVencidas }}</div>
            <div style="font-size:11.5px;font-weight:500;white-space:nowrap">
              <template v-if="financeiro.contasVencidas > 0"><b style="color:#dc2626;font-weight:700">{{ formatCurrency(financeiro.valorContasVencidas) }}</b> <span style="color:#5a6069">em aberto</span></template>
              <template v-else><span style="color:#16a34a;font-weight:600">tudo em dia ✅</span></template>
            </div>
          </div>

          <!-- Saldo Previsto -->
          <div style="background:#fff;border:1px solid #e2e5ea;border-radius:16px;padding:15px 14px;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.05)">
            <div style="display:flex;align-items:center;gap:9px">
              <span style="width:36px;height:36px;flex:none;border-radius:50%;background:#f1eafd;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.4" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="2.1"/><circle cx="15.5" cy="8.5" r="2.1"/><circle cx="8.5" cy="15.5" r="2.1"/><circle cx="15.5" cy="15.5" r="2.1"/></svg></span>
              <span style="font-size:10.5px;font-weight:800;letter-spacing:.4px;color:#31363e;white-space:nowrap">SALDO PREVISTO</span>
            </div>
            <div style="font-size:20.5px;font-weight:800;letter-spacing:-.7px;color:#0f1216;white-space:nowrap;margin:10px 0 4px" class="truncate">{{ formatCurrency(previsao.saldo) }}</div>
            <div style="font-size:11.5px;color:#7c828b;font-weight:500;white-space:nowrap">receber - pagar (não pagas)</div>
          </div>
        </div>

      <!-- ═══════════════════════════════════ ROW: EVOLUÇÃO DA RECEITA + STATUS DE PRODUÇÃO -->
      <div class="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-3.5 mt-3.5">
          <!-- Evolução da Receita -->
          <div>
            <DashboardCharts
              :evolucao-mensal="evolucaoMensal"
              :format-currency="formatCurrency"
            />
          </div>

          <!-- Status de Produção -->
          <div class="xl:mb-[44px]" style="background:#fff;border:1px solid #e2e5ea;border-radius:18px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,.05)">
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div style="font-size:15.5px;font-weight:700;color:#0f1216;letter-spacing:-.2px">Status de Produção</div>
              <NuxtLink to="/adesivos-ordens-servico" style="display:flex;align-items:center;gap:8px;border:1px solid #e5e5e2;border-radius:10px;padding:8px 13px;font-size:12.5px;font-weight:600;color:#31363e;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.03)">Ver detalhes <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></NuxtLink>
            </div>
            <div style="display:flex;align-items:center;gap:26px;margin-top:20px;padding:0 4px">
              <div style="position:relative;flex:none">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="62" fill="none" stroke="#e9ebee" stroke-width="15" />
                  <circle
                    v-for="(seg, i) in producaoSegmentsBig"
                    :key="`ps${i}`"
                    cx="75" cy="75" r="62"
                    fill="none"
                    :stroke="seg.color"
                    stroke-width="15"
                    stroke-linecap="round"
                    :stroke-dasharray="`${seg.dash} ${ringBig - seg.dash}`"
                    :stroke-dashoffset="seg.offset"
                    transform="rotate(-90 75 75)"
                  />
                </svg>
                <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                  <div style="font-size:29px;font-weight:800;color:#0f1216;line-height:1">{{ producaoTotalGeral }}</div>
                  <div style="font-size:11px;color:#6b7079;font-weight:500;margin-top:3px">OS no total</div>
                </div>
              </div>
              <div style="flex:1;display:flex;flex-direction:column;gap:17px">
                <div style="display:flex;align-items:center;gap:12px">
                  <span style="width:28px;height:28px;flex:none;border-radius:50%;background:#e4edfd;display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 5 5v1"/></svg></span>
                  <span style="font-size:19px;font-weight:800;color:#0f1216;min-width:16px">{{ producao.osEmProducao }}</span>
                  <div style="flex:1;line-height:1.25;margin-left:4px"><div style="font-size:13px;font-weight:700;color:#2563eb">OS em Produção</div><div style="font-size:11.5px;color:#8b9099">Ordens de Serviço ativas</div></div>
                  <span style="font-size:15px;font-weight:800;color:#0f1216">{{ producaoPctGeral(producao.osEmProducao) }}%</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                  <span style="width:28px;height:28px;flex:none;border-radius:50%;background:#e3f7ea;display:flex;align-items:center;justify-content:center"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="7.5"/></svg></span>
                  <span style="font-size:19px;font-weight:800;color:#0f1216;min-width:16px">{{ producao.osProntas }}</span>
                  <div style="flex:1;line-height:1.25;margin-left:4px"><div style="font-size:13px;font-weight:700;color:#16a34a">OS Prontas</div><div style="font-size:11.5px;color:#8b9099">Finalizadas e entregues</div></div>
                  <span style="font-size:15px;font-weight:800;color:#0f1216">{{ producaoPctGeral(producao.osProntas) }}%</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                  <span style="width:28px;height:28px;flex:none;border-radius:50%;background:#cffafe;display:flex;align-items:center;justify-content:center"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h4"/></svg></span>
                  <span style="font-size:19px;font-weight:800;color:#0f1216;min-width:16px">{{ producao.osFaturamento }}</span>
                  <div style="flex:1;line-height:1.25;margin-left:4px"><div style="font-size:13px;font-weight:700;color:#0891b2">Faturamento</div><div style="font-size:11.5px;color:#8b9099">Nota / conferência / pagamento</div></div>
                  <span style="font-size:15px;font-weight:800;color:#0f1216">{{ producaoPctGeral(producao.osFaturamento) }}%</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                  <span style="width:28px;height:28px;flex:none;border-radius:50%;background:#f1eafd;display:flex;align-items:center;justify-content:center"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2" fill="#7c3aed" stroke="none"/></svg></span>
                  <span style="font-size:19px;font-weight:800;color:#0f1216;min-width:16px">{{ producao.processosAtivos }}</span>
                  <div style="flex:1;line-height:1.25;margin-left:4px"><div style="font-size:13px;font-weight:700;color:#7c3aed">Processos Ativos</div><div style="font-size:11.5px;color:#8b9099">Processos em andamento</div></div>
                  <span style="font-size:15px;font-weight:800;color:#0f1216">{{ producaoPctGeral(producao.processosAtivos) }}%</span>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                  <span style="width:28px;height:28px;flex:none;border-radius:50%;background:#fdeee2;display:flex;align-items:center;justify-content:center"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 4.5 18h15z"/></svg></span>
                  <span style="font-size:19px;font-weight:800;color:#0f1216;min-width:16px">{{ producao.osAtrasadas }}</span>
                  <div style="flex:1;line-height:1.25;margin-left:4px"><div style="font-size:13px;font-weight:700;color:#ef4444">OS com prazo vencido</div><div style="font-size:11.5px;color:#8b9099">Requer atenção urgente</div></div>
                  <span style="font-size:15px;font-weight:800;color:#0f1216">{{ producaoPctGeral(producao.osAtrasadas) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- ═══════════════════════════════ ROW: PIPELINE + ATIVIDADES + RESUMO FINANCEIRO -->
      <div class="grid grid-cols-1 xl:grid-cols-[1.42fr_1fr_1.89fr] gap-3.5 mt-3.5">
        <!-- Pipeline de Orçamentos -->
        <div style="background:#fff;border:1px solid #e2e5ea;border-radius:18px;padding:18px 20px;box-shadow:0 1px 3px rgba(0,0,0,.05);display:flex;flex-direction:column">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="font-size:15.5px;font-weight:700;color:#0f1216;letter-spacing:-.2px">Pipeline de Orçamentos</div>
            <div style="display:flex;align-items:center;gap:8px;border:1px solid #e5e5e2;border-radius:10px;padding:8px 13px;font-size:12.5px;font-weight:600;color:#31363e;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.03)">{{ periodoLabel }} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></div>
          </div>

          <template v-if="pipelineTotal > 0">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);margin-top:22px">
              <div style="padding-right:12px">
                <div style="font-size:12px;color:#6b7079;font-weight:500">Rascunho</div>
                <div style="font-size:25px;font-weight:800;color:#0f1216;margin:4px 0 3px;letter-spacing:-.5px">{{ pipeline.rascunho }}</div>
                <div style="font-size:11.5px;color:#4b5159;font-weight:600;white-space:nowrap">{{ pipelinePct(pipeline.rascunho) }}% do total</div>
              </div>
              <div style="padding:0 0 0 14px;border-left:1px solid #ececea">
                <div style="font-size:12px;color:#6b7079;font-weight:500">Enviado</div>
                <div style="font-size:25px;font-weight:800;color:#0f1216;margin:4px 0 3px;letter-spacing:-.5px">{{ pipeline.enviado }}</div>
                <div style="font-size:11.5px;color:#4b5159;font-weight:600;white-space:nowrap">{{ formatCurrency(pipeline.valorEmNegociacao) }}</div>
              </div>
              <div style="padding:0 0 0 14px;border-left:1px solid #ececea">
                <div style="font-size:12px;color:#6b7079;font-weight:500">Aprovado</div>
                <div style="font-size:25px;font-weight:800;color:#16a34a;margin:4px 0 3px;letter-spacing:-.5px">{{ pipeline.aprovado }}</div>
                <div style="font-size:11.5px;color:#4b5159;font-weight:600;white-space:nowrap">{{ pipelinePct(pipeline.aprovado) }}% do total</div>
              </div>
              <div style="padding:0 0 0 14px;border-left:1px solid #ececea">
                <div style="font-size:12px;color:#6b7079;font-weight:500">Rej./Venc.</div>
                <div style="font-size:25px;font-weight:800;color:#0f1216;margin:4px 0 3px;letter-spacing:-.5px">{{ pipeline.rejeitado + pipeline.vencido }}</div>
                <div style="font-size:11.5px;color:#4b5159;font-weight:600;white-space:nowrap">{{ pipelinePct(pipeline.rejeitado + pipeline.vencido) }}% do total</div>
              </div>
            </div>

            <div style="display:flex;gap:3px;margin-top:22px;height:8px">
              <div v-if="pipeline.rascunho > 0" style="background:#3652ad;border-radius:4px 0 0 4px" :style="{ flex: pipeline.rascunho }" />
              <div v-if="pipeline.enviado > 0" style="background:#fc6404" :style="{ flex: pipeline.enviado }" />
              <div v-if="pipeline.aprovado > 0" style="background:#22a749" :style="{ flex: pipeline.aprovado }" />
              <div v-if="(pipeline.rejeitado + pipeline.vencido) > 0" style="background:#a78bfa;border-radius:0 4px 4px 0" :style="{ flex: pipeline.rejeitado + pipeline.vencido }" />
            </div>

            <div style="margin-top:22px;background:#f5f5f3;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:14px">
              <div style="flex:none">
                <div style="font-size:12px;color:#6b7079;font-weight:500">Taxa de Conversão</div>
                <div style="font-size:24px;font-weight:800;color:#0f1216;letter-spacing:-.5px;margin-top:2px">{{ taxaConversao.toFixed(1).replace('.', ',') }}%</div>
              </div>
              <div style="flex:1;text-align:center;font-size:12px;font-weight:600;color:#6b7079">aprovados ÷ respondidos</div>
              <div style="flex:none;width:46px;height:46px;border-radius:13px;background:#ddf3e4;display:flex;align-items:center;justify-content:center">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5l4.5-4.5 3.5 2.5 6.5-6.5M19.5 8v4.5H15"/></svg>
              </div>
            </div>
          </template>

          <div v-else style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 0;gap:8px">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c7cdd6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>
            <p style="font-size:13.5px;font-weight:600;color:#9aa1ab">Nenhum orçamento no período</p>
          </div>
        </div>

        <!-- Atividades Recentes -->
        <div style="background:#fff;border:1px solid #e2e5ea;border-radius:18px;padding:18px 18px;box-shadow:0 1px 3px rgba(0,0,0,.05)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div style="font-size:15.5px;font-weight:700;color:#0f1216;letter-spacing:-.2px">Atividades Recentes</div>
            <NuxtLink to="/adesivos-orcamentos" style="font-size:12.5px;font-weight:700;color:#3b82f6">Ver todas</NuxtLink>
          </div>

          <div v-if="atividadesDashboard.length > 0 || producao.osAtrasadas > 0" style="position:relative;display:flex;flex-direction:column;gap:18px">
            <NuxtLink
              v-for="item in atividadesDashboard.slice(0, 4)"
              :key="`${item.tipo}-${item.id}`"
              :to="atividadeRoute(item)"
              style="display:flex;align-items:flex-start;gap:10px;position:relative"
            >
              <span :style="{ width:'33px', height:'33px', flex:'none', borderRadius:'10px', background: atividadeSquareBg(item.tipo), display:'flex', alignItems:'center', justifyContent:'center' }">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" :stroke="atividadeSquareColor(item.tipo)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6m-6 4h4m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.6a1 1 0 0 1 .7.3l5.4 5.4a1 1 0 0 1 .3.7V19a2 2 0 0 1-2 2z"/></svg>
              </span>
              <div style="flex:1;line-height:1.35;min-width:0">
                <div style="font-size:12.5px;font-weight:700;color:#0f1216" class="truncate">{{ item.descricao }}</div>
                <div v-if="item.clienteNome" style="font-size:11.5px;color:#8b9099;margin-top:1px" class="truncate">Cliente: {{ item.clienteNome }}</div>
              </div>
              <span style="font-size:10.5px;color:#9aa1ab;font-weight:500;white-space:nowrap">{{ tempoRelativo(item.criadoEm) }}</span>
            </NuxtLink>

            <!-- Alerta de prazo vencido (data-backed) -->
            <NuxtLink v-if="producao.osAtrasadas > 0" to="/adesivos-ordens-servico" style="display:flex;align-items:center;gap:10px;position:relative;background:#fceceb;border-radius:12px;padding:11px 12px;margin:2px -4px 0">
              <span style="width:33px;height:33px;flex:none;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 3.5 19h17z"/><path d="M12 10v4M12 16.5v.01" stroke-width="2.2"/></svg></span>
              <div style="flex:1;line-height:1.35;min-width:0">
                <div style="font-size:12.5px;font-weight:700;color:#b91c1c" class="truncate">{{ producao.osAtrasadas }} OS com prazo vencido</div>
                <div style="font-size:11.5px;color:#a05252;margin-top:1px">Requer atenção urgente</div>
              </div>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a05252" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
            </NuxtLink>
          </div>

          <div v-else style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 0;gap:8px">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c7cdd6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>
            <p style="font-size:13.5px;font-weight:600;color:#9aa1ab">Nenhuma atividade recente</p>
          </div>
        </div>

        <!-- Resumo Financeiro (card escuro com anel) -->
        <div class="xl:-mt-[44px]" style="background:linear-gradient(150deg,#16181c,#0d0e11);border-radius:18px;padding:18px 22px;position:relative;overflow:hidden;color:#e5e7eb">
          <div style="position:absolute;right:-70px;top:-40px;width:300px;height:300px;border-radius:50%;border:1px solid rgba(255,255,255,.04)"></div>
          <div style="position:absolute;right:-30px;top:0;width:280px;height:280px;border-radius:50%;border:1px solid rgba(255,255,255,.035)"></div>
          <div style="position:absolute;right:10px;bottom:-90px;width:260px;height:260px;border-radius:50%;border:1px solid rgba(255,255,255,.04)"></div>

          <div style="position:relative;display:flex;align-items:center;justify-content:space-between">
            <div style="font-size:15.5px;font-weight:700;color:#fff;letter-spacing:-.2px">Resumo Financeiro</div>
            <span style="display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:8px 13px;font-size:12.5px;font-weight:600;color:#e5e7eb">{{ periodoLabel }}</span>
          </div>

          <div style="position:relative;display:flex;align-items:center;gap:26px;margin-top:14px">
            <!-- Anel receitas/despesas/lucro -->
            <div style="position:relative;flex:none;width:180px;height:180px">
              <svg width="180" height="180" viewBox="0 0 120 120" style="transform:rotate(-90deg)">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="12" />
                <circle
                  v-for="(seg, i) in resumoSegments"
                  :key="`rs${i}`"
                  cx="60" cy="60" r="50"
                  fill="none"
                  :stroke="seg.color"
                  stroke-width="12"
                  :stroke-dasharray="`${seg.dash} ${seg.gap}`"
                  :stroke-dashoffset="seg.offset"
                />
              </svg>
              <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
                <div style="font-size:11px;color:#9aa4b2;font-weight:500">Lucro Estimado</div>
                <div style="font-size:19px;font-weight:800;color:#fff;letter-spacing:-.5px;margin:3px 0" class="truncate">{{ formatCurrency(financeiro.lucroEstimado) }}</div>
                <div style="font-size:11px;font-weight:700" :style="{ color: varColor(variacaoLucro) }">{{ fmtVar(variacaoLucro) }}</div>
              </div>
            </div>

            <!-- Lista -->
            <div style="flex:1;display:flex;flex-direction:column;min-width:0">
              <div style="display:flex;align-items:center;gap:11px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07)">
                <span style="width:13px;height:13px;border-radius:50%;background:#22c55e;box-shadow:0 3px 8px rgba(34,197,94,.4)"></span>
                <span style="flex:1;font-size:13.5px;font-weight:500;color:#d3d8de">Receitas</span>
                <span style="font-size:13.5px;font-weight:800;color:#fff;letter-spacing:-.2px" class="truncate">{{ formatCurrency(financeiro.faturamento) }}</span>
                <span style="font-size:12px;color:#9aa4b2;width:38px;text-align:right;font-weight:500">{{ resumoPct(financeiro.faturamento) }}%</span>
              </div>
              <div style="display:flex;align-items:center;gap:11px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07)">
                <span style="width:13px;height:13px;border-radius:50%;background:#ef4444;box-shadow:0 3px 8px rgba(239,68,68,.4)"></span>
                <span style="flex:1;font-size:13.5px;font-weight:500;color:#d3d8de">Despesas</span>
                <span style="font-size:13.5px;font-weight:800;color:#fff;letter-spacing:-.2px" class="truncate">{{ formatCurrency(financeiro.despesas) }}</span>
                <span style="font-size:12px;color:#9aa4b2;width:38px;text-align:right;font-weight:500">{{ resumoPct(financeiro.despesas) }}%</span>
              </div>
              <div style="display:flex;align-items:center;gap:11px;padding:14px 0">
                <span style="width:13px;height:13px;border-radius:50%;background:#3b82f6;box-shadow:0 3px 8px rgba(59,130,246,.4)"></span>
                <span style="flex:1;font-size:13.5px;font-weight:500;color:#d3d8de">Lucro</span>
                <span style="font-size:13.5px;font-weight:800;color:#fff;letter-spacing:-.2px" class="truncate">{{ formatCurrency(financeiro.lucroEstimado) }}</span>
                <span style="font-size:12px;color:#9aa4b2;width:38px;text-align:right;font-weight:500">{{ resumoPct(financeiro.lucroEstimado) }}%</span>
              </div>
            </div>
          </div>

          <NuxtLink to="/financeiro" style="position:relative;margin-top:10px;height:42px;padding:0 18px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#e5e7eb;font-weight:600;font-size:13px;display:flex;align-items:center;gap:10px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3.5" width="16" height="17" rx="2.2"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/></svg>
            Ver relatório completo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-left:auto"><path d="M9 6l6 6-6 6"/></svg>
          </NuxtLink>
        </div>
      </div>
      </div>
      <!-- ═══ fim painel de conteúdo ═══ -->

      <!-- FAB — Nova OS -->
      <NuxtLink to="/adesivos-ordens-servico" class="hidden xl:flex" style="position:fixed;right:38px;bottom:28px;width:60px;height:60px;border-radius:50%;background:#fc6404;color:#fff;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(249,115,22,.45);z-index:40" title="Nova Ordem de Serviço">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </NuxtLink>

      <!-- Botão "Tentar novamente" após timeout de 10s -->
      <div v-if="loading && loadingTimeout" class="flex justify-center mb-6">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-primary-10 bg-theme-card shadow-sm text-sm font-bold text-primary hover:bg-primary-5 transition-colors"
          @click="refresh()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
          Tentar novamente
        </button>
      </div>

    </template>

    <!-- Loading inicial -->
    <div v-if="adminLoading" class="flex items-center justify-center py-32">
      <span class="spinner spinner-md" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import { useEmpresa } from '~/composables/useEmpresa'
import { useDashboardAdmin } from '~/composables/useDashboardAdmin'
import { createSupabaseClient } from '~/lib/supabase'
import AppNavIcon from '~/components/AppNavIcon.vue'

const supabase = createSupabaseClient()
const { isAdmin, isAdminOrGerente, adminLoading } = useAdmin()
const { empresaId, userPerfil, loadEmpresa } = useEmpresa()
const { formatCurrency } = useLocale()

// ── Dashboard Admin Composable ──────────────────────────────────────────────
const { periodoFiltro, periodoCustom, periodoLabel, periodoRange, loading, financeiro, previsao, pipeline, producao, atividades: atividadesDashboard, alertas, topClientes, evolucaoMensal, comparativo, ticketMedio, proximosVencimentos, refresh } = useDashboardAdmin()

// ── Loading timeout: botão "Tentar novamente" após 10s ──────────────────────
const loadingTimeout = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | null = null

// ── Pipeline total (for progress bar) ───────────────────────────────────────
const pipelineTotal = computed(() =>
  pipeline.value.rascunho + pipeline.value.enviado + pipeline.value.aprovado + pipeline.value.rejeitado + pipeline.value.vencido
)

// ── Taxa de conversão ────────────────────────────────────────────────────────
const taxaConversao = computed(() => {
  const { aprovado, enviado, rejeitado, vencido } = pipeline.value
  const total = aprovado + enviado + rejeitado + vencido
  if (total === 0) return 0
  return (aprovado / total) * 100
})

// ── Anéis (donut SVG) — helper de segmentos ──────────────────────────────────
const ringCircumference = 2 * Math.PI * 50 // r = 50 (viewBox 120)
const ringBig = 2 * Math.PI * 62           // r = 62 (viewBox 150)

interface RingSegment { value: number; color: string }
function buildRingSegments(items: RingSegment[], radius = 50) {
  const C = 2 * Math.PI * radius
  const total = items.reduce((s, i) => s + Math.max(i.value, 0), 0)
  if (total <= 0) return []
  let acc = 0
  const gapPx = 2 // pequeno espaço entre segmentos
  return items
    .filter(i => i.value > 0)
    .map(i => {
      const frac = i.value / total
      const dash = Math.max(frac * C - gapPx, 0)
      const offset = -acc * C
      acc += frac
      return { color: i.color, dash, offset, gap: C - dash }
    })
}

// ── Percentuais / variações ──────────────────────────────────────────────────
function pipelinePct(val: number): number {
  if (pipelineTotal.value === 0) return 0
  return Math.round((val / pipelineTotal.value) * 100)
}

const variacaoLucro = computed(() => {
  const lucroAnterior = comparativo.value.faturamentoAnterior - comparativo.value.despesasAnterior
  const lucroAtual = financeiro.value.lucroEstimado
  if (lucroAnterior <= 0) return 0
  return ((lucroAtual - lucroAnterior) / lucroAnterior) * 100
})

function fmtVar(v: number): string {
  const sign = v >= 0 ? '+' : ''
  return `${sign}${v.toFixed(1).replace('.', ',')}%`
}
function varColor(v: number): string {
  return v >= 0 ? '#16a34a' : '#dc2626'
}

const totalAlertas = computed(() =>
  (alertas.value.osAtrasadas > 0 ? 1 : 0) +
  (alertas.value.contasVencidas > 0 ? 1 : 0) +
  (alertas.value.orcamentosExpirando > 0 ? 1 : 0)
)

// ── Status de Produção (donut) ───────────────────────────────────────────────
const producaoTotalGeral = computed(() =>
  producao.value.osEmProducao + producao.value.osProntas + producao.value.osFaturamento + producao.value.processosAtivos + producao.value.osAtrasadas
)
function producaoPctGeral(val: number): number {
  if (producaoTotalGeral.value === 0) return 0
  return Math.round((val / producaoTotalGeral.value) * 100)
}
const producaoSegmentsBig = computed(() => buildRingSegments([
  { value: producao.value.osEmProducao, color: '#3b82f6' },
  { value: producao.value.osProntas, color: '#22c55e' },
  { value: producao.value.osFaturamento, color: '#06b6d4' },
  { value: producao.value.processosAtivos, color: '#a855f7' },
  { value: producao.value.osAtrasadas, color: '#f59e0b' },
], 62))

// ── Resumo Financeiro (donut) ────────────────────────────────────────────────
const resumoTotal = computed(() =>
  Math.max(financeiro.value.faturamento, 0) + Math.max(financeiro.value.despesas, 0) + Math.max(financeiro.value.lucroEstimado, 0)
)
function resumoPct(val: number): number {
  if (resumoTotal.value === 0) return 0
  return Math.round((Math.max(val, 0) / resumoTotal.value) * 100)
}
const resumoSegments = computed(() => buildRingSegments([
  { value: financeiro.value.faturamento, color: '#22c55e' },
  { value: financeiro.value.despesas, color: '#ef4444' },
  { value: financeiro.value.lucroEstimado, color: '#3b82f6' },
], 50))

// ── Atividade: cores do ícone (hex, para inline style) ───────────────────────
function atividadeSquareBg(tipo: string): string {
  switch (tipo) {
    case 'orcamento_criado': return '#e4edfd'
    case 'orcamento_aprovado': return '#dff3e6'
    case 'os_criada': return '#f1eafd'
    case 'conta_criada': return '#fdeee2'
    default: return '#eef0f2'
  }
}
function atividadeSquareColor(tipo: string): string {
  switch (tipo) {
    case 'orcamento_criado': return '#2563eb'
    case 'orcamento_aprovado': return '#16a34a'
    case 'os_criada': return '#7c3aed'
    case 'conta_criada': return '#ea580c'
    default: return '#6b7079'
  }
}

// ── Sparkline helpers ────────────────────────────────────────────────────────
function buildSparklinePath(values: number[]): string {
  if (values.length === 0) return 'M 0,15 L 100,15'
  const max = Math.max(...values)
  // Se todos os valores são zero ou negativos, mostra linha reta
  if (max <= 0) return 'M 0,28 L 100,28'
  const step = 100 / Math.max(values.length - 1, 1)
  const pts = values.map((v, i) => ({ x: i * step, y: 28 - (Math.max(v, 0) / max) * 26 }))
  if (pts.length < 2) return `M ${pts[0].x},${pts[0].y}`
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]
    const p1 = pts[i]
    const dx = p1.x - p0.x
    const cp1x = (p0.x + dx * 0.4).toFixed(1)
    const cp2x = (p1.x - dx * 0.4).toFixed(1)
    d += ` C ${cp1x},${p0.y.toFixed(1)} ${cp2x},${p1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`
  }
  return d
}

const sparklineFaturamento = computed(() =>
  buildSparklinePath(evolucaoMensal.value.map(e => e.faturamento))
)
const sparklineDespesas = computed(() =>
  buildSparklinePath(evolucaoMensal.value.map(e => e.despesas))
)
const sparklineLucro = computed(() =>
  buildSparklinePath(evolucaoMensal.value.map(e => e.faturamento - e.despesas))
)

watch(loading, (isLoading) => {
  if (isLoading) {
    loadingTimeout.value = false
    loadingTimer = setTimeout(() => {
      if (loading.value) {
        loadingTimeout.value = true
      }
    }, 10_000)
  } else {
    loadingTimeout.value = false
    if (loadingTimer) {
      clearTimeout(loadingTimer)
      loadingTimer = null
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
  // Limpar listener de visibilidade
  document.removeEventListener('visibilitychange', handleVisibilityRefresh)
})

// ── Auto-refresh ao voltar para a página ────────────────────────────────────
function handleVisibilityRefresh() {
  if (document.visibilityState === 'visible' && !loading.value) {
    refresh()
  }
}
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', handleVisibilityRefresh)
}
// ── Tempo relativo helper ───────────────────────────────────────────────────
function tempoRelativo(isoDate: string): string {
  const agora = Date.now()
  const data = new Date(isoDate).getTime()
  const diffMs = agora - data
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`
  const diffHoras = Math.floor(diffMin / 60)
  if (diffHoras < 24) return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
  const diffDias = Math.floor(diffHoras / 24)
  if (diffDias < 30) return `há ${diffDias} dia${diffDias > 1 ? 's' : ''}`
  const diffMeses = Math.floor(diffDias / 30)
  return `há ${diffMeses} ${diffMeses > 1 ? 'meses' : 'mês'}`
}

// ── Atividade route helper ──────────────────────────────────────────────────
function atividadeRoute(item: { id: number; tipo: string }): string {
  switch (item.tipo) {
    case 'orcamento_criado':
    case 'orcamento_aprovado':
      return '/adesivos-orcamentos'
    case 'os_criada':
      return '/adesivos-pedidos'
    case 'conta_criada':
      return '/financeiro'
    default:
      return '/'
  }
}

// ── Atividade icon class helper ─────────────────────────────────────────────
function atividadeIconClass(tipo: string): string {
  switch (tipo) {
    case 'orcamento_criado': return 'text-blue-500'
    case 'orcamento_aprovado': return 'text-green-500'
    case 'os_criada': return 'text-purple-500'
    case 'conta_criada': return 'text-orange-500'
    default: return 'text-gray-400'
  }
}

// ── Filtros painel admin ────────────────────────────────────────────────────
const filtroAberto = ref(false)

const periodoOpcoes = [
  { value: 'mes_atual',       label: 'Mês Atual' },
  { value: 'semana_atual',    label: 'Semana Atual' },
  { value: 'trimestre_atual', label: 'Trimestre Atual' },
  { value: 'ano_atual',       label: 'Ano Atual' },
  { value: 'personalizado',   label: 'Personalizado' },
]

const mesesOpcoes = [
  { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' }, { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },   { value: 5, label: 'Maio' },      { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },   { value: 8, label: 'Agosto' },    { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },{ value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' },
]

const anosOpcoes = computed(() => {
  const y = new Date().getFullYear()
  return [y - 2, y - 1, y, y + 1]
})

function resetarFiltros() {
  periodoFiltro.value = 'mes_atual'
  periodoCustom.value = { mes: new Date().getMonth() + 1, ano: new Date().getFullYear() }
}

// periodoLabelAtual now delegates to the composable's periodoLabel
const periodoLabelAtual = periodoLabel

// �"?�"? FUNCIONÁRIO: atividades �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
interface AtividadeFuncionario {
  id: number
  titulo: string
  descricao: string | null
  status: string | null
  prioridade: string | null
  periodicidade: string | null
  data_atividade: string | null
  hora_inicio: string | null
  hora_fim: string | null
  observacao: string | null
}
interface FuncionarioLite { id: number; nome: string; cargo: string | null }

const funcionarioLogado  = ref<FuncionarioLite | null>(null)
const minhasAtividades   = ref<AtividadeFuncionario[]>([])
const loadingAtividades  = ref(true)
const atualizando        = ref<number | null>(null)
const tabAtiva           = ref<'hoje' | 'semana' | 'quinzena' | 'mes'>('hoje')

const tabs = [
  { label: 'Hoje',     value: 'hoje'     },
  { label: 'Semana',   value: 'semana'   },
  { label: 'Quinzena', value: 'quinzena' },
  { label: 'Mês',      value: 'mes'      },
] as const

// �"?�"? Datas de referência �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
const hoje = new Date()
hoje.setHours(0, 0, 0, 0)

const dataHoje = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function inicioSemana(): Date {
  const d = new Date(hoje)
  const dia = d.getDay() // 0=Dom
  d.setDate(d.getDate() - dia)
  return d
}
function fimSemana(): Date {
  const d = new Date(inicioSemana())
  d.setDate(d.getDate() + 6)
  return d
}
function inicioQuinzena(): Date {
  const d = new Date(hoje)
  d.setDate(hoje.getDate() <= 15 ? 1 : 16)
  return d
}
function fimQuinzena(): Date {
  const d = new Date(hoje)
  if (hoje.getDate() <= 15) {
    d.setDate(15)
  } else {
    d.setMonth(d.getMonth() + 1, 0) // último dia do mês
  }
  return d
}
function inicioMes(): Date {
  return new Date(hoje.getFullYear(), hoje.getMonth(), 1)
}
function fimMes(): Date {
  return new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
}

function ativasTab(tab: string): AtividadeFuncionario[] {
  return atividadesPorTab(tab).filter(a => a.status !== 'concluida' && a.status !== 'cancelada')
}
function concluidasTab(tab: string): AtividadeFuncionario[] {
  return atividadesPorTab(tab).filter(a => a.status === 'concluida')
}

const frasesMotivacionais = [
  'Cada cliente que sai daqui carrega sua arte no rosto!',
  'Beleza é o reflexo do cuidado que você dedica a cada atendimento.',
  'Um serviço especial faz toda a diferença no dia do cliente!',
  'Sua habilidade transforma autoestima — isso é incrível!',
  'Organização e dedicação são o segredo de um salão de sucesso.',
  'Hoje é mais um dia para encantar e fazer a diferença!',
  'Cada detalhe importa quando o objetivo é a excelência.',
  'Clientes satisfeitos são a melhor propaganda do seu trabalho.',
]
const fraseAtual = computed(() => {
  const idx = new Date().getDate() % frasesMotivacionais.length
  return frasesMotivacionais[idx]
})

function atividadesPorTab(tab: string): AtividadeFuncionario[] {
  const todaIso = toISODate(hoje)
  return minhasAtividades.value.filter(a => {
    const dataAtiv = a.data_atividade
    if (tab === 'hoje') {
      // diárias de hoje OU sem data definida com periodicidade diária
      if (a.periodicidade === 'diaria') {
        return !dataAtiv || dataAtiv === todaIso
      }
      return dataAtiv === todaIso
    }
    if (tab === 'semana') {
      if (a.periodicidade !== 'diaria') return false
      if (!dataAtiv) return true // recorrente diária sem data fixa
      return dataAtiv >= toISODate(inicioSemana()) && dataAtiv <= toISODate(fimSemana())
    }
    if (tab === 'quinzena') {
      if (a.periodicidade !== 'quinzenal') return false
      if (!dataAtiv) return true
      return dataAtiv >= toISODate(inicioQuinzena()) && dataAtiv <= toISODate(fimQuinzena())
    }
    if (tab === 'mes') {
      if (a.periodicidade !== 'mensal') return false
      if (!dataAtiv) return true
      return dataAtiv >= toISODate(inicioMes()) && dataAtiv <= toISODate(fimMes())
    }
    return false
  })
}

function countAtivStatus(s: string) {
  return minhasAtividades.value.filter(a => a.status === s).length
}

function primeiroNome(nome: string) {
  return nome.split(' ')[0]
}

function formatarData(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function statusLabel(s: string | null) {
  if (s === 'pendente')     return 'Pendente'
  if (s === 'em_andamento') return 'Em Andamento'
  if (s === 'concluida')    return 'Concluída'
  if (s === 'cancelada')    return 'Cancelada'
  return s ?? '�?"'
}
function statusBadgeClass(s: string | null) {
  if (s === 'pendente')     return 'bg-primary-10 text-primary'
  if (s === 'em_andamento') return 'bg-blue-100 text-blue-700'
  if (s === 'concluida')    return 'bg-green-100 text-green-700'
  if (s === 'cancelada')    return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}
function statusDotClass(s: string | null) {
  if (s === 'pendente')     return 'bg-primary'
  if (s === 'em_andamento') return 'bg-blue-500'
  if (s === 'concluida')    return 'bg-green-500'
  if (s === 'cancelada')    return 'bg-red-500'
  return 'bg-gray-400'
}
function prioridadeLabel(p: string | null) {
  if (p === 'baixa')   return 'Baixa'
  if (p === 'media')   return 'Média'
  if (p === 'alta')    return 'Alta'
  if (p === 'urgente') return 'Urgente'
  return p ?? '�?"'
}
function prioridadeBadgeClass(p: string | null) {
  if (p === 'baixa')   return 'bg-gray-100 text-gray-600'
  if (p === 'media')   return 'bg-sky-100 text-sky-700'
  if (p === 'alta')    return 'bg-orange-100 text-orange-700'
  if (p === 'urgente') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-500'
}
function prioridadeAccent(p: string | null) {
  if (p === 'baixa')   return 'bg-gray-300'
  if (p === 'media')   return 'bg-sky-400'
  if (p === 'alta')    return 'bg-orange-400'
  if (p === 'urgente') return 'bg-red-500'
  return 'bg-gray-200'
}
function periodicidadeLabel(p: string | null) {
  if (p === 'diaria')    return 'Diária'
  if (p === 'quinzenal') return 'Quinzenal'
  if (p === 'mensal')    return 'Mensal'
  return p ?? '�?"'
}
function periodicidadeBadgeClass(p: string | null) {
  if (p === 'diaria')    return 'bg-primary-10 text-primary'
  if (p === 'quinzenal') return 'bg-teal-100 text-teal-700'
  if (p === 'mensal')    return 'bg-rose-100 text-rose-700'
  return 'bg-gray-100 text-gray-500'
}

async function alterarStatus(at: AtividadeFuncionario, novoStatus: string) {
  atualizando.value = at.id
  await supabase.from('atividades_funcionarios').update({ status: novoStatus }).eq('id', at.id)
  at.status = novoStatus
  atualizando.value = null
}

// ── Kanban de agendamentos do funcionário ────────────────────
interface AgKanban {
  id: number
  data_hora: string
  status: string
  cliente_nome: string | null
  nome_solicitante: string | null
  cliente_telefone: string | null
  servicos_nomes: string | null
  funcionario_nome: string | null
}

const meuKanban          = ref<AgKanban[]>([])
const meuKanbanLoading   = ref(false)

function getMondayOfWeekFun(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  d.setHours(0, 0, 0, 0)
  return d
}

const meuKanbanSemanaInicio = ref<Date>(getMondayOfWeekFun(new Date()))
const hojeIso = new Date().toISOString().split('T')[0]

const meuKanbanDias = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(meuKanbanSemanaInicio.value)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    return {
      iso,
      diaSemana: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
      diaNum: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
      ehHoje: iso === hojeIso,
    }
  })
)

const meuKanbanMesLabel = computed(() => {
  const dias = meuKanbanDias.value
  const inicio = new Date(dias[0].iso + 'T12:00:00')
  const fim    = new Date(dias[6].iso + 'T12:00:00')
  if (inicio.getMonth() === fim.getMonth())
    return inicio.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  return `${inicio.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')} – ${fim.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}`
})

const meuKanbanPorDia = computed(() => {
  const map: Record<string, AgKanban[]> = {}
  meuKanbanDias.value.forEach(d => { map[d.iso] = [] })
  meuKanban.value.forEach(ag => {
    const key = ag.data_hora.slice(0, 10)
    if (map[key]) map[key].push(ag)
  })
  Object.keys(map).forEach(k => map[k].sort((a, b) => a.data_hora.localeCompare(b.data_hora)))
  return map
})

function meuKanbanSemanaAnterior() {
  const d = new Date(meuKanbanSemanaInicio.value)
  d.setDate(d.getDate() - 7)
  meuKanbanSemanaInicio.value = d
}
function meuKanbanSemanaProxima() {
  const d = new Date(meuKanbanSemanaInicio.value)
  d.setDate(d.getDate() + 7)
  meuKanbanSemanaInicio.value = d
}
function meuKanbanIrParaHoje() {
  meuKanbanSemanaInicio.value = getMondayOfWeekFun(new Date())
}

function agKanbanFormatHora(iso: string) { return iso.slice(11, 16) }

function agKanbanStatusCor(s: string) {
  return { solicitado: 'bg-amber-400', agendado: 'bg-blue-400', confirmado: 'bg-green-400', concluido: 'bg-violet-500', cancelado: 'bg-red-400', faltou: 'bg-orange-400' }[s] ?? 'bg-gray-300'
}
function agKanbanStatusBadge(s: string) {
  return { solicitado: 'bg-amber-100 text-amber-700', agendado: 'bg-blue-100 text-blue-700', confirmado: 'bg-green-100 text-green-700', concluido: 'bg-primary-10 text-primary', cancelado: 'bg-red-100 text-red-600', faltou: 'bg-orange-100 text-orange-600' }[s] ?? 'bg-gray-100 text-gray-600'
}
function agKanbanStatusLabel(s: string) {
  return { solicitado: 'Solicitado', agendado: 'Agendado', confirmado: 'Confirmado', concluido: 'Concluído', cancelado: 'Cancelado', faltou: 'Faltou' }[s] ?? s
}

async function fetchMeuKanban(userId: string, funcId: number, eId: number) {
  meuKanbanLoading.value = true

  // Estratégia 1: agendamentos onde funcionario_id = uuid do usuário logado
  const { data: rowsByUuid } = await supabase
    .from('agendamentos')
    .select('id, data_hora, status, nome_solicitante, telefone_solicitante, funcionario_id, clientes(nome, telefone)')
    .eq('empresa_id', eId)
    .eq('funcionario_id', userId)
    .not('status', 'in', '(cancelado,faltou)')
    .order('data_hora', { ascending: true })

  // Estratégia 2: agendamentos cujo serviço está vinculado ao funcionário (bigint id)
  // — cobre os casos em que funcionario_id ainda é null no banco
  const { data: meusSvcs } = await supabase
    .from('servico_funcionarios')
    .select('servico_id')
    .eq('funcionario_id', funcId)

  const meusSvcIds = (meusSvcs ?? []).map((s: any) => Number(s.servico_id))
  let rowsByServico: any[] = []
  if (meusSvcIds.length) {
    const { data: agLinks } = await supabase
      .from('agendamento_servicos')
      .select('agendamento_id')
      .in('servico_id', meusSvcIds)

    const agIds = [...new Set((agLinks ?? []).map((l: any) => Number(l.agendamento_id)))]
    if (agIds.length) {
      const { data: rowsSvc } = await supabase
        .from('agendamentos')
        .select('id, data_hora, status, nome_solicitante, telefone_solicitante, funcionario_id, clientes(nome, telefone)')
        .eq('empresa_id', eId)
        .in('id', agIds)
        .not('status', 'in', '(cancelado,faltou)')
        .order('data_hora', { ascending: true })
      rowsByServico = rowsSvc ?? []
    }
  }

  // Mescla as duas listas sem duplicar (por id)
  const seenIds = new Set<number>()
  const allRows: any[] = []
  for (const r of [...(rowsByUuid ?? []), ...rowsByServico]) {
    if (!seenIds.has(Number(r.id))) {
      seenIds.add(Number(r.id))
      allRows.push(r)
    }
  }
  allRows.sort((a, b) => a.data_hora.localeCompare(b.data_hora))

  // Busca nomes dos serviços
  const ids = allRows.map((r: any) => r.id)
  let servicosMap: Record<number, string[]> = {}
  if (ids.length) {
    const { data: agSvcs } = await supabase
      .from('agendamento_servicos')
      .select('agendamento_id, servicos(nome)')
      .in('agendamento_id', ids)
    ;(agSvcs ?? []).forEach((row: any) => {
      if (!servicosMap[row.agendamento_id]) servicosMap[row.agendamento_id] = []
      if (row.servicos?.nome) servicosMap[row.agendamento_id].push(row.servicos.nome)
    })
  }

  // Busca nome do profissional direto de funcionarios (cadastro)
  // uuid → nome via profiles.email → funcionarios.nome
  const funcUuids = [...new Set(allRows.map((r: any) => r.funcionario_id).filter(Boolean))] as string[]
  const funcNomeByUuid: Record<string, string> = {}
  if (funcUuids.length) {
    const { data: profs } = await supabase
      .from('profiles').select('id, email').in('id', funcUuids)
    const emailToUuid: Record<string, string> = {}
    ;(profs ?? []).forEach((p: any) => { if (p.email) emailToUuid[p.email.toLowerCase()] = p.id })
    const { data: funcs } = await supabase
      .from('funcionarios').select('nome, email').eq('empresa_id', eId)
    ;(funcs ?? []).forEach((f: any) => {
      if (f.email) {
        const uuid = emailToUuid[f.email.toLowerCase()]
        if (uuid) funcNomeByUuid[uuid] = f.nome
      }
    })
  }

  meuKanban.value = allRows.map((r: any) => ({
    id:               r.id,
    data_hora:        r.data_hora,
    status:           r.status,
    cliente_nome:     r.clientes?.nome ?? null,
    nome_solicitante: r.nome_solicitante ?? null,
    cliente_telefone: r.clientes?.telefone ?? r.telefone_solicitante ?? null,
    servicos_nomes:   servicosMap[r.id]?.join(', ') ?? null,
    funcionario_nome: funcNomeByUuid[r.funcionario_id] ?? null,
  }))
  meuKanbanLoading.value = false
}

// �"?�"? Fetch �"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?�"?
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const email = session?.user?.email
  await loadEmpresa()

  // Funcionário: buscar pelo email
  if (userPerfil.value === 'funcionario') {
    const { data: func } = await supabase
      .from('funcionarios')
      .select('id, nome, cargo')
      .eq('empresa_id', empresaId.value!)
      .ilike('email', email ?? '')
      .maybeSingle()

    if (func) {
      funcionarioLogado.value = func as FuncionarioLite
      const { data: ativs } = await supabase
        .from('atividades_funcionarios')
        .select('id, titulo, descricao, status, prioridade, periodicidade, data_atividade, hora_inicio, hora_fim, observacao')
        .eq('funcionario_id', func.id)
        .eq('empresa_id', empresaId.value!)
        .order('data_atividade', { ascending: true })
      minhasAtividades.value = (ativs ?? []) as AtividadeFuncionario[]
      // Buscar agendamentos do funcionário (por uuid E por serviço vinculado)
      if (session?.user?.id) {
        await fetchMeuKanban(session.user.id, func.id, empresaId.value!)
      }
    }
    loadingAtividades.value = false
    return
  }

  // Admin: buscar resumo
  loadingAtividades.value = false
  // useDashboardAdmin handles its own data fetching via watch({ immediate: true })
})

const atalhos = [
  { to: '/agendamentos',  icon: 'calendar',       title: 'Agendamentos',  minPerfil: 'all'     },
  { to: '/servicos',      icon: 'sparkles',       title: 'Serviços',      minPerfil: 'all'     },
  { to: '/clientes',      icon: 'identification', title: 'Clientes',      minPerfil: 'all'     },
  { to: '/estoque',       icon: 'package',        title: 'Estoque',       minPerfil: 'all'     },
  { to: '/funcionarios',  icon: 'users',          title: 'Funcionários',  minPerfil: 'manager' },
  { to: '/atividades',    icon: 'clipboard',      title: 'Atividades',    minPerfil: 'all'     },
  { to: '/contas-pagar',  icon: 'wallet',         title: 'Contas a Pagar', minPerfil: 'manager' },
  { to: '/configuracoes', icon: 'settings',       title: 'Configurações', minPerfil: 'manager' },
] as const

const atalhosVisiveis = computed(() =>
  atalhos.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value)
)
</script>
