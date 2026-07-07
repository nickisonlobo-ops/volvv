-- ═══════════════════════════════════════════════════════════════
-- Mensageria multicanal: adiciona Instagram e Facebook Messenger à central
-- de mensagens (hoje as tabelas conversations/messages só suportam WhatsApp,
-- ver api/supabase/schema.sql).
--
-- conversations/messages ganham a coluna `canal` pra distinguir a origem.
-- Reaproveitamos phone_number_id/wa_id como identificadores genéricos de
-- "caixa de entrada" (Page ID / ID da conta comercial do Instagram no lugar
-- do número de WhatsApp) e "contato externo" (PSID/IGSID no lugar do wa_id)
-- — evita reescrever toda a lógica de upsert/índices/canal Pusher que já
-- depende desses nomes de coluna.
--
-- marketing_integracoes ganha as credenciais de mensageria do Meta
-- (meta_msg_*), SEPARADAS de meta_page_id (que é a Página usada pra
-- anúncios) — a empresa pode gerenciar várias Páginas e escolher uma
-- diferente pra mensagens sem afetar a Página usada nos anúncios.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS canal text NOT NULL DEFAULT 'whatsapp'
    CHECK (canal IN ('whatsapp', 'instagram', 'facebook'));

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS canal text NOT NULL DEFAULT 'whatsapp'
    CHECK (canal IN ('whatsapp', 'instagram', 'facebook'));

-- A unicidade (phone_number_id, wa_id) valia só pra WhatsApp; agora que o
-- mesmo par de colunas serve pra guardar identificadores de outros canais,
-- incluímos `canal` na chave (todas as linhas existentes já têm canal
-- 'whatsapp', então a unicidade efetiva não muda pra elas).
ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_phone_number_id_wa_id_key;
ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_canal_phone_wa_key;
ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_canal_phone_wa_key UNIQUE (canal, phone_number_id, wa_id);

CREATE INDEX IF NOT EXISTS idx_conversations_canal_recent
  ON public.conversations USING btree (canal, phone_number_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_canal
  ON public.messages USING btree (canal);

ALTER TABLE public.marketing_integracoes
  ADD COLUMN IF NOT EXISTS meta_msg_page_id text NULL,               -- Página escolhida p/ mensagens (independente da Página de anúncios)
  ADD COLUMN IF NOT EXISTS meta_msg_page_nome text NULL,              -- nome da Página (exibição, evita nova chamada à Graph API)
  ADD COLUMN IF NOT EXISTS meta_msg_page_access_token text NULL,      -- Page Access Token (Send API de Messenger/Instagram)
  ADD COLUMN IF NOT EXISTS meta_msg_instagram_business_id text NULL,  -- ID da conta comercial do Instagram vinculada a essa Página
  ADD COLUMN IF NOT EXISTS meta_msg_instagram_usuario text NULL;      -- @usuário do Instagram vinculado (exibição)
