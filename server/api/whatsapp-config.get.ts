/**
 * GET /api/whatsapp-config?empresa_id=X
 * Retorna a config do WhatsApp para a empresa (ou null se não configurado).
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const empresaId = query.empresa_id as string

  if (!empresaId) {
    throw createError({ statusCode: 400, message: 'empresa_id obrigatório' })
  }

  const supabase = useSupabaseServer()
  const { data, error } = await supabase
    .from('whatsapp_config')
    .select('*')
    .eq('empresa_id', empresaId)
    .maybeSingle()

  if (error) {
    console.error('[whatsapp-config] get:', error.message)
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
