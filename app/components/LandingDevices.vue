<template>
  <!-- ═══ APARELHOS / DEVICES ═══ -->
  <section ref="root" class="relative overflow-hidden bg-[#0c0c0d] py-20 sm:py-24">
    <div class="absolute top-[120px] left-1/2 -translate-x-1/2 w-[820px] max-w-full h-[460px] pointer-events-none" style="background: radial-gradient(ellipse, rgba(249,115,22,0.18), transparent 62%); filter: blur(44px); animation: glowpulse 7s ease-in-out infinite;"></div>
    <div class="absolute top-[200px] left-[18%] w-[420px] max-w-full h-[360px] pointer-events-none" style="background: radial-gradient(ellipse, rgba(168,85,247,0.10), transparent 65%); filter: blur(50px); animation: glowpulse 10s ease-in-out infinite reverse;"></div>

    <div class="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-[2]">
      <div class="text-center mb-14">
        <p class="font-['Sora'] text-xs font-bold text-orange-500 uppercase tracking-widest mb-3.5">Simples e em qualquer lugar</p>
        <h2 class="font-['Sora'] font-extrabold text-3xl sm:text-[44px] leading-[1.1] tracking-tight max-w-[680px] mx-auto mb-4">{{ headline }}</h2>
        <p class="text-[17px] text-zinc-400 max-w-[540px] mx-auto leading-relaxed">{{ intro }}</p>
      </div>

      <!-- Devices scene: molduras reais via devices.css (MacBook Pro + iPhone 14 Pro),
           reescalada via JS pra caber em qualquer largura de tela. -->
      <div ref="viewport" class="devices-reveal relative mx-auto" :class="{ 'is-in': visible }" :style="{ height: viewportH + 'px' }">
        <div class="devices-scaler" :style="{ width: STAGE_W + 'px', height: STAGE_H + 'px', transform: `scale(${scale})` }">
          <!-- LAPTOP -->
          <div class="device device-macbook-pro device-spacegray devices-tilt device-reveal-fade" :class="{ 'is-in': visible }" data-depth="16" :style="{ left: LAPTOP_LEFT + 'px', top: '0px' }">
            <div class="device-frame">
              <div class="device-screen dev-card">
                <div class="dev-fit-laptop">
                  <div class="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                    <div class="flex items-center gap-2">
                      <div class="w-[22px] h-[22px] rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-['Sora'] font-extrabold text-[10px] text-[#0a0a0b]">SP</div>
                      <span class="font-['Sora'] font-bold text-xs">Painel de produção</span>
                    </div>
                    <div class="flex items-baseline gap-1.5">
                      <span class="text-[10px] text-zinc-500">Faturamento Jun</span>
                      <span ref="numFat" class="font-['Sora'] font-extrabold text-[13px] text-orange-500">{{ money('0') }}</span>
                      <span class="text-[10px] font-bold text-emerald-500">▲18%</span>
                    </div>
                  </div>
                  <div class="p-4 flex flex-col gap-3.5">
                    <div class="grid grid-cols-3 gap-2.5">
                      <div class="flex flex-col gap-2">
                        <p class="text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Arte</p>
                        <div class="bg-[#18181b] border border-white/[0.06] border-l-[3px] border-l-orange-500 rounded-[7px] p-2.5"><p class="text-[11px] font-semibold">Banner 3×1m</p><p class="text-[9px] text-zinc-500 mt-0.5">Studio Vibe</p></div>
                        <div class="bg-[#18181b] border border-white/[0.06] border-l-[3px] border-l-orange-500 rounded-[7px] p-2.5"><p class="text-[11px] font-semibold">Fachada ACM</p><p class="text-[9px] text-zinc-500 mt-0.5">Padaria Sol</p></div>
                      </div>
                      <div class="flex flex-col gap-2">
                        <p class="text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Impressão</p>
                        <div class="bg-[#18181b] border border-white/[0.06] border-l-[3px] border-l-blue-500 rounded-[7px] p-2.5"><p class="text-[11px] font-semibold">Adesivo ×50</p><p class="text-[9px] text-zinc-500 mt-0.5">Bar do Zé</p></div>
                        <div class="bg-[#18181b] border border-white/[0.06] border-l-[3px] border-l-blue-500 rounded-[7px] p-2.5"><p class="text-[11px] font-semibold">Cartões ×1000</p><p class="text-[9px] text-zinc-500 mt-0.5">Adv. Lima</p></div>
                      </div>
                      <div class="flex flex-col gap-2">
                        <p class="text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Acabamento</p>
                        <div class="bg-[#18181b] border border-white/[0.06] border-l-[3px] border-l-emerald-500 rounded-[7px] p-2.5"><p class="text-[11px] font-semibold">Placa PS ×3</p><p class="text-[9px] text-emerald-500 mt-0.5">✓ Pronto</p></div>
                        <div class="bg-[#18181b] border border-white/[0.06] border-l-[3px] border-l-emerald-500 rounded-[7px] p-2.5"><p class="text-[11px] font-semibold">Wind banner</p><p class="text-[9px] text-emerald-500 mt-0.5">✓ Pronto</p></div>
                      </div>
                    </div>
                    <div class="flex gap-2.5">
                      <div class="flex-1 bg-[#18181b] border border-white/[0.06] rounded-lg p-3">
                        <div class="flex justify-between items-center mb-3"><span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Faturamento · 7 dias</span><span class="text-[11px] font-bold text-emerald-500">▲ 18%</span></div>
                        <div ref="bars" class="flex items-end gap-2 h-[92px]">
                          <div class="dev-bar flex-1" style="height:38%;background:#3f3f46"></div>
                          <div class="dev-bar flex-1" style="height:52%;background:#3f3f46"></div>
                          <div class="dev-bar flex-1" style="height:44%;background:#52525b"></div>
                          <div class="dev-bar flex-1" style="height:64%;background:#52525b"></div>
                          <div class="dev-bar flex-1" style="height:56%;background:#71717a"></div>
                          <div class="dev-bar flex-1" style="height:80%;background:#a1a1aa"></div>
                          <div class="dev-bar flex-1" style="height:100%;background:linear-gradient(180deg,#fb923c,#f97316)"></div>
                        </div>
                      </div>
                      <div class="w-[132px] bg-[#18181b] border border-white/[0.06] rounded-lg p-3 flex flex-col items-center justify-center gap-2">
                        <div class="relative w-[84px] h-[84px]">
                          <svg width="84" height="84" viewBox="0 0 84 84" class="dev-donut-svg">
                            <circle cx="42" cy="42" r="34" fill="none" stroke="#232326" stroke-width="8" />
                            <circle ref="donutLaptop" cx="42" cy="42" r="34" fill="none" stroke="#f97316" stroke-width="8" stroke-linecap="round" stroke-dasharray="213.6" stroke-dashoffset="213.6" />
                          </svg>
                          <div class="absolute inset-0 flex items-center justify-center">
                            <span ref="numMeta" class="font-['Sora'] font-extrabold text-[16px]">0%</span>
                          </div>
                        </div>
                        <p class="text-[9px] text-zinc-500 uppercase tracking-wider font-bold text-center">Meta do mês</p>
                      </div>
                      <div class="w-[148px] flex flex-col gap-2.5">
                        <div class="flex-1 bg-[#18181b] border border-white/[0.06] rounded-lg p-2.5 flex flex-col justify-center"><p class="text-[9.5px] text-zinc-500">A receber</p><p ref="numReceber" class="font-['Sora'] font-extrabold text-[15px]">{{ money('0') }}</p></div>
                        <div class="flex-1 bg-[#18181b] border border-white/[0.06] rounded-lg p-2.5 flex flex-col justify-center"><p class="text-[9.5px] text-zinc-500">O.S. no mês</p><p ref="numOs" class="font-['Sora'] font-extrabold text-[15px]">0</p></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="dev-glare" aria-hidden="true"></div>
              </div>
            </div>
            <div class="device-header"></div>
            <div class="device-power"></div>
          </div>

          <!-- PHONE -->
          <div class="device device-iphone-14-pro device-black devices-tilt devices-phone-scale device-reveal-fade device-reveal-fade-delayed" :class="{ 'is-in': visible }" data-depth="30" :style="{ left: PHONE_LEFT + 'px', top: PHONE_TOP + 'px' }">
            <div class="device-frame">
              <div class="device-screen dev-card dev-card-violet">
                <div class="flex justify-between items-center px-4 pt-4 pb-1.5 text-[13px] text-zinc-400 font-semibold"><span>9:41</span><span>●●● ▂▄▆</span></div>
                <div class="px-4 pt-3 pb-3">
                  <div class="flex justify-between items-center mb-3">
                    <div><p class="text-[11px] text-zinc-500">Hoje</p><p class="font-['Sora'] font-bold text-[18px]">Produção</p></div>
                    <div class="relative w-12 h-12">
                      <svg width="48" height="48" viewBox="0 0 48 48" class="dev-donut-svg">
                        <circle cx="24" cy="24" r="19" fill="none" stroke="#2a2a2e" stroke-width="5" />
                        <circle ref="donutPhone" cx="24" cy="24" r="19" fill="none" stroke="#c084fc" stroke-width="5" stroke-linecap="round" stroke-dasharray="119.4" stroke-dashoffset="119.4" />
                      </svg>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <span ref="numDia" class="font-['Sora'] font-extrabold text-[10px]">0%</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2 mb-3">
                    <div class="flex-1 bg-[#161618] border border-white/[0.06] rounded-[10px] p-2.5"><p class="text-[9px] text-zinc-500">Ativas</p><p ref="numAtivas" class="font-['Sora'] font-extrabold text-[18px] text-orange-500">0</p></div>
                    <div class="flex-1 bg-[#161618] border border-white/[0.06] rounded-[10px] p-2.5"><p class="text-[9px] text-zinc-500">Prontas</p><p ref="numProntas" class="font-['Sora'] font-extrabold text-[18px] text-emerald-500">0</p></div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <div class="bg-[#161618] border border-white/[0.06] border-l-[3px] border-l-orange-500 rounded-[9px] p-2.5 flex justify-between items-center"><div><p class="text-[13px] font-semibold">Banner 3×1m</p><p class="text-[10px] text-zinc-500 mt-0.5">Studio Vibe</p></div><span class="text-[9px] font-bold text-orange-500 bg-orange-500/[0.14] px-1.5 py-0.5 rounded">Arte</span></div>
                    <div class="bg-[#161618] border border-white/[0.06] border-l-[3px] border-l-blue-500 rounded-[9px] p-2.5 flex justify-between items-center"><div><p class="text-[13px] font-semibold">Adesivo ×50</p><p class="text-[10px] text-zinc-500 mt-0.5">Bar do Zé</p></div><span class="text-[9px] font-bold text-blue-500 bg-blue-500/[0.14] px-1.5 py-0.5 rounded">Impr.</span></div>
                    <div class="bg-[#161618] border border-white/[0.06] border-l-[3px] border-l-emerald-500 rounded-[9px] p-2.5 flex justify-between items-center"><div><p class="text-[13px] font-semibold">Placa PS ×3</p><p class="text-[10px] text-zinc-500 mt-0.5">Ótica Vista</p></div><span class="text-[9px] font-bold text-emerald-500 bg-emerald-500/[0.14] px-1.5 py-0.5 rounded">✓</span></div>
                  </div>

                  <!-- Progresso por etapa: 3 anéis, um por coluna do kanban -->
                  <div class="mt-4 bg-[#161618] border border-white/[0.06] rounded-[10px] p-3">
                    <p class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">Progresso por etapa</p>
                    <div class="flex justify-between">
                      <div class="flex flex-col items-center gap-1.5">
                        <div class="relative w-11 h-11">
                          <svg width="44" height="44" viewBox="0 0 44 44" class="dev-donut-svg">
                            <circle cx="22" cy="22" r="17" fill="none" stroke="#232326" stroke-width="4.5" />
                            <circle ref="donutArte" cx="22" cy="22" r="17" fill="none" stroke="#f97316" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="106.8" stroke-dashoffset="106.8" />
                          </svg>
                          <div class="absolute inset-0 flex items-center justify-center"><span ref="numArte" class="font-['Sora'] font-bold text-[9px]">0%</span></div>
                        </div>
                        <p class="text-[8px] text-zinc-500">Arte</p>
                      </div>
                      <div class="flex flex-col items-center gap-1.5">
                        <div class="relative w-11 h-11">
                          <svg width="44" height="44" viewBox="0 0 44 44" class="dev-donut-svg">
                            <circle cx="22" cy="22" r="17" fill="none" stroke="#232326" stroke-width="4.5" />
                            <circle ref="donutImpressao" cx="22" cy="22" r="17" fill="none" stroke="#60a5fa" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="106.8" stroke-dashoffset="106.8" />
                          </svg>
                          <div class="absolute inset-0 flex items-center justify-center"><span ref="numImpressao" class="font-['Sora'] font-bold text-[9px]">0%</span></div>
                        </div>
                        <p class="text-[8px] text-zinc-500">Impressão</p>
                      </div>
                      <div class="flex flex-col items-center gap-1.5">
                        <div class="relative w-11 h-11">
                          <svg width="44" height="44" viewBox="0 0 44 44" class="dev-donut-svg">
                            <circle cx="22" cy="22" r="17" fill="none" stroke="#232326" stroke-width="4.5" />
                            <circle ref="donutAcabamento" cx="22" cy="22" r="17" fill="none" stroke="#34d399" stroke-width="4.5" stroke-linecap="round" stroke-dasharray="106.8" stroke-dashoffset="106.8" />
                          </svg>
                          <div class="absolute inset-0 flex items-center justify-center"><span ref="numAcabamento" class="font-['Sora'] font-bold text-[9px]">0%</span></div>
                        </div>
                        <p class="text-[8px] text-zinc-500">Acabam.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Mini gráfico de barras, mesma ideia do laptop -->
                  <div class="mt-3 bg-[#161618] border border-white/[0.06] rounded-[10px] p-3">
                    <div class="flex justify-between items-center mb-2.5"><span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Atividade · 7 dias</span><span class="text-[9px] font-bold text-emerald-500">▲ 24%</span></div>
                    <div ref="barsPhone" class="flex items-end gap-1.5 h-[48px]">
                      <div class="dev-bar flex-1" style="height:35%;background:#3f3f46"></div>
                      <div class="dev-bar flex-1" style="height:55%;background:#3f3f46"></div>
                      <div class="dev-bar flex-1" style="height:40%;background:#52525b"></div>
                      <div class="dev-bar flex-1" style="height:70%;background:#52525b"></div>
                      <div class="dev-bar flex-1" style="height:50%;background:#71717a"></div>
                      <div class="dev-bar flex-1" style="height:85%;background:#a1a1aa"></div>
                      <div class="dev-bar flex-1" style="height:100%;background:linear-gradient(180deg,#c084fc,#a855f7)"></div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-around py-3 border-t border-white/[0.06]">
                  <div class="w-4 h-1 rounded-sm bg-orange-500"></div>
                  <div class="w-4 h-1 rounded-sm bg-zinc-700"></div>
                  <div class="w-4 h-1 rounded-sm bg-zinc-700"></div>
                  <div class="w-4 h-1 rounded-sm bg-zinc-700"></div>
                </div>
                <div class="dev-glare" aria-hidden="true"></div>
              </div>
            </div>
            <div class="device-stripe"></div>
            <div class="device-header"></div>
            <div class="device-sensors"></div>
            <div class="device-btns"></div>
            <div class="device-power"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import 'devices.css/dist/devices.css'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{ locale?: 'pt-BR' | 'pt-PT' }>(), { locale: 'pt-BR' })
