// ═══════════════════════════════════════════════════════════════
// Ações de escrita na Meta Marketing API (Facebook + Instagram Ads).
// Requer token com escopo `ads_management` (leitura usa só `ads_read`).
// Todas as chamadas são server-side; o token nunca vai ao navegador.
// Docs: https://developers.facebook.com/docs/marketing-api/reference
// ═══════════════════════════════════════════════════════════════

import type { Credenciais } from './types'

const GRAPH = 'https://graph.facebook.com/v21.0'

function actId(id: string): string {
  return id.startsWith('act_') ? id : `act_${id}`
}

export interface AcaoResult {
  ok: boolean
  erro?: string
  id?: string
}

function extrairErro(e: any): string {
  return e?.data?.error?.error_user_msg || e?.data?.error?.message || e?.message || 'Falha na ação Meta.'
}

/** Pausa ou reativa uma campanha (ou adset/ad). status: 'ACTIVE' | 'PAUSED'. */
export async function metaSetStatus(creds: Credenciais, objectId: string, status: 'ACTIVE' | 'PAUSED'): Promise<AcaoResult> {
  if (!creds.accessToken) return { ok: false, erro: 'Token ausente.' }
  try {
    await $fetch(`${GRAPH}/${objectId}`, {
      method: 'POST',
      body: { status, access_token: creds.accessToken },
    })
    return { ok: true, id: objectId }
  } catch (e) {
    return { ok: false, erro: extrairErro(e) }
  }
}

/**
 * Ajusta o orçamento de uma campanha (CBO) ou adset.
 * valorReais = valor em R$ (convertido para centavos, como a Meta exige).
 * tipo: 'diario' → daily_budget; 'total' → lifetime_budget.
 */
export async function metaSetBudget(
  creds: Credenciais,
  objectId: string,
  valorReais: number,
  tipo: 'diario' | 'total' = 'diario',
): Promise<AcaoResult> {
  if (!creds.accessToken) return { ok: false, erro: 'Token ausente.' }
  if (!(valorReais > 0)) return { ok: false, erro: 'Valor inválido.' }
  const centavos = Math.round(valorReais * 100)
  const campo = tipo === 'total' ? 'lifetime_budget' : 'daily_budget'
  try {
    await $fetch(`${GRAPH}/${objectId}`, {
      method: 'POST',
      body: { [campo]: centavos, access_token: creds.accessToken },
    })
    return { ok: true, id: objectId }
  } catch (e) {
    return { ok: false, erro: extrairErro(e) }
  }
}

/**
 * Cria uma campanha (começa PAUSED por segurança).
 * objetivo: OUTCOME_LEADS | OUTCOME_TRAFFIC | OUTCOME_SALES | OUTCOME_ENGAGEMENT | OUTCOME_AWARENESS
 * orcamentoDiarioReais: opcional, ativa CBO (orçamento na campanha).
 */
export async function metaCreateCampaign(
  creds: Credenciais,
  opts: { nome: string; objetivo?: string; orcamentoDiarioReais?: number; ativar?: boolean },
): Promise<AcaoResult> {
  if (!creds.accessToken || !creds.accountId) return { ok: false, erro: 'Credenciais ausentes.' }
  const body: Record<string, unknown> = {
    name: opts.nome,
    objective: opts.objetivo || 'OUTCOME_TRAFFIC',
    status: opts.ativar ? 'ACTIVE' : 'PAUSED',
    special_ad_categories: '[]', // obrigatório pela Meta (sem categoria especial)
    access_token: creds.accessToken,
  }
  if (opts.orcamentoDiarioReais && opts.orcamentoDiarioReais > 0) {
    body.daily_budget = Math.round(opts.orcamentoDiarioReais * 100)
  } else {
    // Sem orçamento na campanha (orçamento fica no conjunto/ABO) — a Meta exige declarar
    // explicitamente se os conjuntos poderão compartilhar orçamento entre si (recurso novo).
    body.is_adset_budget_sharing_enabled = false
  }
  try {
    const res = await $fetch<{ id: string }>(`${GRAPH}/${actId(creds.accountId)}/campaigns`, {
      method: 'POST',
      body,
    })
    return { ok: true, id: res.id }
  } catch (e) {
    return { ok: false, erro: extrairErro(e) }
  }
}

