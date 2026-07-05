/**
 * Resolve credenciais WhatsApp/Datafy para um dado phone_number_id.
 * 1. Busca na tabela whatsapp_config (multi-tenant)
 * 2. Fallback para variáveis de ambiente (single-tenant / backward compat)
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
  const config = useRuntimeConfig()
  const envBase = (config.datafyApiUrl || process.env.DATAFY_API_URL) as string
  const envToken = (config.datafyNumberToken || process.env.DATAFY_NUMBER_TOKEN) as string
  const envPhoneId = (process.env.DATAFY_PHONE_NUMBER_ID) as string

  // Se não veio phone_number_id, usa env diretamente
  if (!phoneNumberId) {
    if (!envBase || !envToken) {
      throw createError({ statusCode: 500, message: 'WhatsApp não configurado (sem phone_number_id e sem env vars)' })
    }
    return { apiUrl: envBase, token: envToken, phoneNumberId: envPhoneId || '' }
  }

  // Checa cache
  const cached = cache.get(phoneNumberId)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data
  }

  // Busca na tabela whatsapp_config
  try {
    const supabase = useSupabaseServer()
    const { data, error } = await supabase
      .from('whatsapp_config')
      .select('datafy_api_url, datafy_token, phone_number_id')
      .eq('phone_number_id', phoneNumberId)
      .eq('ativo', true)
      .maybeSingle()

    if (!error && data) {
      const creds: WhatsAppCredentials = {
        apiUrl: data.datafy_api_url,
        token: data.datafy_token,
        phoneNumberId: data.phone_number_id,
      }
      cache.set(phoneNumberId, { data: creds, ts: Date.now() })
      return creds
    }
  } catch (e: any) {
    console.warn('[whatsapp-config] lookup falhou, usando env:', e?.message)
  }

  // Fallback: se o phoneNumberId bate com o do env, usa env
  if (envBase && envToken) {
    const fallback: WhatsAppCredentials = { apiUrl: envBase, token: envToken, phoneNumberId }
    cache.set(phoneNumberId, { data: fallback, ts: Date.now() })
    return fallback
  }

  throw createError({ statusCode: 500, message: `WhatsApp não configurado para phone_number_id ${phoneNumberId}` })
}

/** Invalida o cache (quando admin salva novas credenciais) */
export function invalidateWhatsAppCache(phoneNumberId?: string) {
  if (phoneNumberId) {
    cache.delete(phoneNumberId)
  } else {
    cache.clear()
  }
}
