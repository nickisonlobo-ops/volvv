-- ═══════════════════════════════════════════════════════════════
-- Migration: foto_instalacao_url por item na OS
-- Permite registrar foto da instalação concluída para cada item
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.itens_ordem_servico
  ADD COLUMN IF NOT EXISTS foto_instalacao_url text;
