-- ============================================================
-- WhatsApp Integration — Tabelas Supabase
-- ============================================================

-- TABELA: wpp_conversas
-- Cada conversa = um contato do WhatsApp por empresa
CREATE TABLE public.wpp_conversas (
  id bigserial NOT NULL,
  empresa_id bigint NOT NULL,
  
  -- Identificação do contato
  wa_id text NOT NULL,                    -- Número do WhatsApp (ex: "5511940527609")
  user_id text NULL,                      -- Meta user_id (ex: "BR.905018129298135")
  nome text NULL,                         -- Nome do perfil no WhatsApp
  foto_url text NULL,                     -- URL da foto do perfil (se disponível)
  
  -- Identificação do nosso número
  phone_number_id text NOT NULL,          -- ID do número conectado na Meta
  display_phone_number text NULL,         -- Número formatado do negócio
  
  -- Estado da conversa
  ultima_mensagem text NULL,              -- Preview da última mensagem
  ultima_mensagem_at timestamp with time zone NULL,  -- Quando foi a última mensagem
  nao_lidas integer NOT NULL DEFAULT 0,   -- Contagem de mensagens não lidas
  status text NOT NULL DEFAULT 'aberta',  -- aberta, arquivada, encerrada
  
  -- Atendimento
  atendente_id uuid NULL,                 -- Funcionário atribuído (profiles.id)
  etiquetas text[] NULL DEFAULT '{}',     -- Tags/etiquetas da conversa
  
  -- Vínculo com CRM
  cliente_id bigint NULL,                 -- Referência ao cliente no CRM (clientes.id)
  
  -- Timestamps
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  
  CONSTRAINT wpp_conversas_pkey PRIMARY KEY (id),
  CONSTRAINT wpp_conversas_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE,
  CONSTRAINT wpp_conversas_unique_contact UNIQUE (empresa_id, wa_id, phone_number_id)
) TABLESPACE pg_default;

CREATE INDEX idx_wpp_conversas_empresa ON public.wpp_conversas USING btree (empresa_id);
CREATE INDEX idx_wpp_conversas_wa_id ON public.wpp_conversas USING btree (wa_id);
CREATE INDEX idx_wpp_conversas_updated ON public.wpp_conversas USING btree (ultima_mensagem_at DESC);


-- TABELA: wpp_mensagens
-- Cada mensagem trocada (enviada ou recebida)
CREATE TABLE public.wpp_mensagens (
  id bigserial NOT NULL,
  empresa_id bigint NOT NULL,
  conversa_id bigint NOT NULL,
  
  -- Identificação da mensagem
  wamid text NOT NULL,                    -- ID único da Meta (wamid.xxx)
  
  -- Direção
  direcao text NOT NULL DEFAULT 'in',     -- 'in' (recebida) | 'out' (enviada)
  
  -- Remetente/destinatário
  de text NOT NULL,                       -- Número de quem enviou
  para text NULL,                         -- Número do destinatário (para 'out')
  
  -- Conteúdo
  tipo text NOT NULL DEFAULT 'text',      -- text, image, audio, video, document, sticker, reaction, location
  
  -- Campos por tipo
  texto text NULL,                        -- Corpo da mensagem (text.body)
  
  -- Mídia (image, audio, video, document, sticker)
  media_id text NULL,                     -- ID da mídia na Meta
  media_url text NULL,                    -- URL pública (após download/re-upload no Storage)
  media_mime_type text NULL,              -- Tipo MIME (image/jpeg, audio/ogg, etc.)
  media_sha256 text NULL,                 -- Hash SHA256 para verificação
  media_filename text NULL,               -- Nome do arquivo (para documents)
  media_voice boolean NULL DEFAULT false, -- Se é áudio de voz (PTT)
  media_duracao text NULL,                -- Duração do áudio/vídeo (se disponível)
  
  -- Legenda (para imagem/vídeo/documento)
  legenda text NULL,                      -- caption da mídia
  
  -- Reaction
  reaction_emoji text NULL,               -- Emoji da reação
  reaction_message_id text NULL,          -- wamid da mensagem reagida
  
  -- Location
  latitude numeric NULL,
  longitude numeric NULL,
  location_name text NULL,
  location_address text NULL,
  
  -- Status de entrega
  status text NOT NULL DEFAULT 'sent',    -- sent, delivered, read, failed
  
  -- Timestamps
  timestamp_msg bigint NOT NULL,          -- Timestamp Unix original da Meta
  created_at timestamp with time zone NULL DEFAULT now(),
  
  CONSTRAINT wpp_mensagens_pkey PRIMARY KEY (id),
  CONSTRAINT wpp_mensagens_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES empresas (id) ON DELETE CASCADE,
  CONSTRAINT wpp_mensagens_conversa_id_fkey FOREIGN KEY (conversa_id) REFERENCES wpp_conversas (id) ON DELETE CASCADE,
  CONSTRAINT wpp_mensagens_wamid_unique UNIQUE (wamid)
) TABLESPACE pg_default;

CREATE INDEX idx_wpp_mensagens_conversa ON public.wpp_mensagens USING btree (conversa_id, created_at);
CREATE INDEX idx_wpp_mensagens_wamid ON public.wpp_mensagens USING btree (wamid);
CREATE INDEX idx_wpp_mensagens_empresa ON public.wpp_mensagens USING btree (empresa_id);


-- RLS Policies
ALTER TABLE public.wpp_conversas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wpp_conversas_select" ON public.wpp_conversas FOR SELECT USING (true);
CREATE POLICY "wpp_conversas_insert" ON public.wpp_conversas FOR INSERT WITH CHECK (true);
CREATE POLICY "wpp_conversas_update" ON public.wpp_conversas FOR UPDATE USING (true);
CREATE POLICY "wpp_conversas_delete" ON public.wpp_conversas FOR DELETE USING (true);

ALTER TABLE public.wpp_mensagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wpp_mensagens_select" ON public.wpp_mensagens FOR SELECT USING (true);
CREATE POLICY "wpp_mensagens_insert" ON public.wpp_mensagens FOR INSERT WITH CHECK (true);
CREATE POLICY "wpp_mensagens_update" ON public.wpp_mensagens FOR UPDATE USING (true);
CREATE POLICY "wpp_mensagens_delete" ON public.wpp_mensagens FOR DELETE USING (true);


-- Trigger para atualizar updated_at na conversa
CREATE OR REPLACE FUNCTION update_wpp_conversas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_wpp_conversas_updated_at
  BEFORE UPDATE ON public.wpp_conversas
  FOR EACH ROW
  EXECUTE FUNCTION update_wpp_conversas_updated_at();
