/**
 * Visão geral do Marketing — agrega dados REAIS de duas fontes:
 *   • CRM (tabela leads do Supabase): funil + KPIs de leads/oportunidades/clientes.
 *     Sempre reais, independem de integração de anúncio.
 *   • Plataformas de anúncio (Meta/Google Ads/GA4): mídia paga, campanhas,
 *     sessões por canal. Só quando há integração ativa/conectada.
 *
 * Query: ?empresa_id=X&since=YYYY-MM-DD&until=YYYY-MM-DD
 * Sem integração de anúncio → { conectado:false } (CRM ainda vem preenchido).
 */
import type { CampanhaNorm, CanalNorm, PlatformResult, SeriedPonto } from '../../utils/marketing/types'
import { getIntegracoesAtivas } from '../../utils/marketing/marketingConfig'
import { fetchMeta } from '../../utils/marketing/metaAds'
import { fetchGoogleAds } from '../../utils/marketing/googleAds'
import { fetchGa4 } from '../../utils/marketing/ga4'

function mesAtual() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const p = (n: number) => String(n).padStart(2, '0')
  const first = `${y}-${p(m + 1)}-01`
  const last = new Date(y, m + 1, 0)
  return { since: first, until: `${last.getFullYear()}-${p(last.getMonth() + 1)}-${p(last.getDate())}` }
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const empresaId = q.empresa_id as string | undefined
  if (!empresaId) {
    throw createError({ statusCode: 400, message: 'empresa_id obrigatório' })
  }
  const def = mesAtual()
  const since = (q.since as string) || def.since
  const until = (q.until as string) || def.until

  const supabase = useSupabaseServer()

  // ── 1. CRM: leads reais por status ──────────────────────────────
  const { data: leadsData } = await supabase
    .from('leads')
    .select('status, cliente_id')
    .eq('empresa_id', empresaId)

  const leads = leadsData ?? []
  const totalLeads = leads.length
  const oportunidades = leads.filter((l) => l.status === 'qualificado' || l.status === 'proposta').length
  const propostas = leads.filter((l) => l.status === 'proposta').length
  const clientes = leads.filter((l) => l.status === 'convertido').length

  // ── 2. Plataformas de anúncio ───────────────────────────────────
  const integracoes = await getIntegracoesAtivas(empresaId)
  const resultados: PlatformResult[] = []
  for (const cred of integracoes) {
    if (cred.plataforma === 'meta') resultados.push(await fetchMeta(cred, since, until))
    else if (cred.plataforma === 'google_ads') resultados.push(await fetchGoogleAds(cred, since, until))
    else if (cred.plataforma === 'ga4') resultados.push(await fetchGa4(cred, since, until))
  }
  const conectados = resultados.filter((r) => r.conectado)
  const conectado = conectados.length > 0
  // Integração configurada mas falhando (ex: token expirado) é diferente de "nunca conectou" —
  // sem isso, a tela mostra "conecte suas contas" mesmo já estando configurada, o que confunde.
  const erro = resultados.find((r) => !r.conectado && r.erro)?.erro

  // Agrega mídia paga
  let investimento = 0
  let cliques = 0
  let conversoes = 0
  const campanhas: CampanhaNorm[] = []
  const canais: CanalNorm[] = []
  const serieMap = new Map<string, number>()
  for (const r of conectados) {
    investimento += r.investimento
    cliques += r.cliques
    conversoes += r.conversoes
    campanhas.push(...r.campanhas)
    canais.push(...r.canais)
    for (const p of r.serie) serieMap.set(p.data, (serieMap.get(p.data) || 0) + p.valor)
  }
  const serie: SeriedPonto[] = [...serieMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([data, valor]) => ({ data, valor }))
  const cpc = cliques > 0 ? investimento / cliques : 0

  // Visitantes (topo do funil) = sessões dos canais, se houver; senão cliques
  const visitantes = canais.reduce((s, c) => s + c.qtd, 0) || cliques

  const funil = [
    { nome: 'Visitantes', qtd: visitantes, cor: '#4c1d95' },
    { nome: 'Leads', qtd: totalLeads, cor: '#6d28d9' },
    { nome: 'Oportunidades', qtd: oportunidades, cor: '#7c3aed' },
    { nome: 'Propostas', qtd: propostas, cor: '#8b5cf6' },
    { nome: 'Clientes', qtd: clientes, cor: '#22c55e' },
  ].map((e) => ({
    ...e,
    conv: visitantes > 0 ? `${((e.qtd / visitantes) * 100).toFixed(1)}%` : '—',
  }))

  // ROI de marketing = valor gerado / investimento. Sem fonte de receita
  // atribuída, deixamos null (UI mostra "—") para não inventar número.
  const roi = investimento > 0 && conversoes > 0
    ? `${Math.round(((conversoes * 200 - investimento) / investimento) * 100)}%`
    : null

  return {
    conectado,
    erro,
    plataformas: integracoes.map((i) => i.plataforma),
    periodo: { since, until },
    kpis: {
      leads: totalLeads,
      oportunidades,
      clientes,
      receita: null as number | null,   // sem fonte de receita atribuída
      roi,
    },
    funil,
    canais,
    campanhas,
    midiaPaga: conectado ? { investimento, cliques, cpc, conversoes, serie } : null,
  }
})