const isPT = computed(() => props.locale === 'pt-PT')

function money(v: string) { return isPT.value ? `€${v}` : `R$ ${v}` }

const headline = computed(() => isPT.value
  ? 'Fácil de usar, no computador e no telemóvel'
  : 'Fácil de usar, no computador e no celular')
const intro = computed(() => isPT.value
  ? 'Uma interface intuitiva que qualquer pessoa da equipa domina em minutos — e acede onde estiver: no desktop do escritório ou no smartphone, no chão de fábrica.'
  : 'Uma interface intuitiva que qualquer pessoa da equipe domina em minutos — e você acessa de onde estiver: no desktop do escritório ou no smartphone, no chão de fábrica.')

// ─── Palco (tamanhos nativos em px das molduras da devices.css) ───
// MacBook Pro: 740×434. iPhone 14 Pro: 428×868 (aplicamos scale menor nele,
// PHONE_SCALE, pra ficar proporcionalmente menor que o laptop, como no design
// original). Posições calculadas pra reproduzir a composição original: laptop
// centralizado no topo, celular sobrepondo a quina inferior-esquerda.
const PHONE_SCALE = 0.62
// Celular claramente separado do laptop (fora da tela, não sobrepondo o
// conteúdo) — celular à esquerda, laptop à direita, com uma folga entre os
// dois em vez da sobreposição de antes. Margens simétricas (25px) recentram
// o conjunto no palco.
const LAPTOP_LEFT = 305
const STAGE_W = 1070
const STAGE_H = 620
const PHONE_LEFT = 25
const PHONE_TOP = STAGE_H - 868 * PHONE_SCALE

