<template>
  <div class="mkt-page">
    <!-- Top bar -->
    <div class="mkt-topbar">
      <div>
        <h1 class="mkt-title">Marketing</h1>
        <p class="mkt-subtitle">Gerencie todas as estratégias e ações de marketing da sua empresa</p>
      </div>
      <div class="mkt-topbar-right">
        <div class="mkt-date-pill">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>
          {{ periodoLabel }}
        </div>
        <button v-if="activeTab === 'planejamento'" class="mkt-btn-primary" @click="abrirTarefa()">+ Nova tarefa</button>
        <button v-else-if="activeTab === 'conteudo' || activeTab === 'calendario'" class="mkt-btn-primary" @click="abrirConteudo()">+ Novo conteúdo</button>
        <button v-else-if="activeTab === 'automacao'" class="mkt-btn-primary" @click="abrirAutomacao()">+ Nova automação</button>
        <NuxtLink v-else to="/configuracoes" class="mkt-btn-primary" style="text-decoration: none;">Configurar integrações</NuxtLink>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mkt-tabs">
      <button v-for="tab in tabs" :key="tab.id" class="mkt-tab" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
        {{ tab.label }}
        <span v-if="activeTab === tab.id" class="mkt-tab-bar"></span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mkt-loading">
      <span class="mkt-spinner"></span>
      <span>Carregando…</span>
    </div>

    <template v-else>

    <!-- ═══════════ VISÃO GERAL ═══════════ -->
    <template v-if="activeTab === 'visao'">

    <!-- Aviso conectar -->
    <div v-if="!overview?.conectado" class="mkt-connect-banner">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <div class="mkt-connect-text">
        <strong>Conecte suas contas de anúncio</strong>
        <span>Funil e leads abaixo são reais (do seu CRM). Para mídia paga, campanhas e sessões por canal, conecte Meta / Google em Configurações.</span>
      </div>
      <NuxtLink to="/configuracoes" class="mkt-connect-btn">Conectar</NuxtLink>
    </div>

    <!-- KPI ROW -->
    <div class="mkt-kpi-row">
      <div v-for="k in kpis" :key="k.label" class="mkt-kpi-card">
        <div class="mkt-kpi-icon" :style="{ background: k.iconBg }">
          <svg class="w-[18px] h-[18px]" :style="{ color: k.iconColor }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" v-html="k.svg"></svg>
        </div>
        <div class="mkt-kpi-label">{{ k.label }}</div>
        <div class="mkt-kpi-value">{{ k.valor }}</div>
        <div class="mkt-kpi-hint">{{ k.hint }}</div>
        <svg v-if="k.spark" class="mkt-kpi-spark" viewBox="0 0 140 40" preserveAspectRatio="none">
          <path :d="k.spark.areaPath" :fill="k.iconColor + '18'"/>
          <path :d="k.spark.linePath" fill="none" :stroke="k.iconColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- ROW 2: Funil (SVG trapézio) + Receita × Investimento -->
    <div class="mkt-row">
      <div class="mkt-card" style="flex: 5 1 430px;">
        <div class="mkt-card-header"><div><h2>Funil de marketing</h2><p class="mkt-card-sub">Da descoberta à decisão de compra — jornada completa</p></div><span class="mkt-card-sub">Todos os canais</span></div>
        <div v-if="funilFases.length" class="mkt-funnel-scroll">
          <div class="mkt-funnel-wrap">
            <!-- Rótulos esquerda -->
            <div class="mkt-funnel-labels">
              <div class="mkt-funnel-label" style="height: 128px; margin-top: 14px;"><span>Topo de funil</span><span class="mkt-funnel-bracket"></span></div>
              <div class="mkt-funnel-label" style="height: 108px; margin-top: 5px;"><span>Meio de funil</span><span class="mkt-funnel-bracket"></span></div>
              <div class="mkt-funnel-label" style="height: 42px; margin-top: 6px;"><span>Fundo de funil</span><span class="mkt-funnel-bracket"></span></div>
            </div>
            <!-- SVG funil -->
            <svg width="320" height="322" viewBox="0 0 320 322" class="mkt-funnel-svg">
              <defs>
                <linearGradient id="fnl1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3f70f3"/><stop offset="100%" stop-color="#2b58d8"/></linearGradient>
                <linearGradient id="fnl2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3363e8"/><stop offset="100%" stop-color="#2450c0"/></linearGradient>
                <linearGradient id="fnl3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2853cc"/><stop offset="100%" stop-color="#1d43a6"/></linearGradient>
                <linearGradient id="fnl4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1f45b0"/><stop offset="100%" stop-color="#173a92"/></linearGradient>
                <linearGradient id="fnl5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#17398f"/><stop offset="100%" stop-color="#102b70"/></linearGradient>
              </defs>
              <ellipse cx="160" cy="314" rx="52" ry="6" fill="rgba(16,24,40,.07)"/>
              <path d="M34,16 A126,14 0 0 0 286,16 L254,64 A94,11 0 0 1 66,64 Z" fill="url(#fnl1)"/>
              <ellipse cx="160" cy="16" rx="126" ry="14" fill="#6b93f7"/>
              <text x="160" y="46" text-anchor="middle" font-size="12.5" font-weight="700" fill="#fff">{{ funilFases[0]?.nome }}</text>
              <text x="160" y="60" text-anchor="middle" font-size="10.5" font-weight="600" fill="rgba(255,255,255,.85)">{{ funilFases[0]?.qtdFmt }}</text>
              <path d="M70,90 A90,11 0 0 0 250,90 L226,136 A66,8.5 0 0 1 94,136 Z" fill="url(#fnl2)"/>
              <ellipse cx="160" cy="90" rx="90" ry="11" fill="#5d86f0"/>
              <text x="160" y="117" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">{{ funilFases[1]?.nome }}</text>
              <text x="160" y="130" text-anchor="middle" font-size="10.5" font-weight="600" fill="rgba(255,255,255,.85)">{{ funilFases[1]?.qtdFmt }}</text>
              <path d="M98,155 A62,8 0 0 0 222,155 L204,198 A44,6.5 0 0 1 116,198 Z" fill="url(#fnl3)"/>
              <ellipse cx="160" cy="155" rx="62" ry="8" fill="#4d75dd"/>
              <text x="160" y="179" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">{{ funilFases[2]?.nome }}</text>
              <text x="160" y="192" text-anchor="middle" font-size="10" font-weight="600" fill="rgba(255,255,255,.85)">{{ funilFases[2]?.qtdFmt }}</text>
              <path d="M119,213 A41,6 0 0 0 201,213 L188,254 A28,5 0 0 1 132,254 Z" fill="url(#fnl4)"/>
              <ellipse cx="160" cy="213" rx="41" ry="6" fill="#3f66c9"/>
              <text x="160" y="235" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff">{{ funilFases[3]?.nome }}</text>
              <text x="160" y="248" text-anchor="middle" font-size="9.5" font-weight="600" fill="rgba(255,255,255,.85)">{{ funilFases[3]?.qtdFmt }}</text>
              <path d="M135,266 A25,4.5 0 0 0 185,266 L177,304 A17,3.5 0 0 1 143,304 Z" fill="url(#fnl5)"/>
              <ellipse cx="160" cy="266" rx="25" ry="4.5" fill="#33549f"/>
              <text x="160" y="285" text-anchor="middle" font-size="9.5" font-weight="700" fill="#fff">{{ funilFases[4]?.nome }}</text>
              <text x="160" y="297" text-anchor="middle" font-size="9.5" font-weight="700" fill="rgba(255,255,255,.9)">{{ funilFases[4]?.qtdFmt }}</text>
            </svg>
            <!-- Anotações direita -->
            <div class="mkt-funnel-notes">
              <div v-for="(f, i) in funilFases" :key="i" class="mkt-funnel-note" :style="{ top: FUNNEL_NOTE_TOP[i] + 'px' }">
                <svg width="22" height="16" viewBox="0 0 22 16" class="mkt-funnel-arrow"><path d="M2,13 C7,5 12,3 17,5.5" fill="none" stroke="#2f63f0" stroke-width="1.8" stroke-linecap="round"/><path d="M18.5,2 L21.5,7 L15.5,7.5 Z" fill="#2f63f0"/></svg>
                <div><div class="mkt-funnel-note-title">{{ f.fase }}</div><div class="mkt-funnel-note-sub">{{ f.texto }}</div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="mkt-funil-footer">
          <span>Conversão visitante → cliente</span>
          <span class="mkt-funil-footer-val">{{ convGeral }}</span>
        </div>
      </div>

      <!-- RECEITA × INVESTIMENTO -->
      <div class="mkt-card" style="flex: 7 1 440px;">
        <div class="mkt-card-header">
          <div><h2>Receita × Investimento</h2><p class="mkt-card-sub">Investimento diário em mídia — R$</p></div>
          <span class="mkt-chart-legend"><span class="mkt-legend-item"><span class="mkt-legend-line" style="background:#2457e6"></span>Investimento</span></span>
        </div>
        <div v-if="serieMidia.length > 1" class="mkt-chart-area">
          <svg viewBox="0 0 640 180" preserveAspectRatio="none" class="mkt-chart-svg">
            <defs><linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2457e6" stop-opacity="0.12"/><stop offset="100%" stop-color="#2457e6" stop-opacity="0"/></linearGradient></defs>
            <line x1="0" y1="160" x2="640" y2="160" stroke="#eef1f5" stroke-width="1"/>
            <line x1="0" y1="107" x2="640" y2="107" stroke="#eef1f5" stroke-width="1"/>
            <line x1="0" y1="54" x2="640" y2="54" stroke="#eef1f5" stroke-width="1"/>
            <path :d="serieAreaPath" fill="url(#gBlue)"/>
            <path :d="serieLinePath" fill="none" stroke="#2457e6" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div v-else class="mkt-empty-chart">
          <div class="mkt-empty-inline">
            <p>Sem dados de mídia paga</p>
            <NuxtLink to="/configuracoes" class="mkt-link">Conectar contas de anúncio</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 3: Donut + Campanhas -->
    <div class="mkt-row">
      <!-- DONUT CANAIS -->
      <div class="mkt-card" style="flex: 5 1 340px;">
        <div class="mkt-card-header"><h2>Desempenho por canal</h2><span class="mkt-card-sub">Sessões</span></div>
        <div v-if="canais.length" class="mkt-donut-wrap">
          <div class="mkt-donut-container">
            <svg viewBox="0 0 140 140" class="mkt-donut-svg">
              <g transform="rotate(-90 70 70)">
                <circle v-for="(seg, i) in donutSegments" :key="i" cx="70" cy="70" r="54" fill="none" :stroke="seg.cor" stroke-width="21" :stroke-dasharray="seg.dash" :stroke-dashoffset="seg.offset"/>
              </g>
            </svg>
            <div class="mkt-donut-center">
              <span class="mkt-donut-val">{{ totalSessoes.toLocaleString('pt-BR') }}</span>
              <span class="mkt-donut-label">sessões</span>
            </div>
          </div>
          <div class="mkt-donut-legend">
            <div v-for="c in canaisComPct" :key="c.nome" class="mkt-legend-row">
              <span class="mkt-legend-dot" :style="{ background: c.cor }"></span>
              <span class="mkt-legend-name">{{ c.nome }}</span>
              <span class="mkt-legend-val">{{ c.qtd.toLocaleString('pt-BR') }}</span>
              <span class="mkt-legend-pct">{{ c.pct }}%</span>
            </div>
          </div>
        </div>
        <div v-else class="mkt-empty-inline">
          <p>Conecte GA4 para ver sessões por canal</p>
          <NuxtLink to="/configuracoes" class="mkt-link">Conectar</NuxtLink>
        </div>
      </div>

      <!-- CAMPANHAS -->
      <div class="mkt-card" style="flex: 7 1 460px;">
        <div class="mkt-card-header">
          <div><h2>Campanhas ativas</h2><p class="mkt-card-sub">{{ campanhas.length }} campanha(s) em veiculação</p></div>
          <span class="mkt-link" @click="activeTab = 'campanhas'">Ver todas</span>
        </div>
        <div v-if="campanhas.length" class="mkt-table-scroll">
          <div class="mkt-table-head">
            <span>Campanha</span><span>Investimento</span><span>Resultado</span><span>ROI</span><span>Status</span><span></span>
          </div>
          <div v-for="(c, i) in campanhas" :key="i" class="mkt-table-row">
            <div class="mkt-camp-name">
              <span class="mkt-camp-badge" style="background:#e8eefc;color:#2457e6">{{ c.icone }}</span>
              <div><div class="mkt-camp-title">{{ c.nome }}</div><div class="mkt-camp-sub">{{ c.canal }}</div></div>
            </div>
            <span class="mkt-cell-mono">{{ fmtBRL(c.investimento) }}</span>
            <span class="mkt-cell-mono">{{ c.resultado }}</span>
            <span class="mkt-cell-roi">{{ c.roi }}</span>
            <span><span class="mkt-status-pill" :style="statusPill(c.status)"><span class="mkt-status-dot" :style="{ background: statusPill(c.status).dot }"></span>{{ c.status }}</span></span>
            <span class="mkt-cell-menu">⋯</span>
          </div>
        </div>
        <div v-else class="mkt-empty-inline">
          <p>Nenhuma campanha ativa</p>
          <NuxtLink to="/configuracoes" class="mkt-link">Conectar contas de anúncio</NuxtLink>
        </div>
      </div>

    </div>

    <!-- ROW 4: Mídia Paga + Metas -->
    <div class="mkt-row">
      <!-- MÍDIA PAGA -->
      <div class="mkt-card" style="flex: 7 1 440px;">
        <div class="mkt-card-header"><div><h2>Mídia paga</h2><p class="mkt-card-sub">Consolidado das plataformas conectadas</p></div><span class="mkt-link" @click="activeTab = 'midia'">Ver relatório</span></div>
        <div v-if="overview?.midiaPaga" class="mkt-midia-grid">
          <div v-for="m in midiaCards" :key="m.label" class="mkt-midia-kpi"><div class="mkt-midia-kpi-label">{{ m.label }}</div><div class="mkt-midia-kpi-val">{{ m.valor }}</div></div>
        </div>
        <div v-else class="mkt-empty-inline">
          <p>Sem dados de mídia paga</p>
          <NuxtLink to="/configuracoes" class="mkt-link">Conectar contas de anúncio</NuxtLink>
        </div>
      </div>

      <!-- METAS -->
      <div class="mkt-card" style="flex: 5 1 340px;">
        <div class="mkt-card-header"><div><h2>Metas do mês</h2><p class="mkt-card-sub">Progresso em relação às metas</p></div></div>
        <div class="mkt-metas">
          <div v-for="m in metas" :key="m.label" class="mkt-meta-item">
            <div class="mkt-meta-top"><span class="mkt-meta-label">{{ m.label }}<span v-if="m.superada" class="mkt-meta-badge">Meta superada</span></span><span class="mkt-meta-val">{{ m.valorFmt }}</span></div>
            <div class="mkt-meta-bar-wrap"><div class="mkt-meta-bar" :style="{ width: m.pct + '%', background: m.cor }"></div></div>
            <div class="mkt-meta-bottom"><span>Meta: {{ m.metaFmt }}</span><span :style="{ color: m.cor, fontWeight: 700 }">{{ m.pct }}%</span></div>
          </div>
        </div>
      </div>
    </div>

    </template>

    <!-- ═══════════ PLANEJAMENTO ═══════════ -->
    <template v-else-if="activeTab === 'planejamento'">
      <div class="mkt-card" style="padding: 0; overflow: hidden;">
        <div v-if="tarefas.length === 0" class="mkt-empty-block">
          <div class="mkt-empty-icon">✓</div>
          <h2>Nenhuma tarefa cadastrada</h2>
          <button class="mkt-link" @click="abrirTarefa()">Criar primeira tarefa</button>
        </div>
        <table v-else class="mkt-data-table">
          <thead><tr><th>Tarefa</th><th>Prioridade</th><th>Data</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr v-for="t in tarefas" :key="t.id">
              <td>
                <div class="mkt-td-title" :class="{ done: t.status === 'concluida' }">{{ t.titulo }}</div>
                <div v-if="t.descricao" class="mkt-td-sub">{{ t.descricao }}</div>
              </td>
              <td><span class="mkt-tag" :style="prioridadeTag(t.prioridade)">{{ t.prioridade }}</span></td>
              <td class="mkt-cell-mono">{{ fmtDataCurta(t.data_tarefa) }}</td>
              <td><span class="mkt-tag" :style="t.status === 'concluida' ? tagVerde : tagAmarelo">{{ t.status === 'concluida' ? 'Concluída' : 'Pendente' }}</span></td>
              <td class="mkt-td-actions">
                <button v-if="t.status !== 'concluida'" class="mkt-link" @click="concluirTarefa(t)">Concluir</button>
                <button class="mkt-link" @click="abrirTarefa(t)">Editar</button>
                <button class="mkt-link danger" @click="excluirTarefa(t)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ═══════════ CAMPANHAS ═══════════ -->
    <template v-else-if="activeTab === 'campanhas'">
      <div class="mkt-card" style="padding: 0; overflow: hidden;">
        <div v-if="campanhas.length === 0" class="mkt-empty-block">
          <div class="mkt-empty-icon">📣</div>
          <h2>Nenhuma campanha</h2>
          <p class="mkt-card-sub">As campanhas são puxadas automaticamente das plataformas de anúncio conectadas.</p>
          <NuxtLink to="/configuracoes" class="mkt-link">Conectar Meta / Google</NuxtLink>
        </div>
        <table v-else class="mkt-data-table">
          <thead><tr><th>Campanha</th><th>Canal</th><th class="right">Investimento</th><th class="right">Resultado</th><th class="right">ROI</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="(c, i) in campanhas" :key="i">
              <td class="mkt-td-title">{{ c.icone }} {{ c.nome }}</td>
              <td class="mkt-cell-mono" style="text-transform: capitalize;">{{ c.canal }}</td>
              <td class="mkt-cell-mono right">{{ fmtBRL(c.investimento) }}</td>
              <td class="right">{{ c.resultado }}</td>
              <td class="mkt-cell-roi right">{{ c.roi }}</td>
              <td><span class="mkt-tag" :style="statusTag(c.status)">{{ c.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ═══════════ CONTEÚDO ═══════════ -->
    <template v-else-if="activeTab === 'conteudo'">
      <div class="mkt-card" style="padding: 0; overflow: hidden;">
        <div v-if="conteudos.length === 0" class="mkt-empty-block">
          <div class="mkt-empty-icon">✎</div>
          <h2>Nenhum conteúdo cadastrado</h2>
          <button class="mkt-link" @click="abrirConteudo()">Criar primeiro conteúdo</button>
        </div>
        <table v-else class="mkt-data-table">
          <thead><tr><th>Título</th><th>Tipo</th><th>Publicação</th><th class="right">Alcance</th><th class="right">Engaj.</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr v-for="c in conteudos" :key="c.id">
              <td class="mkt-td-title"><span class="mkt-dot-inline" :style="{ background: c.thumb_cor || '#2457e6' }"></span>{{ c.titulo }}</td>
              <td class="mkt-cell-mono" style="text-transform: capitalize;">{{ c.tipo }}</td>
              <td class="mkt-cell-mono">{{ fmtDataCurta(c.data_publicacao) }}</td>
              <td class="mkt-cell-mono right">{{ c.alcance.toLocaleString('pt-BR') }}</td>
              <td class="mkt-cell-mono right">{{ c.engajamento.toLocaleString('pt-BR') }}</td>
              <td><span class="mkt-tag" :style="statusConteudoTag(c.status)">{{ c.status }}</span></td>
              <td class="mkt-td-actions">
                <button class="mkt-link" @click="abrirConteudo(c)">Editar</button>
                <button class="mkt-link danger" @click="excluirConteudo(c)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ═══════════ CALENDÁRIO ═══════════ -->
    <template v-else-if="activeTab === 'calendario'">
      <div class="mkt-card">
        <div class="mkt-cal-header">
          <button class="mkt-cal-nav" @click="mudarMes(-1)">‹</button>
          <h2 style="text-transform: capitalize;">{{ mesLabel }}</h2>
          <button class="mkt-cal-nav" @click="mudarMes(1)">›</button>
        </div>
        <div class="mkt-cal-weekdays">
          <div v-for="d in ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']" :key="d">{{ d }}</div>
        </div>
        <div class="mkt-cal-grid">
          <div v-for="(cel, i) in gradeCalendario" :key="i" class="mkt-cal-cell" :class="{ out: !cel.doMes, today: cel.hoje }">
            <template v-if="cel.dia">
              <span class="mkt-cal-day">{{ cel.dia }}</span>
              <div v-for="c in cel.conteudos" :key="c.id" class="mkt-cal-event" :style="{ background: c.thumb_cor || '#2457e6' }" :title="c.titulo" @click="abrirConteudo(c)">{{ c.titulo }}</div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════ MÍDIA PAGA ═══════════ -->
    <template v-else-if="activeTab === 'midia'">
      <div v-if="overview?.midiaPaga">
        <div class="mkt-kpi-row">
          <div v-for="m in midiaCards" :key="m.label" class="mkt-kpi-card">
            <div class="mkt-kpi-label">{{ m.label }}</div>
            <div class="mkt-kpi-value">{{ m.valor }}</div>
          </div>
        </div>
        <div class="mkt-card" style="margin-top: 14px;">
          <div class="mkt-card-header"><h2>Investimento diário</h2></div>
          <div v-if="serieMidia.length > 1" class="mkt-chart-area">
            <svg viewBox="0 0 640 180" preserveAspectRatio="none" class="mkt-chart-svg">
              <defs><linearGradient id="gBlue2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2457e6" stop-opacity="0.12"/><stop offset="100%" stop-color="#2457e6" stop-opacity="0"/></linearGradient></defs>
              <path :d="serieAreaPath" fill="url(#gBlue2)"/>
              <path :d="serieLinePath" fill="none" stroke="#2457e6" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <p v-else class="mkt-card-sub" style="padding: 20px 0; text-align: center;">Poucos dados para o gráfico</p>
        </div>
      </div>
      <div v-else class="mkt-card mkt-empty-block">
        <div class="mkt-empty-icon">$</div>
        <h2>Sem dados de mídia paga</h2>
        <p class="mkt-card-sub">Conecte suas contas de anúncio para ver investimento, cliques e conversões.</p>
        <NuxtLink to="/configuracoes" class="mkt-link">Conectar contas</NuxtLink>
      </div>
    </template>

    <!-- ═══════════ AUTOMAÇÃO ═══════════ -->
    <template v-else-if="activeTab === 'automacao'">
      <div class="mkt-card" style="padding: 0; overflow: hidden;">
        <div v-if="automacoes.length === 0" class="mkt-empty-block">
          <div class="mkt-empty-icon">⚡</div>
          <h2>Nenhuma automação</h2>
          <button class="mkt-link" @click="abrirAutomacao()">Criar automação</button>
        </div>
        <div v-else class="mkt-auto-list">
          <div v-for="a in automacoes" :key="a.id" class="mkt-auto-item">
            <div class="mkt-auto-info">
              <div class="mkt-td-title">{{ a.nome }}</div>
              <div class="mkt-td-sub">Quando <b>{{ gatilhoLabel(a.gatilho) }}</b> → <b>{{ acaoLabel(a.acao) }}</b></div>
            </div>
            <button class="mkt-toggle" :class="{ on: a.ativo }" @click="toggleAutomacao(a)"><span class="mkt-toggle-knob"></span></button>
            <button class="mkt-link" @click="abrirAutomacao(a)">Editar</button>
            <button class="mkt-link danger" @click="excluirAutomacao(a)">Excluir</button>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════ RELATÓRIOS ═══════════ -->
    <template v-else-if="activeTab === 'relatorios'">
      <div class="mkt-kpi-row">
        <div v-for="r in relatorioCards" :key="r.label" class="mkt-kpi-card">
          <div class="mkt-kpi-label">{{ r.label }}</div>
          <div class="mkt-kpi-value">{{ r.valor }}</div>
          <div class="mkt-kpi-hint">{{ r.hint }}</div>
        </div>
      </div>
    </template>

    </template>

    <!-- ═══ MODAL TAREFA ═══ -->
    <Teleport to="body">
      <Transition name="mkt-fade">
        <div v-if="modalTarefa" class="mkt-modal-overlay" @click.self="modalTarefa = false">
          <div class="mkt-modal">
            <h3>{{ tarefaForm.id ? 'Editar' : 'Nova' }} tarefa</h3>
            <input v-model="tarefaForm.titulo" type="text" placeholder="Título da tarefa" class="mkt-input" />
            <textarea v-model="tarefaForm.descricao" rows="2" placeholder="Descrição (opcional)" class="mkt-input"></textarea>
            <div class="mkt-modal-grid">
              <select v-model="tarefaForm.prioridade" class="mkt-input"><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></select>
              <input v-model="tarefaForm.data_tarefa" type="date" class="mkt-input" />
            </div>
            <label class="mkt-check"><input v-model="tarefaForm.urgente" type="checkbox" /> Marcar como urgente</label>
            <p v-if="modalError" class="mkt-modal-error">{{ modalError }}</p>
            <div class="mkt-modal-actions">
              <button class="mkt-btn-ghost" @click="modalTarefa = false">Cancelar</button>
              <button class="mkt-btn-primary" :disabled="saving || !tarefaForm.titulo" @click="salvarTarefa">{{ saving ? 'Salvando…' : 'Salvar' }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ MODAL CONTEÚDO ═══ -->
    <Teleport to="body">
      <Transition name="mkt-fade">
        <div v-if="modalConteudo" class="mkt-modal-overlay" @click.self="modalConteudo = false">
          <div class="mkt-modal">
            <h3>{{ conteudoForm.id ? 'Editar' : 'Novo' }} conteúdo</h3>
            <input v-model="conteudoForm.titulo" type="text" placeholder="Título do conteúdo" class="mkt-input" />
            <div class="mkt-modal-grid">
              <select v-model="conteudoForm.tipo" class="mkt-input"><option value="blog">Blog</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="email">E-mail</option><option value="outro">Outro</option></select>
              <select v-model="conteudoForm.status" class="mkt-input"><option value="rascunho">Rascunho</option><option value="agendado">Agendado</option><option value="publicado">Publicado</option></select>
            </div>
            <input v-model="conteudoForm.data_publicacao" type="date" class="mkt-input" />
            <div class="mkt-modal-grid">
              <input v-model.number="conteudoForm.alcance" type="number" placeholder="Alcance" class="mkt-input" />
              <input v-model.number="conteudoForm.engajamento" type="number" placeholder="Engajamento" class="mkt-input" />
            </div>
            <p v-if="modalError" class="mkt-modal-error">{{ modalError }}</p>
            <div class="mkt-modal-actions">
              <button class="mkt-btn-ghost" @click="modalConteudo = false">Cancelar</button>
              <button class="mkt-btn-primary" :disabled="saving || !conteudoForm.titulo" @click="salvarConteudo">{{ saving ? 'Salvando…' : 'Salvar' }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══ MODAL AUTOMAÇÃO ═══ -->
    <Teleport to="body">
      <Transition name="mkt-fade">
        <div v-if="modalAutomacao" class="mkt-modal-overlay" @click.self="modalAutomacao = false">
          <div class="mkt-modal">
            <h3>{{ automacaoForm.id ? 'Editar' : 'Nova' }} automação</h3>
            <input v-model="automacaoForm.nome" type="text" placeholder="Nome da automação" class="mkt-input" />
            <div class="mkt-modal-grid">
              <select v-model="automacaoForm.gatilho" class="mkt-input"><option value="novo_lead">Novo lead</option><option value="lead_qualificado">Lead qualificado</option><option value="proposta_enviada">Proposta enviada</option><option value="cliente_convertido">Cliente convertido</option></select>
              <select v-model="automacaoForm.acao" class="mkt-input"><option value="enviar_email">Enviar e-mail</option><option value="enviar_whatsapp">Enviar WhatsApp</option><option value="notificar_equipe">Notificar equipe</option><option value="criar_tarefa">Criar tarefa</option></select>
            </div>
            <input v-model="automacaoForm.descricao" type="text" placeholder="Descrição (opcional)" class="mkt-input" />
            <p v-if="modalError" class="mkt-modal-error">{{ modalError }}</p>
            <div class="mkt-modal-actions">
              <button class="mkt-btn-ghost" @click="modalAutomacao = false">Cancelar</button>
              <button class="mkt-btn-primary" :disabled="saving || !automacaoForm.nome" @click="salvarAutomacao">{{ saving ? 'Salvando…' : 'Salvar' }}</button>
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
import { useEmpresa } from '~/composables/useEmpresa'

definePageMeta({ layout: 'default' })
const supabase = createSupabaseClient()
const { empresaId, loadEmpresa } = useEmpresa()

const tabs = [
  { id: 'visao', label: 'Visão geral' },
  { id: 'planejamento', label: 'Planejamento' },
  { id: 'campanhas', label: 'Campanhas' },
  { id: 'conteudo', label: 'Conteúdo' },
  { id: 'calendario', label: 'Calendário' },
  { id: 'midia', label: 'Mídia paga' },
  { id: 'automacao', label: 'Automação' },
  { id: 'relatorios', label: 'Relatórios' },
]
const activeTab = ref('visao')
const loading = ref(true)
const saving = ref(false)
const modalError = ref<string | null>(null)

interface Tarefa { id: number; titulo: string; descricao: string | null; status: string; prioridade: string; data_tarefa: string | null; urgente: boolean }
interface Conteudo { id: number; titulo: string; tipo: string; rede: string | null; status: string; data_publicacao: string | null; alcance: number; engajamento: number; thumb_cor: string | null }
interface Automacao { id: number; nome: string; gatilho: string; acao: string; descricao: string | null; ativo: boolean }
interface Overview {
  conectado: boolean
  kpis: { leads: number; oportunidades: number; clientes: number; receita: number | null; roi: string | null }
  funil: { nome: string; qtd: number; cor: string; conv: string }[]
  canais: { nome: string; qtd: number; cor: string }[]
  campanhas: { nome: string; canal: string; icone: string; investimento: number; resultado: string; roi: string; status: string }[]
  midiaPaga: { investimento: number; cliques: number; cpc: number; conversoes: number; serie: { data: string; valor: number }[] } | null
}

const overview = ref<Overview | null>(null)
const tarefas = ref<Tarefa[]>([])
const conteudos = ref<Conteudo[]>([])
const automacoes = ref<Automacao[]>([])

// ── Formatação ──
function fmtBRL(n: number | null | undefined): string {
  if (n == null) return '—'
  return 'R$ ' + Math.round(n).toLocaleString('pt-BR')
}
function fmtDataCurta(d: string | null): string {
  if (!d) return '—'
  const dt = new Date(d.length <= 10 ? d + 'T00:00:00' : d)
  if (isNaN(dt.getTime())) return '—'
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
const periodoLabel = computed(() => new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))

// ── Visão geral derivados ──
const funil = computed(() => overview.value?.funil ?? [])
const canais = computed(() => overview.value?.canais ?? [])
const campanhas = computed(() => overview.value?.campanhas ?? [])
const totalSessoes = computed(() => canais.value.reduce((s, c) => s + c.qtd, 0))

// Funil 3D: fases fixas + anotações (percentual da etapa para a seguinte)
const FUNIL_FASES = [
  { fase: 'Aprendizado e descoberta', suffix: 'viram leads' },
  { fase: 'Reconhecimento do problema', suffix: 'viram oportunidades' },
  { fase: 'Consideração da solução', suffix: 'recebem proposta' },
  { fase: 'Avaliação e negociação', suffix: 'fecham negócio' },
  { fase: 'Decisão de compra', suffix: '' },
]
const FUNNEL_NOTE_TOP = [30, 102, 164, 220, 271]
const funilFases = computed(() => {
  const arr = funil.value
  if (!arr.length) return []
  return arr.map((e, i) => {
    const next = arr[i + 1]
    const pct = next && e.qtd > 0 ? ((next.qtd / e.qtd) * 100).toFixed(1).replace('.', ',') + '%' : null
    const meta = FUNIL_FASES[i] || { fase: e.nome, suffix: '' }
    const texto = i < arr.length - 1 && pct
      ? `${pct} ${meta.suffix}`
      : `${e.qtd.toLocaleString('pt-BR')} novos clientes no mês`
    return { nome: e.nome, qtdFmt: e.qtd.toLocaleString('pt-BR'), fase: meta.fase, texto }
  })
})
const convGeral = computed(() => {
  const f = funil.value
  const topo = f[0]?.qtd || 0
  const clientes = f[f.length - 1]?.qtd || 0
  return topo > 0 ? ((clientes / topo) * 100).toFixed(2) + '%' : '—'
})

const canaisComPct = computed(() => {
  const tot = totalSessoes.value || 1
  return canais.value.map((c) => ({ ...c, pct: ((c.qtd / tot) * 100).toFixed(1) }))
})
const donutSegments = computed(() => {
  const circ = 2 * Math.PI * 54
  const tot = totalSessoes.value || 1
  let offset = 0
  return canais.value.map((c) => {
    const dash = (c.qtd / tot) * circ
    const seg = { cor: c.cor, dash: `${dash.toFixed(1)} ${(circ - dash).toFixed(1)}`, offset: `-${offset.toFixed(1)}` }
    offset += dash
    return seg
  })
})

function sparkPath(vals: number[], w = 140, h = 40) {
  const pad = 4, lo = Math.min(...vals), hi = Math.max(...vals) || 1
  const pts = vals.map((v, i) => `${((i / (vals.length - 1)) * w).toFixed(1)},${(pad + (1 - (v - lo) / (hi - lo || 1)) * (h - 2 * pad)).toFixed(1)}`)
  const line = 'M' + pts.join(' L')
  return { linePath: line, areaPath: line + ` L${w},${h} L0,${h} Z` }
}
// Sparklines decorativas (tendência genérica, não é série real por KPI)
const SPARK = {
  leads: sparkPath([62, 58, 66, 71, 64, 74, 79, 72, 84, 81, 90, 96]),
  oport: sparkPath([30, 34, 31, 38, 36, 42, 40, 47, 45, 52, 50, 57]),
  cli: sparkPath([4, 6, 5, 7, 6, 8, 7, 9, 8, 10, 9, 11]),
  rec: sparkPath([6.2, 7.8, 7.1, 9.4, 8.8, 10.6, 11.2, 10.4, 12.8, 12.1, 13.9, 15.2]),
  roi: sparkPath([210, 232, 224, 251, 246, 268, 262, 281, 275, 296, 301, 315]),
}

const kpis = computed(() => {
  const k = overview.value?.kpis
  return [
    { label: 'Novos Leads', valor: (k?.leads ?? 0).toLocaleString('pt-BR'), iconBg: '#eef3fd', iconColor: '#2457e6', hint: 'do CRM', spark: SPARK.leads, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z"/>' },
    { label: 'Oportunidades', valor: (k?.oportunidades ?? 0).toLocaleString('pt-BR'), iconBg: '#e7f6ef', iconColor: '#0fa06e', hint: 'leads qualificados', spark: SPARK.oport, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
    { label: 'Clientes conquistados', valor: (k?.clientes ?? 0).toLocaleString('pt-BR'), iconBg: '#fdf2dd', iconColor: '#d8920b', hint: 'leads convertidos', spark: SPARK.cli, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>' },
    { label: 'Receita gerada', valor: fmtBRL(k?.receita ?? null), iconBg: '#e3f4f9', iconColor: '#12a5c9', hint: k?.receita == null ? 'sem fonte atribuída' : '', spark: SPARK.rec, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
    { label: 'ROI Marketing', valor: k?.roi ?? '—', iconBg: '#f0ebfd', iconColor: '#7c5ce6', hint: overview.value?.conectado ? '' : 'conecte anúncios', spark: SPARK.roi, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>' },
  ]
})

const midiaCards = computed(() => {
  const m = overview.value?.midiaPaga
  if (!m) return []
  return [
    { label: 'Investimento', valor: fmtBRL(m.investimento) },
    { label: 'Cliques', valor: m.cliques.toLocaleString('pt-BR') },
    { label: 'CPC médio', valor: 'R$ ' + m.cpc.toFixed(2).replace('.', ',') },
    { label: 'Conversões', valor: m.conversoes.toLocaleString('pt-BR') },
  ]
})

const serieMidia = computed(() => overview.value?.midiaPaga?.serie ?? [])
function serieCoords() {
  const s = serieMidia.value
  if (s.length < 2) return [] as { x: number; y: number }[]
  const max = Math.max(...s.map((p) => p.valor), 1)
  const w = 640, h = 180, pad = 14
  return s.map((p, i) => ({ x: (i / (s.length - 1)) * w, y: h - pad - (p.valor / max) * (h - 2 * pad) }))
}
const serieLinePath = computed(() => {
  const c = serieCoords()
  if (!c.length) return ''
  return 'M' + c.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L')
})
const serieAreaPath = computed(() => {
  const c = serieCoords()
  if (!c.length) return ''
  return serieLinePath.value + ` L640,180 L0,180 Z`
})

// Metas do mês — valor REAL (do CRM/mídia), meta é referência (ajustável)
const METAS_ALVO = { leads: 1500, clientes: 100, roi: 250 }
const metas = computed(() => {
  const k = overview.value?.kpis
  const leads = k?.leads ?? 0
  const clientes = k?.clientes ?? 0
  const roiNum = k?.roi ? parseInt(String(k.roi).replace(/\D/g, '')) : 0
  const pct = (v: number, alvo: number) => Math.min(100, Math.round((v / alvo) * 100))
  return [
    { label: 'Novos leads', valorFmt: leads.toLocaleString('pt-BR'), metaFmt: METAS_ALVO.leads.toLocaleString('pt-BR'), pct: pct(leads, METAS_ALVO.leads), cor: '#12a5c9', superada: leads >= METAS_ALVO.leads },
    { label: 'Clientes conquistados', valorFmt: clientes.toLocaleString('pt-BR'), metaFmt: String(METAS_ALVO.clientes), pct: pct(clientes, METAS_ALVO.clientes), cor: '#0fa06e', superada: clientes >= METAS_ALVO.clientes },
    { label: 'ROI de marketing', valorFmt: k?.roi ?? '—', metaFmt: METAS_ALVO.roi + '%', pct: pct(roiNum, METAS_ALVO.roi), cor: '#7c5ce6', superada: roiNum >= METAS_ALVO.roi },
  ]
})

const relatorioCards = computed(() => {
  const k = overview.value?.kpis
  const m = overview.value?.midiaPaga
  return [
    { label: 'Leads no período', valor: (k?.leads ?? 0).toLocaleString('pt-BR'), hint: 'do CRM' },
    { label: 'Taxa de conversão', valor: k && k.leads ? ((k.clientes / k.leads) * 100).toFixed(1) + '%' : '—', hint: 'leads → clientes' },
    { label: 'Investimento em mídia', valor: fmtBRL(m?.investimento ?? null), hint: m ? '' : 'conecte anúncios' },
    { label: 'Conversões (mídia)', valor: (m?.conversoes ?? 0).toLocaleString('pt-BR'), hint: m ? '' : '—' },
    { label: 'Conteúdos publicados', valor: conteudos.value.filter((c) => c.status === 'publicado').length.toLocaleString('pt-BR'), hint: 'total' },
    { label: 'Automações ativas', valor: automacoes.value.filter((a) => a.ativo).length.toLocaleString('pt-BR'), hint: 'em execução' },
  ]
})

// ── Badges / tags ──
const tagVerde = { background: '#e7f6ef', color: '#0b7a4b' }
const tagAmarelo = { background: '#fdf2dd', color: '#a06508' }
function prioridadeTag(p: string) {
  if (p === 'alta') return { background: '#fde8e8', color: '#c02b2b' }
  if (p === 'baixa') return { background: '#eef1f5', color: '#6b7a8a' }
  return { background: '#fdf2dd', color: '#a06508' }
}
function statusConteudoTag(s: string) {
  if (s === 'publicado') return tagVerde
  if (s === 'agendado') return { background: '#fdf2dd', color: '#a06508' }
  return { background: '#eef1f5', color: '#6b7a8a' }
}
function statusTag(s: string) {
  if (s === 'ativa') return tagVerde
  if (s === 'pausada') return tagAmarelo
  return { background: '#eef1f5', color: '#6b7a8a' }
}
function statusPill(s: string) {
  if (s === 'ativa') return { background: '#e7f6ef', color: '#0b7a4b', dot: '#0fa06e' }
  if (s === 'pausada') return { background: '#fdf2dd', color: '#a06508', dot: '#d8920b' }
  return { background: '#eef1f5', color: '#6b7a8a', dot: '#94a3b8' }
}

const GATILHOS: Record<string, string> = { novo_lead: 'novo lead', lead_qualificado: 'lead qualificado', proposta_enviada: 'proposta enviada', cliente_convertido: 'cliente convertido' }
const ACOES: Record<string, string> = { enviar_email: 'enviar e-mail', enviar_whatsapp: 'enviar WhatsApp', notificar_equipe: 'notificar equipe', criar_tarefa: 'criar tarefa' }
function gatilhoLabel(g: string) { return GATILHOS[g] || g }
function acaoLabel(a: string) { return ACOES[a] || a }

// ── Tarefas ──
const modalTarefa = ref(false)
const tarefaForm = reactive<Partial<Tarefa>>({})
function abrirTarefa(t?: Tarefa) {
  modalError.value = null
  if (t) Object.assign(tarefaForm, t)
  else Object.assign(tarefaForm, { id: undefined, titulo: '', descricao: '', prioridade: 'media', data_tarefa: null, urgente: false, status: 'pendente' })
  modalTarefa.value = true
}
async function salvarTarefa() {
  if (!empresaId.value || !tarefaForm.titulo) return
  saving.value = true; modalError.value = null
  const payload = { empresa_id: empresaId.value, titulo: tarefaForm.titulo, descricao: tarefaForm.descricao || null, prioridade: tarefaForm.prioridade || 'media', data_tarefa: tarefaForm.data_tarefa || null, urgente: !!tarefaForm.urgente, status: tarefaForm.status || 'pendente' }
  const res = tarefaForm.id ? await supabase.from('marketing_tarefas').update(payload).eq('id', tarefaForm.id) : await supabase.from('marketing_tarefas').insert(payload)
  saving.value = false
  if (res.error) { modalError.value = res.error.message; return }
  modalTarefa.value = false
  await fetchTarefas()
}
async function concluirTarefa(t: Tarefa) { await supabase.from('marketing_tarefas').update({ status: 'concluida' }).eq('id', t.id); await fetchTarefas() }
async function excluirTarefa(t: Tarefa) { if (!confirm('Excluir esta tarefa?')) return; await supabase.from('marketing_tarefas').delete().eq('id', t.id); await fetchTarefas() }

// ── Conteúdos ──
const CORES_CONTEUDO = ['#2457e6', '#7c5ce6', '#e1306c', '#12a5c9', '#d8920b', '#0fa06e']
const modalConteudo = ref(false)
const conteudoForm = reactive<Partial<Conteudo>>({})
function abrirConteudo(c?: Conteudo) {
  modalError.value = null
  if (c) Object.assign(conteudoForm, { ...c, data_publicacao: c.data_publicacao ? c.data_publicacao.slice(0, 10) : null })
  else Object.assign(conteudoForm, { id: undefined, titulo: '', tipo: 'instagram', status: 'rascunho', data_publicacao: null, alcance: 0, engajamento: 0, thumb_cor: null })
  modalConteudo.value = true
}
async function salvarConteudo() {
  if (!empresaId.value || !conteudoForm.titulo) return
  saving.value = true; modalError.value = null
  const payload = { empresa_id: empresaId.value, titulo: conteudoForm.titulo, tipo: conteudoForm.tipo || 'outro', status: conteudoForm.status || 'rascunho', data_publicacao: conteudoForm.data_publicacao || null, alcance: Number(conteudoForm.alcance) || 0, engajamento: Number(conteudoForm.engajamento) || 0, thumb_cor: conteudoForm.thumb_cor || CORES_CONTEUDO[Math.floor(Math.random() * CORES_CONTEUDO.length)] }
  const res = conteudoForm.id ? await supabase.from('marketing_conteudos').update(payload).eq('id', conteudoForm.id) : await supabase.from('marketing_conteudos').insert(payload)
  saving.value = false
  if (res.error) { modalError.value = res.error.message; return }
  modalConteudo.value = false
  await fetchConteudos()
}
async function excluirConteudo(c: Conteudo) { if (!confirm('Excluir este conteúdo?')) return; await supabase.from('marketing_conteudos').delete().eq('id', c.id); await fetchConteudos() }

// ── Calendário ──
const calRef = ref(new Date())
const mesLabel = computed(() => calRef.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
function mudarMes(delta: number) { const d = new Date(calRef.value); d.setMonth(d.getMonth() + delta); calRef.value = d }
const gradeCalendario = computed(() => {
  const y = calRef.value.getFullYear(), m = calRef.value.getMonth()
  const diasNoMes = new Date(y, m + 1, 0).getDate()
  const inicioSemana = new Date(y, m, 1).getDay()
  const hoje = new Date()
  const cels: { dia: number | null; doMes: boolean; hoje: boolean; conteudos: Conteudo[] }[] = []
  for (let i = 0; i < inicioSemana; i++) cels.push({ dia: null, doMes: false, hoje: false, conteudos: [] })
  for (let d = 1; d <= diasNoMes; d++) {
    const cd = conteudos.value.filter((c) => {
      if (!c.data_publicacao) return false
      const dt = new Date(c.data_publicacao.length <= 10 ? c.data_publicacao + 'T00:00:00' : c.data_publicacao)
      return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d
    })
    cels.push({ dia: d, doMes: true, hoje: hoje.getFullYear() === y && hoje.getMonth() === m && hoje.getDate() === d, conteudos: cd })
  }
  while (cels.length % 7 !== 0) cels.push({ dia: null, doMes: false, hoje: false, conteudos: [] })
  return cels
})

// ── Automações ──
const modalAutomacao = ref(false)
const automacaoForm = reactive<Partial<Automacao>>({})
function abrirAutomacao(a?: Automacao) {
  modalError.value = null
  if (a) Object.assign(automacaoForm, a)
  else Object.assign(automacaoForm, { id: undefined, nome: '', gatilho: 'novo_lead', acao: 'enviar_email', descricao: '', ativo: true })
  modalAutomacao.value = true
}
async function salvarAutomacao() {
  if (!empresaId.value || !automacaoForm.nome) return
  saving.value = true; modalError.value = null
  const payload = { empresa_id: empresaId.value, nome: automacaoForm.nome, gatilho: automacaoForm.gatilho || 'novo_lead', acao: automacaoForm.acao || 'enviar_email', descricao: automacaoForm.descricao || null, ativo: automacaoForm.ativo !== false }
  const res = automacaoForm.id ? await supabase.from('marketing_automacoes').update(payload).eq('id', automacaoForm.id) : await supabase.from('marketing_automacoes').insert(payload)
  saving.value = false
  if (res.error) { modalError.value = res.error.message; return }
  modalAutomacao.value = false
  await fetchAutomacoes()
}
async function toggleAutomacao(a: Automacao) { await supabase.from('marketing_automacoes').update({ ativo: !a.ativo }).eq('id', a.id); await fetchAutomacoes() }
async function excluirAutomacao(a: Automacao) { if (!confirm('Excluir esta automação?')) return; await supabase.from('marketing_automacoes').delete().eq('id', a.id); await fetchAutomacoes() }

// ── Fetching ──
async function fetchOverview() {
  if (!empresaId.value) return
  try { overview.value = await $fetch<Overview>('/api/marketing/overview', { query: { empresa_id: empresaId.value } }) }
  catch (e) { console.error('[marketing] overview erro:', e) }
}
async function fetchTarefas() {
  if (!empresaId.value) return
  const { data } = await supabase.from('marketing_tarefas').select('*').eq('empresa_id', empresaId.value).order('data_tarefa', { ascending: true, nullsFirst: false })
  tarefas.value = (data as Tarefa[]) || []
}
async function fetchConteudos() {
  if (!empresaId.value) return
  const { data } = await supabase.from('marketing_conteudos').select('*').eq('empresa_id', empresaId.value).order('data_publicacao', { ascending: false, nullsFirst: false })
  conteudos.value = (data as Conteudo[]) || []
}
async function fetchAutomacoes() {
  if (!empresaId.value) return
  const { data } = await supabase.from('marketing_automacoes').select('*').eq('empresa_id', empresaId.value).order('created_at', { ascending: false })
  automacoes.value = (data as Automacao[]) || []
}

onMounted(async () => {
  await loadEmpresa()
  if (empresaId.value) await Promise.all([fetchOverview(), fetchTarefas(), fetchConteudos(), fetchAutomacoes()])
  loading.value = false
})
</script>

<style scoped>
.mkt-page { padding: 20px 24px; background: #f7f9fc; min-height: 100%; font-family: 'Inter', system-ui, sans-serif; }
.mkt-topbar { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 22px; }
.mkt-title { font-size: 20px; font-weight: 700; color: #0f1720; letter-spacing: -0.3px; }
.mkt-subtitle { font-size: 12.5px; color: #6b7a8a; margin-top: 2px; }
.mkt-topbar-right { display: flex; align-items: center; gap: 10px; }
.mkt-date-pill { display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px; border: 1px solid #e6eaf0; background: #fff; font-size: 12px; font-weight: 500; color: #33404e; text-transform: capitalize; }
.mkt-btn-primary { padding: 9px 16px; border-radius: 8px; border: none; background: linear-gradient(135deg, #2457e6, #1c46c4); color: #fff; font-size: 12.5px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(36,87,230,0.25); }
.mkt-btn-primary:disabled { opacity: 0.5; cursor: default; }
.mkt-btn-ghost { padding: 9px 16px; border-radius: 8px; border: 1px solid #e6eaf0; background: #fff; color: #6b7a8a; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.mkt-tabs { display: flex; gap: 0; border-bottom: 1px solid #e6eaf0; margin-bottom: 20px; overflow-x: auto; }
.mkt-tab { position: relative; padding: 10px 16px; border: none; background: none; font-size: 12.5px; font-weight: 500; color: #6b7a8a; cursor: pointer; white-space: nowrap; }
.mkt-tab.active { color: #0f1720; font-weight: 600; }
.mkt-tab-bar { position: absolute; left: 8px; right: 8px; bottom: -1px; height: 2px; border-radius: 2px; background: #2457e6; }
.mkt-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 80px 0; color: #98a4b3; font-size: 13px; }
.mkt-spinner { width: 30px; height: 30px; border: 3px solid #dbe4f5; border-top-color: #2457e6; border-radius: 50%; animation: mkt-spin 0.8s linear infinite; }
@keyframes mkt-spin { to { transform: rotate(360deg); } }
.mkt-connect-banner { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px; border: 1px solid #cddbfa; background: #eef3fd; margin-bottom: 14px; color: #2457e6; }
.mkt-connect-text { flex: 1; display: flex; flex-direction: column; }
.mkt-connect-text strong { font-size: 13px; color: #1c3aa0; }
.mkt-connect-text span { font-size: 12px; color: #4a5f8f; margin-top: 2px; }
.mkt-connect-btn { padding: 8px 14px; border-radius: 8px; background: linear-gradient(135deg, #2457e6, #1c46c4); color: #fff; font-size: 12px; font-weight: 700; text-decoration: none; white-space: nowrap; }
.mkt-row { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 14px; }
.mkt-card { background: #fff; border: 1px solid #e6eaf0; border-radius: 12px; padding: 20px 22px; box-shadow: 0 1px 2px rgba(16,24,40,0.03); }
.mkt-card-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
.mkt-card-header h2 { font-size: 14.5px; font-weight: 700; letter-spacing: -0.2px; color: #0f1720; }
.mkt-card-sub { font-size: 12px; color: #8a97a6; margin-top: 2px; }
.mkt-link { font-size: 12px; font-weight: 600; color: #2457e6; cursor: pointer; background: none; border: none; text-decoration: none; }
.mkt-link:hover { text-decoration: underline; }
.mkt-link.danger { color: #e04545; }
.mkt-kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 14px; }
.mkt-kpi-card { background: #fff; border: 1px solid #e6eaf0; border-radius: 12px; padding: 16px 18px; box-shadow: 0 1px 2px rgba(16,24,40,0.03); }
.mkt-kpi-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.mkt-kpi-label { font-size: 11.5px; font-weight: 500; color: #6b7a8a; margin-bottom: 4px; }
.mkt-kpi-value { font-size: 22px; font-weight: 700; color: #0f1720; letter-spacing: -0.4px; font-variant-numeric: tabular-nums; }
.mkt-kpi-hint { font-size: 10.5px; color: #98a4b3; margin-top: 4px; min-height: 14px; }
.mkt-kpi-spark { width: 100%; height: 34px; margin-top: 8px; display: block; }
/* Funil 3D (SVG trapézio) */
.mkt-funnel-scroll { overflow-x: auto; }
.mkt-funnel-wrap { display: flex; align-items: flex-start; gap: 8px; min-width: 540px; }
.mkt-funnel-labels { width: 82px; flex: none; display: flex; flex-direction: column; }
.mkt-funnel-label { display: flex; align-items: center; gap: 6px; }
.mkt-funnel-label span:first-child { flex: 1; text-align: right; font-size: 9.5px; font-weight: 700; color: #6b7a8a; text-transform: uppercase; letter-spacing: 0.4px; line-height: 1.4; }
.mkt-funnel-bracket { width: 7px; height: 100%; border-top: 1.5px solid #bac8de; border-left: 1.5px solid #bac8de; border-bottom: 1.5px solid #bac8de; border-radius: 3px 0 0 3px; }
.mkt-funnel-svg { flex: none; display: block; }
.mkt-funnel-notes { flex: 1 1 138px; min-width: 138px; position: relative; height: 322px; }
.mkt-funnel-note { position: absolute; left: 0; right: 0; display: flex; align-items: flex-start; gap: 7px; }
.mkt-funnel-arrow { flex: none; margin-top: 1px; }
.mkt-funnel-note-title { font-size: 11.5px; font-weight: 600; color: #22303d; line-height: 1.25; }
.mkt-funnel-note-sub { font-size: 10.5px; color: #8a97a6; margin-top: 2px; }
.mkt-funil-footer { margin-top: 16px; padding-top: 14px; border-top: 1px solid #eef1f5; display: flex; justify-content: space-between; font-size: 12px; color: #6b7a8a; }
.mkt-funil-footer-val { font-weight: 700; color: #0f1720; font-variant-numeric: tabular-nums; }
/* Chart */
.mkt-chart-area { margin-top: 12px; }
.mkt-chart-svg { width: 100%; height: 180px; display: block; }
.mkt-chart-legend { display: flex; gap: 14px; align-items: center; }
.mkt-legend-item { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: #33404e; font-weight: 500; }
.mkt-legend-line { width: 14px; height: 3px; border-radius: 2px; }
.mkt-empty-inline { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 30px 0; text-align: center; }
.mkt-empty-inline p { font-size: 12.5px; color: #8a97a6; }
/* Donut */
.mkt-donut-wrap { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.mkt-donut-container { position: relative; width: 160px; height: 160px; flex: none; }
.mkt-donut-svg { width: 100%; height: 100%; display: block; }
.mkt-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.mkt-donut-val { font-size: 18px; font-weight: 700; letter-spacing: -0.4px; font-variant-numeric: tabular-nums; color: #0f1720; }
.mkt-donut-label { font-size: 11px; color: #8a97a6; }
.mkt-donut-legend { flex: 1; display: flex; flex-direction: column; gap: 8px; min-width: 160px; }
.mkt-legend-row { display: flex; align-items: center; gap: 8px; }
.mkt-legend-dot { width: 8px; height: 8px; border-radius: 2px; flex: none; }
.mkt-legend-name { font-size: 12.5px; color: #33404e; flex: 1; }
.mkt-legend-val { font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; color: #0f1720; }
.mkt-legend-pct { font-size: 11.5px; color: #8a97a6; width: 46px; text-align: right; font-variant-numeric: tabular-nums; }
/* Table (visão) */
.mkt-table-scroll { overflow-x: auto; }
.mkt-table-head { display: grid; grid-template-columns: 2.3fr 1.1fr 1fr 0.7fr 1fr 30px; gap: 10px; padding: 0 10px 9px; border-bottom: 1px solid #eef1f5; font-size: 10.5px; font-weight: 700; color: #8a97a6; text-transform: uppercase; letter-spacing: 0.4px; min-width: 560px; }
.mkt-table-row { display: grid; grid-template-columns: 2.3fr 1.1fr 1fr 0.7fr 1fr 30px; gap: 10px; align-items: center; padding: 11px 10px; border-bottom: 1px solid #f4f6f9; min-width: 560px; border-radius: 8px; }
.mkt-table-row:hover { background: #f7f9fc; }
.mkt-camp-name { display: flex; align-items: center; gap: 10px; }
.mkt-camp-badge { width: 26px; height: 26px; border-radius: 7px; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex: none; }
.mkt-camp-title { font-size: 12.5px; font-weight: 600; color: #22303d; }
.mkt-camp-sub { font-size: 11px; color: #98a4b3; text-transform: capitalize; }
.mkt-cell-mono { font-size: 12.5px; color: #33404e; font-variant-numeric: tabular-nums; }
.mkt-cell-roi { font-size: 12.5px; font-weight: 700; color: #0b7a4b; font-variant-numeric: tabular-nums; }
.mkt-status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.mkt-status-dot { width: 5px; height: 5px; border-radius: 50%; }
.mkt-cell-menu { color: #b0bac6; font-weight: 700; text-align: center; }
/* Midia */
.mkt-midia-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)); gap: 12px; }
.mkt-midia-kpi { padding: 12px 14px; background: #f8fafc; border: 1px solid #eef1f5; border-radius: 10px; }
.mkt-midia-kpi-label { font-size: 10.5px; font-weight: 700; color: #8a97a6; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 5px; }
.mkt-midia-kpi-val { font-size: 17px; font-weight: 700; color: #0f1720; letter-spacing: -0.3px; font-variant-numeric: tabular-nums; }
/* Metas */
.mkt-metas { display: flex; flex-direction: column; gap: 17px; }
.mkt-meta-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; }
.mkt-meta-label { font-size: 12.5px; font-weight: 600; color: #33404e; display: inline-flex; align-items: center; gap: 7px; }
.mkt-meta-badge { padding: 1px 7px; border-radius: 999px; background: #e7f6ef; color: #0b7a4b; font-size: 10px; font-weight: 700; }
.mkt-meta-val { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; color: #0f1720; }
.mkt-meta-bar-wrap { height: 6px; border-radius: 999px; background: #eef1f5; overflow: hidden; }
.mkt-meta-bar { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
.mkt-meta-bottom { display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px; color: #98a4b3; }
.mkt-empty-chart { height: 180px; display: flex; align-items: center; justify-content: center; }
/* Data tables (CRUD tabs) */
.mkt-data-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.mkt-data-table thead th { text-align: left; font-size: 10.5px; font-weight: 700; color: #8a97a6; text-transform: uppercase; letter-spacing: 0.4px; padding: 12px 14px; border-bottom: 1px solid #eef1f5; background: #fafbfd; }
.mkt-data-table thead th.right { text-align: right; }
.mkt-data-table tbody td { padding: 12px 14px; border-bottom: 1px solid #f4f6f9; color: #33404e; vertical-align: top; }
.mkt-data-table tbody td.right { text-align: right; }
.mkt-data-table tbody tr:hover { background: #f9fbfe; }
.mkt-td-title { font-weight: 600; color: #22303d; display: flex; align-items: center; gap: 8px; }
.mkt-td-title.done { text-decoration: line-through; color: #b0bac6; }
.mkt-td-sub { font-size: 11px; color: #98a4b3; margin-top: 2px; }
.mkt-td-actions { text-align: right; white-space: nowrap; }
.mkt-td-actions .mkt-link { margin-left: 12px; }
.mkt-dot-inline { width: 9px; height: 9px; border-radius: 3px; flex: none; }
.mkt-tag { display: inline-block; font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 999px; text-transform: capitalize; }
/* Empty block */
.mkt-empty-block { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 60px 20px; text-align: center; }
.mkt-empty-block h2 { font-size: 15px; font-weight: 700; color: #6b7a8a; }
.mkt-empty-icon { width: 44px; height: 44px; border-radius: 12px; background: #eef3fd; color: #2457e6; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
/* Calendário */
.mkt-cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.mkt-cal-header h2 { font-size: 15px; font-weight: 700; color: #0f1720; }
.mkt-cal-nav { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e6eaf0; background: #fff; color: #6b7a8a; font-size: 18px; cursor: pointer; }
.mkt-cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 6px; }
.mkt-cal-weekdays div { text-align: center; font-size: 10.5px; font-weight: 700; color: #98a4b3; padding: 4px 0; }
.mkt-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.mkt-cal-cell { min-height: 88px; border-radius: 8px; border: 1px solid #eef1f5; padding: 6px; background: #fff; }
.mkt-cal-cell.out { background: #fafbfd; border-color: transparent; }
.mkt-cal-cell.today { border-color: #2457e6; }
.mkt-cal-day { font-size: 11px; font-weight: 700; color: #6b7a8a; }
.mkt-cal-event { margin-top: 4px; font-size: 9px; font-weight: 600; color: #fff; border-radius: 4px; padding: 2px 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
/* Automação */
.mkt-auto-list { display: flex; flex-direction: column; }
.mkt-auto-item { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-bottom: 1px solid #f4f6f9; }
.mkt-auto-item:last-child { border-bottom: none; }
.mkt-auto-info { flex: 1; min-width: 0; }
.mkt-toggle { position: relative; width: 40px; height: 22px; border-radius: 999px; border: none; background: #d5dce6; cursor: pointer; transition: background 0.2s; flex: none; }
.mkt-toggle.on { background: #2457e6; }
.mkt-toggle-knob { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: left 0.2s; }
.mkt-toggle.on .mkt-toggle-knob { left: 21px; }
/* Modal */
.mkt-modal-overlay { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; background: rgba(15,23,32,0.42); }
.mkt-modal { background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(16,24,40,0.28); width: 100%; max-width: 460px; padding: 22px; display: flex; flex-direction: column; gap: 12px; }
.mkt-modal h3 { font-size: 15px; font-weight: 700; color: #0f1720; }
.mkt-input { width: 100%; border: 1px solid #e6eaf0; border-radius: 10px; padding: 10px 12px; font-size: 13px; color: #33404e; background: #f8fafc; font-family: inherit; }
.mkt-input:focus { outline: none; border-color: #2457e6; box-shadow: 0 0 0 3px rgba(36,87,230,0.12); }
.mkt-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mkt-check { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #6b7a8a; }
.mkt-modal-error { font-size: 12px; color: #c02b2b; background: #fde8e8; border: 1px solid #f5c6c6; border-radius: 8px; padding: 8px 10px; }
.mkt-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.mkt-fade-enter-active, .mkt-fade-leave-active { transition: opacity 0.2s ease; }
.mkt-fade-enter-from, .mkt-fade-leave-to { opacity: 0; }
@media (max-width: 768px) { .mkt-page { padding: 14px 12px; } .mkt-kpi-row { grid-template-columns: 1fr 1fr; } }
</style>
