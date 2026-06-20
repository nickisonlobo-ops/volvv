-- ═══════════════════════════════════════════════════════════════
-- Migration: Orçamentos — Storage Bucket e RLS Policies
-- Cria bucket "orcamentos" para upload de fotos (local de instalação
-- e arte do adesivo) com isolamento por empresa via RLS.
-- Path pattern: {empresa_id}/{orcamento_id}/...
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- Criar bucket orcamentos
-- Max file size: 10MB (10485760 bytes)
-- Allowed MIME types: JPEG, PNG, WebP, PDF
-- Public: true (leitura pública para links de aprovação)
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'orcamentos',
  'orcamentos',
  true,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- Storage Policies — Isolamento por empresa
-- O primeiro segmento do path deve ser o empresa_id do usuário
-- Path pattern validado: {empresa_id}/{orcamento_id}/{filename}
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- INSERT: usuários autenticados podem fazer upload
-- no path da sua empresa
-- ─────────────────────────────────────────────
CREATE POLICY "orcamentos_storage_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'orcamentos'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- ─────────────────────────────────────────────
-- SELECT (authenticated): usuários autenticados podem
-- ler arquivos da sua empresa
-- ─────────────────────────────────────────────
CREATE POLICY "orcamentos_storage_select_authenticated"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'orcamentos'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- ─────────────────────────────────────────────
-- SELECT (público): acesso público para arquivos de
-- orçamentos que possuem token_aprovacao válido.
-- Permite que clientes visualizem fotos via link de aprovação.
-- O segundo segmento do path é o orcamento_id.
-- ─────────────────────────────────────────────
CREATE POLICY "orcamentos_storage_select_public"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'orcamentos'
  AND EXISTS (
    SELECT 1 FROM public.orcamentos_adesivo
    WHERE id = (storage.foldername(name))[2]::bigint
      AND token_aprovacao IS NOT NULL
  )
);

-- ─────────────────────────────────────────────
-- DELETE: usuários autenticados podem deletar
-- arquivos da sua empresa (empresa proprietária)
-- ─────────────────────────────────────────────
CREATE POLICY "orcamentos_storage_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'orcamentos'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
);
