<template>
  <div class="min-h-full flex flex-col px-0 pt-2 sm:px-5 sm:pt-4" style="background:#08090b">
    <!-- ═══ Card de título (totalmente preto, borda cinza) ═══ -->
    <div class="relative rounded-t-3xl overflow-hidden shadow-xl mx-0 sm:mx-3" style="background:#000000;border:2px solid rgba(255,255,255,0.16)">
      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-center justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div v-if="$slots.icon" class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 shrink-0" style="color:#fc6404">
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
