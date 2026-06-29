-- =====================================================================
-- Integração de faturação certificada (InvoiceXpress) — multi-tenant
-- A API key NUNCA é guardada em texto plano: vive no Supabase Vault.
-- =====================================================================

create extension if not exists "vault" with schema "vault";

-- ---------------------------------------------------------------------
-- Conta de faturação por tenant (1 conta InvoiceXpress por cliente teu)
-- ---------------------------------------------------------------------
create table if not exists public.billing_accounts (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null,
  provider          text not null default 'invoicexpress',
  account_name      text not null,                 -- o XXX em https://XXX.app.invoicexpress.com
  vault_secret_id   uuid not null,                 -- referência ao segredo (a chave) no Vault
  default_sequence_id text,                         -- série de faturação a usar (opcional)
  status            text not null default 'connected'  -- connected | trial | error
                    check (status in ('connected','trial','error')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (tenant_id, provider)
);

-- ---------------------------------------------------------------------
-- Registo local de cada documento emitido (liga encomenda <-> fatura)
-- ---------------------------------------------------------------------
create table if not exists public.invoices (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null,
  order_id            uuid not null,               -- a encomenda/serviço no teu sistema
  provider            text not null default 'invoicexpress',
  provider_invoice_id text,                         -- id devolvido pelo InvoiceXpress
  document_type       text not null default 'invoice',
  state               text not null default 'pending'  -- pending | finalized | error
                      check (state in ('pending','finalized','error')),
  atcud               text,
  sequence_number     text,
  permalink           text,
  pdf_url             text,
  total               numeric,
  error_message       text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  -- IDEMPOTÊNCIA: uma encomenda só pode originar UMA fatura por tenant.
  unique (tenant_id, order_id)
);

-- ---------------------------------------------------------------------
-- RLS — acesso direto (frontend) só vê as linhas do próprio tenant.
-- As Edge Functions usam a service_role e contornam a RLS.
-- Ajusta a expressão do tenant ao teu modelo de auth.
-- ---------------------------------------------------------------------
alter table public.billing_accounts enable row level security;
alter table public.invoices enable row level security;

create policy "tenant reads own billing account"
  on public.billing_accounts for select to authenticated
  using (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid);

create policy "tenant reads own invoices"
  on public.invoices for select to authenticated
  using (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid);

-- ---------------------------------------------------------------------
-- RPC: guardar a chave no Vault e criar/atualizar a conta de faturação.
-- security definer => corre com privilégios suficientes para o Vault.
-- ---------------------------------------------------------------------
create or replace function public.store_billing_key(
  p_tenant_id    uuid,
  p_account_name text,
  p_api_key      text,
  p_status       text default 'connected'
) returns uuid
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_secret_id uuid;
  v_account_id uuid;
begin
  -- cria o segredo encriptado no Vault (nome único por tenant)
  v_secret_id := vault.create_secret(
    p_api_key,
    'ix_key_' || p_tenant_id::text,
    'InvoiceXpress API key for tenant ' || p_tenant_id::text
  );

  insert into public.billing_accounts (tenant_id, provider, account_name, vault_secret_id, status)
  values (p_tenant_id, 'invoicexpress', p_account_name, v_secret_id, p_status)
  on conflict (tenant_id, provider) do update
    set account_name    = excluded.account_name,
        vault_secret_id  = excluded.vault_secret_id,
        status           = excluded.status,
        updated_at       = now()
  returning id into v_account_id;

  return v_account_id;
end;
$$;

-- ---------------------------------------------------------------------
-- RPC: devolver credenciais desencriptadas para a Edge Function.
-- Apenas a service_role pode executar (a chave nunca chega ao browser).
-- ---------------------------------------------------------------------
create or replace function public.get_billing_credentials(p_tenant_id uuid)
returns table (account_name text, api_key text, status text)
language sql
security definer
set search_path = public, vault
as $$
  select b.account_name, s.decrypted_secret, b.status
  from public.billing_accounts b
  join vault.decrypted_secrets s on s.id = b.vault_secret_id
  where b.tenant_id = p_tenant_id and b.provider = 'invoicexpress';
$$;

revoke all on function public.get_billing_credentials(uuid) from public, anon, authenticated;
grant execute on function public.get_billing_credentials(uuid) to service_role;
revoke all on function public.store_billing_key(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.store_billing_key(uuid, text, text, text) to service_role;
