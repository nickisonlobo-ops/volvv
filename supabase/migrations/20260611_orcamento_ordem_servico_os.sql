-- ═══════════════════════════════════════════════════════════════
-- Migration: Orçamento → Ordem de Serviço — Tabelas de OS
-- Cria tabelas ordens_servico_adesivo e itens_ordem_servico
-- para armazenar Ordens de Serviço geradas a partir de orçamentos aprovados.
-- Depende de: tabela itens_orcamento (criada na migration anterior)
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- CREATE TABLE ordens_servico_adesivo
-- ─────────────────────────────────────────────
CREATE TABLE public.ordens_servico_adesivo (
  id bigserial PRIMARY KEY,
  empresa_id bigint NOT NULL REFERENCES public.empresas(id),
  orcamento_id bigint NOT NULL REFERENCES public.orcamentos_adesivo(id) UNIQUE,
  cliente_id bigint NOT NULL REFERENCES public.clientes(id),
  numero_os text NOT NULL,
  status text NOT NULL DEFAULT 'aguardando_producao'
    CHECK (status IN ('aguardando_producao', 'em_producao', 'pronto', 'entregue', 'cancelado')),
  forma_pagamento text
    CHECK (forma_pagamento IS NULL OR forma_pagamento IN ('dinheiro', 'pix', 'cartao', 'boleto', 'parcelado')),
  valor_total numeric(12,2) NOT NULL DEFAULT 0,
  posicao_fila integer NOT NULL DEFAULT 0,
  data_aprovacao timestamptz NOT NULL DEFAULT now(),
  origem_aprovacao text NOT NULL
    CHECK (origem_aprovacao IN ('interno', 'link_externo')),
  data_inicio_producao timestamptz,
  data_fim_producao timestamptz,
  data_entrega timestamptz,
  prazo_estimado timestamptz,
  observacoes text,
  motivo_cancelamento text,
  created_at timestamptz NOT NULL DEFAULT now(),

  -- Numeração única de OS por empresa
  CONSTRAINT uq_os_numero_empresa UNIQUE (empresa_id, numero_os)
);

-- ─────────────────────────────────────────────
-- CREATE TABLE itens_ordem_servico
-- ─────────────────────────────────────────────
CREATE TABLE public.itens_ordem_servico (
  id bigserial PRIMARY KEY,
  ordem_servico_id bigint NOT NULL REFERENCES public.ordens_servico_adesivo(id) ON DELETE CASCADE,
  item_orcamento_id bigint REFERENCES public.itens_orcamento(id),
  descricao text NOT NULL,
  material_id bigint REFERENCES public.materiais_adesivo(id),
  largura_cm numeric(7,1) NOT NULL,
  altura_cm numeric(7,1) NOT NULL,
  quantidade integer NOT NULL,
  valor_item numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
