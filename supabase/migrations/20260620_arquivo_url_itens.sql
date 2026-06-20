-- ═══════════════════════════════════════════════════════════════
-- Migration: Campo arquivo_url nos itens de orçamento e OS
-- Permite anexar documentos complementares a cada item.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.itens_orcamento
  ADD COLUMN IF NOT EXISTS arquivo_url text;

ALTER TABLE public.itens_ordem_servico
  ADD COLUMN IF NOT EXISTS arquivo_url text;