const root = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const bars = ref<HTMLElement | null>(null)
const numFat = ref<HTMLElement | null>(null)
const numReceber = ref<HTMLElement | null>(null)
const numOs = ref<HTMLElement | null>(null)
const numAtivas = ref<HTMLElement | null>(null)
const numProntas = ref<HTMLElement | null>(null)
const donutLaptop = ref<SVGCircleElement | null>(null)
const numMeta = ref<HTMLElement | null>(null)
const donutPhone = ref<SVGCircleElement | null>(null)
const numDia = ref<HTMLElement | null>(null)
const donutArte = ref<SVGCircleElement | null>(null)
const numArte = ref<HTMLElement | null>(null)
const donutImpressao = ref<SVGCircleElement | null>(null)
const numImpressao = ref<HTMLElement | null>(null)
const donutAcabamento = ref<SVGCircleElement | null>(null)
const numAcabamento = ref<HTMLElement | null>(null)
const barsPhone = ref<HTMLElement | null>(null)

const visible = ref(false)
const scale = ref(1)
const viewportH = ref(STAGE_H)
let cleanup: Array<() => void> = []
let raf = 0
let scrollRaf = 0

// Tilt (hover), parallax (scroll) e entrada (slide lateral) mexem no MESMO
// transform de cada aparelho. Guardamos os três pedaços separados e
// recompomos juntos a cada atualização, pra um não apagar o outro (mesmo
// erro de "quem escreve primeiro" que já corrigimos no CSS, mas aqui do
// lado do JS).
const tiltState = new WeakMap<HTMLElement, { rx: number; ry: number }>()
const parallaxState = new WeakMap<HTMLElement, { ty: number }>()
const entranceState = new WeakMap<HTMLElement, { ex: number }>()

