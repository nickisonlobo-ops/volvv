-- ============================================================
-- Marketing — Tabela de Leads
-- ============================================================

CREATE TABLE IF NOT EXISTS public.leads (
  id bigserial NOT NULL,
  empresa_id bigint NOT NULL,
  
  -- Dados do lead
  nome text NOT NULL,
  email text NULL,
  telefone text NULL,
  empresa_nome text NULL,
  
  -- Origem / Canal
  canal text NOT NULL DEFAULT 'manual',  -- manual, google, instagram, facebook, indicacao, site, whatsapp
  utm_source text NULL,
  utm_medium text NULL,
  utm_campaign text NULL,
  
  -- Qualificação
  status text NOT NULL DEFAULT 'novo',   -- novo, qualificado, proposta, convertido, perdido
  score integer NOT NULL DEFAULT 0,      -- 0-100 (quente/morno/frio)
  
  -- Notas
  notas text NULL,
  tags text[] NULL DEFAULT '{}',
  
  -- Vínculo
  cliente_id bigint NULL,               -- Se convertido, ID do cliente no CRM
  
  -- Atribuição
  responsavel_id uuid NULL,             -- Quem está cuidando desse lead
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  convertido_at timestamp with time zone NULL,
  
  CONSTRAINT leads_pkey PRIMARY KEY (id),
  CONSTRAINT leads_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE
);

CREATE INDEX idx_leads_empresa ON public.leads USING btree (empresa_id);
CREATE INDEX idx_leads_status ON public.leads USING btree (empresa_id, status);
CREATE INDEX idx_leads_canal ON public.leads USING btree (empresa_id, canal);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_all" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- Trigger updated_at
CREATE OR REPLACE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
