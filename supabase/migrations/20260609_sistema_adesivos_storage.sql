-- ═══════════════════════════════════════════════════════════════
-- Migration: Sistema de Adesivos — Storage Bucket artes-cliente
-- Configura bucket para upload de artes com isolamento por empresa
-- Path pattern: {empresa_id}/{pedido_id}/{filename}
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- Criar bucket artes-cliente
-- Max file size: 20MB (20971520 bytes)
-- Allowed MIME types: PNG, JPEG, PDF, SVG, PostScript
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artes-cliente',
  'artes-cliente',
  false,
  20971520, -- 20 MB
  ARRAY['image/png', 'image/jpeg', 'application/pdf', 'image/svg+xml', 'application/postscript']
)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- Storage Policies — Isolamento por empresa
-- O primeiro segmento do path deve ser o empresa_id do usuário autenticado
-- Path pattern validado: {empresa_id}/{pedido_id}/{filename}
-- ─────────────────────────────────────────────

-- INSERT: usuários autenticados podem fazer upload no path da sua empresa
CREATE POLICY "artes_cliente_insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'artes-cliente'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- SELECT: usuários autenticados podem ler arquivos da sua empresa
CREATE POLICY "artes_cliente_select"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'artes-cliente'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- UPDATE: usuários autenticados podem atualizar arquivos da sua empresa
CREATE POLICY "artes_cliente_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'artes-cliente'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- DELETE: usuários autenticados podem deletar arquivos da sua empresa
CREATE POLICY "artes_cliente_delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'artes-cliente'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
);
