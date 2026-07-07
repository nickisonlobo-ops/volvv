<template>
  <div class="min-h-screen font-sans antialiased overflow-x-hidden bg-[#0a0a0f] text-white">

    <!-- ═══ NAV ═══ -->
    <nav
      class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5' : ''"
    >
      <div class="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between h-16 sm:h-20">
        <!-- Logo -->
        <NuxtLink to="/welcome" class="flex items-center">
          <img src="/logo-signpro.png" alt="SignPRO" class="h-8 sm:h-10 w-auto" />
        </NuxtLink>

        <!-- Desktop links -->
        <div class="hidden md:flex items-center gap-8">
          <a v-for="link in navLinks" :key="link.href" :href="link.href" class="text-sm text-white/60 hover:text-white transition-colors font-medium">{{ link.label }}</a>
        </div>

        <!-- Desktop CTA -->
        <div class="hidden md:flex items-center gap-4">
          <NuxtLink to="/login" class="text-sm font-medium text-white/70 hover:text-white transition-colors">Entrar</NuxtLink>
          <a href="/login"
            class="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all duration-200">
            Começar grátis
          </a>
        </div>

        <!-- Hamburger -->
        <button class="md:hidden flex flex-col gap-1.5 p-2" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span class="w-5 h-0.5 bg-white/80 rounded transition-all" :class="mobileOpen ? 'rotate-45 translate-y-[4px]' : ''"></span>
          <span class="w-5 h-0.5 bg-white/80 rounded transition-all" :class="mobileOpen ? 'opacity-0' : ''"></span>
          <span class="w-5 h-0.5 bg-white/80 rounded transition-all" :class="mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''"></span>
        </button>
      </div>

      <!-- Mobile drawer -->
      <div v-if="mobileOpen" class="md:hidden bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" class="block text-sm text-white/70 font-medium py-2" @click="mobileOpen = false">{{ link.label }}</a>
        <div class="flex flex-col gap-3 pt-3 border-t border-white/10">
          <NuxtLink to="/login" class="text-sm font-medium text-white/70 py-2" @click="mobileOpen = false">Entrar</NuxtLink>
          <a href="/login"
            class="px-5 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center" @click="mobileOpen = false">
            Começar grátis
          </a>
        </div>
      </div>
    </nav>

    <!-- ═══ HERO ═══ -->
    <LandingHero locale="pt-BR" />

    <!-- ═══ SEGMENTOS ATENDIDOS ═══ -->
    <LandingIndustries locale="pt-BR" />

    <!-- ═══ FUNCIONALIDADES ═══ -->
    <LandingFeaturesBento locale="pt-BR" />

    <!-- ═══ APARELHOS / DEVICES ═══ -->
    <LandingDevices locale="pt-BR" />

    <!-- ═══ STATS ═══ -->
    <section class="py-20 relative">
      <div class="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-600/5"></div>
      <div class="relative max-w-4xl mx-auto px-6 sm:px-10">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-orange-300 to-orange-400 bg-clip-text text-transparent mb-2">{{ stat.value }}</div>
            <div class="text-xs font-medium text-white/40 uppercase tracking-wider">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ COMO FUNCIONA ═══ -->
    <section id="como-funciona" class="py-24 sm:py-32">
      <div class="max-w-4xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-16">
          <p class="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Simples assim</p>
          <h2 class="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Começa em 3 passos</h2>
          <p class="text-white/50 max-w-md mx-auto">Em 5 minutos sua conta está criada e funcionando.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div v-for="(step, i) in steps" :key="step.title" class="relative text-center">
            <div class="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/20">
              <svg class="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" v-html="step.svg"></svg>
              <span class="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center bg-orange-500 text-white">{{ i + 1 }}</span>
            </div>
            <h3 class="text-base font-semibold text-white mb-2">{{ step.title }}</h3>
            <p class="text-sm text-white/40 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ DEPOIMENTOS ═══ -->
    <section id="depoimentos" class="py-24 sm:py-32 relative">
      <TestimonialsMarquee />
    </section>

    <!-- ═══ PLANOS ═══ -->
    <section id="precos" class="py-24 sm:py-32 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent"></div>
      <div class="relative max-w-5xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-16">
          <p class="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Planos</p>
          <h2 class="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Investimento que se paga em 1 semana</h2>
          <p class="text-white/50 max-w-sm mx-auto">Planos que crescem com sua empresa. Cancele quando quiser.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          <div v-for="plan in plans" :key="plan.name"
            class="relative rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300"
            :class="plan.featured
              ? 'border-2 border-orange-500/50 bg-white/[0.05] shadow-2xl shadow-orange-500/10 sm:scale-[1.03]'
              : 'border border-white/[0.08] bg-white/[0.02] hover:border-white/15'">
            <div v-if="plan.featured"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg whitespace-nowrap">
              MAIS POPULAR
            </div>
            <div>
              <h3 class="text-lg font-bold text-white mb-1">{{ plan.name }}</h3>
              <p class="text-xs text-white/40">{{ plan.desc }}</p>
            </div>
            <div class="flex items-end gap-1">
              <span class="text-4xl font-bold text-white">{{ plan.price }}</span>
              <span v-if="plan.period" class="text-sm text-white/40 mb-1">{{ plan.period }}</span>
            </div>
            <ul class="flex flex-col gap-2.5 flex-1">
              <li v-for="item in plan.items" :key="item" class="flex items-start gap-2.5 text-sm text-white/60">
                <svg class="mt-0.5 shrink-0 w-4 h-4 text-orange-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                {{ item }}
              </li>
            </ul>
            <a :href="plan.url"
              :target="plan.url.startsWith('http') ? '_blank' : undefined"
              :rel="plan.url.startsWith('http') ? 'noopener noreferrer' : undefined"
              class="mt-2 w-full py-3.5 rounded-full text-sm font-semibold text-center transition-all duration-200 hover:scale-[1.02] block"
              :class="plan.featured
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                : 'border border-white/15 text-white/80 hover:bg-white/5 hover:border-white/25'">
              {{ plan.cta }}
            </a>
          </div>
        </div>
        <p class="text-center text-xs text-white/30 mt-8">✅ 14 dias grátis em todos os planos · Sem cartão de crédito · Cancele quando quiser · Preços por faturamento mensal da empresa</p>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="py-24 sm:py-32">
      <div class="max-w-2xl mx-auto px-6 sm:px-10">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Dúvidas</p>
          <h2 class="text-3xl sm:text-5xl font-bold tracking-tight">Perguntas frequentes</h2>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="(faq, i) in faqs" :key="i"
            class="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-all hover:border-white/15">
            <button class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left" @click="toggleFaq(i)">
              <span class="text-sm font-medium text-white/90">{{ faq.q }}</span>
              <svg class="w-4 h-4 text-white/40 shrink-0 transition-transform duration-200" :class="faqOpen === i ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-if="faqOpen === i" class="px-5 pb-4">
              <p class="text-sm text-white/50 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ CTA FINAL ═══ -->
    <section class="py-24 sm:py-32 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style="background: radial-gradient(circle, #ea580c, transparent 70%)"></div>
      </div>
      <div class="relative max-w-2xl mx-auto px-6 sm:px-10 text-center">
        <h2 class="text-3xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
          Da arte à entrega.<br><span class="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">Controle total.</span>
        </h2>
        <p class="text-white/50 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Sua empresa merece um sistema que organiza tudo sem dor de cabeça. Comece hoje, de graça.
        </p>
        <a href="/login"
          class="inline-flex items-center gap-2 text-lg font-semibold px-10 py-5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-200">
          Começar grátis
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
        </a>
        <p class="text-xs text-white/30 mt-5">Sem cartão de crédito. Pronto em 5 minutos.</p>
      </div>
    </section>

    <!-- ═══ FOOTER ═══ -->
    <footer class="border-t border-white/5 py-8">
      <div class="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
          </div>
          <span class="text-sm font-bold">Sign<span class="text-orange-400">PRO</span></span>
        </div>
        <p class="text-xs text-white/30">© 2025 SignPRO. Da arte à entrega, controle total.</p>
        <NuxtLink to="/login" class="text-xs font-medium text-orange-400 hover:text-orange-300 transition-colors">Acessar plataforma</NuxtLink>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: false })

