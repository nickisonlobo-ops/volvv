-- Adicionar coluna profile_id em funcionarios (referencia ao auth.users UUID)
ALTER TABLE public.funcionarios
  ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES auth.users(id);

-- Adicionar coluna comissao_percentual em servicos
ALTER TABLE public.servicos
  ADD COLUMN IF NOT EXISTS comissao_percentual NUMERIC(5,2);
