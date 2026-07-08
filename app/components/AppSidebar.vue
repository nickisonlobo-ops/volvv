<template>
  <aside
    class="sidebar hidden lg:flex"
    :class="expanded ? 'sidebar--expanded' : 'sidebar--collapsed'"
    :style="{ background: 'var(--color-sidebar, #101114)' }"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
  >
    <!-- Marca -->
    <div class="sidebar__brand" :class="expanded ? '' : 'sidebar__brand--collapsed'">
      <template v-if="config.logo_url">
        <img :src="config.logo_url" alt="Logo" class="w-9 h-9 object-contain rounded-lg shrink-0" />
        <Transition name="sidebar-label">
          <p v-if="expanded" class="sidebar__brand-name">{{ config.nome_empresa || 'SignPRO' }}</p>
        </Transition>
      </template>
      <template v-else>
        <span class="sidebar__logo-mark">S</span>
        <Transition name="sidebar-label">
          <div v-if="expanded" class="leading-none">
            <p class="sidebar__brand-name">
              <span class="text-white">{{ brandFirst }}</span><span class="sidebar__brand-accent">{{ brandSecond }}</span>
            </p>
            <p class="sidebar__brand-tagline">Signage <span class="sidebar__dot">•</span> Production <span class="sidebar__dot">•</span> Management</p>
          </div>
        </Transition>
      </template>
    </div>

    <!-- Navegação -->
    <nav class="sidebar__nav">
      <div v-for="section in navSections" :key="section.title" class="sidebar__section">
        <Transition name="sidebar-label">
          <p v-if="expanded" class="sidebar__section-title">{{ section.title }}</p>
        </Transition>
        <NuxtLink
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          class="sidebar__item"
          active-class="sidebar__item--active"
          @mouseenter="onItemMouseEnter($event, item.label)"
          @mouseleave="onItemMouseLeave"
        >
          <span class="sidebar__item-icon">
            <AppNavIcon :name="item.icon" class="w-[18px] h-[18px]" style="stroke-width: 1.7" />
          </span>
          <Transition name="sidebar-label">
            <span v-if="expanded" class="sidebar__item-label">{{ item.label }}</span>
          </Transition>
        </NuxtLink>
      </div>

      <!-- Atalhos Rápidos -->
      <div v-if="isAdminOrGerente" class="sidebar__section sidebar__section--shortcuts">
        <Transition name="sidebar-label">
          <p v-if="expanded" class="sidebar__section-title sidebar__section-title--chevron">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5l8 7-8 7"/></svg>
            Atalhos Rápidos
          </p>
        </Transition>
        <NuxtLink
          v-for="s in atalhos"
          :key="s.to"
          :to="s.to"
          class="sidebar__item"
          @mouseenter="onItemMouseEnter($event, s.label)"
          @mouseleave="onItemMouseLeave"
        >
          <span class="sidebar__item-icon"><AppNavIcon :name="s.icon" class="w-[17px] h-[17px]" style="stroke-width: 1.7" /></span>
          <Transition name="sidebar-label">
            <span v-if="expanded" class="sidebar__item-label">{{ s.label }}</span>
          </Transition>
        </NuxtLink>
      </div>
    </nav>

    <!-- Rodapé: usuário + notificações + ajuda -->
    <div class="sidebar__footer">
      <!-- Usuário -->
      <div class="sidebar__user" :class="expanded ? '' : 'sidebar__user--collapsed'">
        <div class="sidebar__avatar" :title="userName">{{ initials }}</div>
        <Transition name="sidebar-label">
          <div v-if="expanded" class="sidebar__user-info">
            <p class="sidebar__user-hi">Olá,</p>
            <p class="sidebar__user-name">{{ displayName }}</p>
          </div>
        </Transition>

        <template v-if="expanded">
          <!-- Notificações -->
          <button type="button" class="sidebar__icon-btn" title="Notificações" @click="notifAberto = !notifAberto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9A6 6 0 1 0 6 9c0 5-2.5 6.5-2.5 6.5h17S18 14 18 9zM10 19a2 2 0 0 0 4 0"/></svg>
            <span v-if="naoLidas > 0" class="sidebar__notif-badge">{{ naoLidas > 9 ? '9+' : naoLidas }}</span>
          </button>
          <!-- Sair -->
          <button type="button" class="sidebar__icon-btn" title="Sair" @click="handleLogout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4H5v16h4M14 8l4 4-4 4M18 12H9"/></svg>
          </button>
        </template>
      </div>

      <!-- Central de Ajuda -->
      <NuxtLink to="/configuracoes" class="sidebar__help" :class="expanded ? '' : 'sidebar__help--collapsed'">
        <span class="sidebar__help-icon">?</span>
        <Transition name="sidebar-label">
          <span v-if="expanded" class="sidebar__help-label">Central de Ajuda</span>
        </Transition>
      </NuxtLink>
    </div>

    <!-- Dropdown de notificações (teleportado) -->
    <Teleport to="body">
      <Transition name="sidebar-tooltip">
        <div v-if="notifAberto" class="sidebar__notif-panel">
          <div class="sidebar__notif-head">
            <span class="text-sm font-bold" style="color:#0f1216">Notificações</span>
            <button v-if="naoLidas > 0" type="button" class="text-[10px] font-bold" style="color:#fc6404" @click="marcarTodasComoLidas">Marcar todas como lidas</button>
          </div>
          <div class="sidebar__notif-list">
            <div v-if="notificacoes.length === 0" class="py-8 text-center text-sm" style="color:#9aa1ab">Nenhuma notificação</div>
            <div
              v-for="notif in notificacoes"
              :key="notif.id"
              class="sidebar__notif-item"
              :style="notif.lida ? 'opacity:.6' : ''"
              @click="abrirNotificacao(notif)"
            >
              <div class="sidebar__notif-dot-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fc6404" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9A6 6 0 1 0 6 9c0 5-2.5 6.5-2.5 6.5h17S18 14 18 9zM10 19a2 2 0 0 0 4 0"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold truncate" style="color:#0f1216">{{ notif.titulo }}</p>
                <p class="text-[11px] truncate" style="color:#6b7079">{{ notif.mensagem }}</p>
                <p class="text-[10px] mt-0.5" style="color:#9aa1ab">{{ formatNotifTime(notif.created_at) }}</p>
              </div>
              <span v-if="!notif.lida" class="w-2 h-2 rounded-full shrink-0 mt-1.5" style="background:#fc6404" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <div v-if="notifAberto" class="sidebar__notif-overlay" @click="notifAberto = false" />

    <!-- Tooltip (teleportado, aparece quando recolhida) -->
    <Teleport to="body">
      <Transition name="sidebar-tooltip">
        <div
          v-if="tooltip.visible && !expanded"
          class="sidebar__tooltip"
          :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }"
          role="tooltip"
        >
          {{ tooltip.text }}
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdmin } from '~/composables/useAdmin'
import { usePersonalizacao } from '~/composables/usePersonalizacao'
import { useAuth } from '~/composables/useAuth'
import { useNotificacoes } from '~/composables/useNotificacoes'
import { useGlobalOS } from '~/composables/useGlobalOS'
import { createSupabaseClient } from '~/lib/supabase'
import AppNavIcon from '~/components/AppNavIcon.vue'

