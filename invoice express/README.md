# Integração de faturação certificada (InvoiceXpress) — passo a passo

Método de produção para um SaaS multi-tenant: chave **encriptada no Supabase Vault**,
emissão numa **Edge Function** com **idempotência** na base de dados, **retry em 429**,
e PDF obtido sem bloquear a emissão (a fatura já é legal após a finalização).

```
supabase/
├── migrations/0001_billing.sql              tabelas + Vault + RLS + RPCs
└── functions/
    ├── _shared/invoicexpress.ts             cliente da API (auth, retry, draft, finalize, pdf)
    ├── connect-billing-account/index.ts     liga a conta do tenant (valida + guarda no Vault)
    └── emit-invoice/index.ts                emite uma fatura (idempotente)
```

## Passo 0 — Segurança (fazer primeiro)
Gera uma **nova** API key em https://www.app.invoicexpress.com/users/api e revoga a antiga.
A chave nunca entra no código nem no frontend; só no Vault, via a Edge Function de ligação.

## Passo 1 — Aplicar a migration
```bash
supabase db push           # aplica 0001_billing.sql
```
Cria as tabelas `billing_accounts` e `invoices`, ativa o Vault e cria os RPCs
`store_billing_key` (guarda a chave encriptada) e `get_billing_credentials`
(desencripta só para a service_role).

## Passo 2 — Deploy das funções
```bash
supabase functions deploy connect-billing-account
supabase functions deploy emit-invoice
```
`SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` já estão
disponíveis no ambiente das funções — não precisas defini-los à mão.

## Passo 3 — Pré-requisito de conformidade (uma vez por tenant)
Na conta InvoiceXpress de cada cliente, confirma que:
- a **série de faturação** está criada e **comunicada** no Portal das Finanças;
- as **taxas de IVA** (ex.: `IVA23`) existem em *Preferências da Conta › Impostos nos Itens*
  — o `taxName` que envias tem de bater certo, senão é aplicada a taxa por defeito;
- a conta **não está em trial** (em trial os emails de fatura não são enviados).

## Passo 4 — Ligar a conta do tenant (uma vez)
```bash
curl -X POST "$SUPABASE_URL/functions/v1/connect-billing-account" \
  -H "Authorization: Bearer <JWT_DO_UTILIZADOR>" \
  -H "Content-Type: application/json" \
  -d '{ "account_name": "a-tua-conta", "api_key": "NOVA_CHAVE" }'
```

## Passo 5 — Emitir (a cada serviço fechado)
Dispara a partir do teu backend quando um serviço/encomenda é fechado:
```ts
const { data, error } = await supabase.functions.invoke("emit-invoice", {
  body: {
    order_id: order.id,                 // chave de idempotência
    document_type: "invoice",           // ou "invoice_receipt" / "simplified_invoice"
    client: { name: "Cliente Lda", nif: "500123456", email: "geral@cliente.pt" },
    items: [
      { name: "Envelopamento de viatura", unitPrice: 850, quantity: 1, taxName: "IVA23" },
    ],
  },
});
// data.invoice -> { state, atcud, sequence_number, permalink, pdf_url, ... }
```

## Garantias do método
- **Idempotência:** `unique (tenant_id, order_id)` + verificação `finalized` => nunca duplica.
- **Imutabilidade:** corrige-se uma fatura finalizada só por nota de crédito (novo documento).
- **Resiliência:** 429/5xx têm retry com backoff; o PDF não bloqueia a emissão.
- **Segredo protegido:** a chave vive no Vault; só a service_role a desencripta, server-side.

> Nota: para `invoice_receipt` / `simplified_invoice`, confirma na doc o nome exato do
> *wrapper* do JSON (o mapa `DOC` em `_shared/invoicexpress.ts` assume o singular do tipo).
