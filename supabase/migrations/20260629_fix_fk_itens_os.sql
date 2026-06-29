-- ═══════════════════════════════════════════════════════════════
-- Fix: FK itens_ordem_servico → itens_orcamento
-- Permitir apagar/editar itens do orçamento sem quebrar OS.
-- O item da OS mantém os dados copiados, só perde o link.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.itens_ordem_servico
  DROP CONSTRAINT IF EXISTS itens_ordem_servico_item_orcamento_id_fkey;

ALTER TABLE public.itens_ordem_servico
  ADD CONSTRAINT itens_ordem_servico_item_orcamento_id_fkey
  FOREIGN KEY (item_orcamento_id)
  REFERENCES public.itens_orcamento(id)
  ON DELETE SET NULL;
