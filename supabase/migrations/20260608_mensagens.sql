-- Criar tabela de mensagens para comunicação com clientes
CREATE TABLE IF NOT EXISTS mensagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'entrada', -- 'entrada' ou 'saida'
  lido BOOLEAN DEFAULT FALSE,
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_mensagens_empresa_id ON mensagens(empresa_id);
CREATE INDEX idx_mensagens_cliente_id ON mensagens(cliente_id);
CREATE INDEX idx_mensagens_usuario_id ON mensagens(usuario_id);
CREATE INDEX idx_mensagens_cliente_empresa ON mensagens(cliente_id, empresa_id);
CREATE INDEX idx_mensagens_data_envio ON mensagens(data_envio DESC);

-- RLS: Políticas de segurança
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;

-- Apenas usuários da mesma empresa podem ver mensagens
CREATE POLICY "mensagens_select_same_company" ON mensagens
  FOR SELECT USING (
    empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid())
  );

-- Apenas usuários da mesma empresa podem inserir mensagens
CREATE POLICY "mensagens_insert_same_company" ON mensagens
  FOR INSERT WITH CHECK (
    empresa_id = (SELECT empresa_id FROM profiles WHERE id = auth.uid())
    AND usuario_id = auth.uid()
  );

-- Apenas quem criou pode atualizar
CREATE POLICY "mensagens_update_owner" ON mensagens
  FOR UPDATE USING (usuario_id = auth.uid())
  WITH CHECK (usuario_id = auth.uid());

-- Apenas quem criou pode deletar
CREATE POLICY "mensagens_delete_owner" ON mensagens
  FOR DELETE USING (usuario_id = auth.uid());

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_mensagens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mensagens_updated_at_trigger
BEFORE UPDATE ON mensagens
FOR EACH ROW
EXECUTE FUNCTION update_mensagens_updated_at();
