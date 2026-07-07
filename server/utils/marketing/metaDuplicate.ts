// ═══════════════════════════════════════════════════════════════
// Duplicação de objetos Meta via POST /<id>/copies.
// Campanha (deep_copy = leva conjuntos e anúncios), conjunto e anúncio.
// A cópia vem PAUSADA por segurança.
// ═══════════════════════════════════════════════════════════════

import type { Credenciais } from './types'
import type { AcaoResult } from './metaActions'
import type { NivelMeta } from './metaEdit'

const GRAPH = 'https://graph.facebook.com/v21.0'

function extrairErro(e: any): string {
  return e?.data?.error?.error_user_msg || e?.data?.error?.message || e?.message || 'Falha ao duplicar na Meta.'
}

/**
 * Duplica um objeto. Para campanha/conjunto, `deep` copia a subárvore.
 * Retorna o id do objeto copiado (campo varia: copied_*_id).
 */
export async function metaDuplicar(
  creds: Credenciais,
  id: string,
  nivel: NivelMeta,
  opts: { deep?: boolean; sufixo?: string } = {},
): Promise<AcaoResult> {
  if (!creds.accessToken) return { ok: false, erro: 'Token ausente.' }
  const body: Record<string, unknown> = {
    status_option: 'PAUSED',
    access_token: creds.accessToken,
  }
  if (nivel !== 'anuncio') body.deep_copy = opts.deep !== false
  if (opts.sufixo) body.rename_options = JSON.stringify({ rename_suffix: opts.sufixo })

  try {
    const res = await $fetch<Record<string, any>>(`${GRAPH}/${id}/copies`, { method: 'POST', body })
    // A Meta devolve copied_campaign_id / copied_adset_id / copied_ad_id ou { id }
    const novoId = res.copied_campaign_id || res.copied_adset_id || res.copied_ad_id || res.id || (res.ad_object_ids?.[0]?.copied_id)
    return { ok: true, id: novoId ? String(novoId) : undefined }
  } catch (e) {
    return { ok: false, erro: extrairErro(e) }
  }
}
