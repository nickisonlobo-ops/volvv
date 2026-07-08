<template>
  <!-- FAB de menu (arrastavel) -->
  <button
    type="button"
    class="fab-btn lg:hidden"
    :class="menuAberto ? 'fab-btn--open' : ''"
    :style="{ background: 'var(--color-primary, #374151)', boxShadow: `0 8px 28px var(--glow-primary, rgba(55,65,81,0.45)), 0 2px 8px rgba(0,0,0,0.25)`, top: fabPos.top, left: fabPos.left, right: fabPos.right, bottom: fabPos.bottom }"
    @click="onFabClick"
    @touchstart.passive="onFabTouchStart"
    @touchmove.prevent="onFabTouchMove"
    @touchend="onFabTouchEnd"
  >
    <svg v-if="!menuAberto" class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
    <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Backdrop -->
  <Transition name="nav-fade">
    <div
      v-if="menuAberto"
      class="fixed inset-0 z-30 lg:hidden"
      style="background: rgba(0,0,0,0.50); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);"
      @click="menuAberto = false"
    />
  </Transition>

  <!-- Painel de navegação -->
  <Transition name="nav-slide-up">
    <div
      v-if="menuAberto"
      class="nav-panel lg:hidden"
      :style="{ background: 'var(--color-sidebar, #1f2937)', borderColor: 'var(--color-primary-border, rgba(255,255,255,0.10))' }"
    >
      <!-- Handle de drag visual -->
      <div class="nav-panel__handle" />

      <!-- Usuário + notificações + sair (movidos do header) -->
      <div class="nav-panel__user">
        <div class="nav-panel__avatar">{{ initials }}</div>
        <div class="nav-panel__user-info">
          <p class="nav-panel__hi">Olá,</p>
          <p class="nav-panel__name">{{ displayName }}</p>
        </div>
        <button type="button" class="nav-panel__icon-btn" @click="notifAberto = !notifAberto" aria-label="Notificações">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9A6 6 0 1 0 6 9c0 5-2.5 6.5-2.5 6.5h17S18 14 18 9zM10 19a2 2 0 0 0 4 0"/></svg>
          <span v-if="naoLidas > 0" class="nav-panel__notif-badge">{{ naoLidas > 9 ? '9+' : naoLidas }}</span>
        </button>
        <button type="button" class="nav-panel__icon-btn" @click="handleLogout" aria-label="Sair">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H5v16h4M14 8l4 4-4 4M18 12H9"/></svg>
        </button>
      </div>

      <!-- Lista de notificações (inline) -->
      <div v-if="notifAberto" class="nav-panel__notifs">
        <div class="nav-panel__notifs-head">
          <span class="text-xs font-bold text-white/90">Notificações</span>
          <button v-if="naoLidas > 0" type="button" class="text-[10px] font-bold" style="color: var(--color-primary, #fc6404)" @click="marcarTodasComoLidas">Marcar todas</button>
        </div>
        <div v-if="notificacoes.length === 0" class="py-6 text-center text-xs text-white/40">Nenhuma notificação</div>
        <button
          v-for="notif in notificacoes"
          :key="notif.id"
          type="button"
          class="nav-panel__notif-item"
          :style="notif.lida ? 'opacity:.55' : ''"
          @click="abrirNotificacao(notif)"
        >
          <span v-if="!notif.lida" class="nav-panel__notif-dot" />
          <div class="min-w-0 flex-1 text-left">
            <p class="text-xs font-bold text-white/90 truncate">{{ notif.titulo }}</p>
            <p class="text-[11px] text-white/50 truncate">{{ notif.mensagem }}</p>
            <p class="text-[10px] text-white/30 mt-0.5">{{ formatNotifTime(notif.created_at) }}</p>
          </div>
        </button>
      </div>

      <div class="nav-panel__grid" style="max-height: 65vh; overflow-y: auto;">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          exact-active-class="nav-item--active"
          class="nav-item"
          @click="menuAberto = false"
        >
          <div class="nav-item__icon-wrap">
            <AppNavIcon :name="item.icon" class="w-5 h-5" />
          </div>
          <span class="nav-item__label">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdmin } from '~/composables/useAdmin'
