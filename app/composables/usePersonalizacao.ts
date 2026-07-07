import { useState } from '#app'
import { computed, ref } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import { useEmpresa } from './useEmpresa'

export type ThemeMode = 'light' | 'dark'

// ─── Marca fixa (accent) ────────────────────────────────────────────────
// Cor única da marca — usada em botões, links e realces em ambos os modos.
export const BRAND = {
  primary:      '#f97316', // orange-500
  primaryDark:  '#ea580c', // orange-600 (hover)
  primaryText:  '#ffffff',
}

// ─── Paletas de superfície por modo ─────────────────────────────────────
interface Surface {
  bg: string
  sidebar: string
  card: string
  cardTexto: string
  cardBorder: string
  icon: string
}

const SURFACES: Record<ThemeMode, Surface> = {
  light: {
    bg:         '#f8fafc',
    sidebar:    '#0f172a',
    card:       '#ffffff',
    cardTexto:  '#1e293b',
    cardBorder: 'rgba(0,0,0,0.06)',
    icon:       '#ffffff',
  },
  dark: {
    bg:         '#0b0e14',
    sidebar:    '#111318',
    card:       '#181b22',
    cardTexto:  '#e5e7eb',
    cardBorder: 'rgba(255,255,255,0.08)',
    icon:       '#e5e7eb',
  },
}

// Escala do accent (orange do Tailwind) — fixa nos dois modos
const PRIMARY_SCALE: Record<string, string> = {
  '50':  '#fff7ed',
  '100': '#ffedd5',
  '200': '#fed7aa',
  '300': '#fdba74',
  '400': '#fb923c',
  '500': '#f97316',
  '600': '#ea580c',
  '700': '#c2410c',
  '800': '#9a3412',
  '900': '#7c2d12',
}

/**
 * Configuração da empresa. As cores livres/gradientes foram removidas:
 * o sistema agora usa apenas os modos `light`/`dark` com a marca fixa.
 * Os campos `cor_*` permanecem como DERIVADOS do modo, para compatibilidade
 * com telas que ainda os leem diretamente (os-print, catálogo público).
 */
export interface PersonalizacaoConfig {
  pais: string
  nome_empresa: string
  logo_url: string | null
  logo_orcamento_url: string | null
  logo_orcamento_size: string
  logo_size: string
  // Tema padrão da empresa (sistema interno) e da vitrine pública
  tema_sistema: ThemeMode
  tema_loja: ThemeMode
  // ── Derivados do tema (somente leitura para consumidores externos) ──
  cor_primaria: string
  cor_primaria_texto: string
  cor_fundo: string
  cor_sidebar: string
  cor_card: string
  cor_card_texto: string
  cor_botao: string
  cor_botao_texto: string
  cor_icone: string
}

/** Preenche os campos `cor_*` derivados a partir de um modo. */
function derivedColors(mode: ThemeMode) {
  const s = SURFACES[mode]
  return {
    cor_primaria:       BRAND.primary,
    cor_primaria_texto: BRAND.primaryText,
    cor_fundo:          s.bg,
    cor_sidebar:        s.sidebar,
    cor_card:           s.card,
    cor_card_texto:     s.cardTexto,
    cor_botao:          BRAND.primary,
    cor_botao_texto:    BRAND.primaryText,
    cor_icone:          s.icon,
  }
}

const DEFAULTS: PersonalizacaoConfig = {
  pais: 'BR',
  nome_empresa: '',
  logo_url: null,
  logo_orcamento_url: null,
  logo_orcamento_size: '160',
  logo_size: 'md',
  tema_sistema: 'light',
  tema_loja: 'light',
  ...derivedColors('light'),
}

const USER_THEME_KEY = 'sistema_tema_user'

