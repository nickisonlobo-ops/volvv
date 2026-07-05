<template>
  <div class="min-h-full bg-transparent p-3 sm:p-8">
    <!-- Header -->
    <div class="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div class="absolute inset-0" :style="{ background: 'var(--color-primary-bg, linear-gradient(135deg, #374151, #1f2937))' }" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
      <div class="relative px-4 sm:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7">
        <div class="flex flex-wrap items-start justify-between gap-3 sm:gap-6">
          <div class="flex items-center gap-3 sm:gap-5">
            <div class="flex items-center justify-center w-10 sm:w-14 h-10 sm:h-14 rounded-2xl bg-white/[0.12] backdrop-blur-sm border border-white/20 shadow-lg">
              <svg class="w-5 sm:w-7 h-5 sm:h-7 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>
            </div>
            <div>
              <span class="text-xs font-semibold text-white/80 uppercase tracking-widest">Vendas</span>
              <h1 class="text-xl sm:text-3xl font-bold text-white tracking-tight leading-none">E-commerce</h1>
              <p class="text-sm text-white/80 mt-1.5">Sua loja online para clientes</p>
            </div>
          </div>
          <a :href="lojaUrl" target="_blank" class="inline-flex items-center gap-2 text-sm font-bold px-3 sm:px-5 py-2.5 rounded-xl bg-white text-primary hover:bg-primary-5 shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
            Ver minha Loja
          </a>
        </div>
      </div>
    </div>

    <!-- Link da loja -->
    <div class="bg-theme-card rounded-2xl border border-primary-10 p-6 shadow-sm mb-6">
      <h3 class="text-sm font-bold mb-3" style="color: var(--color-card-texto)">Link da sua loja</h3>
      <div class="flex items-center gap-3">
        <input :value="lojaUrl" readonly class="flex-1 px-4 py-2.5 rounded-xl border text-sm bg-transparent" style="color: var(--color-card-texto); border-color: var(--color-primary-10)" />
        <button class="px-4 py-2.5 rounded-xl text-sm font-bold text-white" :style="{ background: 'var(--color-primary)' }" @click="copiarLink">
          {{ copiado ? 'Copiado!' : 'Copiar' }}
        </button>
      </div>
      <p class="text-xs mt-2 opacity-60" style="color: var(--color-card-texto)">Compartilhe este link com seus clientes para eles verem seus produtos e fazerem pedidos via WhatsApp.</p>
    </div>

    <!-- Info -->
    <div class="bg-theme-card rounded-2xl border border-primary-10 p-6 shadow-sm">
      <h3 class="text-sm font-bold mb-3" style="color: var(--color-card-texto)">Como funciona</h3>
      <div class="space-y-3 text-sm" style="color: var(--color-card-texto); opacity: 0.8">
        <p>1. Cadastre seus produtos no <strong>Catalogo</strong></p>
        <p>2. Compartilhe o link da loja com seus clientes</p>
        <p>3. O cliente navega, escolhe e finaliza o pedido via WhatsApp</p>
        <p>4. Voce recebe a mensagem e processa o pedido</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEmpresa } from '~/composables/useEmpresa'

definePageMeta({ layout: 'default' })

const { empresaId, loadEmpresa } = useEmpresa()
const copiado = ref(false)

onMounted(async () => { await loadEmpresa() })

const lojaUrl = computed(() => {
  if (!empresaId.value) return ''
  return `${window.location.origin}/catalogo/${empresaId.value}`
})

function copiarLink() {
  navigator.clipboard.writeText(lojaUrl.value)
  copiado.value = true
  setTimeout(() => copiado.value = false, 2000)
}
</script>
