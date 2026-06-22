<template>
  <div class="flex flex-col gap-2 w-full">
    <!-- Label -->
    <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
      {{ label }}
    </label>

    <!-- Estado: Upload em andamento -->
    <div
      v-if="uploading"
      class="flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-6"
      :style="{ borderColor: 'var(--color-primary, #4f46e5)', background: 'var(--color-primary-5, rgba(79,70,229,0.05))' }"
    >
      <svg class="w-8 h-8 text-current animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span class="text-sm font-semibold text-current">Enviando arquivo...</span>
    </div>

    <!-- Estado: Arquivo selecionado (preview) -->
    <div
      v-else-if="previewUrl || modelValue || selectedFile"
      class="relative rounded-xl border-2 border-gray-200 bg-white overflow-hidden"
    >
      <!-- Preview de imagem -->
      <div v-if="isImagePreview" class="flex items-center justify-center p-3 bg-gray-50">
        <img
          :src="previewUrl || modelValue!"
          :alt="label"
          class="max-h-40 max-w-full rounded-lg object-contain"
        />
      </div>

      <!-- Preview de PDF (Ã­cone) -->
      <div v-else class="flex items-center justify-center gap-3 p-4 bg-gray-50">
        <svg class="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zm-2.5 10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" />
        </svg>
        <span class="text-sm font-semibold text-gray-700">{{ selectedFileName || 'Arquivo PDF' }}</span>
      </div>

      <!-- BotÃµes de aÃ§Ã£o: substituir / remover -->
      <div class="flex border-t border-gray-200">
        <button
          type="button"
          class="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-current hover:bg-indigo-50 transition-colors duration-200 focus:outline-none"
          @click="triggerFileInput"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Substituir
        </button>
        <div class="w-px bg-gray-200" />
        <button
          type="button"
          class="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors duration-200 focus:outline-none"
          @click="removeFile"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remover
        </button>
      </div>
    </div>

    <!-- Estado: Nenhum arquivo (dropzone) -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-colors duration-200"
      style="border-color: var(--color-card-border, rgba(0,0,0,0.15))"
      @click="triggerFileInput"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      :class="{ 'border-primary': isDragging }"
      :style="isDragging ? { borderColor: 'var(--color-primary, #4f46e5)' } : { borderColor: 'var(--color-card-border, rgba(0,0,0,0.15))' }"
    >
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="text-sm font-semibold text-gray-500">Clique ou arraste para enviar</span>
      <span class="text-[10px] text-gray-400">{{ acceptLabel }} â€¢ MÃ¡x. {{ maxSizeMb }} MB</span>
    </div>

    <!-- Input file oculto -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      class="hidden"
      @change="onFileSelected"
    />

    <!-- Mensagem de erro inline -->
    <p v-if="errorMessage" class="text-xs text-red-500 font-semibold flex items-center gap-1.5">
      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { createSupabaseClient } from '~/lib/supabase'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    label: string
    accept: string
    maxSizeMb: number
    storagePath: string
  }>(),
  {
    modelValue: null,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', url: string | null): void
  (e: 'file-selected', file: File): void
  (e: 'file-removed'): void
  (e: 'error', msg: string): void
}>()

// â”€â”€â”€ Composable â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const { validarArquivoUpload } = useOrcamentos()

// â”€â”€â”€ State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const uploading = ref(false)
const errorMessage = ref<string | null>(null)
const isDragging = ref(false)
const selectedFileName = ref<string | null>(null)
/** Tracks the storage path of a file that was uploaded (staged) but not yet saved */
const uploadedStagedPath = ref<string | null>(null)

// â”€â”€â”€ Computed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const acceptedTypes = computed(() =>
  props.accept.split(',').map(t => t.trim())
)

const isImagePreview = computed(() => {
  if (selectedFile.value) {
    return selectedFile.value.type.startsWith('image/')
  }
  if (props.modelValue) {
    // Determina pelo URL se Ã© imagem (nÃ£o Ã© PDF)
    return !props.modelValue.toLowerCase().endsWith('.pdf')
  }
  return false
})

const acceptLabel = computed(() => {
  const types = acceptedTypes.value
  const labels: string[] = []
  if (types.includes('image/jpeg')) labels.push('JPEG')
  if (types.includes('image/png')) labels.push('PNG')
  if (types.includes('image/webp')) labels.push('WebP')
  if (types.includes('application/pdf')) labels.push('PDF')
  return labels.join(', ')
})

// â”€â”€â”€ Methods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  processFile(file)

  // Reset input para permitir selecionar o mesmo arquivo novamente
  input.value = ''
}

function onDragOver(event: DragEvent) {
  isDragging.value = true
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return

  processFile(file)
}

