<template>
  <div class="min-h-full p-4 sm:p-8">
    <!-- Header premium -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-2xl">
      <div class="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_55%)]" />
      <div class="absolute bottom-0 right-0 w-[300px] h-[200px] opacity-10" style="background: radial-gradient(circle, #fff, transparent 70%);"></div>
      <div class="relative px-5 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-white/[0.12] backdrop-blur-md border border-white/20 shadow-xl">
              <svg class="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"/></svg>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Marketing</h1>
              <p class="text-sm text-white/70 mt-0.5">Acompanhe leads, campanhas e resultados</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all" @click="activeTab = 'campanhas'; showNovaCompanha = true">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              Nova Campanha
            </button>
          </div>
        </div>

        <!-- Stats premium -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-7">
          <div class="group bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all duration-300">
            <div class="flex items-center justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
              </div>
              <span class="text-[10px] font-bold text-emerald-300 bg-emerald-400/10 px-1.5 py-0.5 rounded">+{{ stats.novos7d }}</span>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-white leading-none">{{ stats.total }}</p>
            <p class="text-[11px] text-white/50 font-medium mt-1">Total de Leads</p>
          </div>
          <div class="group bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all duration-300">
            <div class="flex items-center justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>
              </div>
              <span class="text-[10px] font-bold text-white/60">{{ stats.taxaConversao }}%</span>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-white leading-none">{{ stats.convertidos }}</p>
            <p class="text-[11px] text-white/50 font-medium mt-1">Conversões</p>
          </div>
          <div class="group bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all duration-300">
            <div class="flex items-center justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-white leading-none">R$12</p>
            <p class="text-[11px] text-white/50 font-medium mt-1">Custo / Lead</p>
          </div>
          <div class="group bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-all duration-300">
            <div class="flex items-center justify-between mb-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
              </div>
              <span class="text-[10px] font-bold text-amber-300">{{ campanhasAgendadas }} agendadas</span>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-white leading-none">{{ campanhasAtivas }}</p>
            <p class="text-[11px] text-white/50 font-medium mt-1">Campanhas Ativas</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs estilizadas -->
    <div class="flex gap-1 mb-7 p-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit">
      <button v-for="tab in tabs" :key="tab.id" class="px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
        :class="activeTab === tab.id ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'"
        @click="activeTab = tab.id">{{ tab.label }}</button>
    </div>

    <!-- ═══ TAB: DASHBOARD ═══ -->
    <div v-show="activeTab === 'dashboard'" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Leads por canal -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-sm font-bold text-gray-800">Leads por Canal de Aquisição</h3>
            <span class="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">últimos 30d</span>
          </div>
          <div class="space-y-3.5">
            <div v-for="canal in canalStats" :key="canal.nome" class="group flex items-center gap-3">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center text-[11px]" :style="{ background: canal.cor + '15', color: canal.cor }">{{ canal.emoji }}</div>
              <span class="w-20 text-xs font-semibold text-gray-600">{{ canal.nome }}</span>
              <div class="flex-1 h-2.5 bg-gray-50 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700 group-hover:opacity-90" :style="{ width: canal.pct + '%', background: `linear-gradient(90deg, ${canal.cor}, ${canal.cor}dd)` }"></div>
              </div>
              <span class="text-xs font-extrabold text-gray-700 w-8 text-right">{{ canal.qtd }}</span>
            </div>
          </div>
        </div>

        <!-- Funil de conversão premium -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-sm font-bold text-gray-800">Funil de Conversão</h3>
            <span class="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">{{ stats.taxaConversao }}% geral</span>
          </div>
          <div class="space-y-3">
            <div v-for="(etapa, i) in funilEtapas" :key="etapa.nome" class="relative">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-extrabold shadow-md" :style="{ background: etapa.cor }">{{ etapa.qtd }}</div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-semibold text-gray-700">{{ etapa.nome }}</span>
                    <span v-if="i > 0" class="text-[10px] font-bold" :style="{ color: etapa.cor }">{{ etapa.taxa }}%</span>
                  </div>
                  <div class="h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" :style="{ width: etapa.pct + '%', background: `linear-gradient(90deg, ${etapa.cor}, ${etapa.cor}aa)` }"></div>
                  </div>
                </div>
              </div>
              <div v-if="i < funilEtapas.length - 1" class="ml-4 h-3 border-l-2 border-dashed border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ROI + Tempo médio -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-5">
          <p class="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mb-1">ROI de Marketing</p>
          <p class="text-3xl font-extrabold text-emerald-700">320%</p>
          <p class="text-xs text-emerald-500 mt-1">Para cada R$1 investido, retorna R$3,20</p>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
          <p class="text-[11px] text-blue-600 font-bold uppercase tracking-wider mb-1">Tempo Médio Conversão</p>
          <p class="text-3xl font-extrabold text-blue-700">14 <span class="text-lg">dias</span></p>
          <p class="text-xs text-blue-500 mt-1">Lead → Orçamento → Venda</p>
        </div>
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5">
          <p class="text-[11px] text-amber-600 font-bold uppercase tracking-wider mb-1">Melhor Canal</p>
          <p class="text-xl font-extrabold text-amber-700">{{ canalStats[0]?.nome || 'Instagram' }}</p>
          <p class="text-xs text-amber-500 mt-1">{{ canalStats[0]?.qtd || 0 }} leads no período</p>
        </div>
      </div>

      <!-- Comparativo mensal -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-sm font-bold text-gray-800">Leads por Mês</h3>
          <span class="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">2026</span>
        </div>
        <div class="flex items-end gap-2 sm:gap-3 h-32">
          <div v-for="mes in comparativoMensal" :key="mes.label" class="flex-1 flex flex-col items-center gap-1.5">
            <span class="text-[10px] font-bold text-gray-500">{{ mes.qtd }}</span>
            <div class="w-full rounded-t-lg transition-all duration-700 hover:opacity-80" :style="{ height: mes.pct + '%', background: 'linear-gradient(180deg, var(--color-primary, #7c3aed), var(--color-primary, #7c3aed)88)' }"></div>
            <span class="text-[10px] font-semibold text-gray-400">{{ mes.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TAB: CAMPANHAS ═══ -->
    <div v-show="activeTab === 'campanhas'" class="space-y-6">
      <!-- Tipos de campanha cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="tipo in tiposCampanha" :key="tipo.id" class="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer" @click="showNovaCompanha = true">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" :class="tipo.bgClass">
            <svg class="w-5 h-5" :class="tipo.iconClass" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="tipo.svg"></svg>
          </div>
          <h4 class="text-sm font-bold text-gray-800 mb-1">{{ tipo.nome }}</h4>
          <p class="text-xs text-gray-400 leading-relaxed">{{ tipo.desc }}</p>
          <div class="mt-3 flex items-center gap-1 text-[10px] font-bold text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity">
            Criar <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </div>
        </div>
      </div>

      <!-- Lista de campanhas -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-800">Campanhas Recentes</h3>
          <span class="text-[10px] text-gray-400 font-medium">{{ campanhas.length }} total</span>
        </div>
        <div v-if="!campanhas.length" class="text-center py-16">
          <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
          </div>
          <p class="text-sm text-gray-400">Nenhuma campanha criada ainda</p>
          <p class="text-xs text-gray-300 mt-1">Clique em um dos tipos acima para começar</p>
        </div>
        <div v-else class="divide-y divide-gray-50">
          <div v-for="c in campanhas" :key="c.id" class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors cursor-pointer">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" :class="c.tipo === 'whatsapp' ? 'bg-green-50 border border-green-100' : c.tipo === 'email' ? 'bg-blue-50 border border-blue-100' : 'bg-amber-50 border border-amber-100'">
              <span class="text-base">{{ c.tipo === 'whatsapp' ? '💬' : c.tipo === 'email' ? '📧' : '📱' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-800 truncate">{{ c.nome }}</p>
              <p class="text-[11px] text-gray-400 mt-0.5">{{ c.destinatarios }} destinatários · {{ formatDate(c.created_at) }}</p>
            </div>
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide" :class="campanhaStatusClass(c.status)">{{ c.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TAB: INTEGRAÇÕES ═══ -->
    <div v-show="activeTab === 'integracoes'" class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="integ in integracoes" :key="integ.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm" :class="integ.bgClass">{{ integ.emoji }}</div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-800">{{ integ.nome }}</h4>
              <p class="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{{ integ.desc }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-gray-50">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full" :class="integ.ativo ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'"></div>
              <span class="text-[11px] font-bold" :class="integ.ativo ? 'text-emerald-600' : 'text-gray-400'">{{ integ.ativo ? 'Conectado' : 'Desconectado' }}</span>
            </div>
            <button class="px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all" :class="integ.ativo ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100' : 'bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-100'">
              {{ integ.ativo ? 'Desconectar' : 'Conectar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pixel -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Pixel de Conversão</h3>
            <p class="text-xs text-gray-400">Cole este código no seu e-commerce para rastrear conversões</p>
          </div>
        </div>
        <div class="bg-gray-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto">
          <span class="text-gray-500">&lt;!-- SignPRO Pixel --&gt;</span><br/>
          &lt;script&gt;<br/>
          &nbsp;&nbsp;!function(s,i,g,n){s.SignPRO=n;s[n]=s[n]||function()<br/>
          &nbsp;&nbsp;{(s[n].q=s[n].q||[]).push(arguments)};<br/>
          &nbsp;&nbsp;var e=i.createElement('script');e.async=1;<br/>
          &nbsp;&nbsp;e.src=g;i.head.appendChild(e)}<br/>
          &nbsp;&nbsp;(window,document,'/pixel.js','sp');<br/>
          &nbsp;&nbsp;sp('init','<span class="text-amber-400">{{ empresaId }}</span>');<br/>
          &nbsp;&nbsp;sp('track','PageView');<br/>
          &lt;/script&gt;
        </div>
      </div>
    </div>

    <!-- ═══ TAB: RELATÓRIOS ═══ -->
    <div v-show="activeTab === 'relatorios'" class="space-y-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p class="text-xl font-extrabold text-gray-800">R$ 12,50</p>
          <p class="text-[10px] text-gray-400 font-semibold uppercase mt-1">Custo por Lead</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
          <div class="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></svg>
          </div>
          <p class="text-lg font-extrabold text-gray-800">{{ canalStats[0]?.nome || '—' }}</p>
          <p class="text-[10px] text-gray-400 font-semibold uppercase mt-1">Melhor Canal</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p class="text-xl font-extrabold text-gray-800">14d</p>
          <p class="text-[10px] text-gray-400 font-semibold uppercase mt-1">Tempo Conversão</p>
        </div>
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md transition-all">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>
          </div>
          <p class="text-xl font-extrabold text-emerald-600">320%</p>
          <p class="text-[10px] text-gray-400 font-semibold uppercase mt-1">ROI</p>
        </div>
      </div>

      <!-- Gráfico mensal premium -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-sm font-bold text-gray-800">Comparativo Mensal de Leads</h3>
          <div class="flex gap-3 text-[10px] font-bold">
            <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-sm" style="background: var(--color-primary, #7c3aed)"></span> Leads</span>
            <span class="flex items-center gap-1 text-gray-400"><span class="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span> Convertidos</span>
          </div>
        </div>
        <div class="flex items-end gap-3 sm:gap-5 h-40">
          <div v-for="mes in comparativoMensal" :key="mes.label" class="flex-1 flex flex-col items-center gap-2">
            <div class="w-full flex flex-col items-center gap-1" style="height: 120px;">
              <div class="w-full max-w-[28px] rounded-lg transition-all duration-700 mt-auto" :style="{ height: mes.pct + '%', background: 'linear-gradient(180deg, var(--color-primary, #7c3aed), var(--color-primary, #7c3aed)77)' }"></div>
            </div>
            <div class="text-center">
              <p class="text-[10px] font-extrabold text-gray-600">{{ mes.qtd }}</p>
              <p class="text-[9px] font-semibold text-gray-400">{{ mes.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nova Campanha -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showNovaCompanha" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="showNovaCompanha = false">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div class="bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-5">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-white">Nova Campanha</h2>
                <button @click="showNovaCompanha = false" class="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <p class="text-xs text-white/60 mt-1">Configure e dispare sua campanha</p>
            </div>
            <div class="p-6 space-y-4">
              <div><label class="text-xs font-bold text-gray-600 mb-1.5 block">Nome</label><input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" placeholder="Ex: Promoção Julho" /></div>
              <div class="grid grid-cols-2 gap-3">
                <div><label class="text-xs font-bold text-gray-600 mb-1.5 block">Tipo</label><select class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"><option>WhatsApp</option><option>Email</option><option>SMS</option></select></div>
                <div><label class="text-xs font-bold text-gray-600 mb-1.5 block">Segmento</label><select class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"><option>Todos</option><option>Leads quentes</option><option>Novos (7d)</option><option>Por nicho</option></select></div>
              </div>
              <div><label class="text-xs font-bold text-gray-600 mb-1.5 block">Mensagem</label><textarea rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none" placeholder="Olá {nome}, temos uma promoção exclusiva..."></textarea><p class="text-[10px] text-gray-400 mt-1.5">Variáveis: {nome}, {empresa}, {telefone}</p></div>
              <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button @click="showNovaCompanha = false" class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50">Cancelar</button>
                <button class="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">Criar Campanha</button>
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

onMounted(async () => { await loadEmpresa(); await carregarDados() })

async function carregarDados() {
  if (!empresaId.value) return
  const { data } = await supabase.from('leads').select('*').eq('empresa_id', empresaId.value).order('created_at', { ascending: false })
  leads.value = data || []
}

const stats = computed(() => {
  const total = leads.value.length
  const now = Date.now()
  const novos7d = leads.value.filter(l => now - new Date(l.created_at).getTime() < 7 * 86400000).length
  const convertidos = leads.value.filter(l => l.status === 'convertido').length
  const taxaConversao = total > 0 ? Math.round((convertidos / total) * 100) : 0
  return { total, novos7d, convertidos, taxaConversao }
})

const campanhasAtivas = computed(() => campanhas.value.filter(c => c.status === 'ativa').length)
const campanhasAgendadas = computed(() => campanhas.value.filter(c => c.status === 'agendada').length)

const canalStats = computed(() => {
  const canais: Record<string, { nome: string; cor: string; emoji: string; qtd: number }> = {
    google: { nome: 'Google', cor: '#4285f4', emoji: '🔍', qtd: 0 },
    instagram: { nome: 'Instagram', cor: '#e1306c', emoji: '📸', qtd: 0 },
    facebook: { nome: 'Facebook', cor: '#1877f2', emoji: '📘', qtd: 0 },
    indicacao: { nome: 'Indicação', cor: '#22c55e', emoji: '🤝', qtd: 0 },
    site: { nome: 'Site', cor: '#06b6d4', emoji: '🌐', qtd: 0 },
    whatsapp: { nome: 'WhatsApp', cor: '#25d366', emoji: '💬', qtd: 0 },
    manual: { nome: 'Manual', cor: '#94a3b8', emoji: '✍️', qtd: 0 },
  }
  for (const l of leads.value) { if (canais[l.canal]) canais[l.canal].qtd++ }
  const max = Math.max(...Object.values(canais).map(c => c.qtd), 1)
  return Object.values(canais).filter(c => c.qtd > 0).sort((a, b) => b.qtd - a.qtd).map(c => ({ ...c, pct: Math.round((c.qtd / max) * 100) }))
})

const funilEtapas = computed(() => {
  const total = leads.value.length || 1
  const qual = leads.value.filter(l => ['qualificado', 'proposta', 'convertido'].includes(l.status)).length
  const prop = leads.value.filter(l => ['proposta', 'convertido'].includes(l.status)).length
  const conv = leads.value.filter(l => l.status === 'convertido').length
  return [
    { nome: 'Todos os Leads', cor: '#6366f1', qtd: leads.value.length, pct: 100, taxa: '' },
    { nome: 'Qualificados', cor: '#0ea5e9', qtd: qual, pct: Math.round((qual / total) * 100), taxa: Math.round((qual / total) * 100) },
    { nome: 'Proposta Enviada', cor: '#f59e0b', qtd: prop, pct: Math.round((prop / total) * 100), taxa: Math.round((prop / total) * 100) },
    { nome: 'Convertidos', cor: '#22c55e', qtd: conv, pct: Math.round((conv / total) * 100), taxa: Math.round((conv / total) * 100) },
  ]
})

const comparativoMensal = computed(() => {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  const vals = [8, 12, 18, 15, 22, 28]
  const max = Math.max(...vals)
  return meses.map((label, i) => ({ label, qtd: vals[i], pct: Math.round((vals[i] / max) * 100) }))
})

const tiposCampanha = [
  { id: 'whatsapp', nome: 'WhatsApp em Massa', desc: 'Dispare mensagens para leads ou clientes via WhatsApp integrado.', bgClass: 'bg-green-50', iconClass: 'text-green-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>' },
  { id: 'email', nome: 'Email Marketing', desc: 'Templates visuais com segmentação inteligente por nicho.', bgClass: 'bg-blue-50', iconClass: 'text-blue-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>' },
  { id: 'sms', nome: 'SMS Marketing', desc: 'Mensagens curtas e diretas para ações rápidas e urgentes.', bgClass: 'bg-amber-50', iconClass: 'text-amber-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/>' },
  { id: 'landing', nome: 'Landing Pages', desc: 'Crie páginas de captura com link compartilhável e formulário.', bgClass: 'bg-purple-50', iconClass: 'text-purple-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582"/>' },
  { id: 'automacao', nome: 'Automações', desc: 'Sequências automáticas disparadas por ações dos leads.', bgClass: 'bg-cyan-50', iconClass: 'text-cyan-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>' },
  { id: 'agendamento', nome: 'Agendamento', desc: 'Programe campanhas recorrentes ou datas específicas.', bgClass: 'bg-rose-50', iconClass: 'text-rose-600', svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>' },
]

const integracoes = [
  { id: 'meta', nome: 'Meta Ads', desc: 'Importar leads automaticamente do Facebook e Instagram Ads', emoji: '📘', bgClass: 'bg-blue-50', ativo: false },
  { id: 'google', nome: 'Google Ads', desc: 'Rastreamento de UTMs, conversões e custo por lead', emoji: '🔍', bgClass: 'bg-red-50', ativo: false },
  { id: 'pixel', nome: 'Pixel SignPRO', desc: 'Rastreamento de visitas e conversões no e-commerce', emoji: '📊', bgClass: 'bg-purple-50', ativo: true },
  { id: 'whatsapp', nome: 'WhatsApp API', desc: 'Disparos e recebimento via Datafy (integrado)', emoji: '💬', bgClass: 'bg-green-50', ativo: true },
]

function campanhaStatusClass(s: string) {
  return { ativa: 'bg-emerald-50 text-emerald-700 border border-emerald-100', agendada: 'bg-amber-50 text-amber-700 border border-amber-100', rascunho: 'bg-gray-50 text-gray-500 border border-gray-100', concluida: 'bg-blue-50 text-blue-700 border border-blue-100' }[s] || 'bg-gray-50 text-gray-500'
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) }
</script>