import { useAuth } from '~/composables/useAuth'
import { useNotificacoes } from '~/composables/useNotificacoes'
import { useGlobalOS } from '~/composables/useGlobalOS'
import { createSupabaseClient } from '~/lib/supabase'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'AppBottomNav' })

const { isAdminOrGerente } = useAdmin()
const menuAberto = ref(false)

// ── Usuário / notificações / logout (movidos do header no mobile) ──────
const router = useRouter()
const { logout } = useAuth()
const { notificacoes, naoLidas, carregarNotificacoes, marcarComoLida, marcarTodasComoLidas } = useNotificacoes()
const { abrirOS } = useGlobalOS()
const supabase = createSupabaseClient()

const userName = ref('')
const notifAberto = ref(false)

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  userName.value = user?.user_metadata?.full_name ?? user?.email ?? ''
  await carregarNotificacoes()
})

const displayName = computed(() => userName.value ? userName.value.split('@')[0] : '')
const initials = computed(() => {
  const name = userName.value
  if (!name) return 'U'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return (name[0] ?? 'U').toUpperCase()
})

function formatNotifTime(dataStr: string): string {
  if (!dataStr) return ''
  const data = new Date(dataStr)
  const diffMs = Date.now() - data.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMs / 3600000)
  const diffDias = Math.floor(diffMs / 86400000)
  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min atrás`
  if (diffHoras < 24) return `${diffHoras}h atrás`
  if (diffDias < 7) return `${diffDias}d atrás`
  return data.toLocaleDateString('pt-BR')
}

function abrirNotificacao(notif: any) {
  if (!notif.lida) marcarComoLida(notif.id)
  if (notif.link && notif.link.startsWith('os:')) {
    const osId = Number(notif.link.split(':')[1])
    if (osId) abrirOS(osId)
    menuAberto.value = false
    notifAberto.value = false
  }
}

async function handleLogout() {
  await logout()
  menuAberto.value = false
  await router.push('/login')
}

// FAB draggable
const fabPos = reactive({ top: 'auto', left: 'auto', right: '1.25rem', bottom: '1.25rem' })
let fabDragging = false
let fabMoved = false
let fabStartX = 0
let fabStartY = 0
let fabStartLeft = 0
let fabStartTop = 0

function onFabTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  const btn = e.currentTarget as HTMLElement
  const rect = btn.getBoundingClientRect()
  fabDragging = true
  fabMoved = false
  fabStartX = touch.clientX
  fabStartY = touch.clientY
  fabStartLeft = rect.left
  fabStartTop = rect.top
  // Switch to top/left positioning
  fabPos.top = rect.top + 'px'
  fabPos.left = rect.left + 'px'
  fabPos.right = 'auto'
  fabPos.bottom = 'auto'
}

function onFabTouchMove(e: TouchEvent) {
  if (!fabDragging) return
  const touch = e.touches[0]
  const dx = touch.clientX - fabStartX
  const dy = touch.clientY - fabStartY
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) fabMoved = true
  const newLeft = Math.max(0, Math.min(window.innerWidth - 56, fabStartLeft + dx))
  const newTop = Math.max(0, Math.min(window.innerHeight - 56, fabStartTop + dy))
  fabPos.left = newLeft + 'px'
  fabPos.top = newTop + 'px'
}

function onFabTouchEnd() {
  fabDragging = false
}

function onFabClick() {
  if (!fabMoved) menuAberto.value = !menuAberto.value
  fabMoved = false
}

const allNavItems = [
  // Principal
  { to: '/',                         icon: 'home',           label: 'Início',             minPerfil: 'all' },
  { to: '/chat',                     icon: 'chat',           label: 'WhatsApp',           minPerfil: 'all' },
  { to: '/agendamentos',             icon: 'calendar',       label: 'Agendamentos',       minPerfil: 'all' },
  { to: '/servicos',                 icon: 'sparkles',       label: 'Serviços',           minPerfil: 'all' },
  { to: '/clientes',                 icon: 'identification', label: 'Clientes',           minPerfil: 'all' },
  // Equipe
  { to: '/funcionarios',             icon: 'users',          label: 'Funcionários',       minPerfil: 'manager' },
  { to: '/atividades',               icon: 'clipboard',      label: 'Atividades',         minPerfil: 'all' },
  // Financeiro
  { to: '/financeiro',               icon: 'wallet',         label: 'Financeiro',         minPerfil: 'manager' },
  { to: '/contas-pagar',             icon: 'wallet',         label: 'Pagar / Receber',    minPerfil: 'manager' },
  { to: '/conciliacao-bancaria',     icon: 'wallet',         label: 'Conciliação',        minPerfil: 'manager' },
  // Produção
  { to: '/adesivos-orcamentos',      icon: 'document',       label: 'Orçamentos',         minPerfil: 'all' },
  { to: '/adesivos-ordens-servico',  icon: 'clipboard',      label: 'Ordens de Serviço',  minPerfil: 'all' },
  { to: '/producao',                 icon: 'clipboard',      label: 'Produção',           minPerfil: 'all' },
  { to: '/processos',                icon: 'clipboard',      label: 'Processos',          minPerfil: 'all' },
  { to: '/adesivos-catalogo',        icon: 'catalog',        label: 'Catálogo',           minPerfil: 'all' },
  { to: '/adesivos-materiais',       icon: 'layers',         label: 'Materiais',          minPerfil: 'all' },
  { to: '/adesivos-estoque',         icon: 'cube',           label: 'Estoque',            minPerfil: 'all' },
  { to: '/ecommerce',                icon: 'cart',           label: 'E-commerce',         minPerfil: 'manager' },
  // Inteligência
  { to: '/consultor',                icon: 'brain',          label: 'Consultor',          minPerfil: 'manager' },
  // Sistema
  { to: '/configuracoes',            icon: 'settings',       label: 'Configurações',      minPerfil: 'manager' },
]

const navItems = computed(() =>
  allNavItems.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value)
)
</script>

<style scoped>
/* ── FAB ─────────────────────────────────────────────────────────────── */
.fab-btn {
  position:    fixed;
  bottom:      1.25rem;
  right:       1.25rem;
  z-index:     40;
  width:       56px;
  height:      56px;
  border-radius: 9999px;
  border:      none;
  cursor:      pointer;
  display:     flex;
  align-items: center;
  justify-content: center;
  transition:  transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;
}
.fab-btn:hover   { transform: scale(1.08); }
.fab-btn:active  { transform: scale(0.94); }
.fab-btn--open   { transform: rotate(180deg) !important; }
.fab-btn--open:hover { transform: rotate(180deg) scale(1.06) !important; }

/* ── Painel ──────────────────────────────────────────────────────────── */
.nav-panel {
  position:    fixed;
  bottom:      5.5rem;
  left:        0.875rem;
  right:       0.875rem;
  z-index:     40;
  border-radius: 1.5rem;
  border:      1px solid;
  overflow:    hidden;
  box-shadow:  0 24px 60px rgba(0,0,0,0.40), 0 8px 20px rgba(0,0,0,0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-panel__handle {
  width:         2.5rem;
  height:        4px;
  border-radius: 9999px;
  background:    rgba(255,255,255,0.20);
  margin:        0.875rem auto 0;
}

/* ── Bloco de usuário (movido do header) ── */
.nav-panel__user {
  display:       flex;
  align-items:   center;
  gap:           0.75rem;
  padding:       0.875rem 1rem 0;
}
.nav-panel__avatar {
  width:            40px;
  height:           40px;
  border-radius:    9999px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  font-size:        0.8125rem;
  font-weight:      800;
  letter-spacing:   0.02em;
  flex-shrink:      0;
  color:            #fff;
  background:       var(--color-primary, #fc6404);
  box-shadow:       0 0 0 2px rgba(255,255,255,0.18);
  user-select:      none;
}
.nav-panel__user-info { flex: 1; min-width: 0; }
.nav-panel__hi {
  font-size:   0.6875rem;
  font-weight: 600;
  color:       rgba(255,255,255,0.45);
  line-height: 1;
}
.nav-panel__name {
  font-size:     0.9375rem;
  font-weight:   800;
  color:         rgba(255,255,255,0.95);
  line-height:   1.2;
  margin-top:    2px;
  white-space:   nowrap;
  overflow:      hidden;
  text-overflow: ellipsis;
}
.nav-panel__icon-btn {
  position:        relative;
  width:           40px;
  height:          40px;
  flex-shrink:     0;
  display:         flex;
  align-items:     center;
  justify-content: center;
  border-radius:   12px;
  color:           rgba(255,255,255,0.85);
  background:      rgba(255,255,255,0.06);
  border:          1px solid rgba(255,255,255,0.10);
  transition:      background 150ms;
}
.nav-panel__icon-btn:hover { background: rgba(255,255,255,0.12); }
.nav-panel__notif-badge {
  position:        absolute;
  top:             -3px;
  right:           -3px;
  min-width:       18px;
  height:          18px;
  padding:         0 4px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  border-radius:   9999px;
  background:      #ef4444;
  color:           #fff;
  font-size:       10px;
  font-weight:     700;
}

/* ── Lista de notificações inline ── */
.nav-panel__notifs {
  margin:        0.75rem 1rem 0;
  border-radius: 14px;
  background:    rgba(255,255,255,0.04);
  border:        1px solid rgba(255,255,255,0.08);
  overflow:      hidden;
  max-height:    45vh;
  overflow-y:    auto;
}
.nav-panel__notifs-head {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  padding:         0.625rem 0.875rem;
  border-bottom:   1px solid rgba(255,255,255,0.08);
}
.nav-panel__notif-item {
  display:       flex;
  gap:           0.625rem;
  width:         100%;
  padding:       0.625rem 0.875rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition:    background 150ms;
}
.nav-panel__notif-item:hover { background: rgba(255,255,255,0.05); }
.nav-panel__notif-dot {
  width:         8px;
  height:        8px;
  margin-top:    4px;
  flex-shrink:   0;
  border-radius: 9999px;
  background:    var(--color-primary, #fc6404);
}

.nav-panel__grid {
  display:               grid;
  grid-template-columns: repeat(4, 1fr);
  gap:                   0.375rem;
  padding:               1rem;
}

/* ── Item ────────────────────────────────────────────────────────────── */
.nav-item {
  display:         flex;
  flex-direction:  column;
  align-items:     center;
  justify-content: center;
  gap:             0.375rem;
  padding:         0.75rem 0.375rem;
  border-radius:   1rem;
  text-decoration: none;
  color:           var(--color-primary-text, #fff);
  opacity:         0.60;
  transition:      background 130ms ease, opacity 130ms ease, transform 130ms ease;
}
.nav-item:hover  { background: rgba(255,255,255,0.08); opacity: 0.90; }
.nav-item:active { transform: scale(0.93); }
.nav-item--active {
  background: rgba(255,255,255,0.14) !important;
  opacity:    1 !important;
}

.nav-item__icon-wrap {
  width:            40px;
  height:           40px;
  border-radius:    11px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  background:       rgba(255,255,255,0.08);
  transition:       background 130ms ease;
}
.nav-item--active .nav-item__icon-wrap {
  background: rgba(255,255,255,0.16);
}

.nav-item__label {
  font-size:   0.625rem;
  font-weight: 700;
  text-align:  center;
  line-height: 1.2;
  white-space: nowrap;
}

/* ── Transições ──────────────────────────────────────────────────────── */
.nav-slide-up-enter-active {
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;
}
.nav-slide-up-leave-active {
  transition: transform 200ms ease, opacity 180ms ease;
}
.nav-slide-up-enter-from,
.nav-slide-up-leave-to {
  transform: translateY(28px);
  opacity:   0;
}

.nav-fade-enter-active { transition: opacity 220ms ease; }
.nav-fade-leave-active { transition: opacity 180ms ease; }
.nav-fade-enter-from,
.nav-fade-leave-to     { opacity: 0; }
</style>
