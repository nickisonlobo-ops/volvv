<template>
  <!-- ═══ FUNCIONALIDADES (bento) ═══ -->
  <section id="funcionalidades" ref="root" class="lfb py-24 sm:py-32 relative overflow-visible">
    <div class="lfb-glow"></div>
    <div class="max-w-[1180px] mx-auto px-6 sm:px-8 relative z-[2]">

      <div class="text-center mb-[52px]">
        <div class="font-['Sora'] text-[12.5px] font-bold text-orange-500 uppercase tracking-widest mb-3.5">Funcionalidades</div>
        <h2 class="font-['Sora'] font-extrabold text-3xl sm:text-[44px] leading-[1.1] tracking-tight max-w-[620px] mx-auto mb-4">Tudo para o seu dia a dia</h2>
        <p class="text-[17px] text-zinc-400 max-w-[520px] mx-auto leading-relaxed">{{ intro }}</p>
      </div>

      <div class="grid">

        <!-- FEATURED: Kanban (span 2) -->
        <div class="card span2 glow-border" style="display:flex;flex-direction:column">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div class="ico" style="background:rgba(249,115,22,.13);border:1px solid rgba(249,115,22,.22)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4" width="4.5" height="16" rx="1.5" stroke="#fc6404" stroke-width="1.8"/><rect x="9.75" y="4" width="4.5" height="11" rx="1.5" stroke="#fc6404" stroke-width="1.8"/><rect x="16" y="4" width="4.5" height="14" rx="1.5" stroke="#fc6404" stroke-width="1.8"/></svg>
              </div>
              <h3 class="ttl">Kanban de produção</h3>
              <p class="desc" style="max-width:340px">Acompanhe cada pedido por etapas visuais — arte, aprovação, produção, acabamento e entrega — e nunca perca um prazo.</p>
            </div>
            <span style="font-size:11px;font-weight:700;color:#fc6404;background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.2);padding:5px 11px;border-radius:100px;white-space:nowrap">12 O.S. ativas</span>
          </div>
          <div class="plx" data-depth="14" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:22px">
            <div>
              <div class="klabel">Arte</div>
              <div class="kcard" style="border-left:3px solid #fc6404;margin-bottom:8px"><div style="font-size:11px;font-weight:600">Banner 3×1m</div><div style="font-size:9px;color:#71717a;margin-top:3px">Studio Vibe</div></div>
              <div class="kcard" style="border-left:3px solid #fc6404"><div style="font-size:11px;font-weight:600">Fachada ACM</div><div style="font-size:9px;color:#71717a;margin-top:3px">Padaria Sol</div></div>
            </div>
            <div>
              <div class="klabel">Impressão</div>
              <div class="kcard" style="border-left:3px solid #3b82f6;margin-bottom:8px"><div style="font-size:11px;font-weight:600">Adesivo ×50</div><div style="font-size:9px;color:#71717a;margin-top:3px">Bar do Zé</div></div>
              <div class="kcard" style="border-left:3px solid #3b82f6"><div style="font-size:11px;font-weight:600">Cartões ×1000</div><div style="font-size:9px;color:#71717a;margin-top:3px">Adv. Lima</div></div>
            </div>
            <div>
              <div class="klabel">Acabamento</div>
              <div class="kcard" style="border-left:3px solid #22c55e"><div style="font-size:11px;font-weight:600">Placa PS ×3</div><div style="font-size:9px;color:#22c55e;margin-top:3px">✓ Pronto</div></div>
            </div>
          </div>
        </div>

        <!-- FEATURED: Dashboard financeiro -->
        <div class="card glow-border" style="display:flex;flex-direction:column">
          <div class="ico" style="background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.22)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 17L9 11L13 14L20 6" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 6H20V11" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3 class="ttl">Dashboard financeiro</h3>
          <p class="desc">Receita, despesas, lucro e fluxo de caixa — tudo visual em tempo real.</p>
          <div class="mini plx" data-depth="12" style="margin-top:auto;padding:14px">
            <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:12px"><span ref="finNum" style="font:800 22px 'Sora'">{{ money('84,2k') }}</span><span style="font-size:11px;font-weight:700;color:#22c55e">▲ 18%</span></div>
            <div ref="finBars" style="display:flex;align-items:flex-end;gap:5px;height:48px">
              <div class="bar" style="flex:1;height:38%;background:#3f3f46"></div><div class="bar" style="flex:1;height:54%;background:#3f3f46"></div><div class="bar" style="flex:1;height:46%;background:#52525b"></div><div class="bar" style="flex:1;height:66%;background:#52525b"></div><div class="bar" style="flex:1;height:58%;background:#71717a"></div><div class="bar" style="flex:1;height:80%;background:#a1a1aa"></div><div class="bar" style="flex:1;height:100%;background:linear-gradient(180deg,#4ade80,#22c55e)"></div>
            </div>
          </div>
        </div>

        <!-- Orçamentos -->
        <div class="card">
          <div class="ico" style="background:rgba(249,115,22,.12);border:1px solid rgba(249,115,22,.2)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#fc6404" stroke-width="1.8"/><line x1="8.5" y1="8" x2="15.5" y2="8" stroke="#fc6404" stroke-width="1.8" stroke-linecap="round"/><line x1="8.5" y1="12" x2="15.5" y2="12" stroke="#fc6404" stroke-width="1.8" stroke-linecap="round"/><line x1="8.5" y1="16" x2="12.5" y2="16" stroke="#fc6404" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <h3 class="ttl">Orçamentos inteligentes</h3>
          <p class="desc">Crie orçamentos profissionais em segundos com cálculo automático de materiais e margem.</p>
          <div class="det"><span class="mono" style="color:#e4e4e7">12 m² × {{ money('89') }}</span><span style="margin-left:auto;color:#fc6404;font-weight:700">{{ money('1.068') }}</span></div>
        </div>

        <!-- Ordens de serviço -->
        <div class="card">
          <div class="ico" style="background:rgba(20,184,166,.12);border:1px solid rgba(20,184,166,.22)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="6" width="16" height="14" rx="2" stroke="#2dd4bf" stroke-width="1.8"/><rect x="9" y="3" width="6" height="5" rx="1.5" stroke="#2dd4bf" stroke-width="1.8"/><line x1="8" y1="12" x2="16" y2="12" stroke="#2dd4bf" stroke-width="1.8" stroke-linecap="round"/><line x1="8" y1="16" x2="13" y2="16" stroke="#2dd4bf" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <h3 class="ttl">Ordens de serviço</h3>
          <p class="desc">Gere O.S. com arte, materiais, prazo e valor. Envie por WhatsApp ao cliente.</p>
          <div class="det"><span style="width:7px;height:7px;border-radius:50%;background:#2dd4bf"></span>OS #1042 · <span style="color:#e4e4e7">Em produção</span><span class="mono" style="margin-left:auto;color:#71717a">2/5</span></div>
        </div>

        <!-- Gestão de clientes -->
        <div class="card">
          <div class="ico" style="background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.22)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#60a5fa" stroke-width="1.8"/><path d="M5 20C5 16.686 8.134 14 12 14C15.866 14 19 16.686 19 20" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <h3 class="ttl">Gestão de clientes</h3>
          <p class="desc">Ficha completa com histórico de pedidos, valor gasto e contato via WhatsApp.</p>
          <div class="det"><span style="color:#e4e4e7;font-weight:700">128</span> clientes<span style="margin-left:auto;color:#22c55e">{{ money('340k') }}</span><span style="color:#71717a">em pedidos</span></div>
        </div>

        <!-- Catálogo de materiais -->
        <div class="card">
          <div class="ico" style="background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.22)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 8L12 4L20 8L12 12L4 8Z" stroke="#f59e0b" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 12L12 16L20 12" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16L12 20L20 16" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3 class="ttl">Catálogo de materiais</h3>
          <p class="desc">Lonas, vinis, ACM e insumos com preço por m², estoque e alertas de reposição.</p>
          <div class="det" style="flex-direction:column;align-items:stretch;gap:7px"><div style="display:flex"><span>Lona 440g</span><span class="mono" style="margin-left:auto;color:#e4e4e7">{{ money('32') }}/m²</span></div><div style="height:5px;border-radius:3px;background:#232326;overflow:hidden"><div style="width:34%;height:100%;background:#f59e0b"></div></div></div>
        </div>

        <!-- Contas a pagar/receber -->
        <div class="card">
          <div class="ico" style="background:rgba(244,63,94,.12);border:1px solid rgba(244,63,94,.22)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="6" width="17" height="12" rx="2" stroke="#fb7185" stroke-width="1.8"/><line x1="3.5" y1="10" x2="20.5" y2="10" stroke="#fb7185" stroke-width="1.8"/><line x1="7" y1="14.5" x2="11" y2="14.5" stroke="#fb7185" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <h3 class="ttl">Contas a pagar/receber</h3>
          <p class="desc">Vencimentos, categorias, inadimplência e status de pagamento em um só lugar.</p>
          <div class="det"><span style="color:#22c55e;font-weight:700">▲ {{ money('12,4k') }}</span><span style="color:#71717a">a receber</span><span style="margin-left:auto;color:#fb7185;font-weight:700">▼ {{ money('4,1k') }}</span></div>
        </div>

        <!-- Equipe e comissões -->
        <div class="card">
          <div class="ico" style="background:rgba(168,85,247,.12);border:1px solid rgba(168,85,247,.22)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="9" r="3" stroke="#c084fc" stroke-width="1.8"/><circle cx="16" cy="9" r="3" stroke="#c084fc" stroke-width="1.8"/><path d="M3 19C3 16.24 5.24 14 8 14C9.64 14 11.09 14.79 12 16" stroke="#c084fc" stroke-width="1.8" stroke-linecap="round"/><path d="M12 16C12.91 14.79 14.36 14 16 14C18.76 14 21 16.24 21 19" stroke="#c084fc" stroke-width="1.8" stroke-linecap="round"/></svg>
          </div>
          <h3 class="ttl">{{ isPT ? 'Equipa e comissões' : 'Equipe e comissões' }}</h3>
          <p class="desc">{{ isPT ? 'Faça a gestão de profissionais, calcule comissões e acompanhe a produtividade.' : 'Gerencie profissionais, calcule comissões e acompanhe produtividade.' }}</p>
          <div class="det" style="flex-direction:column;align-items:stretch;gap:7px"><div style="display:flex"><span>Meta do mês</span><span class="mono" style="margin-left:auto;color:#c084fc;font-weight:700">82%</span></div><div style="height:5px;border-radius:3px;background:#232326;overflow:hidden"><div style="width:82%;height:100%;background:#c084fc"></div></div></div>
        </div>

        <!-- FEATURED WIDE: Consultor IA -->
        <div class="card full glow-border glow-violet" style="background:linear-gradient(120deg,#17121f,#141416 60%);border-color:rgba(168,85,247,.28);display:flex;gap:32px;flex-wrap:wrap;align-items:center;justify-content:space-between">
          <div style="position:absolute;top:-60px;right:120px;width:320px;height:220px;background:radial-gradient(ellipse,rgba(168,85,247,.22),transparent 65%);filter:blur(30px);pointer-events:none"></div>
          <div style="position:relative;max-width:460px">
            <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:16px">
              <div class="ico" style="margin:0;background:rgba(168,85,247,.15);border:1px solid rgba(168,85,247,.3)">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 3H15" stroke="#c084fc" stroke-width="1.8" stroke-linecap="round"/><path d="M10 3V9L5.5 17C4.8 18.3 5.7 20 7.2 20H16.8C18.3 20 19.2 18.3 18.5 17L14 9V3" stroke="#c084fc" stroke-width="1.8" stroke-linejoin="round"/><path d="M7.5 14H16.5" stroke="#c084fc" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <span style="font-size:11px;font-weight:700;color:#c084fc;background:rgba(168,85,247,.14);border:1px solid rgba(168,85,247,.28);padding:5px 11px;border-radius:100px;letter-spacing:.03em">NOVO · IA</span>
            </div>
            <h3 class="ttl" style="font-size:24px;margin-bottom:10px">Consultor IA</h3>
            <p class="desc" style="font-size:15px">Uma inteligência que analisa seus dados e gera diagnósticos, oportunidades e planos de ação — como ter um consultor de gestão dentro da sua gráfica, 24h por dia.</p>
          </div>
          <div style="position:relative;flex:1;min-width:300px;max-width:440px;background:#0f0d12;border:1px solid rgba(168,85,247,.2);border-radius:14px;padding:18px" class="plx" data-depth="18">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
              <div style="width:24px;height:24px;border-radius:7px;background:linear-gradient(135deg,#c084fc,#a855f7);display:flex;align-items:center;justify-content:center;font:800 11px 'Sora';color:#0a0a0b">IA</div>
              <span style="font:700 12px 'Sora'">Diagnóstico da semana</span>
            </div>
            <div style="display:flex;gap:10px;padding:12px;background:#161219;border:1px solid rgba(168,85,247,.14);border-radius:10px;margin-bottom:10px">
              <div style="width:6px;border-radius:3px;background:#22c55e;flex-shrink:0"></div>
              <div><div style="font-size:12.5px;font-weight:600;margin-bottom:3px">Margem baixa em placas ACM</div><div style="font-size:11px;color:#a1a1aa;line-height:1.5">Custo do insumo subiu 12%. Sugiro reajustar o m² em 8% para manter a margem alvo.</div></div>
            </div>
            <div style="display:flex;gap:10px;padding:12px;background:#161219;border:1px solid rgba(168,85,247,.14);border-radius:10px">
              <div style="width:6px;border-radius:3px;background:#fc6404;flex-shrink:0"></div>
              <div><div style="font-size:12.5px;font-weight:600;margin-bottom:3px">Oportunidade com Studio Vibe</div><div style="font-size:11px;color:#a1a1aa;line-height:1.5">Cliente recorrente há 40 dias sem novo pedido. Bom momento para um follow-up.</div></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{ locale?: 'pt-BR' | 'pt-PT' }>(), { locale: 'pt-BR' })