/** Exclui uma campanha (status DELETED — irreversível na Meta). */
export async function metaDeleteCampaign(creds: Credenciais, campaignId: string): Promise<AcaoResult> {
  if (!creds.accessToken) return { ok: false, erro: 'Token ausente.' }
  try {
    await $fetch(`${GRAPH}/${campaignId}`, {
      method: 'DELETE',
      query: { access_token: creds.accessToken },
    })
    return { ok: true, id: campaignId }
  } catch (e) {
    return { ok: false, erro: extrairErro(e) }
  }
}

// ─────────────────────────────────────────────────────────────
// CRIAÇÃO COMPLETA DE ANÚNCIO: Campanha → Conjunto → Criativo → Anúncio
// Foco no caso comum (objetivo Tráfego / cliques no link).
// Tudo criado PAUSADO por segurança.
// ─────────────────────────────────────────────────────────────

export type FormatoAnuncio = 'imagem' | 'video' | 'carrossel'

export interface CardCarrossel {
  link?: string                // se vazio, usa linkDestino
  titulo?: string
  descricao?: string
  imagemUrl?: string
  imagemBase64?: string        // upload
}

export interface AlvoRef { id: string; name: string }

export interface AnuncioInput {
  // Campanha: usa existente OU cria nova
  campanhaId?: string
  campanhaNome?: string
  objetivo?: string            // OUTCOME_TRAFFIC (padrão)
  // Conjunto (adset) — orçamento
  nome: string
  orcamentoDiarioReais?: number
  orcamentoTotalReais?: number // lifetime_budget (exige início+fim)
  // Lance
  bidStrategy?: string         // LOWEST_COST_WITHOUT_CAP | COST_CAP | LOWEST_COST_WITH_BID_CAP
  bidAmountReais?: number      // usado com COST_CAP / bid cap
  optimizationGoal?: string    // sobrescreve o padrão
  billingEvent?: string        // IMPRESSIONS | LINK_CLICKS
  // Agendamento
  inicio?: string              // ISO start_time
  fim?: string                 // ISO end_time
  daypartingHoras?: number[]   // horas do dia (0-23) permitidas (exige orçamento total)
  // Segmentação
  paises?: string[]            // ['BR'] padrão
  cidades?: string[]           // keys de adgeolocation (cidade)
  raioKm?: number              // raio p/ cidades
  idadeMin?: number            // 18 padrão
  idadeMax?: number            // 65 padrão
  generos?: number[]           // [1]=masc [2]=fem; vazio = todos
  idiomas?: number[]           // locales
  interesses?: AlvoRef[]
  comportamentos?: AlvoRef[]
  exclusoesInteresses?: AlvoRef[]
  publicosIncluir?: string[]   // custom_audiences ids
  publicosExcluir?: string[]   // excluded_custom_audiences ids
  // Posicionamentos (manual). Vazio = automático (Advantage+).
  plataformas?: string[]       // facebook, instagram, audience_network, messenger
  posFacebook?: string[]
  posInstagram?: string[]
  dispositivos?: string[]      // mobile, desktop
  // Conversão (opcional — objetivos Leads/Vendas)
  pixelId?: string
  eventoConversao?: string     // PURCHASE, LEAD, COMPLETE_REGISTRATION...
  // Criativo
  formato?: FormatoAnuncio     // 'imagem' (padrão)
  pageId: string
  linkDestino: string
  mensagem: string             // texto principal
  titulo?: string              // headline
  descricao?: string
  cta?: string                 // LEARN_MORE (padrão), SHOP_NOW, SIGN_UP...
  instagramActorId?: string    // opcional (conta IG para placement IG)
  // Imagem única
  imagemUrl?: string
  imagemBase64?: string        // upload → image_hash
  // Vídeo
  videoId?: string             // já enviado (upload por arquivo)
  videoUrl?: string            // Meta baixa o vídeo desta URL
  videoThumbUrl?: string       // thumbnail obrigatório para vídeo
  // Carrossel
  cards?: CardCarrossel[]
  ativar?: boolean
}