export function usePersonalizacao() {
  const supabase = createSupabaseClient()
  const { empresaId, loadEmpresa } = useEmpresa()

  const config = useState<PersonalizacaoConfig>('personalizacao_config', () => ({ ...DEFAULTS }))
  const loading = ref(false)
  const saving = ref(false)
  const uploadingLogo = ref(false)
  const error = ref<string | null>(null)

  /** Modo atual aplicado ao sistema interno (reativo). */
  const currentTheme = useState<ThemeMode>('tema_sistema_atual', () => 'light')
  const isDark = computed(() => currentTheme.value === 'dark')

  /** Lê o override de tema do usuário (localStorage), se houver. */
  function userThemeOverride(): ThemeMode | null {
    if (typeof localStorage === 'undefined') return null
    const v = localStorage.getItem(USER_THEME_KEY)
    return v === 'light' || v === 'dark' ? v : null
  }

  /** Resolve o tema efetivo do sistema: override do usuário > padrão empresa. */
  function resolveSystemTheme(companyDefault: ThemeMode): ThemeMode {
    return userThemeOverride() ?? companyDefault
  }

  async function loadPersonalizacao(apply = true) {
    await loadEmpresa()
    if (!empresaId.value) return

    const [personalizacaoRes, empresaRes] = await Promise.all([
      supabase.from('empresa_personalizacao').select('*').eq('empresa_id', empresaId.value).maybeSingle(),
      supabase.from('empresas').select('nome').eq('id', empresaId.value).maybeSingle(),
    ])

    if (personalizacaoRes.error) {
      console.error('[usePersonalizacao] load error:', personalizacaoRes.error.message)
    }

    const nomeEmpresaFallback = empresaRes.data?.nome ?? ''
    const data = personalizacaoRes.data
    const temaSistema: ThemeMode = data?.tema_sistema === 'dark' ? 'dark' : 'light'
    const temaLoja: ThemeMode = data?.tema_loja === 'dark' ? 'dark' : 'light'

    config.value = {
      ...DEFAULTS,
      pais:                data?.pais                ?? 'BR',
      nome_empresa:        data?.nome_empresa        ?? nomeEmpresaFallback,
      logo_url:            data?.logo_url            ?? null,
      logo_orcamento_url:  data?.logo_orcamento_url  ?? null,
      logo_orcamento_size: data?.logo_orcamento_size ?? '160',
      logo_size:           data?.logo_size           ?? DEFAULTS.logo_size,
      tema_sistema:        temaSistema,
      tema_loja:           temaLoja,
    }

    if (apply) applyTheme(resolveSystemTheme(temaSistema))
  }

  async function savePersonalizacao(newConfig: Partial<PersonalizacaoConfig>) {
    await loadEmpresa()
    if (!empresaId.value) {
      error.value = 'Empresa não identificada. Faça login novamente.'
      return false
    }

    saving.value = true
    error.value = null

    const merged = { ...config.value, ...newConfig }
    const payload = {
      empresa_id:          empresaId.value,
      nome_empresa:        merged.nome_empresa,
      logo_url:            merged.logo_url,
      logo_orcamento_url:  merged.logo_orcamento_url ?? null,
      logo_orcamento_size: merged.logo_orcamento_size ?? '160',
      logo_size:           merged.logo_size          ?? DEFAULTS.logo_size,
      tema_sistema:        merged.tema_sistema,
      tema_loja:           merged.tema_loja,
      updated_at:          new Date().toISOString(),
    }

    const { data, error: err } = await supabase
      .from('empresa_personalizacao')
      .upsert(payload, { onConflict: 'empresa_id' })
      .select()
      .single()

    saving.value = false

    if (err) {
      error.value = 'Erro ao salvar personalização: ' + err.message
      console.error('[usePersonalizacao] save error:', err)
      return false
    }

    if (!data) {
      error.value = 'Não foi possível salvar. Verifique suas permissões.'
      return false
    }

    config.value = { ...merged, ...derivedColors(resolveSystemTheme(merged.tema_sistema)) }
    applyTheme(resolveSystemTheme(merged.tema_sistema))
    return true
  }

  async function uploadLogo(file: File): Promise<string | null> {
    await loadEmpresa()
    if (!empresaId.value) return null

    uploadingLogo.value = true
    error.value = null

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      error.value = 'Formato inválido. Use PNG, JPG, WebP ou SVG.'
      uploadingLogo.value = false
      return null
    }
    if (file.size > 2 * 1024 * 1024) {
      error.value = 'Arquivo muito grande. Máximo 2MB.'
      uploadingLogo.value = false
      return null
    }

    const ext = file.name.split('.').pop()
    const path = `logos/${empresaId.value}/logo.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('empresa-assets')
      .upload(path, file, { upsert: true, contentType: file.type })

    uploadingLogo.value = false

    if (uploadErr) {
      error.value = 'Erro ao enviar logo: ' + uploadErr.message
      return null
    }

    const { data } = supabase.storage
      .from('empresa-assets')
      .getPublicUrl(path)

    return `${data.publicUrl}?t=${Date.now()}`
  }

  /**
   * Aplica um modo (light/dark) ao documento: seta o atributo `data-theme`
   * e todas as variáveis CSS de superfície. A marca (accent) é fixa.
   */
  function applyTheme(mode: ThemeMode) {
    currentTheme.value = mode
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const s = SURFACES[mode]
    const isDarkMode = mode === 'dark'

    root.setAttribute('data-theme', mode)
    root.setAttribute('data-theme-dark', isDarkMode ? 'true' : 'false')

    // Atualiza os campos derivados do config (compat consumidores externos)
    config.value = { ...config.value, ...derivedColors(mode) }

    // ── Accent (fixo) ─────────────────────────────────────────────
    root.style.setProperty('--color-primary',      BRAND.primary)
    root.style.setProperty('--color-primary-text', BRAND.primaryText)
    root.style.setProperty('--color-primary-bg',   `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`)
    root.style.setProperty('--color-btn',          BRAND.primary)
    root.style.setProperty('--color-btn-text',     BRAND.primaryText)

    root.style.setProperty('--color-primary-5',      hexToRgba(BRAND.primary, 0.05))
    root.style.setProperty('--color-primary-10',     hexToRgba(BRAND.primary, 0.10))
    root.style.setProperty('--color-primary-12',     hexToRgba(BRAND.primary, 0.12))
    root.style.setProperty('--color-primary-15',     hexToRgba(BRAND.primary, 0.15))
    root.style.setProperty('--color-primary-20',     hexToRgba(BRAND.primary, 0.20))
    root.style.setProperty('--color-primary-30',     hexToRgba(BRAND.primary, 0.30))
    root.style.setProperty('--color-primary-light',  hexToRgba(BRAND.primary, 0.12))
    root.style.setProperty('--color-primary-border', hexToRgba(BRAND.primary, 0.30))
    for (const [k, v] of Object.entries(PRIMARY_SCALE)) {
      root.style.setProperty(`--color-primary-${k}`, v)
    }
    root.style.setProperty('--glow-primary', hexToRgba(BRAND.primary, 0.30))

    // ── Superfícies (por modo) ────────────────────────────────────
    root.style.setProperty('--color-bg',          s.bg)
    root.style.setProperty('--color-sidebar',     s.sidebar)
    root.style.setProperty('--color-card',        s.card)
    root.style.setProperty('--color-card-texto',  s.cardTexto)
    root.style.setProperty('--color-card-border', s.cardBorder)
    root.style.setProperty('--color-icon',        s.icon)
    root.style.setProperty('--color-icon-10',     hexToRgba(BRAND.primary, 0.10))
    root.style.setProperty('--color-icon-light',  hexToRgba(BRAND.primary, 0.12))
    root.style.setProperty('--color-icon-border', hexToRgba(BRAND.primary, 0.30))

    // ── Background do html/body + status bar mobile ───────────────
    if (document.body) {
      document.documentElement.style.background = s.bg
      document.body.style.background = s.bg
    }
    try {
      let metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
      if (!metaTheme) {
        metaTheme = document.createElement('meta')
        metaTheme.name = 'theme-color'
        document.head.appendChild(metaTheme)
      }
      metaTheme.content = s.bg
    } catch {}

    // ── Glass morphism (derivado do modo) ─────────────────────────
    if (isDarkMode) {
      root.style.setProperty('--glass-bg',            'rgba(255,255,255,0.05)')
      root.style.setProperty('--glass-bg-hover',      'rgba(255,255,255,0.09)')
      root.style.setProperty('--glass-bg-active',     'rgba(255,255,255,0.14)')
      root.style.setProperty('--glass-border',        'rgba(255,255,255,0.08)')
      root.style.setProperty('--glass-border-strong', 'rgba(255,255,255,0.16)')
      root.style.setProperty('--glass-shadow',        '0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.14)')
      root.style.setProperty('--glass-shadow-hover',  '0 20px 60px rgba(0,0,0,0.36), 0 4px 16px rgba(0,0,0,0.20)')
      root.style.setProperty('--glass-shadow-card',   '0 4px 20px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12)')
      root.style.setProperty('--modal-overlay-bg',    'rgba(0,0,0,0.65)')
    } else {
      root.style.setProperty('--glass-bg',            'rgba(255,255,255,0.72)')
      root.style.setProperty('--glass-bg-hover',      'rgba(255,255,255,0.88)')
      root.style.setProperty('--glass-bg-active',     'rgba(255,255,255,0.96)')
      root.style.setProperty('--glass-border',        'rgba(0,0,0,0.07)')
      root.style.setProperty('--glass-border-strong', 'rgba(0,0,0,0.13)')
      root.style.setProperty('--glass-shadow',        '0 4px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)')
      root.style.setProperty('--glass-shadow-hover',  '0 12px 40px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)')
      root.style.setProperty('--glass-shadow-card',   '0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)')
      root.style.setProperty('--modal-overlay-bg',    'rgba(0,0,0,0.40)')
    }
  }

  /** Define o tema do sistema como override do usuário (persiste localStorage). */
  function setTheme(mode: ThemeMode) {
    try { localStorage.setItem(USER_THEME_KEY, mode) } catch {}
    applyTheme(mode)
  }

  /** Alterna light/dark (override do usuário). */
  function toggleTheme() {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  /** Remove o override do usuário e volta ao padrão da empresa. */
  function clearThemeOverride() {
    try { localStorage.removeItem(USER_THEME_KEY) } catch {}
    applyTheme(config.value.tema_sistema)
  }

  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  /** Restaura o tema padrão (light) e limpa override. */
  function resetToDefaults() {
    clearThemeOverride()
    config.value = { ...config.value, ...DEFAULTS, nome_empresa: config.value.nome_empresa }
    applyTheme('light')
  }

  /** Carrega personalização pública (vitrine /loja, /catalogo) e aplica o tema da loja. */
  async function loadPersonalizacaoPublic(eId: number) {
    const [personalizacaoRes, empresaRes] = await Promise.all([
      supabase.from('empresa_personalizacao').select('*').eq('empresa_id', eId).maybeSingle(),
      supabase.from('empresas').select('nome').eq('id', eId).maybeSingle(),
    ])

    if (personalizacaoRes.error) {
      console.error('[usePersonalizacao] public load error:', personalizacaoRes.error.message)
    }

    const nomeEmpresaFallback = empresaRes.data?.nome ?? ''
    const data = personalizacaoRes.data
    const temaLoja: ThemeMode = data?.tema_loja === 'dark' ? 'dark' : 'light'

    config.value = {
      ...DEFAULTS,
      pais:                data?.pais                ?? 'BR',
      nome_empresa:        data?.nome_empresa        ?? nomeEmpresaFallback,
      logo_url:            data?.logo_url            ?? null,
      logo_orcamento_url:  data?.logo_orcamento_url  ?? null,
      logo_orcamento_size: data?.logo_orcamento_size ?? '160',
      logo_size:           data?.logo_size           ?? DEFAULTS.logo_size,
      tema_sistema:        data?.tema_sistema === 'dark' ? 'dark' : 'light',
      tema_loja:           temaLoja,
    }

    // Na vitrine pública ignoramos o override do usuário — usa o tema da loja.
    applyTheme(temaLoja)
  }

  return {
    config,
    loading,
    saving,
    uploadingLogo,
    error,
    currentTheme,
    isDark,
    loadPersonalizacao,
    loadPersonalizacaoPublic,
    savePersonalizacao,
    uploadLogo,
    applyTheme,
    setTheme,
    toggleTheme,
    clearThemeOverride,
    resetToDefaults,
    DEFAULTS,
  }
}
