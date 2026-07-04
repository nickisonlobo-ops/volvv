interface DatafyMediaResponse {
  url: string
  mime_type?: string
  size?: number
}

/**
 * Resolve a URL pública de uma mídia a partir do media_id, via Datafy.
 *
 *   GET {DATAFY_API_URL}/media/{id}
 *   Authorization: Bearer {DATAFY_NUMBER_TOKEN}
 *   -> { url, mime_type, size }   (a url já é pública e estável)
 *
 * Retorna a `url` (ou null em falta de config / erro — a mensagem fica com
 * media_id preenchido e media_url nulo, dá pra reprocessar depois).
 */
export async function resolveMediaUrl(mediaId: string): Promise<string | null> {
  const config = useRuntimeConfig()
  const base = (config.datafyApiUrl || process.env.DATAFY_API_URL) as string
  const token = (config.datafyNumberToken || process.env.DATAFY_NUMBER_TOKEN) as string

  if (!base || !token) {
    console.warn('[media] Datafy não configurado (DATAFY_API_URL / DATAFY_NUMBER_TOKEN)')
    return null
  }

  try {
    console.log(`[media] resolvendo mídia ${mediaId} em ${base}/media/${mediaId}`)
    const res = await $fetch<DatafyMediaResponse>(`${base}/media/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log(`[media] URL resolvida: ${res?.url}`)
    return res?.url ?? null
  } catch (e: any) {
    console.error('[media] falha ao resolver mídia', mediaId, e?.message || e)
    return null
  }
}
