-- ═══════════════════════════════════════════════════════════════
-- Migration: Nome do trabalho no orçamento e OS
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.orcamentos_adesivo
  ADD COLUMN IF NOT EXISTS nome_trabalho text;

ALTER TABLE public.ordens_servico_adesivo
  ADD COLUMN IF NOT EXISTS nome_trabalho text;
