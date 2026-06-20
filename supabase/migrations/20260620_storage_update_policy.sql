-- ═══════════════════════════════════════════════════════════════
-- Migration: Adiciona policy UPDATE no bucket orcamentos
-- Necessária para operações com upsert:true no Storage
-- ═══════════════════════════════════════════════════════════════

-- UPDATE policy (necessária para upsert)
CREATE POLICY "orcamentos_storage_update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'orcamentos'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'orcamentos'
  AND (storage.foldername(name))[1]::bigint IN (
    SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
  )
);
