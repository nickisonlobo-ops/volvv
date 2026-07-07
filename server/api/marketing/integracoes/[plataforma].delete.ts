/**
 * Desconecta uma integração de marketing (remove a credencial).
 * DELETE /api/marketing/integracoes/:plataforma?empresa_id=X
 */
export default defineEventHandler(async (event) => {
  const plataforma = getRouterParam(event, 'plataforma')
  const q = getQuery(event)
  const empresaId = q.empresa_id as string | undefined

  if (!empresaId || !plataforma) {
    throw createError({ statusCode: 400, message: 'empresa_id e plataforma obrigatórios' })
  }

  const supabase = useSupabaseServer()
  const { error } = await supabase
    .from('marketing_integracoes')
    .delete()
    .eq('empresa_id', empresaId)
    .eq('plataforma', plataforma)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true }
})