function renderDeviceTransform(el: HTMLElement) {
  const t = tiltState.get(el) || { rx: 0, ry: 0 }
  const p = parallaxState.get(el) || { ty: 0 }
  const en = entranceState.get(el) || { ex: 0 }
  // O celular também tem um scale() fixo (.devices-phone-scale, pra ficar
  // proporcionalmente menor que o laptop) — como setamos "transform" inline
  // aqui, isso APAGA o transform da classe CSS inteiro, não só combina com
  // ele. Por isso o scale do celular precisa entrar nessa mesma string.
  const phoneScale = el.classList.contains('devices-phone-scale') ? ` scale(${PHONE_SCALE})` : ''
  el.style.transform = `perspective(1400px) rotateX(${t.rx.toFixed(2)}deg) rotateY(${t.ry.toFixed(2)}deg) translateX(${en.ex.toFixed(1)}px) translateY(${p.ty.toFixed(1)}px)${phoneScale}`
}

// Desliza o aparelho de "fromX" (fora da tela) até a posição final (0),
// com a mesma curva de easing do countUp/animateDonut.
function animateEntrance(el: HTMLElement | null, fromX: number, dur: number, reduceMotion: boolean) {
  if (!el) return
  if (reduceMotion) {
    entranceState.set(el, { ex: 0 })
    renderDeviceTransform(el)
    return
  }
  let t0: number | null = null
  function tick(ts: number) {
    if (t0 === null) t0 = ts
    const p = Math.min((ts - t0) / dur, 1)
    const e = 1 - Math.pow(1 - p, 3)
    entranceState.set(el!, { ex: fromX * (1 - e) })
    renderDeviceTransform(el!)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function updateParallax() {
  scrollRaf = 0
  const vh = window.innerHeight
  const vc = vh / 2
  root.value?.querySelectorAll<HTMLElement>('.devices-tilt').forEach((el) => {
    const depth = parseFloat(el.dataset.depth || '0')
    if (!depth) return
    const r = el.getBoundingClientRect()
    const cc = r.top + r.height / 2
    const rel = (cc - vc) / vh
    parallaxState.set(el, { ty: rel * depth * -1 })
    renderDeviceTransform(el)
  })
}
function onScroll() {
  if (!scrollRaf) scrollRaf = requestAnimationFrame(updateParallax)
}

function updateScale() {
  const v = viewport.value
  if (!v) return
  const w = v.parentElement?.clientWidth || v.clientWidth
  const s = Math.min(1, w / STAGE_W)
  scale.value = s
  viewportH.value = STAGE_H * s
}

function countUp(el: HTMLElement | null, target: number, dur: number, format: (v: number) => string, reduceMotion: boolean) {
  if (!el) return
  if (reduceMotion) { el.textContent = format(target); return }
  let t0: number | null = null
  function tick(ts: number) {
    if (t0 === null) t0 = ts
    const p = Math.min((ts - t0) / dur, 1)
    const e = 1 - Math.pow(1 - p, 3)
    el!.textContent = format(target * e)
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// Gráfico circular: anima o traço do círculo (stroke-dashoffset) e o número
// no centro juntos, mesma curva de easing do countUp acima.
function animateDonut(circle: SVGCircleElement | null, numEl: HTMLElement | null, pct: number, radius: number, dur: number, reduceMotion: boolean) {
  if (!circle) return
  const circumference = 2 * Math.PI * radius
  if (reduceMotion) {
    circle.style.strokeDashoffset = String(circumference * (1 - pct / 100))
    if (numEl) numEl.textContent = pct + '%'
    return
  }
  let t0: number | null = null
  function tick(ts: number) {
    if (t0 === null) t0 = ts
    const p = Math.min((ts - t0) / dur, 1)
    const e = 1 - Math.pow(1 - p, 3)
    const current = pct * e
    circle!.style.strokeDashoffset = String(circumference * (1 - current / 100))
    if (numEl) numEl.textContent = Math.round(current) + '%'
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

let ro: ResizeObserver | null = null

onMounted(async () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const canHover = !reduce && !coarse

  updateScale()
  // Espera o Vue aplicar o scale() certo no DOM antes de medir a posição —
  // senão a distância calculada abaixo usa o layout ainda no scale(1) padrão
  // e fica errada (não coincide com o que a tela realmente mostra).
  await nextTick()

  const laptopEl = root.value?.querySelector<HTMLElement>('.device-macbook-pro') ?? null
  const phoneEl = root.value?.querySelector<HTMLElement>('.device-iphone-14-pro') ?? null

  // Distância calculada, não fixa — o suficiente pra cruzar a borda da
  // viewport do lado de cada aparelho + uma folga, ou seja, começa de
  // verdade fora da tela, não só deslocado. Precisa ser aplicada ANTES de
  // qualquer outro render do transform (parallax do scroll roda logo
  // abaixo), senão o aparelho aparece na posição final por um instante
  // antes de "voltar" pra fora.
  const EDGE_MARGIN = 100
  let laptopFromX = 0
  let phoneFromX = 0
  if (!reduce) {
    if (laptopEl) {
      const r = laptopEl.getBoundingClientRect()
      laptopFromX = window.innerWidth - r.left + EDGE_MARGIN
      entranceState.set(laptopEl, { ex: laptopFromX })
      renderDeviceTransform(laptopEl)
    }
    if (phoneEl) {
      const r = phoneEl.getBoundingClientRect()
      phoneFromX = -(r.right + EDGE_MARGIN)
      entranceState.set(phoneEl, { ex: phoneFromX })
      renderDeviceTransform(phoneEl)
    }
  }

  ro = new ResizeObserver(() => updateScale())
  if (viewport.value?.parentElement) ro.observe(viewport.value.parentElement)

  if (!reduce && root.value) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    cleanup.push(() => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    })
    updateParallax()
  }

  if (canHover && root.value) {
    root.value.querySelectorAll<HTMLElement>('.devices-tilt').forEach((el) => {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        const rx = (0.5 - py) * 8
        const ry = (px - 0.5) * 8
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          tiltState.set(el, { rx, ry })
          renderDeviceTransform(el)
        })
      }
      const onLeave = () => {
        tiltState.set(el, { rx: 0, ry: 0 })
        renderDeviceTransform(el)
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      cleanup.push(() => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      })
    })

    root.value.querySelectorAll<HTMLElement>('.dev-card').forEach((card) => {
      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px')
        card.style.setProperty('--my', (e.clientY - r.top) + 'px')
      }
      card.addEventListener('pointermove', onMove)
      cleanup.push(() => card.removeEventListener('pointermove', onMove))
    })
  }

  const bEl = bars.value
  if (bEl) Array.from(bEl.children).forEach((b, i) => { (b as HTMLElement).style.transitionDelay = (i * 60) + 'ms' })
  const bPhoneEl = barsPhone.value
  if (bPhoneEl) Array.from(bPhoneEl.children).forEach((b, i) => { (b as HTMLElement).style.transitionDelay = (i * 60 + 200) + 'ms' })

  let done = false
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting && !done) {
        done = true
        visible.value = true
        bEl?.classList.add('bars-in')
        bPhoneEl?.classList.add('bars-in')
        const prefix = isPT.value ? '€' : 'R$ '
        // Durações bem mais longas — a contagem sobe devagar em vez de "piscar" pro valor final.
        countUp(numFat.value, 84.2, 2800, (v) => prefix + v.toFixed(1).replace('.', ',') + 'k', reduce)
        countUp(numReceber.value, 12.4, 2800, (v) => prefix + v.toFixed(1).replace('.', ',') + 'k', reduce)
        countUp(numOs.value, 38, 2600, (v) => Math.round(v).toString(), reduce)
        countUp(numAtivas.value, 12, 2400, (v) => Math.round(v).toString(), reduce)
        countUp(numProntas.value, 5, 2200, (v) => Math.round(v).toString(), reduce)
        animateDonut(donutLaptop.value, numMeta.value, 72, 34, 2600, reduce)
        animateDonut(donutPhone.value, numDia.value, 68, 19, 2400, reduce)
        animateDonut(donutArte.value, numArte.value, 45, 17, 2300, reduce)
        animateDonut(donutImpressao.value, numImpressao.value, 70, 17, 2500, reduce)
        animateDonut(donutAcabamento.value, numAcabamento.value, 90, 17, 2700, reduce)
        animateEntrance(laptopEl, laptopFromX, 1250, reduce)
        animateEntrance(phoneEl, phoneFromX, 1250, reduce)
        io.disconnect()
      }
    })
  }, { threshold: 0.35 })
  if (viewport.value) io.observe(viewport.value)
  cleanup.push(() => io.disconnect())
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  cancelAnimationFrame(scrollRaf)
  ro?.disconnect()
  cleanup.forEach((fn) => fn())
  cleanup = []
})
</script>

