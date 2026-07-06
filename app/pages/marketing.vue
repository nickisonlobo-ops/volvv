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
          01/07/2026 - 31/07/2026
        </div>
        <button class="mkt-btn-primary">+ Nova ação</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mkt-tabs">
      <button v-for="tab in tabs" :key="tab.id" class="mkt-tab" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
        {{ tab.label }}
        <span v-if="activeTab === tab.id" class="mkt-tab-bar"></span>
      </button>
    </div>

    <template v-if="activeTab === 'visao'">
    <!-- KPI ROW -->
    <div class="mkt-kpi-row">
      <div v-for="k in kpis" :key="k.label" class="mkt-kpi-card">
        <div class="mkt-kpi-icon" :style="{ background: k.iconBg }">
          <svg class="w-[18px] h-[18px]" :style="{ color: k.iconColor }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" v-html="k.svg"></svg>
        </div>
        <div class="mkt-kpi-label">{{ k.label }}</div>
        <div class="mkt-kpi-value">{{ k.valor }}</div>
        <div class="mkt-kpi-change" :class="{ up: k.up }">{{ k.up ? '↑' : '↓' }} {{ k.variacao }} <span>vs mês ant.</span></div>
        <svg class="mkt-kpi-spark" viewBox="0 0 140 40" preserveAspectRatio="none">
          <path :d="k.areaPath" :fill="k.iconColor + '12'" />
          <path :d="k.linePath" fill="none" :stroke="k.iconColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <!-- ROW 2: Funil + Receita x Investimento -->
    <div class="mkt-row">
      <!-- FUNIL -->
      <div class="mkt-card" style="flex: 5 1 380px;">
        <div class="mkt-card-header">
          <h2>Funil de Marketing</h2>
          <select class="mkt-select"><option>Todos os canais</option></select>
        </div>
        <div class="mkt-funil-grid">
          <div v-for="(e, i) in funilData" :key="e.nome" class="mkt-funil-row">
            <div class="mkt-funil-info">
              <span class="mkt-funil-name">{{ e.nome }}</span>
              <span class="mkt-funil-qtd">{{ e.qtd.toLocaleString('pt-BR') }}</span>
            </div>
            <div class="mkt-funil-bar-wrap">
              <div class="mkt-funil-bar" :style="{ width: e.pct + '%', background: e.grad }"></div>
              <span class="mkt-funil-conv">{{ e.conv }}</span>
            </div>
            <span class="mkt-funil-badge" :class="{ green: e.drop }">{{ e.drop }}</span>
          </div>
        </div>
        <div class="mkt-funil-footer">
          <span>Conversão visitante → cliente</span>
          <span class="mkt-funil-footer-val">0,48%</span>
        </div>
      </div>

      <!-- RECEITA x INVESTIMENTO -->
      <div class="mkt-card" style="flex: 7 1 440px;">
        <div class="mkt-card-header">
          <div>
            <h2>Receita × Investimento</h2>
            <p class="mkt-card-sub">Evolução diária consolidada — R$ mil</p>
          </div>
          <div class="mkt-chart-legend">
            <span class="mkt-legend-item"><span class="mkt-legend-line" style="background:#2457e6"></span>Receita</span>
            <span class="mkt-legend-item"><span class="mkt-legend-dash"></span>Investimento</span>
          </div>
        </div>
        <div class="mkt-chart-area">
          <svg viewBox="0 0 640 180" preserveAspectRatio="none" class="mkt-chart-svg">
            <defs><linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2457e6" stop-opacity="0.12"/><stop offset="100%" stop-color="#2457e6" stop-opacity="0"/></linearGradient></defs>
            <line x1="0" y1="160" x2="640" y2="160" stroke="#eef1f5" stroke-width="1"/>
            <line x1="0" y1="120" x2="640" y2="120" stroke="#eef1f5" stroke-width="1"/>
            <line x1="0" y1="80" x2="640" y2="80" stroke="#eef1f5" stroke-width="1"/>
            <line x1="0" y1="40" x2="640" y2="40" stroke="#eef1f5" stroke-width="1"/>
            <path d="M0,130 C40,125 80,128 120,115 C160,102 200,108 240,95 C280,82 320,88 360,75 C400,62 440,68 480,55 C520,42 560,48 600,35 C620,28 640,25 640,22 L640,160 L0,160 Z" fill="url(#gBlue)"/>
            <path d="M0,145 C40,143 80,144 120,140 C160,136 200,138 240,134 C280,130 320,132 360,128 C400,124 440,126 480,122 C520,118 560,120 600,116 C620,114 640,113 640,112" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5 5" stroke-linecap="round"/>
            <path d="M0,130 C40,125 80,128 120,115 C160,102 200,108 240,95 C280,82 320,88 360,75 C400,62 440,68 480,55 C520,42 560,48 600,35 C620,28 640,25 640,22" fill="none" stroke="#2457e6" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="640" cy="22" r="3.5" fill="#2457e6"/>
          </svg>
          <div class="mkt-chart-labels">
            <span>01/07</span><span>08/07</span><span>15/07</span><span>22/07</span><span>31/07</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 3: Donut + Campanhas -->
    <div class="mkt-row">
      <!-- DONUT CANAIS -->
      <div class="mkt-card" style="flex: 5 1 360px;">
        <div class="mkt-card-header"><h2>Desempenho por canal</h2><span class="mkt-card-sub">Sessões</span></div>
        <p class="mkt-card-sub" style="margin-bottom: 16px;">Origem do tráfego no período</p>
        <div class="mkt-donut-wrap">
          <div class="mkt-donut-container">
            <svg viewBox="0 0 140 140" class="mkt-donut-svg">
              <g transform="rotate(-90 70 70)">
                <circle cx="70" cy="70" r="54" fill="none" stroke="#7c5ce6" stroke-width="21" stroke-dasharray="118.8 339.3" stroke-dashoffset="0"/>
                <circle cx="70" cy="70" r="54" fill="none" stroke="#2457e6" stroke-width="21" stroke-dasharray="94.4 339.3" stroke-dashoffset="-120.8"/>
                <circle cx="70" cy="70" r="54" fill="none" stroke="#12a5c9" stroke-width="21" stroke-dasharray="51.6 339.3" stroke-dashoffset="-217.2"/>
                <circle cx="70" cy="70" r="54" fill="none" stroke="#0fa06e" stroke-width="21" stroke-dasharray="32.6 339.3" stroke-dashoffset="-270.8"/>
                <circle cx="70" cy="70" r="54" fill="none" stroke="#d8920b" stroke-width="21" stroke-dasharray="19.4 339.3" stroke-dashoffset="-305.4"/>
                <circle cx="70" cy="70" r="54" fill="none" stroke="#c3ccd8" stroke-width="21" stroke-dasharray="10.6 339.3" stroke-dashoffset="-326.8"/>
              </g>
            </svg>
            <div class="mkt-donut-center">
              <span class="mkt-donut-val">18.734</span>
              <span class="mkt-donut-label">sessões</span>
            </div>
          </div>
          <div class="mkt-donut-legend">
            <div v-for="c in canalLegend" :key="c.nome" class="mkt-legend-row">
              <span class="mkt-legend-dot" :style="{ background: c.cor }"></span>
              <span class="mkt-legend-name">{{ c.nome }}</span>
              <span class="mkt-legend-val">{{ c.qtd }}</span>
              <span class="mkt-legend-pct">{{ c.pct }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CAMPANHAS -->
      <div class="mkt-card" style="flex: 7 1 460px;">
        <div class="mkt-card-header">
          <div><h2>Campanhas ativas</h2><p class="mkt-card-sub">5 campanhas em veiculação</p></div>
          <span class="mkt-link">Ver todas</span>
        </div>
        <div class="mkt-table-scroll">
          <div class="mkt-table-head">
            <span>Campanha</span><span>Investimento</span><span>Resultado</span><span>ROI</span><span>Status</span><span></span>
          </div>
          <div v-for="c in campanhasData" :key="c.nome" class="mkt-table-row">
            <div class="mkt-camp-name">
              <span class="mkt-camp-badge" :style="{ background: c.badgeBg, color: c.badgeColor }">{{ c.sigla }}</span>
              <div><div class="mkt-camp-title">{{ c.nome }}</div><div class="mkt-camp-sub">{{ c.sub }}</div></div>
            </div>
            <span class="mkt-cell-mono">{{ c.investimento }}</span>
            <span class="mkt-cell-mono">{{ c.resultado }}</span>
            <span class="mkt-cell-roi">{{ c.roi }}</span>
            <span><span class="mkt-status-pill" :style="{ background: c.statusBg, color: c.statusColor }"><span class="mkt-status-dot" :style="{ background: c.statusDot }"></span>{{ c.status }}</span></span>
            <span class="mkt-cell-menu">⋯</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 4: Mídia Paga + Metas -->
    <div class="mkt-row">
      <!-- MÍDIA PAGA -->
      <div class="mkt-card" style="flex: 7 1 440px;">
        <div class="mkt-card-header"><div><h2>Mídia paga</h2><p class="mkt-card-sub">Consolidado de todas as plataformas</p></div><span class="mkt-link">Ver relatório</span></div>
        <div class="mkt-midia-grid">
          <div class="mkt-midia-kpi"><div class="mkt-midia-kpi-label">Investimento</div><div class="mkt-midia-kpi-val">R$ 5.120,00</div><div class="mkt-midia-kpi-change up">↑ 12,0% vs jun</div></div>
          <div class="mkt-midia-kpi"><div class="mkt-midia-kpi-label">Cliques</div><div class="mkt-midia-kpi-val">2.813</div><div class="mkt-midia-kpi-change up">↑ 8,4% vs jun</div></div>
          <div class="mkt-midia-kpi"><div class="mkt-midia-kpi-label">CPC médio</div><div class="mkt-midia-kpi-val">R$ 1,82</div><div class="mkt-midia-kpi-change up">↓ 6,2% vs jun</div></div>
          <div class="mkt-midia-kpi"><div class="mkt-midia-kpi-label">Conversões</div><div class="mkt-midia-kpi-val green">68</div><div class="mkt-midia-kpi-change up">↑ 15,0% vs jun</div></div>
        </div>
        <svg viewBox="0 0 640 100" preserveAspectRatio="none" class="mkt-midia-chart">
          <path d="M0,80 C30,76 60,78 90,70 C120,62 150,66 180,58 C210,50 240,54 270,46 C300,38 330,42 360,34 C390,26 420,30 450,24 C480,18 510,22 540,16 C570,10 600,14 640,8 L640,100 L0,100 Z" fill="url(#gBlue)"/>
          <path d="M0,80 C30,76 60,78 90,70 C120,62 150,66 180,58 C210,50 240,54 270,46 C300,38 330,42 360,34 C390,26 420,30 450,24 C480,18 510,22 540,16 C570,10 600,14 640,8" fill="none" stroke="#2457e6" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div class="mkt-chart-labels"><span>01/07</span><span>08/07</span><span>15/07</span><span>22/07</span><span>31/07</span></div>
      </div>

      <!-- METAS -->
      <div class="mkt-card" style="flex: 5 1 340px;">
        <div class="mkt-card-header"><h2>Metas do mês</h2></div>
        <p class="mkt-card-sub" style="margin-bottom: 16px;">Progresso em relação a julho/26</p>
        <div class="mkt-metas">
          <div v-for="m in metas" :key="m.label" class="mkt-meta-item">
            <div class="mkt-meta-top"><span class="mkt-meta-label">{{ m.label }}<span v-if="m.badge" class="mkt-meta-badge">{{ m.badge }}</span></span><span class="mkt-meta-val">{{ m.valor }}</span></div>
            <div class="mkt-meta-bar-wrap"><div class="mkt-meta-bar" :style="{ width: m.pct + '%', background: m.cor }"></div></div>
            <div class="mkt-meta-bottom"><span>Meta: {{ m.meta }}</span><span :style="{ color: m.cor, fontWeight: 700 }">{{ m.pct }}%</span></div>
          </div>
        </div>
      </div>
    </div>

    </template>

    <!-- Outras tabs -->
    <div v-if="activeTab !== 'visao'" class="mkt-card" style="padding: 60px; text-align: center;">
      <div class="mkt-empty-icon">{{ tabs.find(t => t.id === activeTab)?.label?.charAt(0) }}</div>
      <h2 style="margin-bottom: 6px;">{{ tabs.find(t => t.id === activeTab)?.label }}</h2>
      <p class="mkt-card-sub">Em breve disponível</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
definePageMeta({ layout: 'default' })

const activeTab = ref('visao')
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

function sparkPath(vals: number[], w = 140, h = 40) {
  const pad = 4; const lo = Math.min(...vals); const hi = Math.max(...vals) || 1
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${pad + (1 - (v - lo) / (hi - lo || 1)) * (h - 2 * pad)}`)
  const line = 'M' + pts.join(' L')
  const area = line + ` L${w},${h} L0,${h} Z`
  return { linePath: line, areaPath: area }
}

const kpis = [
  { label: 'Novos Leads', valor: '1.248', iconBg: '#eef3fd', iconColor: '#2457e6', variacao: '24,5%', up: true, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>', ...sparkPath([62,58,66,71,64,74,79,72,84,81,90,96]) },
  { label: 'Oportunidades', valor: '573', iconBg: '#e7f6ef', iconColor: '#0fa06e', variacao: '18,7%', up: true, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>', ...sparkPath([30,34,31,38,36,42,40,47,45,52,50,57]) },
  { label: 'Clientes conquistados', valor: '89', iconBg: '#fdf2dd', iconColor: '#d8920b', variacao: '15,2%', up: true, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>', ...sparkPath([4,6,5,7,6,8,7,9,8,10,9,11]) },
  { label: 'Receita gerada', valor: 'R$ 128.430', iconBg: '#e3f4f9', iconColor: '#12a5c9', variacao: '32,1%', up: true, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>', ...sparkPath([6.2,7.8,7.1,9.4,8.8,10.6,11.2,10.4,12.8,12.1,13.9,15.2]) },
  { label: 'ROI Marketing', valor: '315%', iconBg: '#f0ebfd', iconColor: '#7c5ce6', variacao: '28,6%', up: true, svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>', ...sparkPath([210,232,224,251,246,268,262,281,275,296,301,315]) },
]

const funilData = [
  { nome: 'Visitantes', qtd: 18734, pct: 100, conv: '100%', grad: 'linear-gradient(90deg,#1a1d6b,#2a3ab8)', drop: '' },
  { nome: 'Leads', qtd: 1248, pct: 55, conv: '6,7%', grad: 'linear-gradient(90deg,#2a3ab8,#3d5ce6)', drop: '↓ 93,3%' },
  { nome: 'Oportunidades', qtd: 573, pct: 40, conv: '3,1%', grad: 'linear-gradient(90deg,#3d5ce6,#5a7df0)', drop: '↓ 54,1%' },
  { nome: 'Propostas', qtd: 214, pct: 28, conv: '1,1%', grad: 'linear-gradient(90deg,#5a7df0,#7c9cf5)', drop: '↓ 37,3%' },
  { nome: 'Clientes', qtd: 89, pct: 19, conv: '0,5%', grad: 'linear-gradient(90deg,#143489,#0e2a73)', drop: '↓ 41,6%' },
]

const canalLegend = [
  { nome: 'Instagram', qtd: '6.676', pct: '35,6%', cor: '#7c5ce6' },
  { nome: 'Google', qtd: '5.317', pct: '28,4%', cor: '#2457e6' },
  { nome: 'Facebook', qtd: '2.964', pct: '15,8%', cor: '#12a5c9' },
  { nome: 'Orgânico', qtd: '1.913', pct: '10,2%', cor: '#0fa06e' },
  { nome: 'E-mail', qtd: '1.181', pct: '6,3%', cor: '#d8920b' },
  { nome: 'Outros', qtd: '683', pct: '3,7%', cor: '#c3ccd8' },
]

const campanhasData = [
  { nome: 'Campanha Jul — Leads', sub: 'Instagram + Facebook', sigla: 'IG', badgeBg: '#f0ebfd', badgeColor: '#6d4fd2', investimento: 'R$ 2.450,00', resultado: '248 leads', roi: '312%', status: 'Ativa', statusBg: '#e7f6ef', statusColor: '#0b7a4b', statusDot: '#0fa06e' },
  { nome: 'Google Ads — Conversão', sub: 'Rede de pesquisa', sigla: 'GO', badgeBg: '#e8eefc', badgeColor: '#2457e6', investimento: 'R$ 1.890,00', resultado: '32 clientes', roi: '420%', status: 'Ativa', statusBg: '#e7f6ef', statusColor: '#0b7a4b', statusDot: '#0fa06e' },
  { nome: 'Remarketing — Site', sub: 'Público de visitantes', sigla: 'FB', badgeBg: '#e3f4f9', badgeColor: '#0e7e9c', investimento: 'R$ 780,00', resultado: '18 clientes', roi: '289%', status: 'Pausada', statusBg: '#fdf2dd', statusColor: '#a06508', statusDot: '#d8920b' },
  { nome: 'E-mail — Novidades', sub: 'Base ativa · 12.400', sigla: 'EM', badgeBg: '#fdf2dd', badgeColor: '#a06508', investimento: 'R$ 0,00', resultado: '11 clientes', roi: '—', status: 'Ativa', statusBg: '#e7f6ef', statusColor: '#0b7a4b', statusDot: '#0fa06e' },
  { nome: 'LinkedIn — B2B', sub: 'Segmentação por cargo', sigla: 'LI', badgeBg: '#eaeef2', badgeColor: '#51606f', investimento: 'R$ 1.200,00', resultado: '26 leads', roi: '156%', status: 'Teste A/B', statusBg: '#e8eefc', statusColor: '#2457e6', statusDot: '#2457e6' },
]

const metas = [
  { label: 'Receita gerada', valor: 'R$ 128.430', meta: 'R$ 150.000', pct: 86, cor: '#2457e6', badge: '' },
  { label: 'Novos leads', valor: '1.248', meta: '1.500', pct: 83, cor: '#12a5c9', badge: '' },
  { label: 'Clientes conquistados', valor: '89', meta: '100', pct: 89, cor: '#0fa06e', badge: '' },
  { label: 'ROI de marketing', valor: '315%', meta: '250%', pct: 100, cor: '#7c5ce6', badge: 'Meta superada' },
]
</script>

<style scoped>
.mkt-page { padding: 20px 24px; background: #f7f9fc; min-height: 100%; font-family: 'Inter', system-ui, sans-serif; }
.mkt-topbar { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 22px; }
.mkt-title { font-size: 20px; font-weight: 700; color: #0f1720; letter-spacing: -0.3px; }
.mkt-subtitle { font-size: 12.5px; color: #6b7a8a; margin-top: 2px; }
.mkt-topbar-right { display: flex; align-items: center; gap: 10px; }
.mkt-date-pill { display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 8px; border: 1px solid #e6eaf0; background: #fff; font-size: 12px; font-weight: 500; color: #33404e; }
.mkt-btn-primary { padding: 9px 16px; border-radius: 8px; border: none; background: linear-gradient(135deg, #2457e6, #1c46c4); color: #fff; font-size: 12.5px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(36,87,230,0.25); }
.mkt-tabs { display: flex; gap: 0; border-bottom: 1px solid #e6eaf0; margin-bottom: 20px; overflow-x: auto; }
.mkt-tab { position: relative; padding: 10px 16px; border: none; background: none; font-size: 12.5px; font-weight: 500; color: #6b7a8a; cursor: pointer; white-space: nowrap; }
.mkt-tab.active { color: #0f1720; font-weight: 600; }
.mkt-tab-bar { position: absolute; left: 8px; right: 8px; bottom: -1px; height: 2px; border-radius: 2px; background: #2457e6; }
.mkt-row { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 14px; }
.mkt-card { background: #fff; border: 1px solid #e6eaf0; border-radius: 12px; padding: 20px 22px; box-shadow: 0 1px 2px rgba(16,24,40,0.03); }
.mkt-card-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
.mkt-card-header h2 { font-size: 14.5px; font-weight: 700; letter-spacing: -0.2px; color: #0f1720; }
.mkt-card-sub { font-size: 12px; color: #8a97a6; margin-top: 2px; }
.mkt-select { font-size: 11px; font-weight: 500; color: #6b7a8a; border: 1px solid #e6eaf0; border-radius: 6px; padding: 4px 8px; background: #f8fafc; }
.mkt-link { font-size: 12px; font-weight: 600; color: #2457e6; cursor: pointer; }
.mkt-kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 14px; }
.mkt-kpi-card { background: #fff; border: 1px solid #e6eaf0; border-radius: 12px; padding: 16px 18px; box-shadow: 0 1px 2px rgba(16,24,40,0.03); }
.mkt-kpi-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.mkt-kpi-label { font-size: 11.5px; font-weight: 500; color: #6b7a8a; margin-bottom: 4px; }
.mkt-kpi-value { font-size: 22px; font-weight: 700; color: #0f1720; letter-spacing: -0.4px; font-variant-numeric: tabular-nums; }
.mkt-kpi-change { font-size: 11px; font-weight: 600; color: #e04545; margin-top: 4px; }
.mkt-kpi-change.up { color: #0b7a4b; }
.mkt-kpi-change span { color: #98a4b3; font-weight: 400; margin-left: 3px; }
.mkt-kpi-spark { width: 100%; height: 36px; margin-top: 8px; display: block; }
/* Funil */
.mkt-funil-grid { display: flex; flex-direction: column; gap: 10px; }
.mkt-funil-row { display: grid; grid-template-columns: 110px 1fr 58px; align-items: center; gap: 12px; }
.mkt-funil-info { display: flex; flex-direction: column; }
.mkt-funil-name { font-size: 12px; font-weight: 600; color: #33404e; }
.mkt-funil-qtd { font-size: 11px; color: #98a4b3; font-variant-numeric: tabular-nums; }
.mkt-funil-bar-wrap { height: 32px; display: flex; align-items: center; gap: 8px; }
.mkt-funil-bar { height: 100%; border-radius: 6px; flex: none; transition: width 0.6s ease; }
.mkt-funil-conv { color: #33404e; font-size: 11.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.mkt-funil-badge { display: inline-flex; justify-content: center; padding: 2px 0; border-radius: 999px; background: #e7f6ef; color: #0b7a4b; font-size: 10.5px; font-weight: 700; }
.mkt-funil-footer { margin-top: 16px; padding-top: 14px; border-top: 1px solid #eef1f5; display: flex; justify-content: space-between; font-size: 12px; color: #6b7a8a; }
.mkt-funil-footer-val { font-weight: 700; color: #0f1720; font-variant-numeric: tabular-nums; }
/* Chart */
.mkt-chart-area { margin-top: 12px; }
.mkt-chart-svg { width: 100%; height: 180px; display: block; }
.mkt-chart-labels { display: flex; justify-content: space-between; margin-top: 6px; font-size: 10.5px; color: #98a4b3; }
.mkt-chart-legend { display: flex; gap: 14px; align-items: center; }
.mkt-legend-item { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: #33404e; font-weight: 500; }
.mkt-legend-line { width: 14px; height: 3px; border-radius: 2px; }
.mkt-legend-dash { width: 14px; height: 0; border-top: 2px dashed #94a3b8; }
/* Donut */
.mkt-donut-wrap { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.mkt-donut-container { position: relative; width: 160px; height: 160px; flex: none; }
.mkt-donut-svg { width: 100%; height: 100%; display: block; }
.mkt-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.mkt-donut-val { font-size: 18px; font-weight: 700; letter-spacing: -0.4px; font-variant-numeric: tabular-nums; color: #0f1720; }
.mkt-donut-label { font-size: 11px; color: #8a97a6; }
.mkt-donut-legend { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.mkt-legend-row { display: flex; align-items: center; gap: 8px; }
.mkt-legend-dot { width: 8px; height: 8px; border-radius: 2px; flex: none; }
.mkt-legend-name { font-size: 12.5px; color: #33404e; flex: 1; }
.mkt-legend-val { font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; color: #0f1720; }
.mkt-legend-pct { font-size: 11.5px; color: #8a97a6; width: 42px; text-align: right; font-variant-numeric: tabular-nums; }
/* Table */
.mkt-table-scroll { overflow-x: auto; }
.mkt-table-head { display: grid; grid-template-columns: 2.3fr 1.1fr 1fr 0.7fr 1fr 30px; gap: 10px; padding: 0 10px 9px; border-bottom: 1px solid #eef1f5; font-size: 10.5px; font-weight: 700; color: #8a97a6; text-transform: uppercase; letter-spacing: 0.4px; min-width: 560px; }
.mkt-table-row { display: grid; grid-template-columns: 2.3fr 1.1fr 1fr 0.7fr 1fr 30px; gap: 10px; align-items: center; padding: 11px 10px; border-bottom: 1px solid #f4f6f9; min-width: 560px; cursor: pointer; border-radius: 8px; }
.mkt-table-row:hover { background: #f7f9fc; }
.mkt-camp-name { display: flex; align-items: center; gap: 10px; }
.mkt-camp-badge { width: 26px; height: 26px; border-radius: 7px; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex: none; }
.mkt-camp-title { font-size: 12.5px; font-weight: 600; color: #22303d; }
.mkt-camp-sub { font-size: 11px; color: #98a4b3; }
.mkt-cell-mono { font-size: 12.5px; color: #33404e; font-variant-numeric: tabular-nums; }
.mkt-cell-roi { font-size: 12.5px; font-weight: 700; color: #0b7a4b; font-variant-numeric: tabular-nums; }
.mkt-status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.mkt-status-dot { width: 5px; height: 5px; border-radius: 50%; }
.mkt-cell-menu { color: #b0bac6; font-weight: 700; text-align: center; }
/* Midia */
.mkt-midia-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)); gap: 12px; margin-bottom: 16px; }
.mkt-midia-kpi { padding: 12px 14px; background: #f8fafc; border: 1px solid #eef1f5; border-radius: 10px; }
.mkt-midia-kpi-label { font-size: 10.5px; font-weight: 700; color: #8a97a6; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 5px; }
.mkt-midia-kpi-val { font-size: 17px; font-weight: 700; color: #0f1720; letter-spacing: -0.3px; font-variant-numeric: tabular-nums; }
.mkt-midia-kpi-val.green { color: #0b7a4b; }
.mkt-midia-kpi-change { font-size: 11px; font-weight: 600; color: #e04545; margin-top: 3px; }
.mkt-midia-kpi-change.up { color: #0b7a4b; }
.mkt-midia-chart { width: 100%; height: 90px; display: block; }
/* Metas */
.mkt-metas { display: flex; flex-direction: column; gap: 17px; }
.mkt-meta-item {}
.mkt-meta-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 7px; }
.mkt-meta-label { font-size: 12.5px; font-weight: 600; color: #33404e; display: inline-flex; align-items: center; gap: 7px; }
.mkt-meta-badge { padding: 1px 7px; border-radius: 999px; background: #e7f6ef; color: #0b7a4b; font-size: 10px; font-weight: 700; }
.mkt-meta-val { font-size: 12.5px; font-weight: 700; font-variant-numeric: tabular-nums; color: #0f1720; }
.mkt-meta-bar-wrap { height: 6px; border-radius: 999px; background: #eef1f5; overflow: hidden; }
.mkt-meta-bar { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
.mkt-meta-bottom { display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px; color: #98a4b3; }
.mkt-empty-icon { width: 44px; height: 44px; border-radius: 12px; background: #eef3fd; color: #2457e6; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
@media (max-width: 768px) { .mkt-page { padding: 14px 12px; } .mkt-kpi-row { grid-template-columns: 1fr 1fr; } }
</style>