function processFile(file: File) {
  // Limpar erro anterior
  errorMessage.value = null

  // ValidaÃ§Ã£o client-side
  const maxSizeBytes = props.maxSizeMb * 1024 * 1024
  const validacao = validarArquivoUpload(
    { type: file.type, size: file.size },
    acceptedTypes.value,
    maxSizeBytes
  )

  if (!validacao.valido) {
    const mensagem = validacao.erro || 'Arquivo invÃ¡lido'
    errorMessage.value = mensagem
    emit('error', mensagem)
    return
  }

  // Armazenar arquivo selecionado
  selectedFile.value = file
  selectedFileName.value = file.name

  // Gerar preview
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    // Para PDF, nÃ£o temos preview de imagem
    previewUrl.value = null
  }

  emit('file-selected', file)

  // Upload imediato (staged) â€” faz upload ao selecionar para ter a URL disponÃ­vel no save
  uploadImediato(file)
}

async function uploadImediato(file: File) {
  const supabase = createSupabaseClient()
  uploading.value = true

  try {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = props.storagePath.replace(/\.[^.]+$/, '') + '.' + ext

    const { data, error } = await supabase.storage
      .from('orcamentos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error('[FotoUpload] Erro no upload imediato:', error.message, error)
      errorMessage.value = `Erro ao enviar arquivo: ${error.message}`
      emit('error', `Erro ao enviar arquivo: ${error.message}`)
      return
    }

    // Obter URL pÃºblica
    const { data: urlData } = supabase.storage
      .from('orcamentos')
      .getPublicUrl(data.path)

    const publicUrl = urlData.publicUrl
    uploadedStagedPath.value = data.path
    selectedFile.value = null
    emit('update:modelValue', publicUrl)
  } catch (err) {
    console.error('[FotoUpload] Erro inesperado no upload:', err)
    errorMessage.value = 'Erro ao enviar arquivo. Tente novamente.'
    emit('error', 'Erro ao enviar arquivo. Tente novamente.')
  } finally {
    uploading.value = false
  }
}

async function removeFile() {
  // If modelValue is a real URL (persisted file), delete from Storage
  if (props.modelValue && props.modelValue.startsWith('http')) {
    try {
      const supabase = createSupabaseClient()
      await supabase.storage.from('orcamentos').remove([props.storagePath])
    } catch (err) {
      console.error('[FotoUpload] Erro ao deletar arquivo do Storage (best-effort):', err)
    }
  }

  selectedFile.value = null
  previewUrl.value = null
  selectedFileName.value = null
  errorMessage.value = null
  uploadedStagedPath.value = null

  emit('update:modelValue', null)
  emit('file-removed')
}

/** Upload para Supabase Storage â€” chamado pelo componente pai no momento do save */
async function upload(): Promise<string | null> {
  if (!selectedFile.value) return props.modelValue

  const supabase = createSupabaseClient()
  uploading.value = true
  errorMessage.value = null

  try {
    const file = selectedFile.value
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = props.storagePath.endsWith(`.${ext}`)
      ? props.storagePath
      : `${props.storagePath}.${ext}`

    const { data, error } = await supabase.storage
      .from('orcamentos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      const mensagem = 'Erro ao enviar arquivo. Tente novamente.'
      errorMessage.value = mensagem
      emit('error', mensagem)
      return null
    }

    // Obter URL pÃºblica
    const { data: urlData } = supabase.storage
      .from('orcamentos')
      .getPublicUrl(data.path)

    const publicUrl = urlData.publicUrl
    uploadedStagedPath.value = data.path
    selectedFile.value = null
    emit('update:modelValue', publicUrl)
    return publicUrl
  } catch (err) {
    const mensagem = 'Erro ao enviar arquivo. Tente novamente.'
    errorMessage.value = mensagem
    emit('error', mensagem)
    return null
  } finally {
    uploading.value = false
  }
}

/** Verifica se hÃ¡ um arquivo selecionado para upload pendente */
function hasPendingUpload(): boolean {
  return selectedFile.value !== null
}

/** Cleanup: deleta arquivo staged do Storage se houver (chamado pelo pai ao cancelar/erro) */
async function cleanup(): Promise<void> {
  // If there's a file that was uploaded to storage but not yet saved
  if (uploadedStagedPath.value) {
    try {
      const supabase = createSupabaseClient()
      await supabase.storage.from('orcamentos').remove([uploadedStagedPath.value])
    } catch (err) {
      console.error('[FotoUpload] Erro ao limpar arquivo staged do Storage (best-effort):', err)
    }
    uploadedStagedPath.value = null
  }

  // Reset local state
  selectedFile.value = null
  previewUrl.value = null
  selectedFileName.value = null
  errorMessage.value = null
}

// â”€â”€â”€ Expose â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
defineExpose({
  upload,
  hasPendingUpload,
  cleanup,
})
</script>
