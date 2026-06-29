// =====================================================================
// connect-billing-account
// O tenant cola o account_name + API key (gerados em /users/api).
// Validamos, e só então guardamos a chave ENCRIPTADA no Vault.
// =====================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validateCredentials } from "../_shared/invoicexpress.ts";

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return json({ error: "method not allowed" }, 405);
    }

    // tenant_id vem do utilizador autenticado (app_metadata), não do body
    const tenantId = await tenantFromRequest(req);
    if (!tenantId) return json({ error: "unauthorized" }, 401);

    const { account_name, api_key } = await req.json();
    if (!account_name || !api_key) {
      return json({ error: "account_name e api_key são obrigatórios" }, 400);
    }

    const creds = { accountName: account_name, apiKey: api_key };
    const ok = await validateCredentials(creds);
    if (!ok) return json({ error: "credenciais inválidas ou conta inacessível" }, 422);

    // service role para chamar o RPC que mexe no Vault
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await admin.rpc("store_billing_key", {
      p_tenant_id: tenantId,
      p_account_name: account_name,
      p_api_key: api_key,
      p_status: "connected",
    });
    if (error) throw error;

    return json({ billing_account_id: data, status: "connected" });
  } catch (e) {
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
});

// Deriva o tenant do JWT do utilizador. Adapta ao teu modelo de auth.
async function tenantFromRequest(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await client.auth.getUser();
  return (user?.app_metadata as any)?.tenant_id ?? null;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