useHead({
  title: 'SignPRO — Sistema para Gráficas e Comunicação Visual',
  meta: [
    { name: 'description', content: 'Sistema completo para gráficas e empresas de comunicação visual. Orçamentos, OS, kanban de produção, financeiro e CRM em um só lugar.' }
  ],
  script: [
    {
      innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2418191055286734');fbq('track','PageView');`,
      type: 'text/javascript',
    },
  ],
  noscript: [
    { innerHTML: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2418191055286734&ev=PageView&noscript=1" />' },
  ],
})

const scrolled = ref(false)
const mobileOpen = ref(false)
const faqOpen = ref<number | null>(null)

function onScroll() { scrolled.value = window.scrollY > 30 }
function toggleFaq(i: number) { faqOpen.value = faqOpen.value === i ? null : i }

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navLinks = [
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#precos', label: 'Planos' },
]

const stats = [
  { value: '200+', label: 'Empresas ativas' },
  { value: '98%', label: 'Satisfação' },
  { value: '10h', label: 'Economizadas por semana' },
  { value: '5 min', label: 'Para configurar' },
]

const steps = [
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>', title: 'Crie sua conta', desc: 'Cadastre sua empresa em menos de 5 minutos. Sem burocracia e sem cartão.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>', title: 'Configure sua operação', desc: 'Adicione materiais, equipe e configure etapas de produção.' },
  { svg: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>', title: 'Comece a produzir', desc: 'Orçamentos, pedidos e financeiro organizados. Acesse de qualquer lugar.' },
]

const plans = [
  { name: 'Essencial', desc: 'Gestão core + faturamento', price: 'R$297', period: '/mês', featured: false, url: '/login', cta: 'Começar grátis', items: ['Até 3 usuários', 'CRM em kanban (etapas configuráveis)', 'Orçamentos com pipeline e taxa de conversão', 'OS com etapas de produção', 'Catálogo de serviços e produtos', 'Dashboard financeiro completo', 'Contas a pagar e receber', 'Agenda e agendamentos', 'Atividades e tarefas', 'Dashboard geral do negócio'] },
  { name: 'Profissional', desc: '+ produção + IA + Marketing', price: 'R$747', period: '/mês', featured: true, url: '/login', cta: 'Começar grátis', items: ['Tudo do Essencial', 'Até 10 usuários', 'Produção / PCP completo', 'Gestão de estoque e materiais', 'Gestão de funcionários', 'Análise financeira avançada (margem, inadimplência, ticket médio)', 'Conciliação bancária', 'Faturação certificada (NF-e)', 'Consultor de Negócios IA', 'Marketing: funil, campanhas, calendário', 'Mídia paga (Meta/Google Ads + GA4)', 'Relatórios de marketing e ROI'] },
  { name: 'Enterprise', desc: '+ vendas em marketplace, automação e multi-unidade', price: 'R$1.997', period: '/mês', featured: false, url: 'https://wa.me/5511940527609', cta: 'Falar com consultor', items: ['Tudo do Profissional', '⸻ Canais de venda', 'E-commerce a partir do catálogo', 'Marketplaces (Mercado Livre, Shopee — em breve)', 'Chat unificado FB/IG/WhatsApp (em breve)', 'Anúncios Facebook e Google', '⸻ Operação em escala', 'Usuários ilimitados', 'Multi-posto (filiais)', 'White-label (marca própria)', 'Automação de marketing avançada', 'IA de atendimento (em breve)', 'Suporte prioritário'] },
]

const faqs = [
  { q: 'Preciso instalar alguma coisa?', a: 'Não. O SignPRO funciona 100% no navegador — celular, tablet ou computador. Basta acessar e usar.' },
  { q: 'O teste gratuito é realmente grátis?', a: 'Sim. 7 dias sem cartão de crédito. Se não gostar, não paga nada.' },
  { q: 'Posso usar no celular?', a: 'Sim, o sistema é totalmente responsivo. Funciona perfeitamente no celular como um app nativo.' },
  { q: 'Meus dados ficam seguros?', a: 'Usamos criptografia de ponta a ponta e servidores com redundância. Seus dados são exclusivamente seus.' },
  { q: 'Consigo importar meus clientes?', a: 'Sim. Você pode importar clientes via planilha CSV ou cadastrar manualmente de forma rápida.' },
  { q: 'Tem contrato de fidelidade?', a: 'Não. Cancele quando quiser, sem multa. Sem letras miúdas.' },
]
</script>
