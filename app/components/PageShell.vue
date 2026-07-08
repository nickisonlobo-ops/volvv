<template>
  <div class="min-h-full flex flex-col px-2 pt-2 sm:px-5 sm:pt-4" style="background:#08090b">
    <!-- ═══ Card de título (banner escuro) ═══ -->
    <div class="relative rounded-t-3xl overflow-hidden shadow-xl" :style="{ background: 'var(--color-sidebar, #0a0d12)', border: '2px solid rgba(255,255,255,0.16)' }">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
      <div class="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/[0.03] pointer-events-none" />
      <div class="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-white/[0.02] pointer-events-none" />

      <!-- Globo decorativo -->
      <svg v-if="globe" class="absolute -right-10 top-1/2 -translate-y-1/2 w-[380px] h-[380px] opacity-[0.3] pointer-events-none hidden md:block" viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <radialGradient id="pageShellGlobe" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stop-color="#fff" stop-opacity="1" />
            <stop offset="100%" stop-color="#fff" stop-opacity="0" />
          </radialGradient>
          <mask id="pageShellGlobeMask"><rect x="0" y="0" width="400" height="400" fill="url(#pageShellGlobe)" /></mask>
        </defs>
        <g mask="url(#pageShellGlobeMask)">
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1" />
          <ellipse cx="200" cy="200" rx="150" ry="55" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
          <ellipse cx="200" cy="200" rx="150" ry="105" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
          <ellipse cx="200" cy="200" rx="55" ry="150" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
          <ellipse cx="200" cy="200" rx="105" ry="150" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
          <line x1="50" y1="200" x2="350" y2="200" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
          <line x1="200" y1="50" x2="200" y2="350" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
          <path d="M 90 130 Q 220 90 310 190" fill="none" stroke="rgba(249,115,22,0.5)" stroke-width="1.5" stroke-dasharray="2,4" />
          <circle cx="90" cy="130" r="3.5" fill="#f97316" />
          <circle cx="90" cy="130" r="7" fill="none" stroke="#f97316" stroke-width="1" opacity="0.5" />
          <circle cx="310" cy="190" r="3" fill="#fb923c" />
        </g>
      </svg>

      <div class="relative px-4 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div v-if="$slots.icon" class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/15 shadow-lg shrink-0" style="color:#fff">
              <slot name="icon" />
            </div>
            <div class="min-w-0">
              <div v-if="eyebrow || eyebrowMuted" class="flex items-center gap-2 mb-1">
                <span v-if="eyebrow" class="text-xs font-semibold text-white/80 uppercase tracking-widest">{{ eyebrow }}</span>
                <span v-if="eyebrow && eyebrowMuted" class="w-1 h-1 rounded-full bg-white/40" />
                <span v-if="eyebrowMuted" class="text-xs text-white/50 hidden sm:inline">{{ eyebrowMuted }}</span>
              </div>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">{{ title }}</h1>
              <p v-if="subtitle" class="text-sm text-gray-300/80 mt-1.5">{{ subtitle }}</p>
            </div>
          </div>

          <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0">
            <slot name="actions" />
          </div>
        </div>

        <!-- Conteúdo extra no banner (stats, divisor, etc.) -->
        <slot name="banner" />
      </div>
    </div>

    <!-- ═══ Painel claro de conteúdo (ilha de tema claro) ═══ -->
    <div class="page-light-panel flex-1 sm:-mx-4" style="background:#f1f2f4;border-radius:22px 22px 0 0;padding:20px;color:#1a1d21">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageShell' })

withDefaults(defineProps<{
  title: string
  subtitle?: string
  eyebrow?: string
  eyebrowMuted?: string
  globe?: boolean
}>(), {
  globe: true,
})
</script>