const isPT = computed(() => props.locale === 'pt-PT')

function money(v: string) { return isPT.value ? `€${v}` : `R$ ${v}` }

const intro = computed(() => isPT.value
  ? 'Do orçamento à entrega, do financeiro à equipa. Uma plataforma que compreende o ritmo da sua produção.'
  : 'Do orçamento à entrega, do financeiro à equipe. Uma plataforma que entende o ritmo da sua produção.')

const root = ref<HTMLElement | null>(null)
const finBars = ref<HTMLElement | null>(null)
const finNum = ref<HTMLElement | null>(null)

let cleanup: Array<() => void> = []

onMounted(() => {
  const el = root.value
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches
  const cards = Array.from(el.querySelectorAll<HTMLElement>('.card'))
  const layers = Array.from(el.querySelectorAll<HTMLElement>('.plx'))

  // cursor spotlight
  cards.forEach((c) => {
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect()
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px')
      c.style.setProperty('--my', (e.clientY - r.top) + 'px')
    }
    c.addEventListener('pointermove', onMove)
    cleanup.push(() => c.removeEventListener('pointermove', onMove))
  })

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
  const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

  // Entrada lateral: cada card desliza da lateral mais próxima de onde ele já
  // está na grade (esquerda ou direita), quando ELE MESMO (não a seção
  // inteira) se aproxima da tela ao rolar — mesma ideia da entrada do
  // laptop/celular em "Simples e em qualquer lugar". Distância calculada por
  // card (não fixa): o suficiente pra cruzar a borda da viewport do lado
  // dele + uma folga, ou seja, começa de verdade fora da tela.
  // Não dá pra usar IntersectionObserver observando os PRÓPRIOS cards aqui:
  // como eles já nascem com esse deslocamento enorme aplicado, o retângulo
  // real deles (pós-transform) nunca entra na viewport, então "entrou na
  // tela" nunca dispara — trava (precisa aparecer pra disparar a animação,
  // só aparece depois que ela dispara). E disparar tudo de uma vez ao ver só
  // o TOPO da seção (o que tentamos antes) faz as linhas de baixo chegarem
  // sozinhas antes de você rolar até elas, parecendo que o efeito não roda.
  // Por isso reaproveitamos a checagem de posição VERTICAL que o próprio
  // update() já faz a cada scroll (r.top/r.bottom não são afetados pelo
  // translateX do --ex, só a coordenada X seria) pra disparar cada card na
  // hora certa, individualmente.
  const EDGE_MARGIN = 80
  const cardOffset = (c: HTMLElement) => {
    const r = c.getBoundingClientRect()
    const vw = window.innerWidth
    const fromLeft = (r.left + r.width / 2) < vw / 2
    return fromLeft ? -(r.right + EDGE_MARGIN) : (vw - r.left + EDGE_MARGIN)
  }
  const entered = new WeakSet<HTMLElement>()
  function enterCard(c: HTMLElement) {
    if (entered.has(c)) return
    entered.add(c)
    const from = cardOffset(c)
    let t0: number | null = null
    const dur = 850
    function tick(ts: number) {
      if (t0 === null) t0 = ts
      const p = Math.min((ts - t0) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      c.style.setProperty('--ex', (from * (1 - e)).toFixed(1) + 'px')
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  let ticking = false
  function update() {
    ticking = false
    const vh = window.innerHeight
    const vc = vh / 2
    cards.forEach((c) => {
      const r = c.getBoundingClientRect()
      const cc = r.top + r.height / 2
      const prox = clamp(1 - Math.abs(cc - vc) / (vh * 0.62), 0, 1)
      const e = easeOut(prox)
      const s = 0.7 + 0.3 * e
      const ty = (1 - e) * 12
      c.style.setProperty('--s', s.toFixed(4))
      c.style.setProperty('--ty', ty.toFixed(2) + 'px')
      c.style.opacity = clamp(0.4 + 0.9 * e, 0.4, 1).toFixed(3)
      c.style.zIndex = String(10 + Math.round(prox * 12))
      // Assim que o card chega perto o bastante da viewport verticalmente
      // (mesmo limiar do fade/scale acima), dispara a entrada lateral dele.
      if (prox > 0) enterCard(c)
    })
    layers.forEach((l) => {
      const r = l.getBoundingClientRect()
      const depth = parseFloat(l.getAttribute('data-depth') || '10') || 10
      const rel = (r.top + r.height / 2 - vc) / vh
      const pz = clamp(1 - Math.abs(rel) / 0.62, 0, 1)
      l.style.transform = 'translateY(' + (rel * depth * -1).toFixed(2) + 'px) scale(' + (1 + pz * 0.06).toFixed(3) + ')'
    })
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update) } }

  if (reduce) {
    cards.forEach((c) => { c.style.setProperty('--s', '1'); c.style.setProperty('--ty', '0px'); c.style.opacity = '1' })
  } else {
    cards.forEach((c) => c.style.setProperty('--ex', cardOffset(c).toFixed(0) + 'px'))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    cleanup.push(() => window.removeEventListener('scroll', onScroll))
    cleanup.push(() => window.removeEventListener('resize', onScroll))
    update()
  }

  // financeiro: bars grow + count up
  const bars = finBars.value
  const num = finNum.value
  let done = false
  if (bars) {
    Array.from(bars.children).forEach((b, i) => { (b as HTMLElement).style.transitionDelay = (i * 60) + 'ms' })
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !done) {
          done = true
          bars.classList.add('bars-in')
          const prefix = isPT.value ? '€' : 'R$ '
          let start: number | null = null
          const dur = 1200, target = 84.2
          function tick(ts: number) {
            if (start === null) start = ts
            const p = Math.min((ts - start) / dur, 1)
            const e = 1 - Math.pow(1 - p, 3)
            const v = (target * e).toFixed(1).replace('.', ',')
            if (num) num.textContent = prefix + v + 'k'
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.disconnect()
        }
      })
    }, { threshold: 0.4 })
    io.observe(bars)
    cleanup.push(() => io.disconnect())
  }
})