<style scoped>
@keyframes glowpulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 0.9; }
}

.devices-scaler { position: relative; margin: 0 auto; transform-origin: top center; }
.device { position: absolute !important; }
.devices-tilt { transition: transform .2s ease-out; will-change: transform; }
.devices-phone-scale { transform: scale(v-bind(PHONE_SCALE)); transform-origin: top left; }

.devices-reveal { opacity: 0; transform: translateY(46px) scale(.97); transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1); overflow: visible; }
.devices-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .devices-reveal { transition: none; opacity: 1; transform: none; } }

/* Spotlight do cursor + borda cônica rotativa (mesmo padrão do LandingFeaturesBento) */
.dev-card { position: relative; background: #0d0d0f; overflow: hidden; }
/* devices.css aplica um reset MUITO amplo — ".device * { display:block }" —
   que bate de frente com as classes flex/grid do Tailwind aqui dentro (mesma
   especificidade, ordem no bundle decide, e o reset costuma vencer). Contra-
   regra com maior especificidade (".dev-card .flex") restaura o layout certo
   sem precisar de !important. */
.dev-card .flex { display: flex; }
.dev-card .grid { display: grid; }

.dev-card::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(249,115,22,.15), transparent 62%);
  opacity: 0; transition: opacity .35s ease; pointer-events: none; z-index: 0;
}
.dev-card:hover::before { opacity: 1; }
.dev-card > * { position: relative; z-index: 1; }
.dev-card-violet::before { background: radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(168,85,247,.20), transparent 62%); }

