# WhatsApp Webhook Payloads — Referência

## Campos Importantes

### Identificadores
- `entry[].id` — ID da conta WhatsApp Business
- `metadata.phone_number_id` — ID do número conectado (nosso número)
- `metadata.display_phone_number` — Número formatado do negócio
- `contacts[].wa_id` — Número do contato (ex: "5511940527609")
- `contacts[].user_id` — ID único do usuário no Meta (ex: "BR.905018129298135")
- `contacts[].profile.name` — Nome do contato no WhatsApp
- `messages[].id` — ID único da mensagem (wamid)
- `messages[].timestamp` — Timestamp Unix (segundos)

### Tipos de Mensagem (field: "messages")
- `text` — `{ body: "texto" }`
- `image` — `{ mime_type, sha256, id, url }`
- `audio` — `{ mime_type, sha256, id, url, voice: boolean }`
- `video` — `{ mime_type, sha256, id, url }`
- `document` — `{ mime_type, sha256, id, url, filename }`
- `sticker` — `{ mime_type, sha256, id, url, animated: boolean }`
- `reaction` — `{ message_id, emoji }`
- `location` — `{ latitude, longitude, name, address }`

### Message Echoes (field: "smb_message_echoes")
Mensagens enviadas pelo app do WhatsApp Business (não pela API).
- `message_echoes[].from` — Nosso número
- `message_echoes[].to` — Número do destinatário
- `message_echoes[].to_user_id` — User ID do destinatário
- Mesma estrutura de tipo (text, image, etc.)

### Status Updates (field: "messages", com `statuses`)
- `statuses[].id` — wamid da mensagem
- `statuses[].status` — "sent" | "delivered" | "read" | "failed"
- `statuses[].timestamp` — Quando mudou
- `statuses[].recipient_id` — Número do destinatário

### Mídia
Quando chega uma mídia, o payload traz um `id` e `url` temporária.
Para obter URL pública permanente, usar endpoint:
```
GET https://graph.facebook.com/v21.0/{media_id}
Authorization: Bearer {access_token}
```
Retorna `{ url: "https://..." }` — essa URL expira em ~5min.
**Estratégia**: baixar a mídia e re-upload para Supabase Storage para ter URL permanente.
