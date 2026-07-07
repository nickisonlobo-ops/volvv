<template>
  <!-- ═══ SEGMENTOS ATENDIDOS ═══ -->
  <section ref="root" class="relative overflow-hidden bg-[#0a0a0b] py-24 sm:py-28">
    <div class="ind-glow" aria-hidden="true"></div>

    <div class="max-w-[1180px] mx-auto px-6 sm:px-8 relative z-[2]">
      <div class="text-center mb-14">
        <div class="ind-rule mx-auto mb-5" aria-hidden="true"></div>
        <h2 class="font-['Sora'] tracking-tight leading-[1.1] mb-4">
          <span class="block text-2xl sm:text-3xl font-light text-white/70">Feito para quem</span>
          <span class="ind-shimmer block text-3xl sm:text-[44px] font-extrabold">trabalha com</span>
        </h2>
        <div class="ind-dot mx-auto mb-5" aria-hidden="true"></div>
        <p class="text-[15px] sm:text-base text-zinc-400 max-w-md mx-auto leading-relaxed">{{ intro }}</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        <div v-for="(cat, i) in categorias" :key="cat.label" class="ind-card devices-tilt" :style="{ backgroundImage: `url(${cat.img})` }" :data-idx="i">
          <div class="ind-overlay" aria-hidden="true"></div>
          <div class="ind-glare" aria-hidden="true"></div>
          <div class="ind-content">
            <div class="ind-ico" v-html="cat.svg"></div>
            <h3 class="ind-title">{{ cat.label }}</h3>
            <a href="#precos" class="ind-arrow" :aria-label="cat.label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 19L19 5M19 5H8M19 5V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
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

const intro = computed(() => isPT.value
  ? 'Soluções profissionais para comunicação visual, sinalética e personalização com qualidade e performance.'
  : 'Soluções profissionais para comunicação visual, sinalização e personalização com qualidade e performance.')

const ICO_PRINT = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3.5" y="10" width="17" height="8" rx="1.8" stroke="currentColor" stroke-width="1.8"/><rect x="7" y="14" width="10" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/></svg>'
const ICO_SIGN = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 20H15M12 16V20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
const ICO_WRAP = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 17C4 13 8 13 8 9C8 6 6 4 6 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="13" cy="15" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M10.5 15L12.2 16.7L15.8 13.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const ICO_POST = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 6H19L17 8.5L19 11H12" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 21H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
const ICO_VAN = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 16V7a1 1 0 011-1h9v10" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 10H18L21 13V16H13V10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7" cy="17.5" r="1.8" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17.5" r="1.8" stroke="currentColor" stroke-width="1.8"/></svg>'

const categorias = computed(() => [
  { label: 'Gráficas', img: '/landing/ind-graficas.jpg', svg: ICO_PRINT },
  { label: 'Comunicação Visual', img: '/landing/ind-comunicacao.jpg', svg: ICO_SIGN },
  { label: isPT.value ? 'Aplicadores de Vinil' : 'Adesivadores', img: '/landing/ind-adesivadores.jpg', svg: ICO_WRAP },
  { label: isPT.value ? 'Sinalética' : 'Sinalização', img: '/landing/ind-sinalizacao.jpg', svg: ICO_POST },
  { label: isPT.value ? 'Frotas e Rotulagem' : 'Frotas e Plotagem', img: '/landing/ind-frotas.jpg', svg: ICO_VAN },
])

const root = ref<HTMLElement | null>(null)
let cleanup: Array<() => void> = []
let raf = 0

