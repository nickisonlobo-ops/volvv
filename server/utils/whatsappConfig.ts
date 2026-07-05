/**
 * Resolve credenciais WhatsApp/Datafy para um dado phone_number_id.
 * Busca SOMENTE na tabela whatsapp_config (multi-tenant).
 * Tenta pelo phone_number_id. Se não encontrar, busca a primeira config ativa
 * (para backward compat quando phone_number_id mudou na Datafy).
 */

interface WhatsAppCredentials {
  apiUrl: string
  token: string
  phoneNumberId: string
}

// Cache em memória (TTL 5 min)
const cache = new Map<string, { data: WhatsAppCredentials; ts: number }>()
const CACHE_TTL = 5 * 60 * 1000

export async function getWhatsAppCredentials(phoneNumberId?: string): Promise<WhatsAppCredentials> {
  if (!phoneNumberId) {
    throw createError({ statusCode: 500, message: 'WhatsApp não configurado (phone_number_id ausente)' })
  }

  // Checa cache
  const cached = cache.get(phoneNumberId)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data
  }

  const supabase = useSupabaseServer()

  // 1) Busca exata pelo phone_number_id
  let { data } = await supabase
    .from('whatsapp_config')
    .select('datafy_api_url, datafy_token, phone_number_id')
    .eq('phone_number_id', phoneNumberId)
    .eq('ativo', true)
    .maybeSingle()

  // 2) Se não encontrou, busca qualquer config ativa (fallback single-tenant)
  if (!data) {
    const res = await supabase
      .from('whatsapp_config')
      .select('datafy_api_url, datafy_token, phone_number_id')
      .eq('ativo', true)
      .limit(1)
      .maybeSingle()
    data = res.data
  }

  if (!data) {
    console.error('[whatsapp-config] nenhuma config ativa encontrada para phone_number_id:', phoneNumberId)
    throw createError({ statusCode: 500, message: 'WhatsApp não configurado. Configure em Configurações > WhatsApp.' })
  }

  const creds: WhatsAppCredentials = {
    apiUrl: data.datafy_api_url,
    token: data.datafy_token,
    phoneNumberId: data.phone_number_id,
  }
  cache.set(phoneNumberId, { data: creds, ts: Date.now() })
  return creds
}

/** Invalida o cache */
export function invalidateWhatsAppCache(phoneNumberId?: string) {
  if (phoneNumberId) {
    cache.delete(phoneNumberId)
  } else {
    cache.clear()
  }
}