defineOptions({ name: 'AppSidebar' })

const expanded = ref(false)
const router = useRouter()
const { isAdminOrGerente } = useAdmin()
const { config } = usePersonalizacao()
const { logout } = useAuth()
const { notificacoes, naoLidas, carregarNotificacoes, marcarComoLida, marcarTodasComoLidas } = useNotificacoes()
const { abrirOS } = useGlobalOS()
const supabase = createSupabaseClient()

// ── Usuário logado ─────────────────────────────────────────────────
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
  notifAberto.value = false
  if (notif.link && notif.link.startsWith('os:')) {
    const osId = Number(notif.link.split(':')[1])
    if (osId) abrirOS(osId)
  }
}

async function handleLogout() {
  await logout()
  await router.push('/login')
}

// ── Tooltip (só quando recolhida) ──────────────────────────────────
const tooltip = reactive({ visible: false, text: '', top: 0, left: 0 })
let tooltipTimer: ReturnType<typeof setTimeout> | null = null

function onItemMouseEnter(event: MouseEvent, label: string) {
  if (expanded.value) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  if (tooltipTimer) clearTimeout(tooltipTimer)
  tooltipTimer = setTimeout(() => {
    tooltip.text = label
    tooltip.top = rect.top + rect.height / 2
    tooltip.left = rect.right + 12
    tooltip.visible = true
  }, 300)
}
function onItemMouseLeave() {
  if (tooltipTimer) { clearTimeout(tooltipTimer); tooltipTimer = null }
  tooltip.visible = false
}

