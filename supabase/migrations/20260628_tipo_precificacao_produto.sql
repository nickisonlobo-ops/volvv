-- Adicionar tipo de precificação no catálogo de produtos
-- 'unidade' = só Qtd + Preço (padrão universal)
-- 'm2' = Largura × Altura + Preço/m² (comunicação visual, vidraçaria)
-- 'metro_linear' = Comprimento + Preço/metro (faixas, rodapés, perfis)
ALTER TABLE public.catalogo_adesivos
  ADD COLUMN IF NOT EXISTS tipo_precificacao TEXT NOT NULL DEFAULT 'unidade'
  CHECK (tipo_precificacao IN ('unidade', 'm2', 'metro_linear'));
