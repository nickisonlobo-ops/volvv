<template>
  <div style="background:#fff;border:1px solid #e2e5ea;border-radius:18px;padding:18px 20px 12px;box-shadow:0 1px 3px rgba(0,0,0,.05)">
    <div style="display:flex;align-items:flex-start;justify-content:space-between">
      <div>
        <div style="font-size:15.5px;font-weight:700;color:#0f1216;letter-spacing:-.2px">Evolução da Receita</div>
        <div style="font-size:11.5px;color:#9aa1ab;margin-top:3px">Últimos 12 meses — valores mensais</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;border:1px solid #e5e5e2;border-radius:10px;padding:8px 13px;font-size:12.5px;font-weight:600;color:#31363e;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.03)">
        Últimos 12 meses
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </div>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:18px;margin-top:6px;font-size:12px;font-weight:600;color:#31363e">
      <span style="display:flex;align-items:center;gap:7px"><span style="width:10px;height:10px;border-radius:3px;background:#10b981"></span>Receita</span>
      <span style="display:flex;align-items:center;gap:7px"><span style="width:10px;height:10px;border-radius:3px;background:#fc6404"></span>A Receber</span>
      <span style="display:flex;align-items:center;gap:7px"><span style="width:10px;height:10px;border-radius:3px;background:#ef4444"></span>Despesas</span>
    </div>

    <div style="position:relative" @mouseleave="tip = null">
      <svg viewBox="0 0 720 252" width="100%" height="244" style="margin-top:2px">
        <defs>
          <linearGradient id="dashArea2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#10b981" stop-opacity=".2" />
            <stop offset="1" stop-color="#10b981" stop-opacity=".02" />
          </linearGradient>
        </defs>

        <!-- grid -->
        <g stroke="#efefec" stroke-width="1">
          <line v-for="(s, n) in ySteps" :key="`g${n}`" x1="55" :y1="10 + n * 50" x2="710" :y2="10 + n * 50" />
        </g>
        <!-- y labels -->
        <g fill="#9aa1ab" font-size="11.5" font-family="Inter,sans-serif" text-anchor="end">
          <text v-for="(s, n) in ySteps" :key="`yl${n}`" x="47" :y="14 + n * 50">{{ formatShort(s) }}</text>
        </g>

        <!-- area receita -->
        <path v-if="points.length" :d="areaReceita" fill="url(#dashArea2)" />

        <!-- linhas -->
        <path v-if="points.length" :d="lineReceita" fill="none" stroke="#10b981" stroke-width="2.8" stroke-linecap="round" />
        <path v-if="points.length" :d="lineAReceber" fill="none" stroke="#fc6404" stroke-width="2.6" stroke-linecap="round" />
        <path v-if="points.length" :d="lineDespesas" fill="none" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round" />

        <!-- dots -->
        <g fill="#10b981"><circle v-for="(p, i) in points" :key="`dr${i}`" :cx="p.x" :cy="p.yReceita" r="4" /></g>
        <g fill="#fc6404"><circle v-for="(p, i) in points" :key="`da${i}`" :cx="p.x" :cy="p.yAReceber" r="3.4" /></g>
        <g fill="#ef4444"><circle v-for="(p, i) in points" :key="`dd${i}`" :cx="p.x" :cy="p.yDespesas" r="3.4" /></g>

        <!-- hover -->
        <line v-if="tip !== null" :x1="points[tip].x" y1="6" :x2="points[tip].x" y2="210" stroke="#cfd3d8" stroke-width="1" stroke-dasharray="3,2" />
        <rect v-for="(p, i) in points" :key="`hz${i}`" :x="p.x - 26" y="0" width="52" height="220" fill="transparent" style="cursor:pointer" @mouseenter="tip = i" />

        <!-- month labels -->
        <g fill="#9aa1ab" font-size="11.5" font-family="Inter,sans-serif" text-anchor="middle">
          <text v-for="(p, i) in points" :key="`ml${i}`" :x="p.x" y="240">{{ p.label }}</text>
        </g>
      </svg>

      <!-- Tooltip -->
      <Transition name="fade">
        <div
          v-if="tip !== null"
          style="position:absolute;z-index:10;pointer-events:none;background:#fff;border:1px solid #ececea;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,.12);padding:10px 12px;font-size:12px;min-width:150px;color:#0f1216"
          :style="{ left: `${(points[tip].x / 720) * 100}%`, top: '0px', transform: 'translateX(-50%)' }"
        >
          <p style="font-weight:700;margin:0 0 6px;text-transform:capitalize">{{ points[tip].label }}</p>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
            <span style="width:8px;height:8px;border-radius:50%;background:#10b981"></span>
            <span style="color:#8b9099">Receita:</span>
            <span style="font-weight:700;margin-left:auto">{{ formatCurrency(points[tip].receita) }}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
            <span style="width:8px;height:8px;border-radius:50%;background:#fc6404"></span>
            <span style="color:#8b9099">A Receber:</span>
            <span style="font-weight:700;margin-left:auto">{{ formatCurrency(points[tip].aReceber) }}</span>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="width:8px;height:8px;border-radius:50%;background:#ef4444"></span>
            <span style="color:#8b9099">Despesas:</span>
            <span style="font-weight:700;margin-left:auto">{{ formatCurrency(points[tip].despesas) }}</span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EvolucaoMensal } from '~/composables/useDashboardAdmin'

