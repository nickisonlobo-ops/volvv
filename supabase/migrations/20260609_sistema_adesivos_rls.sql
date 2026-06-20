-- ═══════════════════════════════════════════════════════════════
-- Migration: Sistema de Adesivos — RLS Policies
-- Habilita Row Level Security e cria policies de tenant isolation
-- para todas as tabelas do módulo de adesivos
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- Habilita RLS em todas as tabelas do módulo
-- ─────────────────────────────────────────────
ALTER TABLE public.materiais_adesivo         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogo_adesivos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_adesivo           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_adesivo_itens     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos_adesivo        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_adesivo_artes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_movimentacoes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_adesivo_historico ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════
-- TABELAS COM empresa_id DIRETO
-- ═══════════════════════════════════════════════════════════════

-- ── materiais_adesivo ────────────────────────────────────────
CREATE POLICY "materiais_adesivo_select" ON public.materiais_adesivo
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "materiais_adesivo_insert" ON public.materiais_adesivo
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "materiais_adesivo_update" ON public.materiais_adesivo
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "materiais_adesivo_delete" ON public.materiais_adesivo
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- ── catalogo_adesivos ────────────────────────────────────────
CREATE POLICY "catalogo_adesivos_select" ON public.catalogo_adesivos
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "catalogo_adesivos_insert" ON public.catalogo_adesivos
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "catalogo_adesivos_update" ON public.catalogo_adesivos
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "catalogo_adesivos_delete" ON public.catalogo_adesivos
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- ── pedidos_adesivo ──────────────────────────────────────────
CREATE POLICY "pedidos_adesivo_select" ON public.pedidos_adesivo
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "pedidos_adesivo_insert" ON public.pedidos_adesivo
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "pedidos_adesivo_update" ON public.pedidos_adesivo
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "pedidos_adesivo_delete" ON public.pedidos_adesivo
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- ── orcamentos_adesivo ───────────────────────────────────────
CREATE POLICY "orcamentos_adesivo_select" ON public.orcamentos_adesivo
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "orcamentos_adesivo_insert" ON public.orcamentos_adesivo
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "orcamentos_adesivo_update" ON public.orcamentos_adesivo
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "orcamentos_adesivo_delete" ON public.orcamentos_adesivo
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- ── estoque_movimentacoes ────────────────────────────────────
CREATE POLICY "estoque_movimentacoes_select" ON public.estoque_movimentacoes
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "estoque_movimentacoes_insert" ON public.estoque_movimentacoes
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "estoque_movimentacoes_update" ON public.estoque_movimentacoes
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "estoque_movimentacoes_delete" ON public.estoque_movimentacoes
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

-- ═══════════════════════════════════════════════════════════════
-- TABELAS SEM empresa_id (join via pedidos_adesivo)
-- ═══════════════════════════════════════════════════════════════

-- ── pedidos_adesivo_itens ────────────────────────────────────
CREATE POLICY "pedidos_adesivo_itens_select" ON public.pedidos_adesivo_itens
  FOR SELECT TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_itens_insert" ON public.pedidos_adesivo_itens
  FOR INSERT TO authenticated
  WITH CHECK (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_itens_update" ON public.pedidos_adesivo_itens
  FOR UPDATE TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_itens_delete" ON public.pedidos_adesivo_itens
  FOR DELETE TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

-- ── pedidos_adesivo_artes ────────────────────────────────────
CREATE POLICY "pedidos_adesivo_artes_select" ON public.pedidos_adesivo_artes
  FOR SELECT TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_artes_insert" ON public.pedidos_adesivo_artes
  FOR INSERT TO authenticated
  WITH CHECK (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_artes_update" ON public.pedidos_adesivo_artes
  FOR UPDATE TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_artes_delete" ON public.pedidos_adesivo_artes
  FOR DELETE TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

-- ── pedidos_adesivo_historico ────────────────────────────────
CREATE POLICY "pedidos_adesivo_historico_select" ON public.pedidos_adesivo_historico
  FOR SELECT TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_historico_insert" ON public.pedidos_adesivo_historico
  FOR INSERT TO authenticated
  WITH CHECK (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_historico_update" ON public.pedidos_adesivo_historico
  FOR UPDATE TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY "pedidos_adesivo_historico_delete" ON public.pedidos_adesivo_historico
  FOR DELETE TO authenticated
  USING (pedido_id IN (SELECT id FROM public.pedidos_adesivo WHERE empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())));
