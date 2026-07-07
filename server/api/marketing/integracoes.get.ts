/**
 * Lista as integrações de marketing da empresa — APENAS METADADOS.
 * NUNCA retorna access_token / refresh_token (segredos).
 * Query: ?empresa_id=X
 */
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const empresaId = q.empresa_id as string | undefined
  if (!empresaId) {
    throw createError({ statusCode: 400, message: 'empresa_id obrigatório' })
  }

  const supabase = useSupabaseServer()
  const { data, error } = await supabase
    .from('marketing_integracoes')
    .select('id, plataforma, conta_nome, account_id, status, erro_msg, ultimo_sync, ativo, updated_at, meta_page_id, meta_msg_page_id, meta_msg_page_nome, meta_msg_instagram_business_id, meta_msg_instagram_usuario')
    .eq('empresa_id', empresaId)
    .order('plataforma', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data ?? []
})
