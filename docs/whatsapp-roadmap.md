# WhatsApp Integration — Roadmap

## Visão Geral
Integração completa do WhatsApp Business API (Meta Cloud API) no sistema Volvv, permitindo atendimento direto pelo painel com histórico, tempo real e cache local.

---

## Fase 1: Estrutura de Dados ✅ (atual)
- [x] Criar componentes de UI (chat page + message components)
- [x] Adicionar página no sidebar (desktop + mobile)
- [x] Criar componentes de balões (Text, Audio, Image, Document, Sticker)
- [ ] **Criar tabelas no Supabase** (conversas + mensagens)
- [ ] Inserir dados mock para validar UI

## Fase 2: Cache Local (Pinia Store)
- [ ] Criar store `useChatStore` com Pinia
- [ ] Cache de conversas (lista lateral)
- [ ] Cache de mensagens por conversa
- [ ] Otimistic updates (enviar mensagem aparece instantaneamente)
- [ ] Invalidation strategy (quando recebe webhook)

## Fase 3: Tempo Real (Pusher)
- [ ] Configurar Pusher (ou Supabase Realtime como fallback)
- [ ] Canal por empresa: `private-empresa-{id}`
- [ ] Evento `nova-mensagem` → atualiza store + UI
- [ ] Evento `status-mensagem` → atualiza checks (enviado/entregue/lido)
- [ ] Indicador de "digitando..."

## Fase 4: API de Envio (Meta Cloud API)
- [ ] Endpoint server-side (Nuxt API route ou Edge Function)
- [ ] Enviar mensagem de texto
- [ ] Enviar imagem/documento/áudio
- [ ] Enviar template messages (HSM)
- [ ] Marcar mensagem como lida (read receipts)

## Fase 5: Webhook de Recebimento (Meta → Supabase)
- [ ] Endpoint de webhook (verificação + recebimento)
- [ ] Parsear payloads: text, image, audio, document, sticker, reaction
- [ ] Salvar mensagem na tabela `wpp_mensagens`
- [ ] Criar/atualizar conversa na tabela `wpp_conversas`
- [ ] Disparar evento Pusher para o frontend

## Fase 6: Features Avançadas
- [ ] Respostas rápidas (templates salvos)
- [ ] Atribuição de atendente (qual funcionário responde)
- [ ] Etiquetas/tags por conversa
- [ ] Busca no histórico de mensagens
- [ ] Exportar conversa (PDF)
- [ ] Bot de respostas automáticas (fora do horário)
- [ ] Integração com CRM (vincular conversa a cliente existente)
- [ ] Notificações internas quando recebe mensagem

---

## Tabelas Supabase

### `wpp_conversas`
Cada conversa = um contato do WhatsApp.

### `wpp_mensagens`
Cada mensagem trocada (enviada ou recebida).

---

## Stack Técnica
- **Frontend**: Nuxt 3 + Vue 3 + Pinia + Pusher JS
- **Backend**: Nuxt server routes (ou Supabase Edge Functions)
- **Banco**: Supabase (PostgreSQL)
- **Realtime**: Pusher Channels (ou Supabase Realtime)
- **API WhatsApp**: Meta Cloud API v21+
- **Mídia**: Supabase Storage (re-upload de mídia recebida)