// Divide o nome em duas partes para o efeito de destaque (ex.: "Sign" + "PRO")
const brandName = computed(() => config.value.nome_empresa || 'SignPRO')
const brandFirst = computed(() => {
  const n = brandName.value
  if (n.length <= 4) return n
  return n.slice(0, Math.ceil(n.length / 2))
})
const brandSecond = computed(() => {
  const n = brandName.value
  if (n.length <= 4) return ''
  return n.slice(Math.ceil(n.length / 2))
})

const allNavSections = [
  {
    title: 'Principal',
    items: [
      { to: '/', icon: 'home', label: 'Início', minPerfil: 'all' },
      { to: '/chat', icon: 'chat', label: 'WhatsApp', minPerfil: 'all' },
      { to: '/agendamentos', icon: 'calendar', label: 'Agendamentos', minPerfil: 'all' },
      { to: '/servicos', icon: 'sparkles', label: 'Serviços', minPerfil: 'all' },
      { to: '/clientes', icon: 'identification', label: 'Clientes', minPerfil: 'all' },
    ],
  },
  {
    title: 'Equipe',
    items: [
      { to: '/funcionarios', icon: 'users', label: 'Funcionários', minPerfil: 'manager' },
      { to: '/atividades', icon: 'clipboard', label: 'Atividades', minPerfil: 'all' },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { to: '/financeiro', icon: 'wallet', label: 'Dashboard Financeiro', minPerfil: 'manager' },
      { to: '/contas-pagar', icon: 'wallet', label: 'Pagar / Receber', minPerfil: 'manager' },
      { to: '/conciliacao-bancaria', icon: 'wallet', label: 'Conciliação Bancária', minPerfil: 'manager' },
    ],
  },
  {
    title: 'Produção',
    items: [
      { to: '/adesivos-orcamentos', icon: 'document', label: 'Orçamentos', minPerfil: 'all' },
      { to: '/adesivos-ordens-servico', icon: 'clipboard', label: 'Ordens de Serviço', minPerfil: 'all' },
      { to: '/producao', icon: 'clipboard', label: 'Produção', minPerfil: 'all' },
      { to: '/processos', icon: 'clipboard', label: 'Processos', minPerfil: 'all' },
      { to: '/adesivos-catalogo', icon: 'catalog', label: 'Catálogo', minPerfil: 'all' },
      { to: '/adesivos-materiais', icon: 'layers', label: 'Materiais', minPerfil: 'all' },
      { to: '/adesivos-estoque', icon: 'cube', label: 'Estoque', minPerfil: 'all' },
      { to: '/ecommerce', icon: 'cart', label: 'E-commerce', minPerfil: 'manager' },
    ],
  },
  {
    title: 'Inteligência',
    items: [
      { to: '/marketing', icon: 'megaphone', label: 'Marketing', minPerfil: 'manager' },
      { to: '/consultor', icon: 'brain', label: 'Consultor de Negócios', minPerfil: 'manager' },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { to: '/configuracoes', icon: 'settings', label: 'Configurações', minPerfil: 'manager' },
    ],
  },
]

const atalhos = [
  { to: '/adesivos-ordens-servico', icon: 'clipboard', label: 'Nova OS' },
  { to: '/adesivos-orcamentos', icon: 'document', label: 'Novo Orçamento' },
  { to: '/clientes', icon: 'users', label: 'Novo Cliente' },
  { to: '/financeiro', icon: 'wallet', label: 'Relatório Financeiro' },
]

const navSections = computed(() =>
  allNavSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.minPerfil === 'all' || isAdminOrGerente.value),
    }))
    .filter(section => section.items.length > 0)
)
</script>

