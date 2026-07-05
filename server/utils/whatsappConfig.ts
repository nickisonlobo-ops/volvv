/**
 * Resolve credenciais WhatsApp/Datafy para um dado phone_number_id.
 * Busca SOMENTE na tabela whatsapp_config (multi-tenant).
 * Não usa variáveis de ambiente.
 */

interface WhatsAppCredentials {
  apiUrl: string
  token: string
  phoneNumberId: string
}

// Cache em memória (TTL 5 min) para não bater no banco a cada mensagem
const cache = new Map<string, { data: WhatsAppCredentials; ts: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export async function getWhatsAppCredentials(phoneNumberId?: string): Promise<WhatsAppCredentials> {
  if (!phoneNumberId) {
    throw createError({ statusCode: 500, message: 'WhatsApp não configurado (phone_number_id ausente)' })
  }

  // Checa cache
  const cached = cache.get(phoneNumberId)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data
  }

  // Busca na tabela whatsapp_config
  const supabase = useSupabaseServer()
  const { data, error } = await supabase
    .from('whatsapp_config')
    .select('datafy_api_url, datafy_token, phone_number_id')
    .eq('phone_number_id', phoneNumberId)
    .eq('ativo', true)
    .maybeSingle()

  if (error || !data) {
    console.error('[whatsapp-config] credenciais não encontradas para phone_number_id:', phoneNumberId)
    throw createError({ statusCode: 500, message: `WhatsApp não configurado para este número. Configure em Configurações > WhatsApp.` })
  }

  const creds: WhatsAppCredentials = {
    apiUrl: data.datafy_api_url,
    token: data.datafy_token,
    phoneNumberId: data.phone_number_id,
  }
  cache.set(phoneNumberId, { data: creds, ts: Date.now() })
  return creds
}

/** Invalida o cache (quando admin salva novas credenciais) */
export function invalidateWhatsAppCache(phoneNumberId?: string) {
  if (phoneNumberId) {
    cache.delete(phoneNumberId)
  } else {
    cache.clear()
  }
}
