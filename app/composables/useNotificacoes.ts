import { ref, computed } from 'vue'
import { createSupabaseClient } from '~/lib/supabase'

export interface Notificacao {
  id: number
  user_id: string
  tipo: string
  titulo: string
  mensagem: string
  lida: boolean
  link?: string | null
  created_at: string
}

const notificacoes = ref<Notificacao[]>([])
const carregando = ref(false)

export function useNotificacoes() {
  const supabase = createSupabaseClient()

  const naoLidas = computed(() => notificacoes.value.filter(n => !n.lida).length)

  async function carregarNotificacoes() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    carregando.value = true
    const { data } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(30)
    notificacoes.value = (data ?? []) as Notificacao[]
    carregando.value = false
  }

  async function marcarComoLida(id: number) {
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id)
    const n = notificacoes.value.find(x => x.id === id)
    if (n) n.lida = true
  }

  async function marcarTodasComoLidas() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    await supabase.from('notificacoes').update({ lida: true }).eq('user_id', session.user.id).eq('lida', false)
    notificacoes.value.forEach(n => n.lida = true)
  }

  return {
    notificacoes,
    naoLidas,
    carregando,
    carregarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
  }
}