<style scoped>
.sidebar {
  flex-shrink:    0;
  flex-direction: column;
  min-height:     0;
  height:         100vh;
  overflow:       hidden;
  border-right:   1px solid rgba(255,255,255,0.05);
  position:       relative;
  transition:     width 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar--collapsed { width: 72px; }
.sidebar--expanded  { width: 240px; }

/* ── Brand ─────────────────────────────────────────────────────────── */
.sidebar__brand {
  display:      flex;
  align-items:  center;
  gap:          10px;
  height:       68px;
  padding:      0 16px;
  flex-shrink:  0;
  overflow:     hidden;
}
.sidebar__brand--collapsed { justify-content: center; padding: 0; }
.sidebar__logo-mark {
  font-size:        34px;
  font-weight:      900;
  font-style:       italic;
  line-height:      1;
  letter-spacing:   -2px;
  background:       linear-gradient(160deg, #fb923c, #ea580c);
  -webkit-background-clip: text;
  background-clip:  text;
  color:            transparent;
  transform:        translateY(-1px);
  flex-shrink:      0;
}
.sidebar__brand-name {
  font-size:      19px;
  font-weight:    800;
  letter-spacing: -0.4px;
  white-space:    nowrap;
  color:          #fff;
}
.sidebar__brand-accent {
  background:       linear-gradient(120deg, #fb923c, #fc6404);
  -webkit-background-clip: text;
  background-clip:  text;
  color:            transparent;
}
.sidebar__brand-tagline {
  font-size:      6.8px;
  letter-spacing: 0.4px;
  color:          #8b95a3;
  margin-top:     3px;
  white-space:    nowrap;
}
.sidebar__dot { color: #fc6404; }

/* ── Nav ────────────────────────────────────────────────────────────── */
.sidebar__nav {
  flex:       1;
  padding:    10px 12px 8px;
  display:    flex;
  flex-direction: column;
  gap:        14px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
}
.sidebar__nav::-webkit-scrollbar { width: 3px; }
.sidebar__nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
.sidebar__nav::-webkit-scrollbar-track { background: transparent; }

.sidebar__section {
  display:        flex;
  flex-direction: column;
  gap:            2px;
}
.sidebar__section--shortcuts {
  margin-top:  6px;
  padding-top: 14px;
  border-top:  1px solid rgba(255,255,255,0.06);
}
.sidebar__section-title {
  font-size:      10px;
  font-weight:    700;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  padding:        0 13px;
  margin-bottom:  4px;
  color:          #7d8694;
  white-space:    nowrap;
}
.sidebar__section-title--chevron {
  display:     flex;
  align-items: center;
  gap:         6px;
}

/* ── Item ───────────────────────────────────────────────────────────── */
.sidebar__item {
  position:        relative;
  display:         flex;
  align-items:     center;
  gap:             13px;
  padding:         10px 13px;
  border-radius:   12px;
  text-decoration: none;
  color:           #b9c0c9;
  font-weight:     500;
  font-size:       13.5px;
  white-space:     nowrap;
  min-height:      40px;
  transition:      background 130ms ease, color 130ms ease;
}
.sidebar--collapsed .sidebar__item { justify-content: center; gap: 0; padding: 10px; }
.sidebar__item:hover {
  background: rgba(255,255,255,0.045);
  color:      #e5e7eb;
}
.sidebar__item--active {
  background:  rgba(255,255,255,0.07);
  color:       #fff;
  font-weight: 700;
}
.sidebar__item--active::before {
  content:       '';
  position:      absolute;
  left:          0;
  top:           9px;
  bottom:        9px;
  width:         3.5px;
  border-radius: 0 2px 2px 0;
  background:    #fff;
}
.sidebar__item-icon {
  display:         flex;
  align-items:     center;
  justify-content: center;
  flex-shrink:     0;
  color:           #9aa4b2;
}
.sidebar__item:hover .sidebar__item-icon { color: #cbd2db; }
.sidebar__item--active .sidebar__item-icon { color: var(--color-primary, #fc6404); }
.sidebar__item-label {
  flex:          1;
  overflow:      hidden;
  text-overflow: ellipsis;
}
.sidebar__badge {
  margin-left:     auto;
  background:      var(--color-primary, #fc6404);
  color:           #fff;
  font-size:       10.5px;
  font-weight:     700;
  min-width:       20px;
  height:          20px;
  border-radius:   10px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  padding:         0 5px;
}

/* ── Footer / Central de Ajuda ──────────────────────────────────────── */
.sidebar__footer {
  padding:     12px 14px 16px;
  flex-shrink: 0;
}
.sidebar__help {
  display:         flex;
  align-items:     center;
  gap:             12px;
  padding:         15px 14px;
  border-radius:   14px;
  border:          1px solid rgba(255,255,255,0.08);
  color:           #e2e6eb;
  font-weight:     600;
  font-size:       13.5px;
  text-decoration: none;
  overflow:        hidden;
  transition:      background 130ms ease;
}
.sidebar__help--collapsed { justify-content: center; padding: 12px 0; }
.sidebar__help:hover { background: rgba(255,255,255,0.04); }
.sidebar__help-icon {
  width:           26px;
  height:          26px;
  flex-shrink:     0;
  border-radius:   50%;
  background:      rgba(255,255,255,0.09);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #c7cdd6;
  font-size:       13px;
  font-weight:     700;
}
.sidebar__help-label { white-space: nowrap; }

/* ── Usuário ─────────────────────────────────────────────────────────── */
.sidebar__user {
  display:       flex;
  align-items:   center;
  gap:           10px;
  padding:       6px 8px;
  margin-bottom: 10px;
  border-radius: 12px;
  overflow:      hidden;
}
.sidebar__user--collapsed { justify-content: center; padding: 6px 0; }
.sidebar__avatar {
  width:           34px;
  height:          34px;
  flex-shrink:     0;
  border-radius:   50%;
  background:      #1b1d21;
  border:          1.5px solid rgba(255,255,255,0.2);
  display:         flex;
  align-items:     center;
  justify-content: center;
  color:           #fff;
  font-weight:     700;
  font-size:       13.5px;
  user-select:     none;
}
.sidebar__user-info { min-width: 0; line-height: 1.15; }
.sidebar__user-hi { font-size: 10.5px; color: #8b95a3; }
.sidebar__user-name {
  font-size:      13px;
  font-weight:    700;
  color:          #fff;
  white-space:    nowrap;
  overflow:       hidden;
  text-overflow:  ellipsis;
  max-width:      88px;
}
.sidebar__icon-btn {
  position:        relative;
  width:           32px;
  height:          32px;
  flex-shrink:     0;
  border:          none;
  background:      transparent;
  border-radius:   9px;
  color:           #b9c0c9;
  display:         flex;
  align-items:     center;
  justify-content: center;
  cursor:          pointer;
  transition:      background 130ms ease, color 130ms ease;
}
.sidebar__icon-btn:hover { background: rgba(255,255,255,0.07); color: #fff; }
.sidebar__notif-badge {
  position:        absolute;
  top:             -2px;
  right:           -2px;
  min-width:       16px;
  height:          16px;
  padding:         0 4px;
  border-radius:   8px;
  background:      #fc6404;
  color:           #fff;
  font-size:       9.5px;
  font-weight:     700;
  display:         flex;
  align-items:     center;
  justify-content: center;
}

/* ── Transição dos labels ────────────────────────────────────────────── */
.sidebar-label-enter-active { transition: opacity 160ms ease 80ms, transform 160ms ease 80ms; }
.sidebar-label-leave-active { transition: opacity 80ms ease, transform 80ms ease; }
.sidebar-label-enter-from,
.sidebar-label-leave-to { opacity: 0; transform: translateX(-6px); }
</style>

<!-- Tooltip (não-scoped, teleportado para body) -->
<style>
.sidebar__tooltip {
  position:       fixed;
  transform:      translateY(-50%);
  padding:        6px 12px;
  font-size:      12px;
  font-weight:    500;
  white-space:    nowrap;
  color:          #fff;
  background:     rgba(15, 23, 42, 0.92);
  border-radius:  6px;
  box-shadow:     0 4px 12px -2px rgb(0 0 0 / 0.2);
  pointer-events: none;
  z-index:        9999;
}
.sidebar__tooltip::before {
  content:            '';
  position:           absolute;
  right:              100%;
  top:                50%;
  transform:          translateY(-50%);
  border:             5px solid transparent;
  border-right-color: rgba(15, 23, 42, 0.92);
}
.sidebar-tooltip-enter-active { transition: opacity 150ms ease; }
.sidebar-tooltip-leave-active { transition: opacity 100ms ease; }
.sidebar-tooltip-enter-from,
.sidebar-tooltip-leave-to { opacity: 0; }

/* ── Painel de notificações (teleportado) ─────────────────────────────── */
.sidebar__notif-overlay {
  position: fixed;
  inset:    0;
  z-index:  9998;
}
.sidebar__notif-panel {
  position:      fixed;
  left:          16px;
  bottom:        88px;
  width:         320px;
  max-width:     calc(100vw - 32px);
  background:    #fff;
  border:        1px solid #ececea;
  border-radius: 16px;
  box-shadow:    0 12px 40px rgba(0,0,0,0.25);
  overflow:      hidden;
  z-index:       9999;
}
.sidebar__notif-head {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  padding:         12px 16px;
  border-bottom:   1px solid #f1f1ef;
}
.sidebar__notif-list { max-height: 340px; overflow-y: auto; }
.sidebar__notif-item {
  display:       flex;
  gap:           12px;
  padding:       12px 16px;
  border-bottom: 1px solid #f6f6f4;
  cursor:        pointer;
  transition:    background 120ms ease;
}
.sidebar__notif-item:hover { background: #f7f7f5; }
.sidebar__notif-dot-icon {
  width:           32px;
  height:          32px;
  flex-shrink:     0;
  border-radius:   50%;
  background:      #fdeee2;
  display:         flex;
  align-items:     center;
  justify-content: center;
}
</style>
