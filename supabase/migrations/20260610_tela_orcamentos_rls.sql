-- ═══════════════════════════════════════════════════════════════
-- Migration: Tela de Orçamentos — RLS Policies
-- Habilita Row Level Security na tabela regras_desconto_volume
-- e cria políticas de acesso público para aprovação via token
-- Dependência: deve rodar APÓS a migração de schema (task 1.1)
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. RLS para regras_desconto_volume
-- ─────────────────────────────────────────────
ALTER TABLE public.regras_desconto_volume ENABLE ROW LEVEL SECURITY;

CREATE POLICY "regras_desconto_volume_select" ON public.regras_desconto_volume
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "regras_desconto_volume_insert" ON public.regras_desconto_volume
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "regras_desconto_volume_update" ON public.regras_desconto_volume
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "regras_desconto_volume_delete" ON public.regras_desconto_volume
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- ─────────────────────────────────────────────
-- 2. Acesso público (anon) para aprovação via token
--    Permite que clientes visualizem e aprovem/rejeitem
--    orçamentos sem autenticação
-- ─────────────────────────────────────────────

-- SELECT anônimo em orcamentos_adesivo via token (página pública)
CREATE POLICY "orcamentos_adesivo_public_by_token" ON public.orcamentos_adesivo
  FOR SELECT TO anon
  USING (token_aprovacao IS NOT NULL);

-- UPDATE anônimo para aprovar/rejeitar via token
CREATE POLICY "orcamentos_adesivo_public_approve" ON public.orcamentos_adesivo
  FOR UPDATE TO anon
  USING (token_aprovacao IS NOT NULL)
  WITH CHECK (token_aprovacao IS NOT NULL);

-- ─────────────────────────────────────────────
-- 3. Acesso público às tabelas relacionadas
--    (para exibir dados do pedido e artes na página pública)
-- ─────────────────────────────────────────────

-- Acesso público ao pedido vinculado ao orçamento com token
CREATE POLICY "pedidos_adesivo_public_by_orcamento" ON public.pedidos_adesivo
  FOR SELECT TO anon
  USING (id IN (
    SELECT pedido_id FROM public.orcamentos_adesivo WHERE token_aprovacao IS NOT NULL
  ));

-- UPDATE anônimo no pedido vinculado (para aprovar/rejeitar via token público)
CREATE POLICY "pedidos_adesivo_public_update_by_orcamento" ON public.pedidos_adesivo
  FOR UPDATE TO anon
  USING (id IN (
    SELECT pedido_id FROM public.orcamentos_adesivo WHERE token_aprovacao IS NOT NULL
  ))
  WITH CHECK (id IN (
    SELECT pedido_id FROM public.orcamentos_adesivo WHERE token_aprovacao IS NOT NULL
  ));

-- Acesso público às artes do pedido vinculado ao orçamento com token
CREATE POLICY "pedidos_adesivo_artes_public" ON public.pedidos_adesivo_artes
  FOR SELECT TO anon
  USING (pedido_id IN (
    SELECT pedido_id FROM public.orcamentos_adesivo WHERE token_aprovacao IS NOT NULL
  ));
