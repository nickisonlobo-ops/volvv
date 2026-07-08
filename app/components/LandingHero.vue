<template>
  <!-- ═══ HERO ═══ -->
  <section ref="root" class="hero relative overflow-hidden pb-0">
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="hero-glow-orange" aria-hidden="true"></div>
    <div class="hero-glow-violet" aria-hidden="true"></div>

    <!-- Text content -->
    <div class="relative z-10 text-center pt-28 sm:pt-32 px-6">
      <!-- Badge -->
      <div class="reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/[0.09] mb-7" style="--d:0ms">
        <span class="relative flex h-[7px] w-[7px]">
          <span class="ping-dot absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-[7px] w-[7px] bg-emerald-500 shadow-[0_0_10px_#22c55e]"></span>
        </span>
        <span class="text-xs font-semibold text-zinc-300">{{ badgeText }}</span>
      </div>

      <!-- Headline -->
      <h1 class="font-['Sora'] font-extrabold tracking-tight leading-[1.02] mb-5 mx-auto max-w-[900px]">
        <span class="reveal block text-[clamp(2.2rem,6.5vw,4.5rem)] text-stone-50" style="--d:90ms">Gerencie sua produção</span>
        <span class="reveal hero-shimmer block text-[clamp(2.2rem,6.5vw,4.5rem)]" style="--d:180ms">do orçamento à entrega</span>
      </h1>

      <!-- Sub -->
      <p class="reveal text-base sm:text-lg leading-relaxed text-zinc-400 max-w-[580px] mx-auto mb-8" style="--d:270ms">
        Orçamentos, ordens de serviço, kanban de produção, financeiro e CRM.
        Tudo {{ isPT ? 'num' : 'em um' }} só lugar para gráficas e empresas de comunicação visual.
      </p>

      <!-- CTAs -->
      <div class="reveal flex flex-wrap gap-3.5 justify-center mb-4" style="--d:360ms">
        <a ref="ctaPrimary" href="/login"
          class="hero-cta-shine hero-magnetic inline-flex items-center gap-2.5 px-7 py-4 rounded-xl font-bold text-[15px] text-[#0a0a0b] bg-gradient-to-br from-orange-400 to-orange-600 shadow-[0_10px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_16px_46px_rgba(249,115,22,0.6)] transition-shadow duration-200">
          Começar grátis — 7 dias <span class="text-[17px]">→</span>
        </a>
        <a href="#funcionalidades"
          class="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-[15px] text-stone-50 bg-white/[0.04] border border-white/[0.12] hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200">
          ▶ Ver como funciona
        </a>
      </div>

      <!-- Social proof line -->
      <p class="reveal text-[13px] font-medium text-zinc-500" style="--d:450ms">Sem cartão de crédito · +200 empresas ativas · <span class="text-amber-400">★</span> 4.9</p>
    </div>

    <!-- Product cluster -->
    <div ref="cluster" class="reveal relative mx-auto mt-11 w-[1080px] max-w-[96%] h-[320px] sm:h-[420px]" style="--d:540ms">
      <div ref="tilt" class="hero-tilt">
        <!-- Main dashboard card -->
        <div class="hero-card hero-glow-card absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[820px] bg-gradient-to-b from-[#161618] to-[#111113] border border-white/10 rounded-t-2xl shadow-[0_-10px_80px_rgba(249,115,22,0.12),0_40px_90px_rgba(0,0,0,0.6)] overflow-hidden">
          <!-- Browser dots -->
          <div class="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
            <div class="w-[11px] h-[11px] rounded-full bg-orange-500"></div>
            <div class="w-[11px] h-[11px] rounded-full bg-zinc-700"></div>
            <div class="w-[11px] h-[11px] rounded-full bg-zinc-700"></div>
            <span class="text-[11px] text-zinc-500 ml-2.5">Produção — SignPRO</span>
          </div>
          <!-- Kanban grid -->
          <div class="p-4 sm:p-5 grid grid-cols-4 gap-3">
            <div class="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider">Aguardando</div>
            <div class="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider">Arte</div>
            <div class="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider">Impressão</div>
            <div class="text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider">Acabamento</div>
            <!-- Cards row 1 -->
            <div class="bg-[#1c1c1f] border border-white/[0.06] border-l-[3px] border-l-zinc-500 rounded-lg p-2.5">
              <p class="text-xs font-semibold text-zinc-200">Fachada ACM</p>
              <p class="text-[10px] text-zinc-500 mt-1">Padaria Sol · {{ money('690') }}</p>
            </div>
            <div class="bg-[#1c1c1f] border border-white/[0.06] border-l-[3px] border-l-orange-500 rounded-lg p-2.5">
              <p class="text-xs font-semibold text-zinc-200">Banner 3×1m</p>
              <p class="text-[10px] text-zinc-500 mt-1">Studio Vibe · {{ money('480') }}</p>
            </div>
            <div class="bg-[#1c1c1f] border border-white/[0.06] border-l-[3px] border-l-blue-500 rounded-lg p-2.5">
              <p class="text-xs font-semibold text-zinc-200">Adesivo vinil ×50</p>
              <p class="text-[10px] text-zinc-500 mt-1">Bar do Zé · {{ money('320') }}</p>
            </div>
            <div class="bg-[#1c1c1f] border border-white/[0.06] border-l-[3px] border-l-emerald-500 rounded-lg p-2.5">
              <p class="text-xs font-semibold text-zinc-200">Placa PS ×3</p>
              <p class="text-[10px] text-emerald-500 mt-1">✓ Pronto p/ entrega</p>
            </div>
            <!-- Cards row 2 -->
            <div class="hidden sm:block bg-[#1c1c1f] border border-white/[0.06] border-l-[3px] border-l-zinc-500 rounded-lg p-2.5">
              <p class="text-xs font-semibold text-zinc-200">Wind banner</p>
              <p class="text-[10px] text-zinc-500 mt-1">Ótica Vista · {{ money('210') }}</p>
            </div>
            <div class="hidden sm:block bg-[#1c1c1f] border border-white/[0.06] border-l-[3px] border-l-orange-500 rounded-lg p-2.5">
              <p class="text-xs font-semibold text-zinc-200">Cartões ×1000</p>
              <p class="text-[10px] text-zinc-500 mt-1">Adv. Lima · {{ money('180') }}</p>
            </div>
          </div>
        </div>

        <!-- Floating orçamento card (left) -->
        <div class="absolute left-0 top-[180px] sm:top-[110px] w-[180px] sm:w-[238px] z-[3] animate-float-left">
          <div class="hero-card hero-glow-card bg-[#18181a]/95 border border-white/[0.12] rounded-[14px] p-3 sm:p-4 shadow-[0_30px_70px_rgba(0,0,0,0.65)]">
            <div class="flex justify-between items-center mb-2 sm:mb-3">
              <span class="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Orçamento #1042</span>
              <span class="text-[8px] sm:text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">Aprovado</span>
            </div>
            <p class="text-[11px] sm:text-xs font-semibold text-zinc-200 mb-2">Studio Vibe</p>
            <div class="flex justify-between text-[9.5px] sm:text-[10.5px] text-zinc-400 mb-1"><span>Banner ×2</span><span>{{ money('480') }}</span></div>
            <div class="flex justify-between text-[9.5px] sm:text-[10.5px] text-zinc-400 mb-2"><span>Adesivo ×50</span><span>{{ money('320') }}</span></div>
            <div class="h-px bg-white/[0.08] mb-2"></div>
            <div class="flex justify-between items-baseline">
              <span class="text-[10px] sm:text-[11px] text-zinc-500">Total</span>
              <span class="font-['Sora'] font-extrabold text-[14px] sm:text-[17px] text-orange-500">{{ money('1.490') }}</span>
            </div>
          </div>
        </div>

        <!-- Floating financeiro card (right) -->
        <div class="absolute right-0 top-[180px] sm:top-[150px] w-[170px] sm:w-[222px] z-[3] animate-float-right">
          <div class="hero-card hero-glow-card-violet bg-[#18181a]/95 border border-white/[0.12] rounded-[14px] p-3 sm:p-4 shadow-[0_30px_70px_rgba(0,0,0,0.65)]">
            <p class="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 sm:mb-2">Faturamento · Jun</p>
            <div class="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span ref="finNum" class="font-['Sora'] font-extrabold text-[18px] sm:text-[23px] text-stone-50">{{ money('0') }}</span>
              <span class="text-[9.5px] sm:text-[10.5px] font-bold text-emerald-500">▲ 18%</span>
            </div>
            <div ref="finBars" class="flex items-end gap-[4px] sm:gap-[5px] h-[40px] sm:h-[50px]">
              <div class="bar flex-1" style="height:40%;background:#3f3f46"></div>
              <div class="bar flex-1" style="height:55%;background:#3f3f46"></div>
              <div class="bar flex-1" style="height:46%;background:#52525b"></div>
              <div class="bar flex-1" style="height:66%;background:#52525b"></div>
              <div class="bar flex-1" style="height:78%;background:#71717a"></div>
              <div class="bar flex-1" style="height:100%;background:linear-gradient(180deg,#fb923c,#fc6404)"></div>
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