/** Faz upload de uma imagem (base64) e retorna o image_hash. */
export async function metaUploadImage(creds: Credenciais, base64: string): Promise<{ ok: boolean; hash?: string; erro?: string }> {
  if (!creds.accessToken || !creds.accountId) return { ok: false, erro: 'Credenciais ausentes.' }
  // Remove prefixo data:...;base64, se vier
  const bytes = base64.includes(',') ? base64.split(',')[1] : base64
  try {
    const res = await $fetch<{ images: Record<string, { hash: string }> }>(`${GRAPH}/${actId(creds.accountId)}/adimages`, {
      method: 'POST',
      body: { bytes, access_token: creds.accessToken },
    })
    const first = Object.values(res.images || {})[0]
    if (!first?.hash) return { ok: false, erro: 'Upload de imagem sem hash de retorno.' }
    return { ok: true, hash: first.hash }
  } catch (e) {
    return { ok: false, erro: 'Imagem: ' + extrairErro(e) }
  }
}

/** Sobe um vídeo a partir de uma URL (Meta baixa) e retorna o video_id. */
export async function metaUploadVideoFromUrl(creds: Credenciais, url: string): Promise<{ ok: boolean; id?: string; erro?: string }> {
  if (!creds.accessToken || !creds.accountId) return { ok: false, erro: 'Credenciais ausentes.' }
  try {
    const res = await $fetch<{ id: string }>(`${GRAPH}/${actId(creds.accountId)}/advideos`, {
      method: 'POST',
      body: { file_url: url, access_token: creds.accessToken },
    })
    return { ok: true, id: res.id }
  } catch (e) {
    return { ok: false, erro: 'Vídeo: ' + extrairErro(e) }
  }
}

/** Objetivos de conversão que exigem pixel + optimization_goal OFFSITE_CONVERSIONS. */
function ehConversao(objetivo?: string): boolean {
  return objetivo === 'OUTCOME_SALES' || objetivo === 'OUTCOME_LEADS'
}

/** Monta o objeto targeting completo a partir do input (reutilizável em criar/editar). */
export function montarTargeting(i: AnuncioInput): Record<string, unknown> {
  // Cidades específicas já definem seu país implicitamente (a key da Meta carrega isso).
  // Combinar "countries" (país inteiro) com "cities" (cidade dentro dele) no mesmo alvo é
  // redundante e a Meta rejeita com "remova uma localização conflitante" — por isso são
  // mutuamente exclusivos aqui: cidades manda, país só entra quando não há cidade nenhuma.
  const geo: Record<string, unknown> = i.cidades && i.cidades.length
    ? { cities: i.cidades.map((key) => ({ key, radius: i.raioKm || 10, distance_unit: 'kilometer' })) }
    : { countries: i.paises && i.paises.length ? i.paises : ['BR'] }
  const targeting: Record<string, unknown> = {
    geo_locations: geo,
    age_min: i.idadeMin ?? 18,
    age_max: i.idadeMax ?? 65,
  }
  if (i.generos && i.generos.length) targeting.genders = i.generos
  if (i.idiomas && i.idiomas.length) targeting.locales = i.idiomas

  // flexible_spec: interesses + comportamentos (inclusão)
  const flex: Record<string, unknown> = {}
  if (i.interesses && i.interesses.length) flex.interests = i.interesses.map((it) => ({ id: it.id, name: it.name }))
  if (i.comportamentos && i.comportamentos.length) flex.behaviors = i.comportamentos.map((it) => ({ id: it.id, name: it.name }))
  if (Object.keys(flex).length) targeting.flexible_spec = [flex]

  // exclusões
  const exclusions: Record<string, unknown> = {}
  if (i.exclusoesInteresses && i.exclusoesInteresses.length) exclusions.interests = i.exclusoesInteresses.map((it) => ({ id: it.id, name: it.name }))
  if (Object.keys(exclusions).length) targeting.exclusions = exclusions

  // custom audiences
  if (i.publicosIncluir && i.publicosIncluir.length) targeting.custom_audiences = i.publicosIncluir.map((id) => ({ id }))
  if (i.publicosExcluir && i.publicosExcluir.length) targeting.excluded_custom_audiences = i.publicosExcluir.map((id) => ({ id }))

  // posicionamentos manuais (se vazio → automático)
  if (i.plataformas && i.plataformas.length) targeting.publisher_platforms = i.plataformas
  if (i.posFacebook && i.posFacebook.length) targeting.facebook_positions = i.posFacebook
  if (i.posInstagram && i.posInstagram.length) targeting.instagram_positions = i.posInstagram
  if (i.dispositivos && i.dispositivos.length) targeting.device_platforms = i.dispositivos

  return targeting
}

