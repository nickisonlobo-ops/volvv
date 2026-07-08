-- ============================================================
-- Migração: Etapa fixa "Faturamento" no pipeline de produção das OS
-- Descrição:
--   1. Estende o enum de status da OS com 'faturamento'.
--   2. Adiciona a pipeline_etapas as colunas `papel` (mapeia a etapa
--      ao status semântico da OS) e `is_sistema` (etapa fixa/protegida).
--   3. Backfill idempotente: marca Aguardando/Finalizado como sistema,
--      insere "Faturamento" (fixa) antes da etapa final em todas as
--      empresas que já possuem pipeline de produção.
-- Observações:
--   - Receita NÃO tem vínculo com status de OS (vem do orçamento
--     aprovado → contas_pagar tipo='receber'); esta migração não toca
--     em nada financeiro.
-- ============================================================

-- 1. Enum status += 'faturamento'
ALTER TABLE public.ordens_servico_adesivo
  DROP CONSTRAINT IF EXISTS ordens_servico_adesivo_status_check;

ALTER TABLE public.ordens_servico_adesivo
  ADD CONSTRAINT ordens_servico_adesivo_status_check
  CHECK (status IN (
    'aguardando_producao', 'em_producao', 'pronto',
    'faturamento', 'entregue', 'cancelado'
  ));

-- 2. Colunas em pipeline_etapas
ALTER TABLE public.pipeline_etapas
  ADD COLUMN IF NOT EXISTS papel TEXT NULL;
ALTER TABLE public.pipeline_etapas
  ADD COLUMN IF NOT EXISTS is_sistema BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.pipeline_etapas.papel IS
  'Papel semântico da etapa mapeado ao status da OS (aguardando_producao|em_producao|pronto|faturamento|entregue). NULL = etapa custom (deriva por posição).';
COMMENT ON COLUMN public.pipeline_etapas.is_sistema IS
  'Etapa fixa/protegida (não pode ser excluída nem renomeada). true para Aguardando, Faturamento e Finalizado.';

-- 3. Backfill por empresa (idempotente)
DO $$
DECLARE
  emp         RECORD;
  v_final_id  BIGINT;
  v_final_pos INTEGER;
  v_first_id  BIGINT;
  v_fat_id    BIGINT;
  v_tem_final BOOLEAN;
BEGIN
  FOR emp IN
    SELECT DISTINCT empresa_id
    FROM public.pipeline_etapas
    WHERE pipeline_tipo = 'producao'
  LOOP
    -- ── Etapa final (is_final) ─────────────────────────────
    SELECT id, posicao INTO v_final_id, v_final_pos
    FROM public.pipeline_etapas
    WHERE empresa_id = emp.empresa_id AND pipeline_tipo = 'producao' AND is_final = TRUE
    ORDER BY posicao DESC
    LIMIT 1;

    -- Se não houver etapa final, promove a de maior posição
    IF v_final_id IS NULL THEN
      SELECT id, posicao INTO v_final_id, v_final_pos
      FROM public.pipeline_etapas
      WHERE empresa_id = emp.empresa_id AND pipeline_tipo = 'producao'
      ORDER BY posicao DESC
      LIMIT 1;
      IF v_final_id IS NOT NULL THEN
        UPDATE public.pipeline_etapas SET is_final = TRUE WHERE id = v_final_id;
      END IF;
    END IF;

    -- Se a empresa não tem nenhuma etapa de produção, pula
    IF v_final_id IS NULL THEN
      CONTINUE;
    END IF;

    -- Marca a final como sistema/entregue; renomeia "Entregue" → "Finalizado"
    -- (só se não existir já uma "Finalizado" para não violar UNIQUE)
    UPDATE public.pipeline_etapas
    SET papel = 'entregue',
        is_sistema = TRUE,
        nome = CASE
                 WHEN nome = 'Entregue'
                      AND NOT EXISTS (
                        SELECT 1 FROM public.pipeline_etapas x
                        WHERE x.empresa_id = emp.empresa_id
                          AND x.pipeline_tipo = 'producao'
                          AND x.nome = 'Finalizado'
                      )
                 THEN 'Finalizado'
                 ELSE nome
               END
    WHERE id = v_final_id;

    -- ── Primeira etapa → Aguardando (sistema) ──────────────
    SELECT id INTO v_first_id
    FROM public.pipeline_etapas
    WHERE empresa_id = emp.empresa_id AND pipeline_tipo = 'producao'
    ORDER BY posicao ASC
    LIMIT 1;

    UPDATE public.pipeline_etapas
    SET papel = 'aguardando_producao', is_sistema = TRUE
    WHERE id = v_first_id AND id <> v_final_id;

    -- ── Papéis por nome nas etapas intermediárias (não travadas) ──
    UPDATE public.pipeline_etapas
    SET papel = 'em_producao'
    WHERE empresa_id = emp.empresa_id AND pipeline_tipo = 'producao'
      AND papel IS NULL AND nome ILIKE 'Em Produ%';

    UPDATE public.pipeline_etapas
    SET papel = 'pronto'
    WHERE empresa_id = emp.empresa_id AND pipeline_tipo = 'producao'
      AND papel IS NULL AND nome ILIKE 'Pronto%';

    -- ── Faturamento: já existe? ────────────────────────────
    SELECT id INTO v_fat_id
    FROM public.pipeline_etapas
    WHERE empresa_id = emp.empresa_id AND pipeline_tipo = 'producao'
      AND (papel = 'faturamento' OR nome ILIKE 'Faturamento%')
    LIMIT 1;

    IF v_fat_id IS NOT NULL THEN
      -- Já existe (custom): apenas promove a fixa
      UPDATE public.pipeline_etapas
      SET papel = 'faturamento', is_sistema = TRUE, is_final = FALSE
      WHERE id = v_fat_id;
    ELSE
      -- Abre espaço antes da final e insere a etapa fixa
      -- (recarrega a posição final, pode ter mudado com renomeações)
      SELECT posicao INTO v_final_pos
      FROM public.pipeline_etapas WHERE id = v_final_id;

      UPDATE public.pipeline_etapas
      SET posicao = posicao + 1
      WHERE empresa_id = emp.empresa_id AND pipeline_tipo = 'producao'
        AND posicao >= v_final_pos;

      INSERT INTO public.pipeline_etapas
        (empresa_id, pipeline_tipo, nome, cor, posicao, is_final, papel, is_sistema)
      VALUES
        (emp.empresa_id, 'producao', 'Faturamento', '#06b6d4', v_final_pos, FALSE, 'faturamento', TRUE);
    END IF;
  END LOOP;
END $$;
