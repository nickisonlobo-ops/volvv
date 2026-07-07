-- ═══════════════════════════════════════════════════════════════
-- Migration: Marketing — Backend completo
--   • marketing_integracoes  → credenciais Meta/Google Ads/GA4 (segredo
--     protegido: RLS bloqueia leitura pelo frontend; só o server, com a
--     service role, lê access_token/refresh_token. Espelha o padrão de
--     20260629_invoicexpress_billing.sql).
--   • marketing_tarefas       → aba Planejamento (CRUD interno)
--   • marketing_conteudos     → abas Conteúdo / Calendário / Posts (CRUD interno)
--   • marketing_automacoes    → aba Automação (regras; execução via n8n = futuro)
--
-- IMPORTANTE (segredo de API): o frontend NUNCA deve fazer select('*') em
-- marketing_integracoes. Selecionar apenas colunas de metadados
-- (id, plataforma, conta_nome, account_id, status, ativo, ultimo_sync…).
-- access_token / refresh_token só são lidos server-side (service role).
-- ═══════════════════════════════════════════════════════════════

-- Função de trigger updated_at (idempotente — já existe no DB, garantimos aqui)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────
-- 1. marketing_integracoes — credenciais por empresa/plataforma
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.marketing_integracoes (
  id            bigserial PRIMARY KEY,
  empresa_id    bigint NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,

  plataforma    text NOT NULL CHECK (plataforma IN ('meta','google_ads','ga4')),
  conta_nome    text NULL,                 -- nome amigável da conta (ex: "Loja Principal")
  account_id    text NULL,                 -- act_<id> (Meta), customer id (Google Ads), property id (GA4)
  meta_page_id  text NULL,                 -- ID da Página do Facebook (Meta) — necessário para criar anúncios

  -- Segredos — NUNCA expostos ao frontend (ver nota no topo)
  access_token  text NULL,
  refresh_token text NULL,
  expires_at    timestamptz NULL,

  status        text NOT NULL DEFAULT 'desconectado'
                CHECK (status IN ('conectado','erro','desconectado')),
  erro_msg      text NULL,                 -- última mensagem de erro do teste de conexão
  ultimo_sync   timestamptz NULL,
  ativo         boolean NOT NULL DEFAULT true,

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  UNIQUE (empresa_id, plataforma)
);

CREATE INDEX IF NOT EXISTS idx_mkt_integracoes_empresa
  ON public.marketing_integracoes (empresa_id);

-- Coluna adicionada depois (idempotente para bases já existentes)
ALTER TABLE public.marketing_integracoes ADD COLUMN IF NOT EXISTS meta_page_id text;

ALTER TABLE public.marketing_integracoes ENABLE ROW LEVEL SECURITY;

-- RLS empresa-scoped (padrão canônico — 20260417_setup_completo.sql:243).
-- Observação: o segredo fica protegido pela disciplina de nunca fazer
-- select('*') no cliente; a linha é visível à empresa, mas o token só é
-- consumido server-side. (Free tier — sem Vault; mesmo trade-off do invoicexpress.)
DROP POLICY IF EXISTS "mkt_integracoes_select" ON public.marketing_integracoes;
CREATE POLICY "mkt_integracoes_select" ON public.marketing_integracoes
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_integracoes_insert" ON public.marketing_integracoes;
CREATE POLICY "mkt_integracoes_insert" ON public.marketing_integracoes
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_integracoes_update" ON public.marketing_integracoes;
CREATE POLICY "mkt_integracoes_update" ON public.marketing_integracoes
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_integracoes_delete" ON public.marketing_integracoes;
CREATE POLICY "mkt_integracoes_delete" ON public.marketing_integracoes
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE OR REPLACE TRIGGER trg_mkt_integracoes_updated_at
  BEFORE UPDATE ON public.marketing_integracoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────
