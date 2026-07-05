<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-[#1e1e22] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Configuração WhatsApp</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Conecte seu número via Datafy API</p>
          </div>
        </div>
        <button type="button" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10" @click="$emit('close')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="salvar" class="p-6 space-y-4">
        <!-- Status -->
        <div v-if="config?.ativo" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-xs font-medium text-emerald-700 dark:text-emerald-400">WhatsApp conectado</span>
        </div>

        <!-- Datafy API URL -->
        <div>
          <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">API URL</label>
          <input v-model="form.datafy_api_url" type="url" placeholder="https://cloud.datafyapi.com.br" class="cfg-input" />
          <p class="text-[10px] text-gray-400 mt-1">Padrão: https://cloud.datafyapi.com.br</p>
        </div>

        <!-- Token -->
        <div>
          <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Token da Instância (Bearer)</label>
          <input v-model="form.datafy_token" type="password" placeholder="sk_live_xxxxxxxx..." class="cfg-input" autocomplete="off" />
          <p class="text-[10px] text-gray-400 mt-1">Seu token sk_live_ gerado no painel Datafy</p>
        </div>

        <!-- Phone Number ID -->
        <div>
          <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Phone Number ID</label>
          <input v-model="form.phone_number_id" type="text" placeholder="1205697689289632" class="cfg-input" />
          <p class="text-[10px] text-gray-400 mt-1">ID do número conectado (encontrado no painel Datafy/Meta)</p>
        </div>

        <!-- Display Phone -->
        <div>
          <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Número exibido (opcional)</label>
          <input v-model="form.display_phone_number" type="text" placeholder="+55 11 94052-7609" class="cfg-input" />
        </div>

        <!-- Webhook URL (read-only) -->
        <div>
          <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">Webhook URL</label>
          <div class="flex gap-2">
            <input :value="webhookUrl" type="text" readonly class="cfg-input flex-1 bg-gray-50 dark:bg-white/5 cursor-default" />
            <button type="button" @click="copiarWebhook" class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15 transition-colors">
              {{ copiado ? '✓' : 'Copiar' }}
            </button>
          </div>
          <p class="text-[10px] text-gray-400 mt-1">Configure esta URL no painel Datafy como webhook de recebimento</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">Cancelar</button>
          <button type="submit" :disabled="salvando" class="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-500/25">
            {{ salvando ? 'Salvando...' : 'Salvar configuração' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

const emit = defineEmits<{ close: [] }>()
const config = ref<any>(null)
const salvando = ref(false)
const copiado = ref(false)

const form = reactive({
  datafy_api_url: 'https://cloud.datafyapi.com.br',
  datafy_token: '',
  phone_number_id: '',
  display_phone_number: '',
})

const webhookUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/webhook`
  }
  return 'https://app-volvv.arepen.easypanel.host/api/webhook'
})

// Carrega empresa_id do localStorage
function getEmpresaId(): string {
  try {
    const data = localStorage.getItem('empresa_tema') || localStorage.getItem('empresa_data')
    if (data) {
      const parsed = JSON.parse(data)
      return parsed.empresa_id || parsed.id || ''
    }
    // Fallback: buscar do perfil
    const perfil = localStorage.getItem('perfil_data')
    if (perfil) {
      return JSON.parse(perfil).empresa_id || ''
    }
  } catch {}
  return ''
}

onMounted(async () => {
  const empresaId = getEmpresaId()
  if (!empresaId) return

  try {
    const data = await $fetch('/api/whatsapp-config', { query: { empresa_id: empresaId } })
    if (data) {
      config.value = data
      form.datafy_api_url = (data as any).datafy_api_url || 'https://cloud.datafyapi.com.br'
      form.datafy_token = (data as any).datafy_token || ''
      form.phone_number_id = (data as any).phone_number_id || ''
      form.display_phone_number = (data as any).display_phone_number || ''
    }
  } catch (e) {
    console.error('[wpp-config] load:', e)
  }
})

async function salvar() {
  const empresaId = getEmpresaId()
  if (!empresaId) return alert('Empresa não identificada. Faça login novamente.')

  salvando.value = true
  try {
    const res = await $fetch('/api/whatsapp-config', {
      method: 'POST',
      body: {
        empresa_id: empresaId,
        datafy_api_url: form.datafy_api_url,
        datafy_token: form.datafy_token,
        phone_number_id: form.phone_number_id,
        display_phone_number: form.display_phone_number,
      },
    })
    config.value = res
    emit('close')
  } catch (e: any) {
    alert('Erro ao salvar: ' + (e?.data?.message || e?.message || 'erro desconhecido'))
  } finally {
    salvando.value = false
  }
}

function copiarWebhook() {
  navigator.clipboard.writeText(webhookUrl.value)
  copiado.value = true
  setTimeout(() => { copiado.value = false }, 2000)
}
</script>

<style scoped>
.cfg-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  font-size: 13px;
  color: #1f2937;
  outline: none;
  transition: border-color 0.2s;
}
.cfg-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
}
:root.dark .cfg-input,
[data-theme="dark"] .cfg-input {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
  color: #f5f5f4;
}
:root.dark .cfg-input:focus,
[data-theme="dark"] .cfg-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
}
</style>
