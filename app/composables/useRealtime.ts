import { createSupabaseClient } from '~/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Composable para escutar mudanças em tempo real via Supabase Realtime.
 * Uso: useRealtime('tabela', callback) — chama callback ao INSERT/UPDATE/DELETE
 */
export function useRealtime(
  table: string,
  onChangeCallback: () => void,
  options?: { event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'; schema?: string }
) {
  const supabase = createSupabaseClient()
  let channel: RealtimeChannel | null = null

  function subscribe() {
    const event = options?.event ?? '*'
    const schema = options?.schema ?? 'public'

    channel = supabase
      .channel(`realtime-${table}-${Date.now()}`)
      .on('postgres_changes', { event, schema, table }, () => {
        onChangeCallback()
      })
      .subscribe()
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  onMounted(() => { subscribe() })
  onUnmounted(() => { unsubscribe() })

  return { subscribe, unsubscribe }
}

/**
 * Escuta múltiplas tabelas com um único callback de refresh.
 */
export function useRealtimeMulti(
  tables: string[],
  onChangeCallback: () => void
) {
  const supabase = createSupabaseClient()
  let channel: RealtimeChannel | null = null

  function subscribe() {
    const ch = supabase.channel(`realtime-multi-${Date.now()}`)
    for (const table of tables) {
      ch.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        onChangeCallback()
      })
    }
    channel = ch.subscribe()
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  onMounted(() => { subscribe() })
  onUnmounted(() => { unsubscribe() })

  return { subscribe, unsubscribe }
}
