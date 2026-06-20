-- ═══════════════════════════════════════════════════════════════
-- Migration: Tela de Orçamentos — Extensão de Schema
-- Estende orcamentos_adesivo com campos de precificação por unidade,
-- desconto por volume e aprovação externa.
-- Cria tabela regras_desconto_volume para configuração de faixas.
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- ALTER TABLE orcamentos_adesivo — novos campos
-- ─────────────────────────────────────────────
ALTER TABLE public.orcamentos_adesivo
  ADD COLUMN IF NOT EXISTS modalidade_preco text
    NOT NULL DEFAULT 'm2'
    CHECK (modalidade_preco IN ('m2', 'unidade')),
  ADD COLUMN IF NOT EXISTS preco_unitario numeric(10,2)
    CHECK (preco_unitario IS NULL OR preco_unitario BETWEEN 0.01 AND 99999.99),
  ADD COLUMN IF NOT EXISTS desconto_volume_percentual numeric(5,2)
    DEFAULT 0
    CHECK (desconto_volume_percentual BETWEEN 0 AND 99.99),
  ADD COLUMN IF NOT EXISTS token_aprovacao uuid UNIQUE,
  ADD COLUMN IF NOT EXISTS origem_aprovacao text
    CHECK (origem_aprovacao IS NULL OR origem_aprovacao IN ('interno', 'link_externo'));

-- Constraint condicional: preco_unitario obrigatório quando modalidade = 'unidade'
ALTER TABLE public.orcamentos_adesivo
  ADD CONSTRAINT chk_preco_unitario_modalidade
  CHECK (
    (modalidade_preco = 'unidade' AND preco_unitario IS NOT NULL)
    OR (modalidade_preco = 'm2' AND preco_unitario IS NULL)
  );

-- ─────────────────────────────────────────────
-- CREATE TABLE regras_desconto_volume
-- ─────────────────────────────────────────────
CREATE TABLE public.regras_desconto_volume (
  id bigserial PRIMARY KEY,
  empresa_id bigint NOT NULL REFERENCES public.empresas(id),
  quantidade_minima integer NOT NULL CHECK (quantidade_minima BETWEEN 2 AND 99999),
  desconto_percentual numeric(5,2) NOT NULL CHECK (desconto_percentual BETWEEN 0.01 AND 99.99),
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(empresa_id, quantidade_minima)
);