/* A tela do MacBook na devices.css é 600×375 (proporção real) — desenhamos o
   conteúdo num tamanho "confortável" (700×480, dá espaço pros gráficos
   maiores) e encolhemos pra caber exato, em vez de reapertar padding/gap
   manualmente até acertar por tentativa. Seletor composto (especificidade
   maior que ".dev-card > *", que vem antes no arquivo mas empataria em
   especificidade) garante "position:absolute" de verdade — mesma pegadinha
   do ".dev-card .flex" acima. */
.dev-card > .dev-fit-laptop {
  position: absolute; top: 0; left: 50%; width: 700px; height: 480px;
  margin-left: -350px; transform-origin: top center; transform: scale(0.78125);
  z-index: 1;
}

.dev-card > .dev-glare {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background: linear-gradient(115deg, rgba(255,255,255,.06) 0%, transparent 24%, transparent 76%, rgba(255,255,255,.03) 100%);
}

/* Borda com gradiente cônico rotativo no hover (mesmo efeito do LandingFeaturesBento) */
@property --a { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes devRot { to { --a: 360deg; } }
.dev-card::after {
  content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px;
  background: conic-gradient(from var(--a,0deg), transparent 0 70%, rgba(249,115,22,.9) 84%, rgba(251,146,60,.4) 92%, transparent 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .4s ease; pointer-events: none; z-index: 3;
}
.dev-card-violet::after {
  background: conic-gradient(from var(--a,0deg), transparent 0 66%, rgba(192,132,252,.95) 82%, rgba(168,85,247,.4) 90%, transparent 100%);
}
.dev-card:hover::after { opacity: 1; animation: devRot 3.2s linear infinite; }

.dev-bar { border-radius: 3px; transform-origin: bottom; transform: scaleY(0); transition: transform .9s cubic-bezier(.2,.8,.2,1); }
.bars-in .dev-bar { transform: scaleY(1); }
@media (prefers-reduced-motion: reduce) { .dev-bar { transform: none; } }

/* Gráficos circulares: gira o traço pra começar às 12h, como num gráfico de rosca normal. */
.dev-donut-svg { transform: rotate(-90deg); transform-origin: 50% 50%; }

/* Entrada em cascata: celular some/aparece um pouco depois do laptop */
.device-reveal-fade { opacity: 0; transition: opacity .7s ease; }
.device-reveal-fade.is-in { opacity: 1; }
.device-reveal-fade-delayed { transition-delay: .18s; }
@media (prefers-reduced-motion: reduce) { .device-reveal-fade { transition: none; opacity: 1; } }
</style>