const badgeText = computed(() => isPT.value
  ? 'Sistema #1 para comunicação visual em Portugal'
  : 'Sistema #1 para comunicação visual no Brasil')

const root = ref<HTMLElement | null>(null)
const cluster = ref<HTMLElement | null>(null)
const tilt = ref<HTMLElement | null>(null)
const ctaPrimary = ref<HTMLElement | null>(null)
const finBars = ref<HTMLElement | null>(null)
const finNum = ref<HTMLElement | null>(null)

let cleanup: Array<() => void> = []
let raf = 0

function onTiltMove(e: PointerEvent) {
  const c = cluster.value, t = tilt.value
  if (!c || !t) return
  const r = c.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  const rx = (0.5 - py) * 9
  const ry = (px - 0.5) * 9
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    t.style.transform = `perspective(1600px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
  })
}
function onTiltLeave() {
  const t = tilt.value
  if (!t) return
  cancelAnimationFrame(raf)
  t.style.transform = 'perspective(1600px) rotateX(0deg) rotateY(0deg)'
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const canHover = !reduce && !coarse

  // Tilt 3D no cluster inteiro (dashboard + cards flutuantes)
  if (canHover && cluster.value) {
    cluster.value.addEventListener('pointermove', onTiltMove)
    cluster.value.addEventListener('pointerleave', onTiltLeave)
    cleanup.push(() => {
      cluster.value?.removeEventListener('pointermove', onTiltMove)
      cluster.value?.removeEventListener('pointerleave', onTiltLeave)
    })
  }

  // Spotlight do cursor em cada card (mesmo efeito do bento de funcionalidades)
  if (canHover && root.value) {
    root.value.querySelectorAll<HTMLElement>('.hero-card').forEach((card) => {
      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px')
        card.style.setProperty('--my', (e.clientY - r.top) + 'px')
      }
      card.addEventListener('pointermove', onMove)
      cleanup.push(() => card.removeEventListener('pointermove', onMove))
    })
  }

  // Botão magnético — segue o cursor sutilmente dentro da área do CTA
  if (canHover && ctaPrimary.value) {
    const btn = ctaPrimary.value
    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect()
      const mx = (e.clientX - r.left - r.width / 2) * 0.28
      const my = (e.clientY - r.top - r.height / 2) * 0.28
      btn.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px) scale(1.02)`
    }
    const onLeave = () => { btn.style.transform = '' }
    btn.addEventListener('pointermove', onMove)
    btn.addEventListener('pointerleave', onLeave)
    cleanup.push(() => {
      btn.removeEventListener('pointermove', onMove)
      btn.removeEventListener('pointerleave', onLeave)
    })
  }

  // Faturamento: barras crescem + número sobe, logo após a entrada do cluster
  const bars = finBars.value
  const num = finNum.value
  if (bars && num) {
    Array.from(bars.children).forEach((b, i) => { (b as HTMLElement).style.transitionDelay = (i * 60) + 'ms' })
    const start = () => {
      bars.classList.add('bars-in')
      const prefix = isPT.value ? '€' : 'R$ '
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) { num.textContent = prefix + '84,2k'; return }
      let t0: number | null = null
      const dur = 1200, target = 84.2
      function tick(ts: number) {
        if (t0 === null) t0 = ts
        const p = Math.min((ts - t0) / dur, 1)
        const e = 1 - Math.pow(1 - p, 3)
        num!.textContent = prefix + (target * e).toFixed(1).replace('.', ',') + 'k'
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
    const timer = window.setTimeout(start, 750)
    cleanup.push(() => window.clearTimeout(timer))
  }
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  cleanup.forEach((fn) => fn())
  cleanup = []
})
</script>

