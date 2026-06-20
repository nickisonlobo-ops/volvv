-- ═══════════════════════════════════════════════════════════════
-- Migration: Foto do Local de Instalação POR ITEM (não mais por orçamento)
-- Move foto_local_url de orcamentos_adesivo para itens_orcamento
-- e itens_ordem_servico (propagação para OS).
-- Dependência: deve rodar APÓS 20260612_edicao_orcamento_fotos_campos.sql
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. itens_orcamento — foto do local de instalação por item
-- ─────────────────────────────────────────────
ALTER TABLE public.itens_orcamento
  ADD COLUMN IF NOT EXISTS foto_local_url text;

-- ─────────────────────────────────────────────
-- 2. itens_ordem_servico — foto do local (propagada do item de orçamento)
-- ─────────────────────────────────────────────
ALTER TABLE public.itens_ordem_servico
  ADD COLUMN IF NOT EXISTS foto_local_url text;

-- ─────────────────────────────────────────────
-- 3. Atualizar a função gerar_ordem_servico para copiar foto_local_url
--    dos itens do orçamento para os itens da OS
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.gerar_ordem_servico(
  p_orcamento_id bigint,
  p_forma_pagamento text DEFAULT NULL,
  p_origem text DEFAULT 'interno'
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_orc RECORD;
  v_os_id bigint;
  v_numero_os text;
  v_next_pos integer;
  v_next_num integer;
BEGIN
  -- 1. Buscar e validar orçamento
  SELECT * INTO v_orc FROM public.orcamentos_adesivo WHERE id = p_orcamento_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Orçamento não encontrado';
  END IF;
  IF v_orc.status NOT IN ('enviado', 'rascunho') THEN
    RAISE EXCEPTION 'Orçamento não está em status válido para aprovação';
  END IF;

  -- 2. Verificar se já existe OS vinculada (previne dupla criação)
  IF EXISTS (SELECT 1 FROM public.ordens_servico_adesivo WHERE orcamento_id = p_orcamento_id) THEN
    RAISE EXCEPTION 'Ordem de Serviço já gerada para este orçamento';
  END IF;

  -- 3. Gerar número sequencial da OS (formato OS-{N})
  SELECT COALESCE(MAX(CAST(REPLACE(numero_os, 'OS-', '') AS integer)), 0) + 1
  INTO v_next_num
  FROM public.ordens_servico_adesivo
  WHERE empresa_id = v_orc.empresa_id;

  v_numero_os := 'OS-' || v_next_num;

  -- 4. Calcular posição na fila (MAX + 1 para OS ativas da empresa)
  SELECT COALESCE(MAX(posicao_fila), 0) + 1
  INTO v_next_pos
  FROM public.ordens_servico_adesivo
  WHERE empresa_id = v_orc.empresa_id
    AND status IN ('aguardando_producao', 'em_producao');

  -- 5. Criar Ordem de Serviço
  INSERT INTO public.ordens_servico_adesivo (
    empresa_id, orcamento_id, cliente_id, numero_os, status,
    forma_pagamento, valor_total, posicao_fila, data_aprovacao,
    origem_aprovacao, prazo_estimado
  ) VALUES (
    v_orc.empresa_id, p_orcamento_id, v_orc.cliente_id, v_numero_os,
    'aguardando_producao', p_forma_pagamento, v_orc.valor_total,
    v_next_pos, now(), p_origem,
    CASE WHEN v_orc.prazo_estimado_dias IS NOT NULL
      THEN now() + (v_orc.prazo_estimado_dias || ' days')::interval
      ELSE NULL
    END
  ) RETURNING id INTO v_os_id;

  -- 6. Copiar itens do orçamento para OS (inclui foto_arte_url E foto_local_url)
  INSERT INTO public.itens_ordem_servico (
    ordem_servico_id, item_orcamento_id, descricao, material_id,
    largura_cm, altura_cm, quantidade, valor_item, foto_arte_url, foto_local_url
  )
  SELECT v_os_id, id, descricao, material_id,
         largura_cm, altura_cm, quantidade, valor_item, foto_arte_url, foto_local_url
  FROM public.itens_orcamento
  WHERE orcamento_id = p_orcamento_id;

  -- 7. Atualizar status do orçamento para aprovado
  UPDATE public.orcamentos_adesivo
  SET status = 'aprovado',
      data_aprovacao = now(),
      origem_aprovacao = p_origem
  WHERE id = p_orcamento_id;

  RETURN v_os_id;
END;
$$;

-- ─────────────────────────────────────────────
-- Permissões: permitir chamada por authenticated e anon
-- ─────────────────────────────────────────────
GRANT EXECUTE ON FUNCTION public.gerar_ordem_servico(bigint, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.gerar_ordem_servico(bigint, text, text) TO anon;

-- ─────────────────────────────────────────────
-- 4. (Opcional) Remover foto_local_url de orcamentos_adesivo
--    Mantemos a coluna por segurança (dados legados) mas paramos de usá-la.
--    Se desejar dropar: ALTER TABLE public.orcamentos_adesivo DROP COLUMN foto_local_url;
-- ─────────────────────────────────────────────
-- NOTA: Não dropamos para manter backward compatibility com dados existentes.
