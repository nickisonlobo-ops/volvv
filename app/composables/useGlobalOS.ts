import { ref } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'
import type { OrdemServico, ItemOS } from '~/composables/useOrdensServico'

const showGlobalOS = ref(false)
const globalOS = ref<any>(null)
const globalItensOS = ref<ItemOS[]>([])

export function useGlobalOS() {
  const supabase = createSupabaseClient()

  async function abrirOS(osId: number) {
    const { data: osData } = await supabase
      .from('ordens_servico_adesivo')
      .select('*, clientes(nome, telefone)')
      .eq('id', osId)
      .single()
    if (!osData) return

    const { data: itensData } = await supabase
      .from('itens_ordem_servico')
      .select('id, item_orcamento_id, descricao, material_id, largura_cm, altura_cm, quantidade, valor_item, foto_arte_url, foto_local_url, arquivo_url, foto_instalacao_url')
      .eq('ordem_servico_id', osId)
      .order('id', { ascending: true })

    globalOS.value = {
      ...osData,
      cliente_nome: osData.clientes?.nome ?? null,
      cliente_telefone: osData.clientes?.telefone ?? null,
      endereco_instalacao: osData.endereco_instalacao ?? null,
      nome_trabalho: osData.nome_trabalho ?? null,
      data_entrega: osData.data_entrega ?? null,
    }
    globalItensOS.value = (itensData ?? []) as ItemOS[]
    showGlobalOS.value = true
  }

  function fecharOS() {
    showGlobalOS.value = false
    globalOS.value = null
    globalItensOS.value = []
  }

  return {
    showGlobalOS,
    globalOS,
    globalItensOS,
    abrirOS,
    fecharOS,
  }
}
