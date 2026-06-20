<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 md:hidden border-t shadow-2xl"
    :style="{ background: 'var(--color-sidebar, #ffffff)', borderColor: 'var(--color-primary-border, rgba(236,72,153,0.3))' }"
  >
    <!-- Barra principal (5 itens + botão Mais) -->
    <div class="flex items-stretch h-16">
      <NuxtLink
        v-for="item in mainItems"
        :key="item.to"
        :to="item.to"
        exact-active-class="nav-item-active"
        class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors text-[10px] font-semibold nav-item"
        @click="menuAberto = false"
      >
        <AppNavIcon :name="item.icon" class="w-5 h-5 shrink-0" />
        <span class="whitespace-nowrap">{{ item.label }}</span>
      </NuxtLink>

      <!-- Botão Mais -->
      <button
        type="button"
        class="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors text-[10px] font-semibold nav-item"
        :class="{ 'nav-item-active': menuAberto }"
        @click="menuAberto = !menuAberto"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <span>Mais</span>
      </button>
    </div>

    <!-- Menu expandido -->
    <Transition name="slide-up">
      <div
        v-if="menuAberto"
        class="absolute bottom-16 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t shadow-xl"
        :style="{ background: 'var(--color-sidebar, #ffffff)', borderColor: 'var(--color-primary-border, rgba(236,72,153,0.3))' }"
      >
        <div class="p-4 space-y-1">
          <p class="text-[10px] font-bold uppercase tracking-widest px-3 py-2" style="color: var(--color-primary-text, #ffffff); opacity: 0.5">
            Todas as páginas
          </p>
          <NuxtLink
            v-for="item in allItems"
            :key="item.to"
            :to="item.to"
            exact-active-class="menu-item-active"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors menu-item"
            @click="menuAberto = false"
          >
            <AppNavIcon :name="item.icon" class="w-5 h-5 shrink-0" />
            <span class="text-sm font-medium">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>

  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="menuAberto"
      class="fixed inset-0 z-30 bg-black/30 md:hidden"
      @click="menuAberto = false"
    />
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdmin } from '~/composables/useAdmin'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'AppBottomNav' })

const { isAdminOrGerente } = useAdmin()
const menuAberto = ref(false)

// Itens principais visíveis na barra (máx 5)
const mainItems = [
  { to: '/',              icon: 'home',           label: 'Início' },
  { to: '/clientes',      icon: 'identification', label: 'Clientes' },
  { to: '/adesivos-ordens-servico', icon: 'clipboard', label: 'OS' },
  { to: '/adesivos-orcamentos', icon: 'document', label: 'Orçamentos' },
  { to: '/agendamentos',  icon: 'calendar',       label: 'Agenda' },
]

// Todos os itens no menu expandido
const allNavItems = [
  { to: '/',              icon: 'home',           label: 'Início',             minPerfil: 'all' },
  { to: '/agendamentos',  icon: 'calendar',       label: 'Agendamentos',       minPerfil: 'all' },
  { to: '/servicos',      icon: 'sparkles',       label: 'Serviços',           minPerfil: 'all' },
  { to: '/clientes',      icon: 'identification', label: 'Clientes',           minPerfil: 'all' },
  { to: '/estoque',       icon: 'package',        label: 'Estoque',            minPerfil: 'all' },
  { to: '/adesivos-orcamentos', icon: 'document', label: 'Orçamentos',         minPerfil: 'all' },
  { to: '/adesivos-ordens-servico', icon: 'clipboard', label: 'Ordens de Serviço', minPerfil: 'all' },
  { to: '/adesivos-catalogo', icon: 'catalog',    label: 'Catálogo',           minPerfil: 'all' },
  { to: '/adesivos-materiais', icon: 'layers',    label: 'Materiais',          minPerfil: 'all' },
  { to: '/adesivos-estoque', icon: 'cube',        label: 'Estoque Adesivos',   minPerfil: 'all' },
  { to: '/funcionarios',  icon: 'users',          label: 'Funcionários',       minPerfil: 'manager' },
  { to: '/atividades',    icon: 'clipboard',      label: 'Atividades',         minPerfil: 'all' },
  { to: '/financeiro',    icon: 'wallet',         label: 'Dashboard Financeiro', minPerfil: 'manager' },
  { to: '/contas-pagar',  icon: 'wallet',         label: 'Contas a Pagar',     minPerfil: 'manager' },
  { to: '/consultor',     icon: 'brain',          label: 'Consultor',          minPerfil: 'manager' },
  { to: '/configuracoes', icon: 'settings',       label: 'Configurações',      minPerfil: 'manager' },
]

const allItems = computed(() =>
  allNavItems.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value)
)
</script>

<style scoped>
.nav-item {
  color: var(--color-primary-text, #ffffff);
  opacity: 0.55;
}
.nav-item:hover {
  background: rgba(255,255,255,0.1);
  opacity: 0.85;
}
.nav-item-active {
  color: var(--color-primary-text, #ffffff) !important;
  background-color: rgba(255,255,255,0.15) !important;
  opacity: 1 !important;
}
.menu-item {
  color: var(--color-primary-text, #ffffff);
  opacity: 0.7;
}
.menu-item:hover {
  background: rgba(255,255,255,0.1);
  opacity: 1;
}
.menu-item-active {
  background: rgba(255,255,255,0.15) !important;
  opacity: 1 !important;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
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