<style scoped>
.hero-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px);
  background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(ellipse 60% 46% at 50% 18%, black 40%, transparent 78%);
  mask-image: radial-gradient(ellipse 60% 46% at 50% 18%, black 40%, transparent 78%);
}
.hero-glow-orange {
  position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
  width: 900px; max-width: 100%; height: 520px; pointer-events: none;
  background: radial-gradient(ellipse, rgba(249,115,22,0.22), transparent 62%);
  filter: blur(40px); animation: glowpulse 7s ease-in-out infinite;
}
.hero-glow-violet {
  position: absolute; top: 70px; left: 50%; transform: translateX(-50%);
  width: 620px; max-width: 100%; height: 420px; pointer-events: none;
  background: radial-gradient(ellipse, rgba(168,85,247,0.10), transparent 65%);
  filter: blur(50px); animation: glowpulse 9s ease-in-out infinite reverse;
}
@keyframes glowpulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.9; }
}

.reveal { opacity: 0; transform: translateY(18px); animation: heroReveal 0.7s cubic-bezier(.2,.7,.2,1) forwards; animation-delay: var(--d, 0ms); }
@keyframes heroReveal { to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .reveal { animation: none; opacity: 1; transform: none; } }

.ping-dot { animation: heroPing 2.2s cubic-bezier(0,0,0.2,1) infinite; }
@keyframes heroPing { 75%, 100% { transform: scale(2.6); opacity: 0; } }

