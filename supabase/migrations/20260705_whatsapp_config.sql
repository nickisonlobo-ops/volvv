-- ============================================================
-- WhatsApp Config por Empresa
-- Armazena credenciais Datafy/Meta por empresa_id
-- ============================================================

CREATE TABLE IF NOT EXISTS public.whatsapp_config (
  id bigserial NOT NULL,
  empresa_id bigint NOT NULL,
  
  -- Datafy / Meta credentials
  datafy_api_url text NOT NULL DEFAULT 'https://cloud.datafyapi.com.br',
  datafy_token text NOT NULL,                -- sk_live_xxx
  phone_number_id text NOT NULL,             -- ID do numero na Meta
  display_phone_number text NULL,            -- Numero formatado (ex: +351 939 392 051)
  
  -- Webhook
  webhook_verify_token text NULL,            -- Token de verificação do webhook (opcional)
  
  -- Status
  ativo boolean NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT whatsapp_config_pkey PRIMARY KEY (id),
  CONSTRAINT whatsapp_config_empresa_id_key UNIQUE (empresa_id)
);

-- RLS
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "whatsapp_config_all" ON public.whatsapp_config FOR ALL USING (true) WITH CHECK (true);

-- Trigger updated_at
CREATE OR REPLACE TRIGGER trg_whatsapp_config_updated_at
  BEFORE UPDATE ON public.whatsapp_config
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
