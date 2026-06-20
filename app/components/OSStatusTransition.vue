<template>
  <div class="space-y-3">
    <!-- Transition buttons row -->
    <div v-if="!isFinalState" class="flex flex-wrap items-center gap-2">
      <!-- Next valid state button -->
      <button
        v-if="nextTransition"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="nextTransition.btnClass"
        :disabled="loading"
        @click="handleTransition(nextTransition.status)"
      >
        <svg
          v-if="loading && loadingAction === 'transition'"
          class="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <component v-else :is="nextTransition.icon" class="h-4 w-4" />
        <span>{{ nextTransition.label }}</span>
      </button>

      <!-- Cancel button -->
      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="loading"
        @click="showCancelForm = true"
      >
        <svg
          v-if="loading && loadingAction === 'cancel'"
          class="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        <span>Cancelar</span>
      </button>
    </div>

    <!-- Final state info -->
    <div v-else class="flex items-center gap-2 text-sm">
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium" :class="finalStateClasses">
        <svg v-if="statusAtual === 'entregue'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        {{ statusAtual === 'entregue' ? 'OS entregue — concluída' : 'OS cancelada' }}
      </span>
    </div>

    <!-- Cancel reason inline form -->
    <div v-if="showCancelForm" class="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
      <label class="block text-sm font-medium text-red-800">
        Motivo do cancelamento <span class="text-red-600">*</span>
      </label>
      <textarea
        v-model="motivoCancelamento"
        rows="2"
        class="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 resize-none"
        placeholder="Informe o motivo do cancelamento..."
      />
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!motivoValido || loading"
          @click="handleCancel"
        >
          <svg
            v-if="loading && loadingAction === 'cancel'"
            class="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Confirmar cancelamento
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-150"
          :disabled="loading"
          @click="closeCancelForm"
        >
          Voltar
        </button>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="errorMessage" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatusOS, OrdemServico } from '~/composables/useOrdensServico'

const props = defineProps<{
  statusAtual: StatusOS
  osId: number
}>()

const emit = defineEmits<{
  (e: 'statusUpdated', os: OrdemServico): void
}>()

const { atualizarStatusOS, cancelarOS, validarTransicaoOS } = useOrdensServico()

// ─── State ────────────────────────────────────────────────
const loading = ref(false)
const loadingAction = ref<'transition' | 'cancel' | null>(null)
const showCancelForm = ref(false)
const motivoCancelamento = ref('')
const errorMessage = ref('')

// ─── Computed ─────────────────────────────────────────────
const isFinalState = computed(() => {
  return props.statusAtual === 'entregue' || props.statusAtual === 'cancelado'
})

const finalStateClasses = computed(() => {
  if (props.statusAtual === 'entregue') {
    return 'bg-emerald-100 text-emerald-800'
  }
  return 'bg-red-100 text-red-800'
})

const motivoValido = computed(() => {
  return motivoCancelamento.value.trim().length >= 1
})

interface TransitionConfig {
  status: StatusOS
  label: string
  btnClass: string
  icon: any
}

const nextTransition = computed((): TransitionConfig | null => {
  switch (props.statusAtual) {
    case 'aguardando_producao':
      if (validarTransicaoOS(props.statusAtual, 'em_producao')) {
        return {
          status: 'em_producao',
          label: 'Iniciar Produção',
          btnClass: 'bg-blue-600 hover:bg-blue-700',
          icon: IconPlay,
        }
      }
      return null
    case 'em_producao':
      if (validarTransicaoOS(props.statusAtual, 'pronto')) {
        return {
          status: 'pronto',
          label: 'Marcar Pronto',
          btnClass: 'bg-green-600 hover:bg-green-700',
          icon: IconCheck,
        }
      }
      return null
    case 'pronto':
      if (validarTransicaoOS(props.statusAtual, 'entregue')) {
        return {
          status: 'entregue',
          label: 'Marcar Entregue',
          btnClass: 'bg-emerald-600 hover:bg-emerald-700',
          icon: IconTruck,
        }
      }
      return null
    default:
      return null
  }
})

// ─── Actions ──────────────────────────────────────────────
async function handleTransition(novoStatus: StatusOS) {
  loading.value = true
  loadingAction.value = 'transition'
  errorMessage.value = ''

  try {
    const osAtualizada = await atualizarStatusOS(props.osId, props.statusAtual, novoStatus)
    emit('statusUpdated', osAtualizada)
  } catch (err: any) {
    errorMessage.value = err?.message || 'Erro ao atualizar status da OS.'
  } finally {
    loading.value = false
    loadingAction.value = null
  }
}

async function handleCancel() {
  if (!motivoValido.value) return

  loading.value = true
  loadingAction.value = 'cancel'
  errorMessage.value = ''

  try {
    const osAtualizada = await cancelarOS(props.osId, props.statusAtual, motivoCancelamento.value.trim())
    showCancelForm.value = false
    motivoCancelamento.value = ''
    emit('statusUpdated', osAtualizada)
  } catch (err: any) {
    errorMessage.value = err?.message || 'Erro ao cancelar OS.'
  } finally {
    loading.value = false
    loadingAction.value = null
  }
}

function closeCancelForm() {
  showCancelForm.value = false
  motivoCancelamento.value = ''
  errorMessage.value = ''
}
</script>

<!-- Inline functional icon components -->
<script lang="ts">
import { h, defineComponent } from 'vue'

const IconPlay = defineComponent({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-4 w-4',
      viewBox: '0 0 20 20',
      fill: 'currentColor',
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z',
        'clip-rule': 'evenodd',
      }),
    ])
  },
})

const IconCheck = defineComponent({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-4 w-4',
      viewBox: '0 0 20 20',
      fill: 'currentColor',
    }, [
      h('path', {
        'fill-rule': 'evenodd',
        d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
        'clip-rule': 'evenodd',
      }),
    ])
  },
})

const IconTruck = defineComponent({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'h-4 w-4',
      viewBox: '0 0 20 20',
      fill: 'currentColor',
    }, [
      h('path', {
        d: 'M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
      }),
      h('path', {
        d: 'M0 4a1 1 0 011-1h11a1 1 0 011 1v10H1a1 1 0 01-1-1V4zm14 0h3a1 1 0 01.8.4l2 2.667A1 1 0 0120 7.667V13a1 1 0 01-1 1h-5V4z',
      }),
    ])
  },
})
</script>
