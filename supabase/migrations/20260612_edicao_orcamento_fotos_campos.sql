-- ═══════════════════════════════════════════════════════════════
-- Migration: Edição de Orçamento e Fotos — Novos Campos
-- Adiciona campos para foto do local de instalação, foto da arte
-- do adesivo e preço por m² override nos orçamentos e itens.
-- Dependência: deve rodar APÓS 20260611_orcamento_ordem_servico_os.sql
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. orcamentos_adesivo — foto do local de instalação
-- ─────────────────────────────────────────────
ALTER TABLE public.orcamentos_adesivo
  ADD COLUMN IF NOT EXISTS foto_local_url text;

-- ─────────────────────────────────────────────
-- 2. itens_orcamento — foto da arte e preço m² override
-- ─────────────────────────────────────────────
ALTER TABLE public.itens_orcamento
  ADD COLUMN IF NOT EXISTS foto_arte_url text;

ALTER TABLE public.itens_orcamento
  ADD COLUMN IF NOT EXISTS preco_m2 numeric(10,2)
    CHECK (preco_m2 IS NULL OR preco_m2 BETWEEN 0.01 AND 9999.99);

-- ─────────────────────────────────────────────
-- 3. itens_ordem_servico — foto da arte (propagada do orçamento)
-- ─────────────────────────────────────────────
ALTER TABLE public.itens_ordem_servico
  ADD COLUMN IF NOT EXISTS foto_arte_url text;
