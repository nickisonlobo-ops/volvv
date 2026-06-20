# Requirements Document

## Introduction

Reformulação do fluxo de orçamentos no módulo de Adesivos do sistema multi-tenant (Nuxt 4 + Supabase). O fluxo atual é invertido: antes o pedido existia primeiro e o orçamento era gerado a partir dele. O novo fluxo posiciona o **Orçamento como entidade primária**, criado de forma independente com múltiplos itens/produtos (composição). Quando o cliente aprova o orçamento, o sistema gera automaticamente uma **Ordem de Serviço (OS)** contendo os produtos aprovados. O conceito de "pedido" é substituído por "Ordem de Serviço" neste contexto. A infraestrutura existente de aprovação externa (link público, WhatsApp, desconto por volume) é reutilizada e adaptada ao novo fluxo.

## Glossary

- **Sistema_Orcamentos**: Módulo de gerenciamento de orçamentos de adesivos, acessível via `/adesivos-orcamentos`
- **Orcamento**: Proposta comercial criada pelo Operador contendo um ou mais itens/produtos com precificação, prazos e condições para aprovação do cliente
- **Item_Orcamento**: Produto individual dentro de um Orçamento, contendo material, dimensões, quantidade e preço calculado
- **Ordem_Servico**: Documento de produção gerado automaticamente a partir de um Orçamento aprovado, contendo todos os itens a serem produzidos
- **Item_OS**: Produto individual dentro de uma Ordem_Servico, correspondente a um Item_Orcamento aprovado
- **Operador**: Usuário do sistema (funcionário da empresa) com permissão para criar e gerenciar orçamentos
- **Cliente**: Pessoa ou empresa que solicita o serviço de adesivos e aprova orçamentos
- **Link_Aprovacao**: URL única e segura gerada para cada Orçamento que permite ao Cliente visualizar e aprovar externamente sem autenticação
- **Token_Aprovacao**: Identificador único (UUID v4) associado a um Orçamento que compõe o Link_Aprovacao
- **Desconto_Volume**: Regra configurável que aplica desconto percentual automático baseado na quantidade total de itens do Orçamento
- **Regra_Desconto**: Configuração que define uma faixa de quantidade mínima e o percentual de desconto correspondente
- **Mensagem_WhatsApp**: Mensagem pré-formatada com resumo do Orçamento e Link_Aprovacao, pronta para envio via WhatsApp
- **Status_Orcamento**: Estado do ciclo de vida do Orçamento: "rascunho", "enviado", "aprovado", "rejeitado", "vencido"
- **Status_OS**: Estado do ciclo de vida da Ordem_Servico: "aguardando_producao", "em_producao", "pronto", "entregue", "cancelado"

## Requirements

### Requirement 1: Criação de Orçamento com Múltiplos Itens

**User Story:** Como Operador, quero criar um orçamento diretamente na página de orçamentos contendo múltiplos produtos/itens, para que eu possa compor propostas comerciais completas antes de qualquer ordem de produção.

#### Acceptance Criteria

1. WHEN o Operador clicar no botão "Novo Orçamento" na página `/adesivos-orcamentos`, THE Sistema_Orcamentos SHALL exibir um formulário de criação com seleção de cliente, data de validade e área para adicionar itens
2. THE Sistema_Orcamentos SHALL permitir ao Operador adicionar um ou mais itens ao Orçamento, onde cada Item_Orcamento contém: descrição do produto, material (selecionado da tabela materiais_adesivo), largura em centímetros, altura em centímetros, quantidade e modalidade de precificação ("por m²" ou "por unidade")
3. WHEN a modalidade "por m²" for selecionada para um Item_Orcamento, THE Sistema_Orcamentos SHALL calcular o valor do material do item com a fórmula: (largura_cm × altura_cm × quantidade) / 10000 × preço_m2 do material selecionado
4. WHEN a modalidade "por unidade" for selecionada para um Item_Orcamento, THE Sistema_Orcamentos SHALL exigir que o Operador informe o preço unitário (valor entre R$ 0.01 e R$ 99999.99) e calcular o valor do material com a fórmula: preço unitário × quantidade
5. THE Sistema_Orcamentos SHALL calcular e exibir em tempo real o valor total do Orçamento como a soma dos valores individuais de todos os itens, acrescido do valor de mão de obra global, menos descontos aplicados (volume e manual)
6. WHEN o Operador confirmar a criação do Orçamento, THE Sistema_Orcamentos SHALL validar que existe pelo menos um item adicionado, que todos os campos obrigatórios estão preenchidos e que o valor total é maior que zero antes de persistir o registro
7. THE Sistema_Orcamentos SHALL permitir ao Operador remover itens individuais do Orçamento durante a criação, atualizando o valor total automaticamente
8. THE Sistema_Orcamentos SHALL gerar um número sequencial único por empresa para cada Orçamento criado, no formato "ORC-{número}" para identificação