/** Cria conjunto de anúncios (adset). */
async function criarAdSet(creds: Credenciais, campanhaId: string, i: AnuncioInput): Promise<AcaoResult> {
  const targeting = montarTargeting(i)
  const usaPixel = ehConversao(i.objetivo) && i.pixelId

  const body: Record<string, unknown> = {
    name: `${i.nome} — conjunto`,
    campaign_id: campanhaId,
    billing_event: i.billingEvent || 'IMPRESSIONS',
    optimization_goal: i.optimizationGoal || (usaPixel ? 'OFFSITE_CONVERSIONS' : 'LINK_CLICKS'),
    bid_strategy: i.bidStrategy || 'LOWEST_COST_WITHOUT_CAP',
    status: 'PAUSED',
    targeting: JSON.stringify(targeting),
    access_token: creds.accessToken,
  }
  // Orçamento: total (lifetime) exige início+fim; senão diário
  if (i.orcamentoTotalReais && i.orcamentoTotalReais > 0) {
    body.lifetime_budget = Math.round(i.orcamentoTotalReais * 100)
    if (!i.fim) return { ok: false, erro: 'Orçamento total exige data de término.' }
  } else {
    body.daily_budget = Math.round((i.orcamentoDiarioReais || 0) * 100)
  }
  // Lance com teto
  if ((i.bidStrategy === 'COST_CAP' || i.bidStrategy === 'LOWEST_COST_WITH_BID_CAP') && i.bidAmountReais) {
    body.bid_amount = Math.round(i.bidAmountReais * 100)
  }
  // Agendamento
  if (i.inicio) body.start_time = i.inicio
  if (i.fim) body.end_time = i.fim
  if (i.daypartingHoras && i.daypartingHoras.length && i.orcamentoTotalReais) {
    // dayparting exige orçamento total; monta blocos por dia (todos os dias)
    body.adset_schedule = JSON.stringify(
      i.daypartingHoras.map((h) => ({ start_minute: h * 60, end_minute: h * 60 + 59, days: [0, 1, 2, 3, 4, 5, 6] })),
    )
  }
  if (usaPixel) {
    body.promoted_object = JSON.stringify({ pixel_id: i.pixelId, custom_event_type: i.eventoConversao || 'PURCHASE' })
  }
  try {
    const res = await $fetch<{ id: string }>(`${GRAPH}/${actId(creds.accountId!)}/adsets`, { method: 'POST', body })
    return { ok: true, id: res.id }
  } catch (e) {
    return { ok: false, erro: 'Conjunto: ' + extrairErro(e) }
  }
}

/**
 * Monta o object_story_spec do criativo conforme o formato (imagem única / vídeo / carrossel).
 * Faz upload de imagens (base64) e vídeo (URL) quando necessário.
 * Reaproveitado tanto pra criar o criativo de verdade quanto pra gerar a prévia (generatepreviews).
 */
