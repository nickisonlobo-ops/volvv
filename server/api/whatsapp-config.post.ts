/**
 * POST /api/whatsapp-config
 * Cria ou atualiza a configuração WhatsApp da empresa.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { empresa_id, datafy_api_url, datafy_token, phone_number_id, display_phone_number, webhook_verify_token } = body

  if (!empresa_id || !datafy_token || !phone_number_id) {
    throw createError({ statusCode: 400, message: 'empresa_id, datafy_token e phone_number_id são obrigatórios' })
  }

  const supabase = useSupabaseServer()

  const row = {
    empresa_id,
    datafy_api_url: datafy_api_url || 'https://cloud.datafyapi.com.br',
    datafy_token,
    phone_number_id,
    display_phone_number: display_phone_number || null,
    webhook_verify_token: webhook_verify_token || null,
    ativo: true,
  }

  const { data, error } = await supabase
    .from('whatsapp_config')
    .upsert(row, { onConflict: 'empresa_id' })
    .select('*')
    .single()

  if (error) {
    console.error('[whatsapp-config] upsert:', error.message)
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
