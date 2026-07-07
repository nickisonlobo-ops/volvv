// ═══════════════════════════════════════════════════════════════
// Tipos normalizados do módulo Marketing.
// Cada helper de plataforma (metaAds/googleAds/ga4) converte a resposta
// crua da API externa para PlatformResult. O endpoint overview.get.ts
// agrega os resultados de todas as integrações ativas.
// ═══════════════════════════════════════════════════════════════

export type Plataforma = 'meta' | 'google_ads' | 'ga4'

export interface CampanhaNorm {
  id: string               // ID da campanha na plataforma (para ações)
  plataforma: Plataforma   // origem, para rotear ações
  nome: string
  canal: string            // 'meta' | 'google_ads' | nome amigável
  icone: string            // emoji para a UI
  investimento: number     // R$ no período
  resultado: string        // ex: "248 leads", "32 clientes"
  roi: string              // ex: "312%" ou "—"
  status: string           // 'ativa' | 'pausada' | 'encerrada'
}

export interface CanalNorm {
  nome: string             // Instagram, Facebook, Google, ...
  qtd: number              // sessões / cliques
  cor: string              // cor do donut
}

export interface SeriedPonto {
  data: string             // 'YYYY-MM-DD'
  valor: number            // investimento do dia
}

export interface PlatformResult {
  conectado: boolean
  erro?: string
  campanhas: CampanhaNorm[]
  investimento: number
  cliques: number
  conversoes: number
  serie: SeriedPonto[]
  canais: CanalNorm[]
}

export function emptyResult(erro?: string): PlatformResult {
  return {
    conectado: false,
    erro,
    campanhas: [],
    investimento: 0,
    cliques: 0,
    conversoes: 0,
    serie: [],
    canais: [],
  }
}

export interface Credenciais {
  plataforma: Plataforma
  accountId: string | null
  accessToken: string | null
  refreshToken: string | null
  pageId?: string | null      // Meta: ID da Página do Facebook (para criar anúncios)
}

// Resultado de um teste de conexão (usado ao gravar credenciais)
export interface TesteConexao {
  ok: boolean
  conta_nome?: string
  erro?: string
}