onMounted(() => {
  const el = root.value
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const canHover = !reduce && !coarse
  const cards = Array.from(el.querySelectorAll<HTMLElement>('.ind-card'))

  if (canHover) {
    cards.forEach((c) => {
      const onMove = (e: PointerEvent) => {
        const r = c.getBoundingClientRect()
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px')
        c.style.setProperty('--my', (e.clientY - r.top) + 'px')
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        const rx = (0.5 - py) * 10
        const ry = (px - 0.5) * 10
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          // Inclui translateX(var(--ex)) na mesma string — se só setasse o
          // tilt aqui, isso apagaria o deslocamento da entrada lateral (que
          // vive em --ex) caso o hover aconteça durante a animação de
          // entrada, mesma pegadinha de "quem escreve por último apaga o
          // resto" corrigida nos outros componentes.
          c.style.transform = `translateX(var(--ex,0px)) perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.03)`
        })
      }
      const onLeave = () => { c.style.transform = '' }
      c.addEventListener('pointermove', onMove)
      c.addEventListener('pointerleave', onLeave)
      cleanup.push(() => {
        c.removeEventListener('pointermove', onMove)
        c.removeEventListener('pointerleave', onLeave)
      })
    })
  }

  // Entrada lateral: metade esquerda entra da esquerda, metade direita entra
  // da direita, disparando junto quando a SEÇÃO aparece (mesma lógica usada
  // nos aparelhos — observar os próprios cards com esse deslocamento grande
  // aplicado trava o IntersectionObserver, então observamos a seção).
  if (!reduce) {
    const EDGE_MARGIN = 70
    cards.forEach((c) => {
      const idx = parseInt(c.dataset.idx || '0', 10)
      const fromLeft = idx < categorias.value.length / 2
      const r = c.getBoundingClientRect()
      const vw = window.innerWidth
      const off = fromLeft ? -(r.right + EDGE_MARGIN) : (vw - r.left + EDGE_MARGIN)
      c.style.setProperty('--ex', off.toFixed(0) + 'px')
    })

    let entered = false
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entered) return
        entered = true
        io.disconnect()
        cards.forEach((c, i) => {
          const idx = parseInt(c.dataset.idx || '0', 10)
          const fromLeft = idx < categorias.value.length / 2
          const r = c.getBoundingClientRect()
          const vw = window.innerWidth
          const from = fromLeft ? -(r.right + EDGE_MARGIN) : (vw - r.left + EDGE_MARGIN)
          const delay = i * 90
          let t0: number | null = null
          const dur = 800
          function tick(ts: number) {
            if (t0 === null) t0 = ts
            const p = Math.min(Math.max(ts - t0 - delay, 0) / dur, 1)
            const e = 1 - Math.pow(1 - p, 3)
            c.style.setProperty('--ex', (from * (1 - e)).toFixed(1) + 'px')
            if (ts - t0 < delay + dur) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      })
    }, { threshold: 0.15 })
    io.observe(el)
    cleanup.push(() => io.disconnect())
  }
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  cleanup.forEach((fn) => fn())
  cleanup = []
})
</script>

<style scoped>
.ind-glow {
  position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
  width: 640px; max-width: 100%; height: 320px; pointer-events: none;
  background: radial-gradient(ellipse, rgba(249,115,22,.14), transparent 65%);
  filter: blur(46px);
}
.ind-rule { width: 44px; height: 2px; background: linear-gradient(90deg, transparent, #f97316, transparent); }
.ind-dot { width: 5px; height: 5px; border-radius: 50%; background: #f97316; box-shadow: 0 0 12px rgba(249,115,22,.8); }

.ind-shimmer {
  background: linear-gradient(100deg, #fb923c 20%, #fed7aa 45%, #f97316 70%);
  background-size: 220% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: indShimmer 5s ease-in-out infinite;
}
@keyframes indShimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
@media (prefers-reduced-motion: reduce) { .ind-shimmer { animation: none; } }

.ind-card {
  position: relative; overflow: hidden; border-radius: 18px; aspect-ratio: 3/4;
  background-size: cover; background-position: center; border: 1px solid rgba(255,255,255,.08);
  transition: transform .25s ease-out, border-color .3s ease, box-shadow .3s ease;
  transform: translateX(var(--ex, 0px));
  will-change: transform;
}
.ind-card:hover { border-color: rgba(249,115,22,.4); box-shadow: 0 24px 50px rgba(0,0,0,.5); }
.ind-overlay {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(180deg, rgba(10,10,11,.05) 0%, rgba(10,10,11,.35) 55%, rgba(10,10,11,.94) 100%);
}
.ind-glare {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(249,115,22,.20), transparent 62%);
  opacity: 0; transition: opacity .35s ease;
}
.ind-card:hover .ind-glare { opacity: 1; }
.ind-content { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; padding: 18px 12px 20px; text-align: center; }
.ind-ico { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; background: rgba(249,115,22,.16); border: 1px solid rgba(249,115,22,.35); color: #fb923c; margin-bottom: 12px; backdrop-filter: blur(2px); }
.ind-title { font: 700 14px/1.25 'Sora'; color: #fff; margin: 0 0 12px; }
.ind-arrow { width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(249,115,22,.4); color: #fb923c; display: flex; align-items: center; justify-content: center; transition: background .25s ease, color .25s ease, transform .25s ease; }
.ind-card:hover .ind-arrow { background: #f97316; color: #0a0a0b; transform: rotate(45deg); }

/* Borda com gradiente cônico rotativo no hover (mesmo padrão das outras seções) */
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes indRot { to { --a: 360deg; } }
.ind-card::after {
  content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px; z-index: 3;
  background: conic-gradient(from var(--a,0deg), transparent 0 70%, rgba(249,115,22,.9) 84%, rgba(251,146,60,.4) 92%, transparent 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .4s ease; pointer-events: none;
}
.ind-card:hover::after { opacity: 1; animation: indRot 3.2s linear infinite; }

@media (prefers-reduced-motion: reduce) { .ind-card { transform: none !important; } }
</style>
