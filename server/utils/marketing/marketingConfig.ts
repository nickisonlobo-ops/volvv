// ═══════════════════════════════════════════════════════════════
// Resolve credenciais de marketing (Meta/Google Ads/GA4) por empresa.
// Lê marketing_integracoes com a service role (ignora RLS), portanto é o
// ÚNICO ponto onde access_token/refresh_token são acessados. Nunca deve
// haver leitura desses campos a partir do frontend.
// Espelha o padrão de server/utils/whatsappConfig.ts.
// ═══════════════════════════════════════════════════════════════

import type { Credenciais, Plataforma } from './types'

/** Lista as credenciais ativas da empresa (com os segredos — server-only). */
export async function getIntegracoesAtivas(empresaId: string | number): Promise<Credenciais[]> {
  const supabase = useSupabaseServer()
  const { data, error } = await supabase
    .from('marketing_integracoes')
    .select('plataforma, account_id, access_token, refresh_token')
    .eq('empresa_id', empresaId)
    .eq('ativo', true)
    .eq('status', 'conectado')

  if (error) {
    console.error('[marketing-config] erro ao buscar integrações:', error.message)
    return []
  }

  return (data ?? []).map((r) => ({
    plataforma: r.plataforma as Plataforma,
    accountId: r.account_id,
    accessToken: r.access_token,
    refreshToken: r.refresh_token,
  }))
}

/** Busca a credencial de UMA plataforma (mesmo que ainda não testada). */
export async function getIntegracao(
  empresaId: string | number,
  plataforma: Plataforma,
): Promise<Credenciais | null> {
  const supabase = useSupabaseServer()
  const { data } = await supabase
    .from('marketing_integracoes')
    .select('plataforma, account_id, access_token, refresh_token, meta_page_id')
    .eq('empresa_id', empresaId)
    .eq('plataforma', plataforma)
    .maybeSingle()

  if (!data) return null
  return {
    plataforma: data.plataforma as Plataforma,
    accountId: data.account_id,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    pageId: data.meta_page_id ?? null,
  }
}
