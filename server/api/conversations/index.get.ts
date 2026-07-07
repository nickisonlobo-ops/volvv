/**
 * Lista de conversas paginada, filtrada pelo canal + inbox da empresa.
 * Query: ?empresa_id=X&limit=20&offset=0&canal=whatsapp|instagram|facebook
 * Sem `canal` (compat com o Chat existente) = comportamento antigo: WhatsApp.
 */
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const limit = Math.min(Math.max(Number(q.limit) || 20, 1), 50)
  const offset = Math.max(Number(q.offset) || 0, 0)
  const empresaId = q.empresa_id as string | undefined
  const canal = (q.canal as string) || 'whatsapp'

  const supabase = useSupabaseServer()

  let inboxId: string | null = null

  if (empresaId) {
    if (canal === 'whatsapp') {
      const { data: cfg } = await supabase
        .from('whatsapp_config')
        .select('phone_number_id')
        .eq('empresa_id', empresaId)
        .eq('ativo', true)
        .maybeSingle()
      inboxId = cfg?.phone_number_id ?? null
    } else {
      const { data: cfg } = await supabase
        .from('marketing_integracoes')
        .select('meta_msg_page_id, meta_msg_instagram_business_id')
        .eq('empresa_id', empresaId)
        .eq('plataforma', 'meta')
        .maybeSingle()
      inboxId = (canal === 'instagram' ? cfg?.meta_msg_instagram_business_id : cfg?.meta_msg_page_id) ?? null
    }
    console.log(`[conversations] empresa_id=${empresaId} canal=${canal} -> inboxId=${inboxId}`)
  }

  if (!inboxId) {
    // Sem config pro canal pedido = lista vazia
    console.log(`[conversations] empresa sem config pro canal ${canal}, retornando vazio`)
    return []
  }

  const query = supabase
    .from('conversations')
    .select('*')
    .eq('canal', canal)
    .eq('phone_number_id', inboxId)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  const { data, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  console.log(`[conversations] retornando ${data?.length ?? 0} conversas`)
  return data ?? []
})
