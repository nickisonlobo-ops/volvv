-- ═══════════════════════════════════════════════════════════════
-- Migration: Endereço de instalação no orçamento
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.orcamentos_adesivo
  ADD COLUMN IF NOT EXISTS endereco_instalacao text;
