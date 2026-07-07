<template>
  <header
    class="app-header"
    :class="headerHeight"
    :style="{ background: 'var(--color-sidebar, #1f2937)' }"
  >
    <!-- Logo / Brand -->
    <div class="app-header__brand">
      <div
        v-if="!config.logo_url"
        class="app-header__logo-icon"
      >
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true" :style="{ color: 'var(--color-primary-text, #ffffff)' }">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
      <img
        v-else
        :src="config.logo_url"
        alt="Logo"
        class="rounded-xl object-contain"
        :style="{ width: headerLogoPx + 'px', height: headerLogoPx + 'px' }"
      />
      <span class="app-header__company-name hidden sm:block" :style="{ color: 'var(--color-primary-text, #fff)' }">
        {{ config.nome_empresa }}
      </span>
    </div>

    <!-- Ações do usuário -->
    <div class="app-header__actions">
      <span class="hidden sm:block app-header__greeting" :style="{ color: 'var(--color-primary-text, #fff)' }">
        Olá, {{ displayName }}
      </span>

      <!-- Toggle Dark/Light -->
      <button
        type="button"
        class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
        :style="{ color: 'var(--color-primary-text, #fff)' }"
        :title="isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
        @click="toggleTheme"
      >
        <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
      </button>

      <!-- Notificações -->
      <div class="relative">
        <button
          type="button"
          class="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          :style="{ color: 'var(--color-primary-text, #fff)' }"
          @click="notifAberto = !notifAberto"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
          <span v-if="naoLidas > 0" class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">{{ naoLidas > 9 ? '9+' : naoLidas }}</span>
        </button>

        <!-- Dropdown notificações -->
        <div v-if="notifAberto" class="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span class="text-sm font-bold text-gray-800">Notificações</span>
            <button v-if="naoLidas > 0" type="button" class="text-[10px] font-bold text-primary hover:underline" @click="marcarTodasComoLidas">Marcar todas como lidas</button>
          </div>
          <div class="max-h-[320px] overflow-y-auto">
            <div v-if="notificacoes.length === 0" class="py-8 text-center text-sm text-gray-400">Nenhuma notificação</div>
            <div
              v-for="notif in notificacoes"
              :key="notif.id"
              class="flex gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
              :class="notif.lida ? 'opacity-60' : ''"
              @click="abrirNotificacao(notif)"
            >
              <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-gray-800 truncate">{{ notif.titulo }}</p>
                <p class="text-[11px] text-gray-500 truncate">{{ notif.mensagem }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ formatNotifTime(notif.created_at) }}</p>
              </div>
              <span v-if="!notif.lida" class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
            </div>
          </div>
        </div>
      </div>

      <!-- Avatar -->
      <div
        class="app-header__avatar"
        :style="{ background: 'var(--color-primary, #374151)', color: 'var(--color-primary-text, #fff)' }"
        :title="userName"
      >
        {{ initials }}
      </div>

      <!-- Botão sair -->
      <button
        type="button"
        class="app-header__logout"
        :style="{ color: 'var(--color-primary-text, #fff)' }"
        @click="handleLogout"
      >
        <span class="hidden sm:inline">Sair</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { usePersonalizacao } from '~/composables/usePersonalizacao'
import { useNotificacoes } from '~/composables/useNotificacoes'
import { useGlobalOS } from '~/composables/useGlobalOS'
import { createSupabaseClient } from '~/lib/supabase'

defineOptions({ name: 'AppHeader' })

const router = useRouter()
const { logout } = useAuth()
const supabase = createSupabaseClient()
const { config, isDark, toggleTheme } = usePersonalizacao()
const { notificacoes, naoLidas, carregarNotificacoes, marcarComoLida, marcarTodasComoLidas } = useNotificacoes()
const { abrirOS } = useGlobalOS()

const notifAberto = ref(false)

