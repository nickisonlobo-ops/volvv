-- ═══════════════════════════════════════════════════════════════
-- Migration: Sistema de Adesivos
-- Cria todas as tabelas do módulo de gestão de adesivos
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- materiais_adesivo
-- ─────────────────────────────────────────────
CREATE TABLE public.materiais_adesivo (
  id bigserial PRIMARY KEY,
  empresa_id bigint NOT NULL REFERENCES public.empresas(id),
  nome text NOT NULL,
  descricao text,
  preco_m2 numeric(10,2) NOT NULL CHECK (preco_m2 BETWEEN 0.01 AND 99999.99),
  estoque_atual numeric(10,2) NOT NULL DEFAULT 0 CHECK (estoque_atual >= -99999.99 AND estoque_atual <= 99999.99),
  estoque_minimo numeric(10,2) NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(empresa_id, nome)
);

-- ─────────────────────────────────────────────
-- catalogo_adesivos
-- ─────────────────────────────────────────────
CREATE TABLE public.catalogo_adesivos (
  id bigserial PRIMARY KEY,
  empresa_id bigint NOT NULL REFERENCES public.empresas(id),
  nome text NOT NULL,
  descricao text,
  categoria text NOT NULL,
  material_id bigint NOT NULL REFERENCES public.materiais_adesivo(id),
  largura_cm numeric(6,1) NOT NULL CHECK (largura_cm BETWEEN 0.1 AND 500),
  altura_cm numeric(6,1) NOT NULL CHECK (altura_cm BETWEEN 0.1 AND 500),
  preco_venda numeric(10,2) NOT NULL CHECK (preco_venda BETWEEN 0.01 AND 999999.99),
  imagem_url text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- pedidos_adesivo
-- ─────────────────────────────────────────────
CREATE TABLE public.pedidos_adesivo (
  id bigserial PRIMARY KEY,
  empresa_id bigint NOT NULL REFERENCES public.empresas(id),
  cliente_id bigint NOT NULL REFERENCES public.clientes(id),
  tipo text NOT NULL DEFAULT 'encomenda' CHECK (tipo IN ('encomenda', 'catalogo')),
  descricao text NOT NULL,
  material_id bigint REFERENCES public.materiais_adesivo(id),
  largura_cm numeric(7,1) CHECK (largura_cm BETWEEN 0.1 AND 9999.9),
  altura_cm numeric(7,1) CHECK (altura_cm BETWEEN 0.1 AND 9999.9),
  quantidade integer NOT NULL DEFAULT 1 CHECK (quantidade BETWEEN 1 AND 99999),
  area_total_m2 numeric(12,4) GENERATED ALWAYS AS (
    CASE WHEN largura_cm IS NOT NULL AND altura_cm IS NOT NULL
      THEN (largura_cm * altura_cm * quantidade) / 10000.0
      ELSE NULL
    END
  ) STORED,
  observacoes text,
  status text NOT NULL DEFAULT 'novo' CHECK (
    status IN ('novo','orcamento_enviado','aprovado','em_producao','pronto','entregue','cancelado')
  ),
  forma_pagamento text CHECK (
    forma_pagamento IS NULL OR forma_pagamento IN ('dinheiro','pix','cartao','boleto','parcelado')
  ),
  motivo_cancelamento text,
  data_cancelamento timestamptz,
  venda_id bigint REFERENCES public.vendas(id),
  posicao_fila integer,
  data_entrada_fila timestamptz,
  data_inicio_producao timestamptz,
  data_fim_producao timestamptz,
  data_entrega timestamptz,
  prazo_estimado timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- pedidos_adesivo_itens (para pedidos tipo catálogo)
-- ─────────────────────────────────────────────
CREATE TABLE public.pedidos_adesivo_itens (
  id bigserial PRIMARY KEY,
  pedido_id bigint NOT NULL REFERENCES public.pedidos_adesivo(id) ON DELETE CASCADE,
  produto_id bigint NOT NULL REFERENCES public.catalogo_adesivos(id),
  quantidade integer NOT NULL DEFAULT 1 CHECK (quantidade BETWEEN 1 AND 9999),
  preco_unitario numeric(10,2) NOT NULL,
  valor_total numeric(12,2) GENERATED ALWAYS AS (quantidade::numeric * preco_unitario) STORED
);

-- ─────────────────────────────────────────────
-- orcamentos_adesivo
-- ─────────────────────────────────────────────
CREATE TABLE public.orcamentos_adesivo (
  id bigserial PRIMARY KEY,
  pedido_id bigint NOT NULL REFERENCES public.pedidos_adesivo(id),
  empresa_id bigint NOT NULL REFERENCES public.empresas(id),
  valor_material numeric(12,2) NOT NULL,
  valor_mao_obra numeric(12,2) NOT NULL DEFAULT 0 CHECK (valor_mao_obra >= 0),
  desconto_percentual numeric(5,2) DEFAULT 0 CHECK (desconto_percentual BETWEEN 0 AND 100),
  desconto_valor numeric(12,2) DEFAULT 0 CHECK (desconto_valor >= 0),
  valor_total numeric(12,2) NOT NULL CHECK (valor_total > 0),
  prazo_estimado_dias integer,
  validade_dias integer NOT NULL DEFAULT 7 CHECK (validade_dias BETWEEN 1 AND 90),
  data_criacao timestamptz DEFAULT now(),
  data_validade timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- pedidos_adesivo_artes (artes do cliente)
-- ─────────────────────────────────────────────
CREATE TABLE public.pedidos_adesivo_artes (
  id bigserial PRIMARY KEY,
  pedido_id bigint NOT NULL REFERENCES public.pedidos_adesivo(id) ON DELETE CASCADE,
  nome_arquivo text NOT NULL,
  url text NOT NULL,
  tamanho_bytes bigint,
  tipo_mime text,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- estoque_movimentacoes
-- ─────────────────────────────────────────────
CREATE TABLE public.estoque_movimentacoes (
  id bigserial PRIMARY KEY,
  empresa_id bigint NOT NULL REFERENCES public.empresas(id),
  material_id bigint NOT NULL REFERENCES public.materiais_adesivo(id),
  tipo text NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  quantidade_m2 numeric(10,2) NOT NULL CHECK (quantidade_m2 > 0),
  saldo_resultante numeric(10,2) NOT NULL,
  custo_compra numeric(10,2),
  referencia_pedido_id bigint REFERENCES public.pedidos_adesivo(id),
  referencia_venda_id bigint REFERENCES public.vendas(id),
  observacoes text,
  created_at timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- pedidos_adesivo_historico (log de mudanças de status)
-- ─────────────────────────────────────────────
CREATE TABLE public.pedidos_adesivo_historico (
  id bigserial PRIMARY KEY,
  pedido_id bigint NOT NULL REFERENCES public.pedidos_adesivo(id) ON DELETE CASCADE,
  status_anterior text,
  status_novo text NOT NULL,
  data_mudanca timestamptz DEFAULT now(),
  observacao text
);

-- ─────────────────────────────────────────────
-- ALTER TABLE vendas: adicionar forma_pagamento
-- ─────────────────────────────────────────────
ALTER TABLE public.vendas
  ADD COLUMN IF NOT EXISTS forma_pagamento text
  CHECK (forma_pagamento IS NULL OR forma_pagamento IN ('dinheiro','pix','cartao','boleto','parcelado'));