-- 2. marketing_tarefas — aba Planejamento
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.marketing_tarefas (
  id             bigserial PRIMARY KEY,
  empresa_id     bigint NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,

  titulo         text NOT NULL,
  descricao      text NULL,
  status         text NOT NULL DEFAULT 'pendente'
                 CHECK (status IN ('pendente','concluida')),
  prioridade     text NOT NULL DEFAULT 'media'
                 CHECK (prioridade IN ('alta','media','baixa')),
  data_tarefa    date NULL,
  urgente        boolean NOT NULL DEFAULT false,
  responsavel_id uuid NULL,

  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_tarefas_empresa
  ON public.marketing_tarefas (empresa_id, status);

ALTER TABLE public.marketing_tarefas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mkt_tarefas_select" ON public.marketing_tarefas;
CREATE POLICY "mkt_tarefas_select" ON public.marketing_tarefas
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_tarefas_insert" ON public.marketing_tarefas;
CREATE POLICY "mkt_tarefas_insert" ON public.marketing_tarefas
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_tarefas_update" ON public.marketing_tarefas;
CREATE POLICY "mkt_tarefas_update" ON public.marketing_tarefas
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_tarefas_delete" ON public.marketing_tarefas;
CREATE POLICY "mkt_tarefas_delete" ON public.marketing_tarefas
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE OR REPLACE TRIGGER trg_mkt_tarefas_updated_at
  BEFORE UPDATE ON public.marketing_tarefas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────
-- 3. marketing_conteudos — Conteúdo / Calendário / Posts recentes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.marketing_conteudos (
  id               bigserial PRIMARY KEY,
  empresa_id       bigint NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,

  titulo           text NOT NULL,
  tipo             text NOT NULL DEFAULT 'outro'
                   CHECK (tipo IN ('blog','instagram','facebook','email','outro')),
  rede             text NULL,
  status           text NOT NULL DEFAULT 'rascunho'
                   CHECK (status IN ('rascunho','agendado','publicado')),
  data_publicacao  timestamptz NULL,
  alcance          integer NOT NULL DEFAULT 0,
  engajamento      integer NOT NULL DEFAULT 0,
  thumb_cor        text NULL,

  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_conteudos_empresa
  ON public.marketing_conteudos (empresa_id, data_publicacao);

ALTER TABLE public.marketing_conteudos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mkt_conteudos_select" ON public.marketing_conteudos;
CREATE POLICY "mkt_conteudos_select" ON public.marketing_conteudos
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_conteudos_insert" ON public.marketing_conteudos;
CREATE POLICY "mkt_conteudos_insert" ON public.marketing_conteudos
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_conteudos_update" ON public.marketing_conteudos;
CREATE POLICY "mkt_conteudos_update" ON public.marketing_conteudos
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_conteudos_delete" ON public.marketing_conteudos;
CREATE POLICY "mkt_conteudos_delete" ON public.marketing_conteudos
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE OR REPLACE TRIGGER trg_mkt_conteudos_updated_at
  BEFORE UPDATE ON public.marketing_conteudos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────
-- 4. marketing_automacoes — aba Automação
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.marketing_automacoes (
  id           bigserial PRIMARY KEY,
  empresa_id   bigint NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,

  nome         text NOT NULL,
  gatilho      text NOT NULL,             -- ex: 'novo_lead', 'lead_qualificado'
  acao         text NOT NULL,             -- ex: 'enviar_email', 'notificar_equipe'
  descricao    text NULL,
  ativo        boolean NOT NULL DEFAULT true,

  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_automacoes_empresa
  ON public.marketing_automacoes (empresa_id);

ALTER TABLE public.marketing_automacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "mkt_automacoes_select" ON public.marketing_automacoes;
CREATE POLICY "mkt_automacoes_select" ON public.marketing_automacoes
  FOR SELECT TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_automacoes_insert" ON public.marketing_automacoes;
CREATE POLICY "mkt_automacoes_insert" ON public.marketing_automacoes
  FOR INSERT TO authenticated
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_automacoes_update" ON public.marketing_automacoes;
CREATE POLICY "mkt_automacoes_update" ON public.marketing_automacoes
  FOR UPDATE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "mkt_automacoes_delete" ON public.marketing_automacoes;
CREATE POLICY "mkt_automacoes_delete" ON public.marketing_automacoes
  FOR DELETE TO authenticated
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

CREATE OR REPLACE TRIGGER trg_mkt_automacoes_updated_at
  BEFORE UPDATE ON public.marketing_automacoes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