function formatNotifTime(dataStr: string): string {
  if (!dataStr) return ''
  const data = new Date(dataStr)
  const agora = new Date()
  const diffMs = agora.getTime() - data.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMs / 3600000)
  const diffDias = Math.floor(diffMs / 86400000)
  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min atrás`
  if (diffHoras < 24) return `${diffHoras}h atrás`
  if (diffDias < 7) return `${diffDias}d atrás`
  return data.toLocaleDateString('pt-BR')
}

function logoSizeToPx(s: string): number {
  const num = parseInt(s)
  if (!isNaN(num)) return num
  switch (s) {
    case 'sm':  return 28
    case 'lg':  return 44
    case 'xl':  return 56
    case '2xl': return 72
    default:    return 32
  }
}

const headerLogoPx = computed(() => logoSizeToPx(config.value.logo_size))

const userName = ref('')
const diasRestantesTrial = ref<number | null>(null)

const headerHeight = computed(() => {
  if (!config.value.logo_url) return 'h-16'
  const px = headerLogoPx.value
  if (px <= 28) return 'h-14'
  if (px <= 32) return 'h-16'
  if (px <= 44) return 'h-[4.5rem]'
  if (px <= 56) return 'h-20'
  if (px <= 72) return 'h-24'
  return 'h-28'
})

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  userName.value = user?.user_metadata?.full_name ?? user?.email ?? ''
  await carregarNotificacoes()

  const perfil = user?.user_metadata?.perfil as string | undefined
  if (perfil !== 'funcionario') {
    let empresaId = (user?.user_metadata?.empresa_id as number | null) ?? null
    if (!empresaId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user!.id)
        .maybeSingle()
      empresaId = profile?.empresa_id ?? null
    }
    if (empresaId) {
      const { data: rows } = await supabase.rpc('get_empresa_plano', { p_empresa_id: empresaId })
      const info = rows?.[0]
      if (info && info.plano === 'trial' && info.trial_end) {
        const diffDias = Math.ceil((new Date(info.trial_end).getTime() - Date.now()) / 86400000)
        if (diffDias >= 0) diasRestantesTrial.value = diffDias
      }
    }
  }
})

const displayName = computed(() => {
  if (!userName.value) return ''
  return userName.value.split('@')[0]
})

const initials = computed(() => {
  const name = userName.value
  if (!name) return 'U'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
  return (name[0] ?? 'U').toUpperCase()
})

async function handleLogout() {
  await logout()
  await router.push('/login')
}

function abrirNotificacao(notif: any) {
  if (!notif.lida) marcarComoLida(notif.id)
  notifAberto.value = false
  // Se tem link do tipo "os:123", abrir o modal da OS diretamente
  if (notif.link && notif.link.startsWith('os:')) {
    const osId = Number(notif.link.split(':')[1])
    if (osId) abrirOS(osId)
  }
}
</script>

<style scoped>
.app-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  padding:         0 1.25rem;
  flex-shrink:     0;
  z-index:         30;
  border-bottom:   1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  gap:             0.5rem;
}

@media (min-width: 640px) {
  .app-header { padding: 0 1.5rem; }
}

.app-header__brand {
  display:     flex;
  align-items: center;
  gap:         0.625rem;
  min-width:   0;
}
.app-header__logo-icon {
  width:            36px;
  height:           36px;
  border-radius:    10px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  flex-shrink:      0;
  background:       rgba(255,255,255,0.10);
  border:           1px solid rgba(255,255,255,0.10);
}
.app-header__company-name {
  font-size:      0.9375rem;
  font-weight:    800;
  letter-spacing: -0.01em;
  white-space:    nowrap;
  overflow:       hidden;
  text-overflow:  ellipsis;
  opacity:        0.92;
}

.app-header__actions {
  display:     flex;
  align-items: center;
  gap:         0.5rem;
}
.app-header__greeting {
  font-size:   0.875rem;
  font-weight: 500;
  opacity:     0.70;
  white-space: nowrap;
}

.app-header__avatar {
  width:            34px;
  height:           34px;
  border-radius:    9999px;
  display:          flex;
  align-items:      center;
  justify-content:  center;
  font-size:        0.75rem;
  font-weight:      800;
  letter-spacing:   0.02em;
  flex-shrink:      0;
  box-shadow:       0 0 0 2px rgba(255,255,255,0.18);
  cursor:           default;
  user-select:      none;
}

.app-header__logout {
  display:     flex;
  align-items: center;
  gap:         0.375rem;
  font-size:   0.8125rem;
  font-weight: 600;
  padding:     0.375rem 0.75rem;
  border-radius: 0.625rem;
  opacity:     0.60;
  transition:  opacity 150ms, background 150ms;
  cursor:      pointer;
  border:      none;
  background:  transparent;
}
.app-header__logout:hover {
  opacity:    1;
  background: rgba(255,255,255,0.10);
}

</style>
