<template>
  <section class="py-20 overflow-hidden relative">
    <div class="max-w-4xl mx-auto text-center mb-12 px-4">
      <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">O que nossos clientes dizem</h2>
      <p class="text-lg text-white/60">Empresas que transformaram sua gestao com o Volvv</p>
    </div>

    <div class="relative flex h-[400px] w-full max-w-[900px] mx-auto flex-row items-center justify-center overflow-hidden gap-1.5" style="perspective: 300px;">
      <div class="flex flex-row items-center gap-4" style="transform: translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg);">
        <!-- Coluna 1 (desce) -->
        <div class="flex flex-col gap-4 animate-marquee-down">
          <div v-for="t in [...testimonials, ...testimonials, ...testimonials]" :key="t.name + '-1-' + Math.random()" class="w-52 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 shrink-0">
            <div class="flex items-center gap-2.5 mb-3">
              <img :src="t.img" class="w-9 h-9 rounded-full object-cover" />
              <div>
                <p class="text-sm font-semibold text-white">{{ t.name }}</p>
                <p class="text-[10px] text-white/50">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-xs text-white/70 leading-relaxed">{{ t.body }}</p>
          </div>
        </div>

        <!-- Coluna 2 (sobe) -->
        <div class="flex flex-col gap-4 animate-marquee-up">
          <div v-for="t in [...testimonials.slice(3), ...testimonials, ...testimonials]" :key="t.name + '-2-' + Math.random()" class="w-52 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 shrink-0">
            <div class="flex items-center gap-2.5 mb-3">
              <img :src="t.img" class="w-9 h-9 rounded-full object-cover" />
              <div>
                <p class="text-sm font-semibold text-white">{{ t.name }}</p>
                <p class="text-[10px] text-white/50">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-xs text-white/70 leading-relaxed">{{ t.body }}</p>
          </div>
        </div>

        <!-- Coluna 3 (desce) -->
        <div class="flex flex-col gap-4 animate-marquee-down">
          <div v-for="t in [...testimonials.slice(5), ...testimonials, ...testimonials]" :key="t.name + '-3-' + Math.random()" class="w-52 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 shrink-0">
            <div class="flex items-center gap-2.5 mb-3">
              <img :src="t.img" class="w-9 h-9 rounded-full object-cover" />
              <div>
                <p class="text-sm font-semibold text-white">{{ t.name }}</p>
                <p class="text-[10px] text-white/50">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-xs text-white/70 leading-relaxed">{{ t.body }}</p>
          </div>
        </div>

        <!-- Coluna 4 (sobe) -->
        <div class="flex flex-col gap-4 animate-marquee-up">
          <div v-for="t in [...testimonials.slice(1), ...testimonials, ...testimonials]" :key="t.name + '-4-' + Math.random()" class="w-52 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 shrink-0">
            <div class="flex items-center gap-2.5 mb-3">
              <img :src="t.img" class="w-9 h-9 rounded-full object-cover" />
              <div>
                <p class="text-sm font-semibold text-white">{{ t.name }}</p>
                <p class="text-[10px] text-white/50">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-xs text-white/70 leading-relaxed">{{ t.body }}</p>
          </div>
        </div>
      </div>

      <!-- Gradients -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-gray-900"></div>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-gray-900"></div>
      <div class="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-900"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-900"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  { name: 'Ricardo Souza', role: 'Adesivos Express', body: 'O Volvv organizou toda nossa producao. Antes perdiamos OS no papel, agora tudo no kanban.', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Amanda Costa', role: 'Studio Visual', body: 'O CRM com WhatsApp integrado mudou nosso atendimento. Respondemos 3x mais rapido.', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Carlos Eduardo', role: 'Sign Pro', body: 'Controle financeiro + producao num so lugar. Cancelei 3 ferramentas depois do Volvv.', img: 'https://randomuser.me/api/portraits/men/51.jpg' },
  { name: 'Juliana Rocha', role: 'Arte & Cor', body: 'Meus clientes acompanham a OS pelo link. Reduziu ligacoes de cobranca em 80%.', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Fernando Lima', role: 'Mega Print', body: 'O agendamento online economiza 2h por dia da minha secretaria. Essencial.', img: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { name: 'Patricia Gomes', role: 'Clinica Bella', body: 'Uso para gerenciar pacientes e agendamentos. Interface linda e facil de usar.', img: 'https://randomuser.me/api/portraits/women/53.jpg' },
  { name: 'Lucas Martins', role: 'Auto Center JL', body: 'O e-commerce integrado me deu um canal de vendas novo sem custo extra.', img: 'https://randomuser.me/api/portraits/men/85.jpg' },
  { name: 'Beatriz Santos', role: 'Atelie BS', body: 'Comecei no plano basico e ja estou no Pro. O sistema cresce junto comigo.', img: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { name: 'Marcos Vinicius', role: 'MV Comunicacao', body: 'Suporte rapido e o sistema nunca caiu. Confianca total pro meu negocio.', img: 'https://randomuser.me/api/portraits/men/61.jpg' },
]
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
.animate-marquee-down { animation: marquee-down 40s linear infinite; }
.animate-marquee-up { animation: marquee-up 40s linear infinite; }
</style>