export async function montarObjectStorySpec(creds: Credenciais, i: AnuncioInput): Promise<{ ok: boolean; spec?: Record<string, unknown>; erro?: string }> {
  const cta = i.cta ? { type: i.cta, value: { link: i.linkDestino } } : undefined
  const storySpec: Record<string, unknown> = { page_id: i.pageId }
  if (i.instagramActorId) storySpec.instagram_actor_id = i.instagramActorId
  const formato: FormatoAnuncio = i.formato || 'imagem'

  try {
    if (formato === 'video') {
      if (!i.videoThumbUrl) return { ok: false, erro: 'Vídeo: thumbnail (imagem de capa) é obrigatório.' }
      let videoId = i.videoId
      if (!videoId) {
        if (!i.videoUrl) return { ok: false, erro: 'Vídeo: envie o arquivo ou informe a URL.' }
        const up = await metaUploadVideoFromUrl(creds, i.videoUrl)
        if (!up.ok) return { ok: false, erro: up.erro }
        videoId = up.id
      }
      storySpec.video_data = {
        video_id: videoId,
        image_url: i.videoThumbUrl,
        message: i.mensagem,
        ...(i.titulo ? { title: i.titulo } : {}),
        ...(i.descricao ? { link_description: i.descricao } : {}),
        ...(cta ? { call_to_action: cta } : {}),
      }
    } else if (formato === 'carrossel') {
      const cards = i.cards || []
      if (cards.length < 2) return { ok: false, erro: 'Carrossel: informe pelo menos 2 cartões.' }
      const child: Record<string, unknown>[] = []
      for (const c of cards) {
        const att: Record<string, unknown> = { link: c.link || i.linkDestino }
        if (c.titulo) att.name = c.titulo
        if (c.descricao) att.description = c.descricao
        if (c.imagemBase64) {
          const up = await metaUploadImage(creds, c.imagemBase64)
          if (!up.ok) return { ok: false, erro: up.erro }
          att.image_hash = up.hash
        } else if (c.imagemUrl) {
          att.picture = c.imagemUrl
        }
        if (cta) att.call_to_action = cta
        child.push(att)
      }
      storySpec.link_data = {
        link: i.linkDestino,
        message: i.mensagem,
        child_attachments: child,
        multi_share_optimized: true,
        ...(cta ? { call_to_action: cta } : {}),
      }
    } else {
      // imagem única
      const linkData: Record<string, unknown> = { link: i.linkDestino, message: i.mensagem }
      if (i.titulo) linkData.name = i.titulo
      if (i.descricao) linkData.description = i.descricao
      if (i.imagemBase64) {
        const up = await metaUploadImage(creds, i.imagemBase64)
        if (!up.ok) return { ok: false, erro: up.erro }
        linkData.image_hash = up.hash
      } else if (i.imagemUrl) {
        linkData.picture = i.imagemUrl
      }
      if (cta) linkData.call_to_action = cta
      storySpec.link_data = linkData
    }
    return { ok: true, spec: storySpec }
  } catch (e) {
    return { ok: false, erro: 'Criativo: ' + extrairErro(e) }
  }
}

/**
 * Cria o criativo conforme o formato (imagem única / vídeo / carrossel).
 * Faz upload de imagens (base64) e vídeo (URL) quando necessário.
 */
async function criarCreative(creds: Credenciais, i: AnuncioInput): Promise<AcaoResult> {
  const specRes = await montarObjectStorySpec(creds, i)
  if (!specRes.ok) return { ok: false, erro: specRes.erro }
  try {
    const res = await $fetch<{ id: string }>(`${GRAPH}/${actId(creds.accountId!)}/adcreatives`, {
      method: 'POST',
      body: {
        name: `${i.nome} — criativo`,
        object_story_spec: JSON.stringify(specRes.spec),
        access_token: creds.accessToken,
      },
    })
    return { ok: true, id: res.id }
  } catch (e) {
    return { ok: false, erro: 'Criativo: ' + extrairErro(e) }
  }
}

/**
 * Gera uma prévia real do anúncio (iframe da Meta) sem criar nenhum objeto.
 * adFormat: MOBILE_FEED_STANDARD | DESKTOP_FEED_STANDARD | FACEBOOK_STORY_MOBILE | INSTAGRAM_STANDARD | INSTAGRAM_STORY...
 */
