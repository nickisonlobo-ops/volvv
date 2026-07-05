interface DatafyMediaResponse {
  url: string
  mime_type?: string
  size?: number
}

/**
 * Resolve a URL pública de uma mídia a partir do media_id, via Datafy.
 *
 *   GET {apiUrl}/media/{id}
 *   Authorization: Bearer {token}
 *   -> { url, mime_type, size }
 *
 * Resolve credenciais via whatsapp_config (multi-tenant) com fallback para env.
 * Recebe phoneNumberId para identificar o tenant.
 */
export async function resolveMediaUrl(mediaId: string, phoneNumberId?: string): Promise<string | null> {
  let creds: { apiUrl: string; token: string }

  try {
    creds = await getWhatsAppCredentials(phoneNumberId)
  } catch {
    console.warn('[media] Não foi possível resolver credenciais WhatsApp')
    return null
  }

  try {
    console.log(`[media] resolvendo mídia ${mediaId} em ${creds.apiUrl}/media/${mediaId}`)
    const res = await $fetch<DatafyMediaResponse>(`${creds.apiUrl}/media/${mediaId}`, {
      headers: { Authorization: `Bearer ${creds.token}` },
    })
    console.log(`[media] URL resolvida: ${res?.url}`)
    return res?.url ?? null
  } catch (e: any) {
    console.error('[media] falha ao resolver mídia', mediaId, e?.message || e)
    return null
  }
}
