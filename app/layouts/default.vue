<template>
  <div class="flex flex-col h-screen overflow-hidden" :style="{ background: 'var(--color-bg, #f8fafc)' }">
    <TrialBanner />
    <AppHeader />

    <div class="flex flex-1 min-h-0">
      <AppSidebar />

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

    <AppBottomNav />

    <!-- Global OS Modal (aberto via notificações) -->
    <OSDetalhesModal
      :show="showGlobalOS"
      :ordem-servico="globalOS"
      :itens-o-s="globalItensOS"
      @close="fecharOS"
      @status-updated="fecharOS"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '~/components/AppHeader.vue'
import AppSidebar from '~/components/AppSidebar.vue'
import AppBottomNav from '~/components/AppBottomNav.vue'
import TrialBanner from '~/components/TrialBanner.vue'
import OSDetalhesModal from '~/components/OSDetalhesModal.vue'
import { usePersonalizacao } from '~/composables/usePersonalizacao'
import { useGlobalOS } from '~/composables/useGlobalOS'

const route = useRoute()
const { loadPersonalizacao, applyTheme, config } = usePersonalizacao()
const { showGlobalOS, globalOS, globalItensOS, fecharOS } = useGlobalOS()

onMounted(async () => {
  await loadPersonalizacao()
})

// Re-aplica o tema a cada troca de rota
watch(() => route.path, () => {
  applyTheme(config.value)
})
</script>
