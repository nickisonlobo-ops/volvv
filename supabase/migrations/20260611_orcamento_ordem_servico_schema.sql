-- ═══════════════════════════════════════════════════════════════
-- Migration: Orçamento → Ordem de Serviço — Schema (Parte 1)
-- Altera tabela orcamentos_adesivo para suportar orçamento
-- independente (multi-itens) e cria tabela itens_orcamento.
-- Dependência: deve rodar APÓS 20260610_tela_orcamentos_schema.sql
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. ALTER TABLE orcamentos_adesivo
--    - Tornar pedido_id nullable (orçamento independente)
--    - Adicionar campos para novo fluxo multi-item
-- ─────────────────────────────────────────────

-- Tornar pedido_id nullable (suporta orçamentos sem pedido)
ALTER TABLE public.orcamentos_adesivo
  ALTER COLUMN pedido_id DROP NOT NULL;

-- Adicionar novos campos para o fluxo de orçamento independente
ALTER TABLE public.orcamentos_adesivo
  ADD COLUMN IF NOT EXISTS cliente_id bigint REFERENCES public.clientes(id),
  ADD COLUMN IF NOT EXISTS numero_orcamento text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'rascunho'
    CHECK (status IN ('rascunho', 'enviado', 'aprovado', 'rejeitado', 'vencido')),
  ADD COLUMN IF NOT EXISTS valor_mao_obra_global numeric(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantidade_total_itens integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS motivo_rejeicao text,
  ADD COLUMN IF NOT EXISTS data_aprovacao timestamptz;

-- Constraint UNIQUE: número do orçamento é único por empresa
ALTER TABLE public.orcamentos_adesivo
  ADD CONSTRAINT uq_orcamento_numero_empresa
  UNIQUE (empresa_id, numero_orcamento);

-- ─────────────────────────────────────────────
-- 2. CREATE TABLE itens_orcamento
--    Composição multi-item do orçamento
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.itens_orcamento (
  id bigserial PRIMARY KEY,
  orcamento_id bigint NOT NULL REFERENCES public.orcamentos_adesivo(id) ON DELETE CASCADE,
  material_id bigint NOT NULL REFERENCES public.materiais_adesivo(id),
  descricao text NOT NULL,
  largura_cm numeric(7,1) NOT NULL
    CHECK (largura_cm BETWEEN 0.1 AND 9999.9),
  altura_cm numeric(7,1) NOT NULL
    CHECK (altura_cm BETWEEN 0.1 AND 9999.9),
  quantidade integer NOT NULL
    CHECK (quantidade BETWEEN 1 AND 99999),
  modalidade_preco text NOT NULL
    CHECK (modalidade_preco IN ('m2', 'unidade')),
  preco_unitario numeric(10,2)
    CHECK (preco_unitario IS NULL OR preco_unitario BETWEEN 0.01 AND 99999.99),
  area_m2 numeric(12,4),
  valor_item numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Índice para busca por orçamento (performance em JOINs)
CREATE INDEX IF NOT EXISTS idx_itens_orcamento_orcamento_id
  ON public.itens_orcamento(orcamento_id);