### Requirement 2: Listagem e Gerenciamento de Orçamentos

**User Story:** Como Operador, quero visualizar e gerenciar todos os orçamentos criados de forma centralizada, para que eu possa acompanhar o status de cada proposta comercial.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL exibir a página de orçamentos na rota `/adesivos-orcamentos` com listagem paginada (máximo 20 itens por página), ordenada por data de criação decrescente
2. THE Sistema_Orcamentos SHALL exibir para cada Orçamento na listagem: número do orçamento (ORC-N), nome do cliente, quantidade de itens, valor total, data de criação, data de validade e indicador visual de status (rascunho, enviado, aprovado, vencido, rejeitado)
3. THE Sistema_Orcamentos SHALL filtrar os orçamentos exibidos pela empresa_id do Operador logado, aplicando a política de Row Level Security existente
4. WHEN o Operador aplicar filtros de período (data início e data fim), status do orçamento ou nome do cliente, THE Sistema_Orcamentos SHALL exibir apenas os orçamentos que atendam a todos os critérios selecionados simultaneamente
5. WHEN a data atual exceder a data de validade de um Orçamento com Status_Orcamento "enviado", THE Sistema_Orcamentos SHALL classificar automaticamente o status como "vencido" com indicador visual diferenciado (cor vermelha/laranja)
6. WHEN o Operador clicar em um Orçamento da listagem, THE Sistema_Orcamentos SHALL exibir os detalhes completos em um modal contendo: dados do cliente, lista de todos os itens (material, dimensões, quantidade, valor unitário, subtotal de cada item), valor de mão de obra, descontos aplicados, valor total, prazo estimado e validade
7. THE Sistema_Orcamentos SHALL exibir no topo da página cartões de resumo com: total de orçamentos pendentes (enviados e não vencidos), total de orçamentos vencidos, valor total dos orçamentos aprovados no mês atual e taxa de conversão (aprovados ÷ total enviados no mês)

### Requirement 3: Geração Automática de Ordem de Serviço na Aprovação

**User Story:** Como Operador, quero que ao aprovar um orçamento uma Ordem de Serviço seja gerada automaticamente com os itens aprovados, para que a produção possa iniciar sem retrabalho manual de cadastro.

#### Acceptance Criteria

1. WHEN o Cliente aprovar um Orçamento (via Link_Aprovacao ou aprovação interna pelo Operador), THE Sistema_Orcamentos SHALL criar automaticamente uma Ordem_Servico com Status_OS "aguardando_producao" vinculada ao Orçamento aprovado
2. WHEN a Ordem_Servico for criada, THE Sistema_Orcamentos SHALL copiar todos os itens do Orçamento aprovado para a Ordem_Servico como itens da OS (Item_OS), mantendo: descrição, material, dimensões, quantidade e valor calculado de cada item
3. THE Sistema_Orcamentos SHALL gerar um número sequencial único por empresa para cada Ordem_Servico criada, no formato "OS-{número}" para identificação
4. WHEN a Ordem_Servico for criada, THE Sistema_Orcamentos SHALL inserir a OS na fila de produção com a posição seguinte à última OS existente na fila da empresa
5. THE Sistema_Orcamentos SHALL alterar o Status_Orcamento para "aprovado" e registrar a data/hora da aprovação e a origem ("link_externo" ou "interno") no momento da geração da Ordem_Servico
6. IF o Operador aprovar o Orçamento internamente, THEN THE Sistema_Orcamentos SHALL solicitar a seleção da forma de pagamento (dinheiro, pix, cartão, boleto ou parcelado) antes de gerar a Ordem_Servico
7. WHEN a Ordem_Servico for gerada via aprovação externa (link), THE Sistema_Orcamentos SHALL registrar a forma de pagamento como "pendente" para definição posterior pelo Operador
8. IF um Orçamento já possuir uma Ordem_Servico vinculada, THEN THE Sistema_Orcamentos SHALL impedir nova aprovação e exibir mensagem informando que a OS já foi gerada

