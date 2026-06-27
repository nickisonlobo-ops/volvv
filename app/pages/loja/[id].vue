<template>
  <div class="min-h-full bg-gray-50/60 p-3 sm:p-8">
    <div v-if="loading" class="flex items-center justify-center py-32">
      <span class="inline-block w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" :style="{ borderColor: `var(--color-primary, #6b7280)`, borderTopColor: `transparent` }" />
    </div>
    <div v-else-if="!veiculo" class="flex flex-col items-center justify-center py-32 gap-4">
      <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg></div>
      <div class="text-center"><p class="font-bold text-gray-700">Veículo não encontrado</p><p class="text-sm text-gray-400 mt-1">Este veículo pode ter sido removido ou não está disponível.</p></div>
      <NuxtLink :to="`/loja?e=${eId}`" class="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>Voltar ao catálogo</NuxtLink>
    </div>
    <template v-else>
      <div class="relative rounded-3xl overflow-hidden mb-6 shadow-xl">
        <div class="absolute inset-0" :style="{ background: `var(--color-primary-bg, linear-gradient(135deg, #111827, #1f2937))` }" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
        <div class="relative px-4 sm:px-8 pt-5 pb-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <NuxtLink :to="`/loja?e=${eId}`" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.12] hover:bg-white/20 border border-white/20 transition-colors"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg></NuxtLink>
              <div>
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">{{ nomeEmpresa }}</span>
                  <svg class="w-3 h-3 text-white/40" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                  <span class="text-xs font-semibold text-white/70 uppercase tracking-widest">Detalhes</span>
                </div>
                <h1 class="text-xl sm:text-2xl font-bold text-white leading-tight">{{ veiculo.marca }} {{ veiculo.modelo }}</h1>
                <p class="text-sm text-white/70 mt-0.5">{{ veiculo.ano_fabricacao }}{{ veiculo.ano_modelo && veiculo.ano_modelo !== veiculo.ano_fabricacao ? `/${veiculo.ano_modelo}` : `` }}<span v-if="veiculo.cor"> &bull; {{ veiculo.cor }}</span></p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wide shadow" :class="statusBadgeClass(veiculo.status)">{{ statusLabel(veiculo.status) }}</span>
              <span v-if="veiculo.tipo" class="inline-flex items-center text-xs font-semibold bg-white/15 text-white px-3 py-1.5 rounded-xl border border-white/20">{{ veiculo.tipo }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 flex flex-col gap-4">
          <div class="relative rounded-2xl overflow-hidden bg-gray-100 shadow-md aspect-[16/9]">
            <img v-if="fotoAtiva" :src="fotoAtiva" :alt="`${veiculo.marca} ${veiculo.modelo}`" class="absolute inset-0 w-full h-full object-cover" />
            <div v-else class="absolute inset-0 flex items-center justify-center flex-col gap-3"><svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg><p class="text-sm text-gray-400 font-medium">Sem fotos cadastradas</p></div>
            <span v-if="fotos.length > 1" class="absolute bottom-3 right-3 text-[11px] font-bold bg-black/60 text-white px-2.5 py-1 rounded-full">{{ fotoIndex + 1 }} / {{ fotos.length }}</span>
            <template v-if="fotos.length > 1">
              <button type="button" class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/50 hover:bg-black/70 flex items-center justify-center" @click="fotoIndex = (fotoIndex - 1 + fotos.length) % fotos.length"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg></button>
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/50 hover:bg-black/70 flex items-center justify-center" @click="fotoIndex = (fotoIndex + 1) % fotos.length"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg></button>
            </template>
          </div>
          <div v-if="fotos.length > 1" class="flex gap-2 overflow-x-auto pb-1">
            <button v-for="(foto, i) in fotos" :key="i" type="button" class="shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all" :class="i === fotoIndex ? `shadow-md scale-105` : `border-transparent opacity-60 hover:opacity-100`" :style="i === fotoIndex ? { borderColor: `var(--color-primary, #6b7280)` } : {}" @click="fotoIndex = i"><img :src="foto" :alt="`Foto ${i + 1}`" class="w-full h-full object-cover" /></button>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 class="text-sm font-black text-gray-700 uppercase tracking-widest mb-4">Especificações</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div v-if="veiculo.km != null" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5"><span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quilometragem</span><span class="text-sm font-bold text-gray-800">{{ veiculo.km.toLocaleString("pt-BR") }} km</span></div>
              <div v-if="veiculo.combustivel" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5"><span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Combustível</span><span class="text-sm font-bold text-gray-800">{{ veiculo.combustivel }}</span></div>
              <div v-if="veiculo.cambio" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5"><span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Câmbio</span><span class="text-sm font-bold text-gray-800">{{ veiculo.cambio }}</span></div>
              <div v-if="veiculo.cor" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5"><span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cor</span><span class="text-sm font-bold text-gray-800">{{ veiculo.cor }}</span></div>
              <div v-if="veiculo.tipo" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5"><span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</span><span class="text-sm font-bold text-gray-800">{{ veiculo.tipo }}</span></div>
              <div v-if="veiculo.ano_fabricacao" class="flex flex-col gap-0.5 bg-gray-50 rounded-xl px-3 py-2.5"><span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ano</span><span class="text-sm font-bold text-gray-800">{{ veiculo.ano_fabricacao }}{{ veiculo.ano_modelo && veiculo.ano_modelo !== veiculo.ano_fabricacao ? `/${veiculo.ano_modelo}` : `` }}</span></div>
            </div>
          </div>
          <div v-if="veiculo.observacao" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"><h2 class="text-sm font-black text-gray-700 uppercase tracking-widest mb-3">Observações</h2><p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{{ veiculo.observacao }}</p></div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preço de venda</p>
            <p class="text-3xl font-black text-gray-900 mb-4">{{ formatCurrency(veiculo.preco_venda) }}</p>
            <div class="flex flex-col gap-2">
              <a
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-lg"
                :style="{ backgroundColor: whatsappHover ? '#128C7E' : '#25D366' }"
                @mouseover="whatsappHover = true"
                @mouseleave="whatsappHover = false"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.103 1.523 5.826L.057 23.786c-.07.27.16.5.427.427l5.96-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.028-1.386l-.36-.214-3.733.918.936-3.62-.235-.373A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                Tenho interesse
              </a>
              <NuxtLink :to="`/loja?e=${eId}`" class="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>Ver outros veículos</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { createSupabaseClient } from "~/lib/supabase"
import { usePersonalizacao } from "~/composables/usePersonalizacao"

definePageMeta({ layout: "public" })

interface Veiculo {
  id: number; marca: string; modelo: string
  ano_fabricacao: number | null; ano_modelo: number | null
  tipo: string | null; placa: string | null; cor: string | null
  km: number | null; combustivel: string | null; cambio: string | null
  preco_venda: number; status: string | null
  fotos: string[] | null; observacao: string | null; empresa_id: number
}

const route = useRoute()
const supabase = createSupabaseClient()
const { config: tema, loadPersonalizacaoPublic } = usePersonalizacao()
const { formatCurrency } = useLocale()

const eId = computed(() => Number(route.query.e ?? 0))
const veiculo   = ref<Veiculo | null>(null)
const loading   = ref(true)
const fotoIndex = ref(0)
const nomeEmpresa = ref("")
const whatsappHover = ref(false)

const fotos = computed(() => veiculo.value?.fotos?.filter(Boolean) ?? [])
const fotoAtiva = computed(() => fotos.value[fotoIndex.value] ?? null)

const whatsappLink = computed(() => {
  if (!veiculo.value) return "#"
  const texto = encodeURIComponent(
    `Olá! Tenho interesse no ${veiculo.value.marca} ${veiculo.value.modelo}` +
    (veiculo.value.ano_fabricacao ? ` ${veiculo.value.ano_fabricacao}` : "") +
    (veiculo.value.cor ? ` ${veiculo.value.cor}` : "") +
    ` por ${formatCurrency(veiculo.value.preco_venda)}.`
  )
  return `https://wa.me/?text=${texto}`
})

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id || isNaN(id) || !eId.value) { loading.value = false; return }
  await loadPersonalizacaoPublic(eId.value)
  nomeEmpresa.value = tema.value.nome_empresa || "Catálogo"
  const { data } = await supabase
    .from("veiculos")
    .select("id,marca,modelo,ano_fabricacao,ano_modelo,tipo,placa,cor,km,combustivel,cambio,preco_venda,status,fotos,observacao,empresa_id")
    .eq("id", id)
    .eq("empresa_id", eId.value)
    .single()
  veiculo.value = data ?? null
  loading.value = false
})

function statusLabel(s: string | null) {
  const map: Record<string, string> = { disponivel: "Disponível", vendido: "Vendido", reservado: "Reservado", manutencao: "Manutenção" }
  return map[s ?? ""] ?? s ?? ""
}
function statusBadgeClass(s: string | null) {
  if (s === "disponivel") return "bg-emerald-500 text-white"
  if (s === "reservado")  return "bg-blue-500 text-white"
  if (s === "vendido")    return "bg-red-500 text-white"
  if (s === "manutencao") return "bg-orange-500 text-white"
  return "bg-gray-500 text-white"
}
</script>
