// =====================================================================
// emit-invoice
// Fluxo de produção: idempotência -> credenciais do Vault ->
// garantir cliente -> rascunho -> finalizar (ATCUD/QR/AT) -> PDF -> guardar.
// =====================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  ensureClient, createDraft, finalize, getPdfUrl,
  type DocType, type IxItem, type IxClientData,
} from "../_shared/invoicexpress.ts";

interface EmitBody {
  order_id: string;
  document_type?: DocType;       // default 'invoice'
  client: IxClientData;
  items: IxItem[];
}

Deno.serve(async (req) => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const tenantId = await tenantFromRequest(req);
    if (!tenantId) return json({ error: "unauthorized" }, 401);

    const body = (await req.json()) as EmitBody;
    const docType: DocType = body.document_type ?? "invoice";
    if (!body.order_id || !body.client?.nif || !body.items?.length) {
      return json({ error: "order_id, client.nif e items são obrigatórios" }, 400);
    }

    // -------- IDEMPOTÊNCIA: nunca emitir duas vezes a mesma encomenda --------
    const { data: existing } = await admin
      .from("invoices")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("order_id", body.order_id)
      .maybeSingle();

    if (existing?.state === "finalized") {
      return json({ status: "already_finalized", invoice: existing });
    }

    // reserva a linha (pending). Se já existir pending/error, reutiliza-a.
    const { data: pending, error: upErr } = await admin
      .from("invoices")
      .upsert(
        { tenant_id: tenantId, order_id: body.order_id, document_type: docType, state: "pending" },
        { onConflict: "tenant_id,order_id" },
      )
      .select()
      .single();
    if (upErr) throw upErr;

    // -------- credenciais (desencriptadas do Vault, só server-side) --------
    const { data: credRows, error: credErr } = await admin
      .rpc("get_billing_credentials", { p_tenant_id: tenantId });
    if (credErr) throw credErr;
    const cred = credRows?.[0];
    if (!cred) return json({ error: "tenant sem conta de faturação ligada" }, 412);
    const creds = { accountName: cred.account_name, apiKey: cred.api_key };

    // -------- fluxo InvoiceXpress --------
    await ensureClient(creds, body.client);
    const draft = await createDraft(creds, docType, { client: body.client, items: body.items });
    const final = await finalize(creds, docType, Number(draft.id));  // <- vira fatura legal
    const pdfUrl = await getPdfUrl(creds, Number(final.id));          // não bloqueia se atrasar

    const { data: saved } = await admin
      .from("invoices")
      .update({
        provider_invoice_id: String(final.id),
        state: "finalized",
        atcud: final.atcud ?? null,
        sequence_number: final.sequence_number ?? null,
        permalink: final.permalink ?? null,
        pdf_url: pdfUrl,
        total: final.total ?? null,
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pending.id)
      .select()
      .single();

    return json({ status: "finalized", invoice: saved });
  } catch (e) {
    const msg = String(e instanceof Error ? e.message : e);
    // marca erro para reprocessamento posterior (sem duplicar)
    try {
      const tenantId = await tenantFromRequest(req).catch(() => null);
      const body = await req.clone().json().catch(() => null);
      if (tenantId && body?.order_id) {
        await admin.from("invoices")
          .update({ state: "error", error_message: msg, updated_at: new Date().toISOString() })
          .eq("tenant_id", tenantId).eq("order_id", body.order_id);
      }
    } catch (_) { /* ignore */ }
    return json({ error: msg }, 500);
  }
});

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
