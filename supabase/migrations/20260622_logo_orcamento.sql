-- Adicionar campo de logo alternativo para uso em documentos/orçamentos (fundo claro)
ALTER TABLE public.empresa_personalizacao
  ADD COLUMN IF NOT EXISTS logo_orcamento_url TEXT DEFAULT NULL;

ALTER TABLE public.empresa_personalizacao
  ADD COLUMN IF NOT EXISTS logo_orcamento_size TEXT DEFAULT '160';

COMMENT ON COLUMN public.empresa_personalizacao.logo_orcamento_url IS 'Logo para uso em documentos e links de orçamento (versão para fundo claro)';
COMMENT ON COLUMN public.empresa_personalizacao.logo_orcamento_size IS 'Tamanho em px do logo no link de orçamento';
