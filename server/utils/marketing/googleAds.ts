// ═══════════════════════════════════════════════════════════════
// Google Ads API — mesma estrutura de metaAds.ts.
// SLOT A COMPLETAR: a chamada real requer OAuth (developer token +
// refresh_token) e o endpoint REST googleads.googleapis.com/v17/customers/
// <id>/googleAds:searchStream com uma query GAQL. Enquanto não houver
// credencial válida + developer token configurado, retorna vazio.
// ═══════════════════════════════════════════════════════════════

import type { Credenciais, PlatformResult, TesteConexao } from './types'
import { emptyResult } from './types'

export async function testarGoogleAds(creds: Credenciais): Promise<TesteConexao> {
  if (!creds.accessToken || !creds.accountId) {
    return { ok: false, erro: 'Token ou Customer ID ausente.' }
  }
  // TODO: validar via googleads.googleapis.com (requer developer-token no header).
  // Sem isso, marcamos como não implementado para não dar falso "conectado".
  return { ok: false, erro: 'Integração Google Ads ainda não habilitada neste ambiente (requer developer token).' }
}

export async function fetchGoogleAds(
  creds: Credenciais,
  _since: string,
  _until: string,
): Promise<PlatformResult> {
  // TODO: implementar googleAds:searchStream (GAQL) e normalizar para PlatformResult.
  // Estrutura idêntica ao metaAds.fetchMeta.
  return emptyResult('Google Ads não implementado.')
}
