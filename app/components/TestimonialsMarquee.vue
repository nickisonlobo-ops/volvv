<template>
  <section ref="sectionRef" class="py-20 overflow-hidden relative">
    <div v-reveal class="max-w-4xl mx-auto text-center mb-12 px-4">
      <p class="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Depoimentos</p>
      <h2 class="text-3xl sm:text-5xl font-bold text-white mb-4">Quem usa, recomenda</h2>
      <p class="text-lg text-white/50">Empresas que transformaram sua gestao com o SignPRO</p>
    </div>

    <!-- So renderiza quando visivel -->
    <div v-if="isVisible" class="relative flex h-[420px] sm:h-[550px] w-full max-w-[1100px] mx-auto flex-row items-center justify-center overflow-hidden gap-3 sm:gap-4" style="perspective: 800px;">
      <div class="flex flex-row items-center gap-3 sm:gap-5" :style="isMobile ? 'transform: rotateX(5deg) rotateY(-5deg) rotateZ(5deg)' : 'transform: translateX(-50px) translateZ(-50px) rotateX(10deg) rotateY(-8deg) rotateZ(10deg)'">
        <!-- Coluna 1 -->
        <div class="flex flex-col gap-3 sm:gap-4 animate-marquee-down">
          <div v-for="(t, i) in mobileCol1" :key="'c1-'+i" class="w-48 sm:w-64 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 shrink-0">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <img :src="t.img" loading="lazy" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
              <div>
                <p class="text-xs sm:text-sm font-bold text-white">{{ t.name }}</p>
                <p class="text-[10px] sm:text-[11px] text-white/40">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-white/60 leading-relaxed">"{{ t.body }}"</p>
          </div>
        </div>

        <!-- Coluna 2 -->
        <div class="flex flex-col gap-3 sm:gap-4 animate-marquee-up">
          <div v-for="(t, i) in mobileCol2" :key="'c2-'+i" class="w-48 sm:w-64 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 shrink-0">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <img :src="t.img" loading="lazy" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
              <div>
                <p class="text-xs sm:text-sm font-bold text-white">{{ t.name }}</p>
                <p class="text-[10px] sm:text-[11px] text-white/40">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-white/60 leading-relaxed">"{{ t.body }}"</p>
          </div>
        </div>

        <!-- Coluna 3 (desktop only) -->
        <div class="hidden sm:flex flex-col gap-4 animate-marquee-down">
          <div v-for="(t, i) in col3" :key="'c3-'+i" class="w-64 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shrink-0">
            <div class="flex items-center gap-3 mb-3">
              <img :src="t.img" loading="lazy" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <p class="text-sm font-bold text-white">{{ t.name }}</p>
                <p class="text-[11px] text-white/40">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-sm text-white/60 leading-relaxed">"{{ t.body }}"</p>
          </div>
        </div>

        <!-- Coluna 4 (desktop only) -->
        <div class="hidden md:flex flex-col gap-4 animate-marquee-up">
          <div v-for="(t, i) in col4" :key="'c4-'+i" class="w-64 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shrink-0">
            <div class="flex items-center gap-3 mb-3">
              <img :src="t.img" loading="lazy" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <p class="text-sm font-bold text-white">{{ t.name }}</p>
                <p class="text-[11px] text-white/40">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-sm text-white/60 leading-relaxed">"{{ t.body }}"</p>
          </div>
        </div>
      </div>

      <!-- Gradients -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-1/3" style="background: linear-gradient(to bottom, #0a0a0f, transparent)"></div>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3" style="background: linear-gradient(to top, #0a0a0f, transparent)"></div>
      <div class="pointer-events-none absolute inset-y-0 left-0 w-1/4" style="background: linear-gradient(to right, #0a0a0f, transparent)"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 w-1/4" style="background: linear-gradient(to left, #0a0a0f, transparent)"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '200px' }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => { observer?.disconnect() })

const isMobile = ref(false)
onMounted(() => { isMobile.value = window.innerWidth < 640 })

const testimonials = [
  { name: 'Ricardo Souza', role: 'Adesivos Express — SP', body: 'O SignPRO organizou toda nossa producao. Antes perdiamos OS no papel, agora tudo no kanban.', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Amanda Costa', role: 'Studio Visual — RJ', body: 'O CRM com WhatsApp integrado mudou nosso atendimento. Respondemos 3x mais rapido.', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Carlos Eduardo', role: 'CE Comunicacao Visual — MG', body: 'Controle financeiro + producao num so lugar. Cancelei 3 ferramentas depois do SignPRO.', img: 'https://randomuser.me/api/portraits/men/51.jpg' },
  { name: 'Juliana Rocha', role: 'Arte & Cor Graficas — PR', body: 'Meus clientes acompanham a OS pelo link. Reduziu ligacoes de cobranca em 80%.', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Fernando Lima', role: 'Mega Print — Campinas', body: 'O agendamento online economiza 2h por dia da minha secretaria. Essencial para grafica.', img: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { name: 'Patricia Gomes', role: 'PG Sinalizacao — Salvador', body: 'Gerencio toda producao de placas e faixas pelo SignPRO. Nao troco por nada.', img: 'https://randomuser.me/api/portraits/women/53.jpg' },
  { name: 'Lucas Martins', role: 'Plotag Adesivos — Curitiba', body: 'O kanban de producao mudou tudo. Sei exatamente o que esta em cada etapa.', img: 'https://randomuser.me/api/portraits/men/85.jpg' },
  { name: 'Beatriz Santos', role: 'BS Graficas Rapidas — BH', body: 'Comecei no plano basico e ja estou no Pro. O sistema cresce junto comigo.', img: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { name: 'Marcos Vinicius', role: 'MV Comunicacao Visual — DF', body: 'Suporte rapido e o sistema nunca caiu. Confianca total pro meu negocio.', img: 'https://randomuser.me/api/portraits/men/61.jpg' },
]

const col1 = [...testimonials.slice(0, 5), ...testimonials.slice(0, 5)]
const col2 = [...testimonials.slice(3, 8), ...testimonials.slice(3, 8)]
const col3 = [...testimonials.slice(5, 9), ...testimonials.slice(0, 4)]
const col4 = [...testimonials.slice(1, 6), ...testimonials.slice(1, 6)]

// Mobile: apenas 4 cards por coluna
const mobileCol1 = computed(() => isMobile.value ? [...testimonials.slice(0, 4), ...testimonials.slice(0, 4)] : col1)
const mobileCol2 = computed(() => isMobile.value ? [...testimonials.slice(4, 8), ...testimonials.slice(4, 8)] : col2)
</script>

<style scoped>
@keyframes marquee-down {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-33.33% - 1rem)); }
}
@keyframes marquee-up {
  from { transform: translateY(calc(-33.33% - 1rem)); }
  to { transform: translateY(0); }
}
.animate-marquee-down { animation: marquee-down 35s linear infinite; }
.animate-marquee-up { animation: marquee-up 35s linear infinite; }
</style>
