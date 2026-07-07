-- Tema Dark/Light padronizado
-- Substitui as cores livres por empresa por dois modos: light | dark.
-- tema_sistema: tema padrão do sistema interno da empresa.
-- tema_loja:    tema da vitrine pública (/loja, /catalogo, /agendar).
-- As colunas antigas de cor (cor_primaria, cor_fundo, gradientes, etc.) são
-- mantidas por compatibilidade histórica, mas não são mais usadas pelo app.

alter table public.empresa_personalizacao
  add column if not exists tema_sistema text not null default 'light'
    check (tema_sistema in ('light', 'dark')),
  add column if not exists tema_loja text not null default 'light'
    check (tema_loja in ('light', 'dark'));
