-- Adicionar coluna pais na personalizacao da empresa
-- Valores: 'BR' (Brasil) ou 'PT' (Portugal). Default: 'BR'
ALTER TABLE public.empresa_personalizacao
  ADD COLUMN IF NOT EXISTS pais TEXT NOT NULL DEFAULT 'BR';
