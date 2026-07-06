// ═══════════════════════════════════════════════════════════════
// Google Analytics 4 (Data API) — fornece sessões por canal (o donut
// "Desempenho por canal"). Mesma estrutura de metaAds.ts.
// SLOT A COMPLETAR: a chamada real usa
//   POST analyticsdata.googleapis.com/v1beta/properties/<id>:runReport
//   dimension = sessionDefaultChannelGroup, metric = sessions
// com OAuth (refresh_token) ou service account. Retorna vazio até habilitar.
// ═══════════════════════════════════════════════════════════════

import type { Credenciais, PlatformResult, TesteConexao } from './types'
import { emptyResult } from './types'

// Cores por grupo de canal do GA4 (para o donut da Visão geral)
export const COR_CANAL: Record<string, string> = {
  'Organic Social': '#e1306c',
  'Paid Social': '#1877f2',
  'Organic Search': '#22c55e',
  'Paid Search': '#4285f4',
  Direct: '#8b5cf6',
  Email: '#f59e0b',
  Referral: '#06b6d4',
  Outros: '#94a3b8',
}

export async function testarGa4(creds: Credenciais): Promise<TesteConexao> {
  if (!creds.accessToken || !creds.accountId) {
    return { ok: false, erro: 'Token ou Property ID ausente.' }
  }
  // TODO: validar property via analyticsdata.googleapis.com runReport (1 linha).
  return { ok: false, erro: 'Integração GA4 ainda não habilitada neste ambiente.' }
}

export async function fetchGa4(
  creds: Credenciais,
  _since: string,
  _until: string,
): Promise<PlatformResult> {
  // TODO: runReport(dimension=sessionDefaultChannelGroup, metric=sessions) →
  // mapear para canais[] usando COR_CANAL. Estrutura idêntica ao metaAds.
  return emptyResult('GA4 não implementado.')
}
