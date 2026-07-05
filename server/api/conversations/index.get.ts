/**
 * Lista de conversas paginada, filtrada pelo phone_number_id da empresa.
 * Query: ?empresa_id=X&limit=20&offset=0
 *
 * Se empresa_id for informado, busca o phone_number_id na whatsapp_config
 * e filtra as conversas. Se não informado, retorna todas (backward compat temporário).
 */
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const limit = Math.min(Math.max(Number(q.limit) || 20, 1), 50)
  const offset = Math.max(Number(q.offset) || 0, 0)
  const empresaId = q.empresa_id as string | undefined

  const supabase = useSupabaseServer()

  let phoneNumberId: string | null = null

  // Resolve phone_number_id da empresa
  if (empresaId) {
    const { data: cfg } = await supabase
      .from('whatsapp_config')
      .select('phone_number_id')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)
      .maybeSingle()

    phoneNumberId = cfg?.phone_number_id ?? null
  }

  let query = supabase
    .from('conversations')
    .select('*')
    .order('last_message_at', { ascending: false, nullsFirst: false })

  // Filtra por phone_number_id se encontrou config
  if (phoneNumberId) {
    query = query.eq('phone_number_id', phoneNumberId)
  } else if (empresaId) {
    // Empresa informada mas sem config -> retorna todas conversas (pode ser phone_number_id diferente)
    // Não bloqueia mais — mostra o que tem
  }

  const { data, error } = await query.range(offset, offset + limit - 1)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data ?? []
})
