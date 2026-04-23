<template>
  <div class="min-h-screen relative overflow-hidden font-sans antialiased" style="background: #fff5f9; color: #2d1a2e">

    <!-- Blobs de fundo (sempre visíveis) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-25 blur-[100px]" style="background: radial-gradient(circle, #fbcfe8, transparent 70%)"></div>
      <div class="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-20 blur-[120px]" style="background: radial-gradient(circle, #f5d0fe, transparent 70%)"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]" style="background: radial-gradient(circle, #fce7f3, transparent 70%)"></div>
      <!-- Partículas flutuantes -->
      <div class="particle" style="top:8%;right:12%;width:14px;height:14px;background:#f9a8d4;animation-duration:4s"></div>
      <div class="particle" style="top:18%;right:30%;width:9px;height:9px;background:#e879f9;animation-duration:5s;animation-delay:.7s"></div>
      <div class="particle" style="top:55%;left:8%;width:11px;height:11px;background:#fca5a5;animation-duration:4.5s;animation-delay:1.3s"></div>
      <div class="particle" style="bottom:20%;left:22%;width:8px;height:8px;background:#f472b6;animation-duration:3.5s;animation-delay:.4s"></div>
      <div class="particle" style="bottom:35%;right:18%;width:10px;height:10px;background:#d8b4fe;animation-duration:4.2s;animation-delay:1s"></div>
      <div class="particle" style="top:40%;left:40%;width:6px;height:6px;background:#f9a8d4;animation-duration:6s;animation-delay:.2s"></div>
    </div>

    <!-- ═══════════════ INTRO HERO ═══════════════ -->
    <Transition name="intro">
      <div v-if="showIntro" class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center">

        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-pink-100 border border-pink-200 mb-8 shadow-sm intro-badge">
          <svg class="w-3.5 h-3.5 text-pink-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
          </svg>
          <span class="text-xs font-bold text-pink-600 tracking-wider uppercase">Para mulheres que fazem acontecer</span>
        </div>

        <!-- Ícone central -->
        <div class="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl shadow-pink-900/30 mb-8 intro-icon" style="background: linear-gradient(135deg, #ec4899, #a855f7)">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
          </svg>
        </div>

        <!-- Headline -->
        <h1 class="font-black tracking-tight mb-5 intro-headline" style="line-height:1.08">
          <span class="block" style="font-size:clamp(2rem,5.5vw,3.8rem);background:linear-gradient(135deg,#be185d,#7e22ce);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
            Menos agendamento manual.
          </span>
          <span class="block mt-1" style="font-size:clamp(2rem,5.5vw,3.8rem);background:linear-gradient(135deg,#f472b6,#c026d3,#f43f5e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">
            Mais facilidade para o seu studio.
          </span>
        </h1>

        <!-- Subheadline -->
        <p class="text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed intro-sub" style="color:rgba(120,40,60,0.65)">
          Crie sua conta grátis e transforme a gestão do seu negócio de beleza — da agenda ao financeiro, tudo em um só lugar.
        </p>

        <!-- Benefícios em pills -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-10 intro-pills">
          <div v-for="b in benefits" :key="b.text" class="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-pink-100 shadow-sm text-sm font-semibold" style="color:#be185d">
            <span class="text-base">{{ b.emoji }}</span>
            <span>{{ b.text }}</span>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 intro-ctas">
          <button
            class="inline-flex items-center gap-2 text-base font-black px-10 py-4 rounded-full text-white transition-all duration-200 hover:scale-105 active:scale-100 shadow-xl"
            style="background:linear-gradient(135deg,#f472b6,#c026d3);box-shadow:0 8px 28px rgba(236,72,153,0.4)"
            @click="goTo('register')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Criar minha conta grátis
          </button>
          <button
            class="inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full border-2 border-pink-200 bg-white hover:bg-pink-50 hover:border-pink-300 transition-all duration-200 shadow-sm"
            style="color:#ec4899"
            @click="goTo('login')"
          >
            Já tenho uma conta
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </button>
        </div>

        <!-- Social proof -->
        <div class="flex flex-wrap items-center justify-center gap-5 text-sm intro-proof" style="color:rgba(120,40,60,0.5)">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              <div v-for="(c, i) in avatarColors" :key="i" class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white" :style="{ background: c }">{{ avatarInitials[i] }}</div>
            </div>
            <span class="font-semibold">+500 estúdios ativos</span>
          </div>
          <span class="text-pink-200 hidden sm:inline">|</span>
          <div class="flex items-center gap-1">
            <svg v-for="s in 5" :key="s" class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span class="font-semibold ml-1" style="color:rgba(120,40,60,0.7)">4.9 de satisfação</span>
          </div>
          <span class="text-pink-200 hidden sm:inline">|</span>
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Sem cartão de crédito</span>
          </div>
        </div>

      </div>
    </Transition>

    <!-- ═══════════════ FORMULÁRIO ═══════════════ -->
    <Transition name="form">
      <div v-if="!showIntro" class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">

        <!-- Botão voltar -->
        <button
          class="absolute top-5 left-5 flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-700 transition-colors"
          @click="showIntro = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          Voltar
        </button>

        <LoginForm :initial-tab="initialTab" class="relative z-10" />

      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/LoginForm.vue'

definePageMeta({ layout: false })

const showIntro = ref(true)
const initialTab = ref<'login' | 'register'>('register')

function goTo(tab: 'login' | 'register') {
  initialTab.value = tab
  showIntro.value = false
}

const benefits = [
  { emoji: '📅', text: 'Agenda automática' },
  { emoji: '💰', text: 'Controle financeiro' },
  { emoji: '👥', text: 'Gestão de clientes' },
  { emoji: '📦', text: 'Controle de estoque' },
  { emoji: '✨', text: 'Link de agendamento' },
]

const avatarColors = ['#f472b6', '#a855f7', '#ec4899', '#c084fc']
const avatarInitials = ['A', 'M', 'J', 'K']
</script>

<style scoped>
/* Partícula flutuante */
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.45;
  animation: float linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-14px) scale(1.1); }
}

/* Animação de entrada dos elementos do intro */
.intro-badge   { animation: fadeUp .55s ease both; }
.intro-icon    { animation: fadeUp .6s .08s ease both; }
.intro-headline{ animation: fadeUp .65s .15s ease both; }
.intro-sub     { animation: fadeUp .65s .22s ease both; }
.intro-pills   { animation: fadeUp .65s .30s ease both; }
.intro-ctas    { animation: fadeUp .65s .38s ease both; }
.intro-proof   { animation: fadeUp .65s .46s ease both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Transition: intro sai para cima */
.intro-leave-active { transition: all .45s cubic-bezier(.4,0,.2,1); }
.intro-leave-to     { opacity: 0; transform: translateY(-30px); }
.intro-enter-active { transition: all .45s cubic-bezier(.4,0,.2,1); }
.intro-enter-from   { opacity: 0; transform: translateY(-30px); }

/* Transition: form entra por baixo */
.form-enter-active { transition: all .5s cubic-bezier(.4,0,.2,1) .1s; }
.form-enter-from   { opacity: 0; transform: translateY(30px); }
.form-leave-active { transition: all .35s cubic-bezier(.4,0,.2,1); }
.form-leave-to     { opacity: 0; transform: translateY(30px); }
</style>
