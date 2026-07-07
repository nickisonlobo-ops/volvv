// ═══════════════════════════════════════════════════════════════
// Resolve credenciais de marketing (Meta/Google Ads/GA4) por empresa.
// Lê marketing_integracoes com a service role (ignora RLS), portanto é o
// ÚNICO ponto onde access_token/refresh_token são acessados. Nunca deve
// haver leitura desses campos a partir do frontend.
// Espelha o padrão de server/utils/whatsappConfig.ts.
// ═══════════════════════════════════════════════════════════════

import type { Credenciais, Plataforma } from './types'
import { buscarCredenciaisMensageria } from './metaAds'

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
    .select('plataforma, account_id, access_token, refresh_token, meta_page_id, meta_msg_page_id, meta_msg_page_nome, meta_msg_page_access_token, meta_msg_instagram_business_id, meta_msg_instagram_usuario')
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
    msgPageId: data.meta_msg_page_id ?? null,
    msgPageNome: data.meta_msg_page_nome ?? null,
    pageAccessToken: data.meta_msg_page_access_token ?? null,
    instagramBusinessId: data.meta_msg_instagram_business_id ?? null,
    instagramUsuario: data.meta_msg_instagram_usuario ?? null,
  }
}

/**
 * Acha o Page Access Token a partir do "inbox" (Page ID ou ID da conta do
 * Instagram) — usado pela central de mensagens pra enviar via Instagram/
 * Messenger, quando só se tem o id salvo em conversations.phone_number_id
 * (não o empresa_id diretamente). Espelha getWhatsAppCredentials(phoneNumberId).
 */
export async function getCredenciaisMensageriaPorInbox(
  inboxId: string,
): Promise<{ empresaId: number; pageAccessToken: string } | null> {
  const supabase = useSupabaseServer()
  const { data } = await supabase
    .from('marketing_integracoes')
    .select('empresa_id, meta_msg_page_access_token')
    .eq('plataforma', 'meta')
    .or(`meta_msg_page_id.eq.${inboxId},meta_msg_instagram_business_id.eq.${inboxId}`)
    .maybeSingle()

  if (!data?.meta_msg_page_access_token) return null
  return { empresaId: data.empresa_id, pageAccessToken: data.meta_msg_page_access_token }
}

/**
 * Troca qual Página do Facebook é usada pela central de mensagens (Instagram/
 * Messenger) — independente da Página usada em anúncios (meta_page_id).
 * Busca o Page Access Token + IG Business ID na hora e persiste.
 */
export async function selecionarPaginaMensageria(
  empresaId: string | number,
  pageId: string,
): Promise<{ ok: boolean; erro?: string; nome?: string; instagramUsuario?: string }> {
  const creds = await getIntegracao(empresaId, 'meta')
  if (!creds?.accessToken) return { ok: false, erro: 'Integração Meta não conectada.' }

  const info = await buscarCredenciaisMensageria(creds, pageId)
  if (!info.pageAccessToken) {
    return { ok: false, erro: 'Não foi possível obter o token dessa Página. Confirme que sua conta administra essa Página no Facebook.' }
  }

  const supabase = useSupabaseServer()
  const { error } = await supabase
    .from('marketing_integracoes')
    .update({
      meta_msg_page_id: pageId,
      meta_msg_page_nome: info.pageNome ?? null,
      meta_msg_page_access_token: info.pageAccessToken,
      meta_msg_instagram_business_id: info.instagramBusinessId ?? null,
      meta_msg_instagram_usuario: info.instagramUsuario ?? null,
    })
    .eq('empresa_id', empresaId)
    .eq('plataforma', 'meta')

  if (error) return { ok: false, erro: error.message }
  return { ok: true, nome: info.pageNome, instagramUsuario: info.instagramUsuario }
}