export async function metaGeneratePreview(
  creds: Credenciais,
  i: AnuncioInput,
  adFormat: string,
): Promise<{ ok: boolean; iframeSrc?: string; erro?: string }> {
  if (!creds.accessToken || !creds.accountId) return { ok: false, erro: 'Credenciais ausentes.' }
  const pageId = i.pageId || creds.pageId
  if (!pageId) return { ok: false, erro: 'Selecione uma Página do Facebook para pré-visualizar.' }
  if (!i.linkDestino || !i.mensagem) return { ok: false, erro: 'Preencha o link e o texto principal para pré-visualizar.' }

  const specRes = await montarObjectStorySpec(creds, { ...i, pageId })
  if (!specRes.ok) return { ok: false, erro: specRes.erro }

  try {
    const res = await $fetch<{ data: { body: string }[] }>(`${GRAPH}/${actId(creds.accountId)}/generatepreviews`, {
      query: {
        creative: JSON.stringify({ object_story_spec: specRes.spec }),
        ad_format: adFormat,
        access_token: creds.accessToken,
      },
    })
    const html = res.data?.[0]?.body
    if (!html) return { ok: false, erro: 'A Meta não retornou uma prévia.' }
    const match = html.match(/src="([^"]+)"/)
    const iframeSrc = match?.[1]?.replace(/&amp;/g, '&')
    if (!iframeSrc) return { ok: false, erro: 'Não foi possível extrair a prévia.' }
    return { ok: true, iframeSrc }
  } catch (e) {
    return { ok: false, erro: 'Prévia: ' + extrairErro(e) }
  }
}

/** Cria o anúncio ligando conjunto + criativo. */
async function criarAd(creds: Credenciais, adsetId: string, creativeId: string, i: AnuncioInput): Promise<AcaoResult> {
  try {
    const res = await $fetch<{ id: string }>(`${GRAPH}/${actId(creds.accountId!)}/ads`, {
      method: 'POST',
      body: {
        name: i.nome,
        adset_id: adsetId,
        creative: JSON.stringify({ creative_id: creativeId }),
        status: i.ativar ? 'ACTIVE' : 'PAUSED',
        access_token: creds.accessToken,
      },
    })
    return { ok: true, id: res.id }
  } catch (e) {
    return { ok: false, erro: 'Anúncio: ' + extrairErro(e) }
  }
}

export interface AnuncioResult {
  ok: boolean
  erro?: string
  campanhaId?: string
  adsetId?: string
  creativeId?: string
  adId?: string
}

/**
 * Cria um anúncio COMPLETO: campanha (se preciso) → conjunto → criativo → anúncio.
 * Para em qualquer erro e devolve o que já criou (pra não deixar lixo órfão sem rastro).
 */
export async function metaCreateFullAd(creds: Credenciais, i: AnuncioInput): Promise<AnuncioResult> {
  if (!creds.accessToken || !creds.accountId) return { ok: false, erro: 'Credenciais Meta ausentes.' }
  const pageId = i.pageId || creds.pageId
  if (!pageId) return { ok: false, erro: 'Page ID do Facebook é obrigatório para criar anúncios (configure na integração Meta).' }
  if (!i.linkDestino) return { ok: false, erro: 'Link de destino é obrigatório.' }
  if (!((i.orcamentoDiarioReais || 0) > 0) && !((i.orcamentoTotalReais || 0) > 0)) {
    return { ok: false, erro: 'Informe um orçamento (diário ou total).' }
  }
  const input = { ...i, pageId }

  // 1) Campanha
  let campanhaId = i.campanhaId
  if (!campanhaId) {
    const camp = await metaCreateCampaign(creds, { nome: i.campanhaNome || i.nome, objetivo: i.objetivo || 'OUTCOME_TRAFFIC', ativar: false })
    if (!camp.ok) return { ok: false, erro: camp.erro }
    campanhaId = camp.id
  }

  // 2) Conjunto
  const adset = await criarAdSet(creds, campanhaId!, input)
  if (!adset.ok) return { ok: false, erro: adset.erro, campanhaId }

  // 3) Criativo
  const creative = await criarCreative(creds, input)
  if (!creative.ok) return { ok: false, erro: creative.erro, campanhaId, adsetId: adset.id }

  // 4) Anúncio
  const ad = await criarAd(creds, adset.id!, creative.id!, input)
  if (!ad.ok) return { ok: false, erro: ad.erro, campanhaId, adsetId: adset.id, creativeId: creative.id }

  return { ok: true, campanhaId, adsetId: adset.id, creativeId: creative.id, adId: ad.id }
}