const props = defineProps<{
  evolucaoMensal: EvolucaoMensal[]
  formatCurrency: (value: number) => string
}>()

const tip = ref<number | null>(null)

// Geometria do gráfico (mesmo sistema do mockup)
const X0 = 55, X1 = 690, YTOP = 10, YBASE = 210

function formatShort(val: number): string {
  if (val >= 1_000_000) return `R$ ${(val / 1_000_000).toFixed(1)}M`
  if (val >= 10_000) return `R$ ${(val / 1_000).toFixed(0)}k`
  if (val >= 1_000) return `R$ ${(val / 1_000).toFixed(1).replace('.', ',')}k`
  return `R$ ${val.toFixed(0)}`
}

function smooth(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]
    const p1 = pts[i]
    const dx = p1.x - p0.x
    const cp1x = (p0.x + dx * 0.4).toFixed(2)
    const cp2x = (p1.x - dx * 0.4).toFixed(2)
    d += ` C ${cp1x},${p0.y.toFixed(2)} ${cp2x},${p1.y.toFixed(2)} ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`
  }
  return d
}

const rawMax = computed(() =>
  Math.max(...props.evolucaoMensal.flatMap(m => [m.faturamento, m.despesas, m.receitaAReceber]), 1)
)
// Arredonda para um "nice max" divisível por 4 gridlines
const maxVal = computed(() => {
  const step = Math.ceil(rawMax.value / 4 / 250) * 250 || 250
  return step * 4
})
const ySteps = computed(() => {
  const m = maxVal.value
  return [m, m * 0.75, m * 0.5, m * 0.25, 0]
})

const points = computed(() => {
  const meses = props.evolucaoMensal
  const m = maxVal.value
  const span = X1 - X0
  const yFor = (v: number) => YBASE - (v / m) * (YBASE - YTOP)
  return meses.map((mo, i) => ({
    x: X0 + i * (span / Math.max(meses.length - 1, 1)),
    yReceita: yFor(mo.faturamento),
    yAReceber: yFor(mo.receitaAReceber),
    yDespesas: yFor(mo.despesas),
    label: mo.mes,
    receita: mo.faturamento,
    aReceber: mo.receitaAReceber,
    despesas: mo.despesas,
  }))
})

const lineReceita = computed(() => smooth(points.value.map(p => ({ x: p.x, y: p.yReceita }))))
const lineAReceber = computed(() => smooth(points.value.map(p => ({ x: p.x, y: p.yAReceber }))))
const lineDespesas = computed(() => smooth(points.value.map(p => ({ x: p.x, y: p.yDespesas }))))

const areaReceita = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  return `${smooth(pts.map(p => ({ x: p.x, y: p.yReceita })))} L ${pts[pts.length - 1].x.toFixed(2)},${YBASE} L ${pts[0].x.toFixed(2)},${YBASE} Z`
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 120ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
