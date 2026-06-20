<template>
  <!-- Botão flutuante de menu (FAB) -->
  <button
    type="button"
    class="fixed bottom-5 right-5 z-40 md:hidden w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300"
    :style="{ background: 'var(--color-primary, #374151)' }"
    :class="menuAberto ? 'rotate-45 scale-90' : 'hover:scale-110'"
    @click="menuAberto = !menuAberto"
  >
    <svg v-if="!menuAberto" class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
    <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="menuAberto"
      class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
      @click="menuAberto = false"
    />
  </Transition>

  <!-- Menu expandido (grid de ícones) -->
  <Transition name="slide-up">
    <div
      v-if="menuAberto"
      class="fixed bottom-24 left-4 right-4 z-40 md:hidden rounded-3xl shadow-2xl overflow-hidden"
      :style="{ background: 'var(--color-sidebar, #ffffff)' }"
    >
      <div class="p-5">
        <div class="grid grid-cols-4 gap-3">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            exact-active-class="menu-icon-active"
            class="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all duration-150 menu-icon"
            @click="menuAberto = false"
          >
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: rgba(255,255,255,0.1)">
              <AppNavIcon :name="item.icon" class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-semibold text-center leading-tight whitespace-nowrap">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'AppBottomNav' })

const { isAdminOrGerente } = useAdmin()
const menuAberto = ref(false)

const allNavItems = [
  { to: '/',              icon: 'home',           label: 'Início',        minPerfil: 'all' },
  { to: '/agendamentos',  icon: 'calendar',       label: 'Agenda',        minPerfil: 'all' },
  { to: '/clientes',      icon: 'identification', label: 'Clientes',      minPerfil: 'all' },
  { to: '/adesivos-ordens-servico', icon: 'clipboard', label: 'OS',       minPerfil: 'all' },
  { to: '/adesivos-orcamentos', icon: 'document', label: 'Orçamentos',    minPerfil: 'all' },
  { to: '/servicos',      icon: 'sparkles',       label: 'Serviços',      minPerfil: 'all' },
  { to: '/estoque',       icon: 'package',        label: 'Estoque',       minPerfil: 'all' },
  { to: '/adesivos-catalogo', icon: 'catalog',    label: 'Catálogo',      minPerfil: 'all' },
  { to: '/adesivos-materiais', icon: 'layers',    label: 'Materiais',     minPerfil: 'all' },
  { to: '/adesivos-estoque', icon: 'cube',        label: 'Estoque AD',    minPerfil: 'all' },
  { to: '/atividades',    icon: 'clipboard',      label: 'Atividades',    minPerfil: 'all' },
  { to: '/funcionarios',  icon: 'users',          label: 'Equipe',        minPerfil: 'manager' },
  { to: '/financeiro',    icon: 'wallet',         label: 'Financeiro',    minPerfil: 'manager' },
  { to: '/contas-pagar',  icon: 'wallet',         label: 'Contas',        minPerfil: 'manager' },
  { to: '/consultor',     icon: 'brain',          label: 'Consultor',     minPerfil: 'manager' },
  { to: '/configuracoes', icon: 'settings',       label: 'Config',        minPerfil: 'manager' },
]

const navItems = computed(() =>
  allNavItems.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value)
)
</script>

<style scoped>
.menu-icon {
  color: var(--color-primary-text, #ffffff);
  opacity: 0.75;
}
.menu-icon:hover {
  background: rgba(255,255,255,0.1);
  opacity: 1;
}
.menu-icon:active {
  transform: scale(0.92);
}
.menu-icon-active {
  background: rgba(255,255,255,0.15) !important;
  opacity: 1 !important;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
