-- ═══════════════════════════════════════════════════════════════
-- Migration: Orçamento → Ordem de Serviço — RLS Policies
-- Habilita Row Level Security nas novas tabelas e cria policies
-- de tenant isolation (authenticated) e acesso público (anon).
-- Dependência: deve rodar APÓS as migrations de schema (1.1 e 1.2)
-- NOTA: NÃO recria policies já existentes em 20260610_tela_orcamentos_rls.sql
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. RLS para itens_orcamento
-- ─────────────────────────────────────────────
ALTER TABLE public.itens_orcamento ENABLE ROW LEVEL SECURITY;

-- Tenant isolation: authenticated users see only items from their company's budgets
CREATE POLICY "itens_orcamento_tenant" ON public.itens_orcamento
  FOR ALL TO authenticated
  USING (orcamento_id IN (
    SELECT id FROM public.orcamentos_adesivo
    WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
  ))
  WITH CHECK (orcamento_id IN (
    SELECT id FROM public.orcamentos_adesivo
    WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
  ));

-- Public access (anon) for approval page: view items of budgets that have a token
CREATE POLICY "itens_orcamento_public_token" ON public.itens_orcamento
  FOR SELECT TO anon
  USING (orcamento_id IN (
    SELECT id FROM public.orcamentos_adesivo WHERE token_aprovacao IS NOT NULL
  ));

-- ─────────────────────────────────────────────
-- 2. RLS para ordens_servico_adesivo
-- ─────────────────────────────────────────────
ALTER TABLE public.ordens_servico_adesivo ENABLE ROW LEVEL SECURITY;

-- Tenant isolation: authenticated users see only their company's service orders
CREATE POLICY "ordens_servico_tenant" ON public.ordens_servico_adesivo
  FOR ALL TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- ─────────────────────────────────────────────
-- 3. RLS para itens_ordem_servico
-- ─────────────────────────────────────────────
ALTER TABLE public.itens_ordem_servico ENABLE ROW LEVEL SECURITY;

-- Tenant isolation: authenticated users see only items from their company's service orders
CREATE POLICY "itens_os_tenant" ON public.itens_ordem_servico
  FOR ALL TO authenticated
  USING (ordem_servico_id IN (
    SELECT id FROM public.ordens_servico_adesivo
    WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
  ))
  WITH CHECK (ordem_servico_id IN (
    SELECT id FROM public.ordens_servico_adesivo
    WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
  ));