### Requirement 4: Modelo de Dados para Itens do Orçamento e Ordem de Serviço

**User Story:** Como Operador, quero que o sistema armazene corretamente a composição de múltiplos itens por orçamento e a estrutura de ordens de serviço, para que os dados reflitam o novo fluxo de trabalho.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL criar a tabela `itens_orcamento` com os campos: id (bigserial PK), orcamento_id (FK para orcamentos_adesivo), material_id (FK para materiais_adesivo), descricao (texto obrigatório), largura_cm (numérico entre 0.1 e 9999.9), altura_cm (numérico entre 0.1 e 9999.9), quantidade (inteiro entre 1 e 99999), modalidade_preco (texto "m2" ou "unidade"), preco_unitario (numérico, obrigatório quando modalidade é "unidade"), area_m2 (numérico calculado), valor_item (numérico calculado), e created_at (timestamptz)
2. THE Sistema_Orcamentos SHALL alterar a tabela `orcamentos_adesivo` para tornar o campo `pedido_id` opcional (nullable), adicionar o campo `numero_orcamento` (texto único por empresa), o campo `status` (texto com valores "rascunho", "enviado", "aprovado", "rejeitado", "vencido"), o campo `valor_mao_obra_global` (numérico), e o campo `quantidade_total_itens` (inteiro calculado a partir da soma dos itens)
3. THE Sistema_Orcamentos SHALL criar a tabela `ordens_servico_adesivo` com os campos: id (bigserial PK), empresa_id (FK para empresas), orcamento_id (FK para orcamentos_adesivo, único), cliente_id (FK para clientes), numero_os (texto único por empresa), status (texto com valores "aguardando_producao", "em_producao", "pronto", "entregue", "cancelado"), forma_pagamento (texto nullable), valor_total (numérico), posicao_fila (inteiro), data_aprovacao (timestamptz), origem_aprovacao (texto "interno" ou "link_externo"), data_inicio_producao (timestamptz), data_fim_producao (timestamptz), data_entrega (timestamptz), prazo_estimado (timestamptz), observacoes (texto) e created_at (timestamptz)
4. THE Sistema_Orcamentos SHALL criar a tabela `itens_ordem_servico` com os campos: id (bigserial PK), ordem_servico_id (FK para ordens_servico_adesivo ON DELETE CASCADE), item_orcamento_id (FK para itens_orcamento), descricao (texto), material_id (FK para materiais_adesivo), largura_cm (numérico), altura_cm (numérico), quantidade (inteiro), valor_item (numérico) e created_at (timestamptz)
5. THE Sistema_Orcamentos SHALL habilitar Row Level Security em todas as novas tabelas (itens_orcamento, ordens_servico_adesivo, itens_ordem_servico) com política de tenant baseada em empresa_id do perfil do usuário autenticado
6. THE Sistema_Orcamentos SHALL aplicar constraint UNIQUE em (empresa_id, numero_orcamento) na tabela `orcamentos_adesivo` e em (empresa_id, numero_os) na tabela `ordens_servico_adesivo` para garantir numeração única por empresa

### Requirement 5: Aprovação do Cliente via Link Compartilhável

**User Story:** Como Operador, quero gerar um link de aprovação para enviar ao Cliente, para que o Cliente possa visualizar todos os itens do orçamento e aprovar sem acessar o sistema interno.

#### Acceptance Criteria

1. WHEN o Operador solicitar a geração do Link_Aprovacao para um Orçamento com Status_Orcamento "enviado", THE Sistema_Orcamentos SHALL gerar um Token_Aprovacao único (UUID v4) e armazenar o token vinculado ao Orçamento
2. THE Sistema_Orcamentos SHALL compor o Link_Aprovacao no formato: `{base_url}/orcamento-aprovacao/{token}` onde o token é o Token_Aprovacao gerado
3. WHEN um visitante acessar o Link_Aprovacao com Token_Aprovacao válido e cujo Orçamento não esteja vencido, THE Sistema_Orcamentos SHALL exibir uma página pública (sem autenticação) contendo: nome da empresa, lista completa de itens do Orçamento (descrição, material, dimensões, quantidade, valor de cada item), valor total, validade, e botões "Aprovar" e "Rejeitar"
4. WHEN o Cliente clicar em "Aprovar" na página pública, THE Sistema_Orcamentos SHALL alterar o Status_Orcamento para "aprovado", gerar a Ordem_Servico automaticamente conforme Requirement 3, e exibir confirmação de aprovação ao Cliente
5. WHEN o Cliente clicar em "Rejeitar" na página pública, THE Sistema_Orcamentos SHALL solicitar um motivo opcional (máximo 500 caracteres), alterar o Status_Orcamento para "rejeitado", registrar a origem como "link_externo" e exibir confirmação ao Cliente
6. IF um visitante acessar o Link_Aprovacao com Token_Aprovacao inválido ou inexistente, THEN THE Sistema_Orcamentos SHALL exibir página de erro informando que o orçamento não foi encontrado
7. IF um visitante acessar o Link_Aprovacao de um Orçamento já aprovado, rejeitado ou com validade expirada, THEN THE Sistema_Orcamentos SHALL exibir página informativa com o status atual sem permitir nova ação
8. WHEN o Operador gerar o Link_Aprovacao, THE Sistema_Orcamentos SHALL exibir o link copiável e um botão para copiar diretamente para a área de transferência