/* Texto com brilho degrade em movimento */
.hero-shimmer {
  background: linear-gradient(100deg, #fc6404 20%, #fed7aa 40%, #fc6404 60%);
  background-size: 220% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
/* Precisa declarar as duas animações juntas: um único "animation" shorthand
   no elemento vence por completo — se .reveal e .hero-shimmer declarassem
   "animation" cada um no seu próprio seletor, a regra que vier depois no
   CSS apagaria a outra (inclusive o "forwards" que mantém o texto visível). */
.reveal.hero-shimmer {
  animation: heroReveal 0.7s cubic-bezier(.2,.7,.2,1) forwards, heroShimmer 5s ease-in-out infinite;
  animation-delay: var(--d, 0ms), 0s;
}
@keyframes heroShimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
@media (prefers-reduced-motion: reduce) { .reveal.hero-shimmer { animation: none; background-position: 0 0; opacity: 1; transform: none; } }

.hero-tilt { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .25s ease-out; will-change: transform; }

/* Spotlight do cursor (mesmo efeito do LandingFeaturesBento) */
.hero-card { position: relative; }
.hero-card::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(249,115,22,.18), transparent 62%);
  opacity: 0; transition: opacity .35s ease; pointer-events: none; z-index: 0;
}
.hero-card:hover::before { opacity: 1; }
.hero-card > * { position: relative; z-index: 1; }
.hero-glow-card-violet::before { background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(168,85,247,.20), transparent 62%); }

/* Borda com gradiente cônico rotativo (mesmo efeito do LandingFeaturesBento) */
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes heroRot { to { --a: 360deg; } }
.hero-glow-card::after, .hero-glow-card-violet::after {
  content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .4s ease; pointer-events: none; z-index: 2;
}
.hero-glow-card::after {
  background: conic-gradient(from var(--a,0deg), transparent 0 70%, rgba(249,115,22,.9) 84%, rgba(251,146,60,.4) 92%, transparent 100%);
}
.hero-glow-card-violet::after {
  background: conic-gradient(from var(--a,0deg), transparent 0 66%, rgba(192,132,252,.95) 82%, rgba(168,85,247,.4) 90%, transparent 100%);
  opacity: .5; animation: heroRot 6s linear infinite;
}
.hero-glow-card:hover::after, .hero-glow-card-violet:hover::after { opacity: 1; animation: heroRot 3.2s linear infinite; }

/* Barras do card financeiro */
.bar { border-radius: 3px; transform-origin: bottom; transform: scaleY(0); transition: transform .9s cubic-bezier(.2,.8,.2,1); }
.bars-in .bar { transform: scaleY(1); }
@media (prefers-reduced-motion: reduce) { .bar { transform: none; } }

.hero-magnetic { will-change: transform; transition: transform .15s ease-out; }

@keyframes float-left {
  0%, 100% { transform: translateY(0) rotate(-2.5deg); }
  50% { transform: translateY(-11px) rotate(-2.5deg); }
}
@keyframes float-right {
  0%, 100% { transform: translateY(0) rotate(2deg); }
  50% { transform: translateY(-9px) rotate(2deg); }
}
.animate-float-left { animation: float-left 8s ease-in-out infinite; }
.animate-float-right { animation: float-right 9s ease-in-out infinite; }
</style>