onUnmounted(() => { cleanup.forEach((fn) => fn()); cleanup = [] })
</script>

<style scoped>
.lfb-glow {
  position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
  width: 700px; max-width: 100%; height: 300px;
  background: radial-gradient(ellipse, rgba(249,115,22,.10), transparent 65%);
  filter: blur(40px); pointer-events: none;
}
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.span2 { grid-column: span 2; }
.full { grid-column: 1 / -1; }
.card {
  background: #141416; border: 1px solid rgba(255,255,255,.07); border-radius: 18px; padding: 24px;
  transition: border-color .25s ease, background .25s ease, box-shadow .25s ease;
  position: relative; overflow: hidden;
  transform: translateY(calc(var(--ty,0px) + var(--hy,0px))) translateX(var(--ex,0px)) scale(var(--s,1)); will-change: transform;
}
.card:hover { --hy: -6px; border-color: rgba(249,115,22,.35); background: #17171a; box-shadow: 0 30px 60px rgba(0,0,0,.45); }
.card > * { position: relative; z-index: 1; }
.card::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(249,115,22,.16), transparent 62%);
  opacity: 0; transition: opacity .35s ease; pointer-events: none; z-index: 0;
}
.card:hover::before { opacity: 1; }
.card.full::before { background: radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(168,85,247,.20), transparent 62%); }
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes lfb-rot { to { --a: 360deg; } }
.glow-border::after {
  content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px;
  background: conic-gradient(from var(--a,0deg), transparent 0 68%, rgba(249,115,22,.9) 82%, rgba(251,146,60,.4) 90%, transparent 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .4s ease; pointer-events: none; z-index: 2;
}
.glow-border:hover::after { opacity: 1; animation: lfb-rot 3.2s linear infinite; }
.glow-violet::after { background: conic-gradient(from var(--a,0deg), transparent 0 66%, rgba(192,132,252,.95) 82%, rgba(168,85,247,.4) 90%, transparent 100%); opacity: .55; animation: lfb-rot 6s linear infinite; }
.glow-violet:hover::after { opacity: 1; animation: lfb-rot 3.2s linear infinite; }
.plx { transition: transform .05s linear; will-change: transform; }
.bar { border-radius: 3px; transform-origin: bottom; transform: scaleY(0); transition: transform .9s cubic-bezier(.2,.8,.2,1); }
.bars-in .bar { transform: scaleY(1); }
@media (prefers-reduced-motion: reduce) { .bar { transform: none; } }
.ico { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.ttl { font: 700 18px 'Sora'; margin: 0 0 8px; }
.desc { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0; }
.mini { background: #0f0f11; border: 1px solid rgba(255,255,255,.05); border-radius: 10px; }
.kcard { background: #1a1a1d; border: 1px solid rgba(255,255,255,.06); border-radius: 7px; padding: 8px; }
.klabel { font-size: 9px; font-weight: 700; color: #71717a; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 7px; }
.det { margin-top: 16px; padding: 11px 13px; background: #0f0f11; border: 1px solid rgba(255,255,255,.05); border-radius: 10px; font-size: 11.5px; color: #a1a1aa; display: flex; align-items: center; gap: 8px; }
.mono { font-family: ui-monospace, Menlo, monospace; }
@media (max-width: 820px) { .grid { grid-template-columns: 1fr 1fr; } .span2 { grid-column: span 2; } .full { grid-column: 1/-1; } }
@media (max-width: 560px) { .grid { grid-template-columns: 1fr; } .span2, .full { grid-column: auto; } }
</style>