### Requirement 6: Envio de Orçamento via WhatsApp

**User Story:** Como Operador, quero enviar o orçamento ao Cliente via WhatsApp com link de aprovação, para que o Cliente possa aprovar de forma rápida e conveniente pelo celular.

#### Acceptance Criteria

1. WHEN o Operador solicitar envio via WhatsApp para um Orçamento com Link_Aprovacao gerado, THE Sistema_Orcamentos SHALL compor uma Mensagem_WhatsApp contendo: saudação com nome do Cliente, resumo dos itens (quantidade total de itens e descrição resumida), valor total do Orçamento, validade e o Link_Aprovacao
2. THE Sistema_Orcamentos SHALL formatar a Mensagem_WhatsApp com quebras de linha e emojis adequados para leitura em dispositivos móveis, com limite máximo de 1000 caracteres
3. WHEN o Operador clicar no botão de envio WhatsApp, THE Sistema_Orcamentos SHALL abrir o link `https://wa.me/{telefone_cliente}?text={mensagem_codificada}` em uma nova aba do navegador, com o telefone do Cliente obtido do cadastro e a mensagem codificada com encodeURIComponent
4. IF o Cliente cadastrado não possuir número de telefone registrado, THEN THE Sistema_Orcamentos SHALL exibir campo para o Operador inserir o número de telefone manualmente (formato brasileiro com DDD, 10 ou 11 dígitos) antes de gerar o link de WhatsApp
5. THE Sistema_Orcamentos SHALL alterar o Status_Orcamento de "rascunho" para "enviado" quando o link de WhatsApp ou Link_Aprovacao for gerado pela primeira vez para o Orçamento

### Requirement 7: Regras de Desconto por Volume

**User Story:** Como Operador, quero configurar regras de desconto automático por volume, para que descontos sejam aplicados automaticamente em orçamentos com grandes quantidades totais.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL permitir ao Operador cadastrar regras de desconto por volume com os campos: quantidade mínima (inteiro entre 2 e 99999) e percentual de desconto (valor entre 0.01 e 99.99 com até 2 casas decimais)
2. THE Sistema_Orcamentos SHALL associar cada Regra_Desconto à empresa_id do Operador logado e permitir o cadastro de múltiplas faixas não sobrepostas para a mesma empresa
3. WHEN a quantidade total de itens do Orçamento (soma das quantidades individuais de todos os itens) atingir ou exceder a quantidade mínima de uma Regra_Desconto, THE Sistema_Orcamentos SHALL aplicar automaticamente o percentual de desconto correspondente à maior faixa atendida sobre o valor total dos itens
4. WHEN existirem múltiplas faixas de desconto e a quantidade total do Orçamento atender a mais de uma faixa, THE Sistema_Orcamentos SHALL aplicar apenas o desconto da faixa com a maior quantidade mínima que seja menor ou igual à quantidade total
5. THE Sistema_Orcamentos SHALL exibir no formulário de criação do Orçamento o desconto de volume aplicado como item separado, mostrando o valor antes e depois do desconto
6. THE Sistema_Orcamentos SHALL permitir ao Operador adicionar desconto manual (percentual ou valor fixo) aplicado cumulativamente após o desconto de volume, desde que o valor final do Orçamento permaneça maior que zero
7. WHEN o Operador editar ou excluir uma Regra_Desconto, THE Sistema_Orcamentos SHALL manter os orçamentos existentes inalterados, aplicando a alteração apenas em orçamentos futuros
8. IF o Operador tentar cadastrar uma Regra_Desconto com quantidade mínima que se sobreponha a uma faixa existente na mesma empresa, THEN THE Sistema_Orcamentos SHALL exibir mensagem de erro informando a sobreposição e impedir o salvamento

### Requirement 8: Página Pública de Aprovação com Itens Detalhados

**User Story:** Como Cliente, quero visualizar todos os itens do orçamento em uma página clara e aprovar ou rejeitar sem precisar criar conta no sistema, para que o processo de aprovação seja simples e informativo.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL renderizar a página pública de aprovação (`/orcamento-aprovacao/{token}`) sem exigir autenticação, utilizando layout minimalista com logo da empresa e dados completos do Orçamento
2. THE Sistema_Orcamentos SHALL exibir na página pública: nome da empresa, número do orçamento (ORC-N), data de emissão, validade, lista de todos os itens com detalhamento (descrição, material, dimensões largura × altura, quantidade, valor de cada item), subtotal dos itens, descontos aplicados (volume e manual), valor de mão de obra, valor total final e prazo estimado de produção
3. THE Sistema_Orcamentos SHALL permitir acesso público (role anon) à página de aprovação por meio de política RLS que libera SELECT na tabela `orcamentos_adesivo` e `itens_orcamento` onde o token_aprovacao corresponda ao token da URL
4. IF a página pública for acessada em dispositivo móvel, THEN THE Sistema_Orcamentos SHALL renderizar o layout de forma responsiva adaptando-se a telas de 320px a 768px de largura
5. WHEN o Cliente aprovar o Orçamento pela página pública, THE Sistema_Orcamentos SHALL exibir mensagem de confirmação informando que a Ordem de Serviço foi gerada e a produção será iniciada

### Requirement 9: Gestão de Ordens de Serviço

**User Story:** Como Operador, quero visualizar e gerenciar as Ordens de Serviço geradas a partir dos orçamentos aprovados, para que eu possa acompanhar a produção dos itens.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL exibir na página de orçamentos um indicador visual quando um Orçamento aprovado possuir uma Ordem_Servico vinculada, incluindo o número da OS e o status atual de produção
2. WHEN o Operador clicar no indicador da Ordem_Servico, THE Sistema_Orcamentos SHALL exibir os detalhes da OS: número, status, lista de itens com status individual, data de aprovação, forma de pagamento, prazo estimado e posição na fila
3. THE Sistema_Orcamentos SHALL permitir ao Operador alterar o Status_OS entre as transições válidas: "aguardando_producao" → "em_producao" → "pronto" → "entregue", registrando a data/hora de cada transição
4. THE Sistema_Orcamentos SHALL permitir ao Operador cancelar uma Ordem_Servico com motivo obrigatório, alterando o Status_OS para "cancelado" e registrando o motivo
5. WHEN o Operador definir a forma de pagamento em uma OS com pagamento "pendente", THE Sistema_Orcamentos SHALL atualizar o campo forma_pagamento com o valor selecionado (dinheiro, pix, cartão, boleto ou parcelado)
6. THE Sistema_Orcamentos SHALL manter a compatibilidade com o sistema de fila de produção existente, utilizando o campo posicao_fila para ordenação na produção

### Requirement 10: Navegação e Integração com Sistema Existente

**User Story:** Como Operador, quero que o novo fluxo de orçamentos se integre ao menu lateral existente e coexista com a infraestrutura atual, para que a transição seja transparente.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL utilizar o item "Orçamentos" já existente no menu lateral na seção "Adesivos", mantendo a rota `/adesivos-orcamentos` e o ícone atual
2. WHEN o Operador acessar `/adesivos-orcamentos`, THE Sistema_Orcamentos SHALL exibir o botão "Novo Orçamento" em posição de destaque no topo da página, ao lado dos filtros
3. THE Sistema_Orcamentos SHALL reutilizar a tabela `regras_desconto_volume` já existente, a infraestrutura de Token_Aprovacao e a página pública de aprovação (`/orcamento-aprovacao/[token].vue`) adaptando-a para exibir múltiplos itens
4. WHEN um Orçamento for aprovado e a Ordem_Servico for gerada, THE Sistema_Orcamentos SHALL refletir a existência da nova OS na seção relevante do sistema sem duplicar informações na página de pedidos antiga
5. THE Sistema_Orcamentos SHALL manter os orçamentos criados no fluxo antigo (vinculados a pedidos) acessíveis na listagem com indicação visual de "legado", sem impedir a navegação para o pedido original
