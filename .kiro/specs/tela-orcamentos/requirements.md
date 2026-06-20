# Requirements Document

## Introduction

Página dedicada de gerenciamento de orçamentos (`/adesivos-orcamentos`) para o módulo de adesivos do sistema multi-tenant existente (Nuxt 4 + Supabase). O objetivo é centralizar a visualização, gerenciamento e acompanhamento de todos os orçamentos em uma interface especializada, adicionando funcionalidades que não existem atualmente: cálculo de preço por unidade (além do m²), regras de desconto por volume configuráveis, e aprovação pelo cliente via link compartilhável e mensagem WhatsApp. O módulo estende as tabelas `orcamentos_adesivo` e `pedidos_adesivo` já existentes, mantendo compatibilidade com o fluxo atual da página `adesivos-pedidos`.

## Glossary

- **Sistema_Orcamentos**: Página e lógica dedicada ao gerenciamento de orçamentos de adesivos, acessível via `/adesivos-orcamentos`
- **Orcamento**: Registro financeiro vinculado a um pedido de encomenda contendo valores, prazos e condições para aprovação do cliente
- **Operador**: Usuário do sistema (funcionário da empresa) com permissão para gerenciar orçamentos
- **Cliente**: Pessoa ou empresa que solicita o serviço de adesivos
- **Link_Aprovacao**: URL única e segura gerada para cada orçamento que permite ao cliente visualizar e aprovar o orçamento externamente sem autenticação no sistema
- **Mensagem_WhatsApp**: Mensagem pré-formatada contendo resumo do orçamento e link de aprovação, pronta para envio via WhatsApp Web ou app
- **Desconto_Volume**: Regra configurável que aplica desconto percentual automático baseado na quantidade de unidades do pedido (ex.: 10+ unidades = 10% off)
- **Regra_Desconto**: Configuração que define uma faixa de quantidade mínima e o percentual de desconto correspondente para aplicação automática
- **Preco_Unitario**: Modalidade de precificação onde o valor é calculado por unidade produzida em vez de por metro quadrado
- **Token_Aprovacao**: Identificador único (UUID) associado a um orçamento que compõe o Link_Aprovacao e permite acesso público seguro ao orçamento

## Requirements

### Requirement 1: Página de Listagem de Orçamentos

**User Story:** Como Operador, quero uma página dedicada para listar e gerenciar todos os orçamentos, para que eu possa acompanhar o status de cada proposta de forma centralizada.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL exibir a página de orçamentos na rota `/adesivos-orcamentos` com listagem paginada (máximo 20 itens por página), ordenada por data de criação decrescente
2. THE Sistema_Orcamentos SHALL exibir para cada orçamento na listagem: número do pedido, nome do cliente, descrição resumida (truncada em 60 caracteres), valor total, data de criação, data de validade, e indicador visual de status (pendente, aprovado, vencido, rejeitado)
3. THE Sistema_Orcamentos SHALL filtrar os orçamentos exibidos pela empresa_id do Operador logado, aplicando a política de Row Level Security existente
4. WHEN o Operador aplicar filtros de período (data início e data fim), status do orçamento ou nome do cliente, THE Sistema_Orcamentos SHALL exibir apenas os orçamentos que atendam a todos os critérios selecionados simultaneamente
5. WHEN a data atual exceder a data de validade de um orçamento cujo pedido ainda possui Status_Pedido "orcamento_enviado", THE Sistema_Orcamentos SHALL exibir o indicador visual "vencido" com cor diferenciada (vermelho/laranja) para esse orçamento na listagem
6. WHEN o Operador clicar em um orçamento da listagem, THE Sistema_Orcamentos SHALL exibir os detalhes completos do orçamento em um modal contendo: dados do cliente, descrição do pedido, material, dimensões, quantidade, área total, valor do material, valor de mão de obra, descontos aplicados (manual e volume), valor final, prazo estimado, validade e artes anexadas
7. THE Sistema_Orcamentos SHALL exibir no topo da página cartões de resumo com: total de orçamentos pendentes, total de orçamentos vencidos no período, valor total dos orçamentos aprovados no mês atual, e taxa de conversão (orçamentos aprovados ÷ total emitidos no mês)

### Requirement 2: Cálculo de Preço por Unidade

**User Story:** Como Operador, quero calcular o preço de um orçamento por unidade (além do cálculo por m²), para que eu possa atender pedidos com precificação fixa por peça.

#### Acceptance Criteria

1. WHEN o Operador gerar um orçamento, THE Sistema_Orcamentos SHALL permitir a seleção da modalidade de precificação entre "por m²" (padrão existente) e "por unidade"
2. WHEN a modalidade "por m²" for selecionada, THE Sistema_Orcamentos SHALL calcular o valor do material com a fórmula: área total em m² × preço por m² do material selecionado
3. WHEN a modalidade "por unidade" for selecionada, THE Sistema_Orcamentos SHALL exigir que o Operador informe o preço unitário (valor entre 0.01 e 99999.99 em R$) e calcular o valor do material com a fórmula: preço unitário × quantidade
4. THE Sistema_Orcamentos SHALL exibir em tempo real o valor calculado do material conforme o Operador altera a modalidade de precificação, o preço unitário ou as dimensões do pedido
5. THE Sistema_Orcamentos SHALL armazenar no registro do orçamento a modalidade de precificação utilizada e o preço unitário quando aplicável

### Requirement 3: Regras de Desconto por Volume

**User Story:** Como Operador, quero configurar regras de desconto automático por volume, para que descontos sejam aplicados automaticamente em pedidos com grandes quantidades.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL permitir ao Operador cadastrar regras de desconto por volume com os campos: quantidade mínima (inteiro entre 2 e 99999) e percentual de desconto (valor entre 0.01 e 99.99 com até 2 casas decimais)
2. THE Sistema_Orcamentos SHALL associar cada Regra_Desconto à empresa_id do Operador logado e permitir o cadastro de múltiplas faixas não sobrepostas para a mesma empresa
3. WHEN a quantidade do pedido atingir ou exceder a quantidade mínima de uma Regra_Desconto, THE Sistema_Orcamentos SHALL aplicar automaticamente o percentual de desconto correspondente à maior faixa atendida ao valor do material no orçamento
4. WHEN existirem múltiplas faixas de desconto e a quantidade do pedido atender a mais de uma faixa, THE Sistema_Orcamentos SHALL aplicar apenas o desconto da faixa com a maior quantidade mínima que seja menor ou igual à quantidade do pedido
5. THE Sistema_Orcamentos SHALL exibir no formulário de orçamento o desconto de volume aplicado como item separado, permitindo que o Operador visualize o valor antes e depois do desconto de volume
6. THE Sistema_Orcamentos SHALL permitir ao Operador adicionar desconto manual (percentual ou valor fixo) que será aplicado cumulativamente após o desconto de volume, desde que o valor final do orçamento permaneça maior que zero
7. WHEN o Operador editar ou excluir uma Regra_Desconto, THE Sistema_Orcamentos SHALL manter os orçamentos existentes inalterados, aplicando a alteração apenas em orçamentos futuros
8. IF o Operador tentar cadastrar uma Regra_Desconto com quantidade mínima que se sobreponha a uma faixa existente na mesma empresa, THEN THE Sistema_Orcamentos SHALL exibir mensagem de erro informando a sobreposição e não salvar a regra

### Requirement 4: Aprovação do Cliente via Link Compartilhável

**User Story:** Como Operador, quero gerar um link de aprovação para enviar ao cliente, para que o cliente possa visualizar e aprovar o orçamento sem acessar o sistema interno.

#### Acceptance Criteria

1. WHEN o Operador solicitar a geração do Link_Aprovacao para um orçamento com status "orcamento_enviado", THE Sistema_Orcamentos SHALL gerar um Token_Aprovacao único (UUID v4) e armazenar o token vinculado ao orçamento
2. THE Sistema_Orcamentos SHALL compor o Link_Aprovacao no formato: `{base_url}/orcamento-aprovacao/{token}` onde o token é o Token_Aprovacao gerado
3. WHEN um visitante acessar o Link_Aprovacao com um Token_Aprovacao válido e cujo orçamento não esteja vencido, THE Sistema_Orcamentos SHALL exibir uma página pública (sem autenticação) contendo: nome da empresa, dados do orçamento (descrição, material, dimensões, quantidade, valores, validade) e botões de ação "Aprovar" e "Rejeitar"
4. WHEN o cliente clicar em "Aprovar" na página pública, THE Sistema_Orcamentos SHALL alterar o Status_Pedido para "aprovado", registrar a data/hora da aprovação, a origem como "link_externo" e inserir o pedido na Fila_Producao
5. WHEN o cliente clicar em "Rejeitar" na página pública, THE Sistema_Orcamentos SHALL solicitar um motivo opcional (máximo 500 caracteres), alterar o Status_Pedido para "cancelado" e registrar a origem como "link_externo"
6. IF um visitante acessar o Link_Aprovacao com Token_Aprovacao inválido ou inexistente, THEN THE Sistema_Orcamentos SHALL exibir página de erro informando que o orçamento não foi encontrado
7. IF um visitante acessar o Link_Aprovacao de um orçamento já aprovado, rejeitado ou com validade expirada, THEN THE Sistema_Orcamentos SHALL exibir página informativa com o status atual do orçamento sem permitir nova ação
8. WHEN o Operador gerar o Link_Aprovacao, THE Sistema_Orcamentos SHALL exibir o link copiável e um botão para copiar diretamente para a área de transferência

### Requirement 5: Aprovação do Cliente via WhatsApp

**User Story:** Como Operador, quero enviar o orçamento ao cliente via WhatsApp com link de aprovação, para que o cliente possa aprovar de forma rápida e conveniente.

#### Acceptance Criteria

1. WHEN o Operador solicitar envio via WhatsApp para um orçamento com Link_Aprovacao gerado, THE Sistema_Orcamentos SHALL compor uma Mensagem_WhatsApp contendo: saudação com nome do cliente, resumo do orçamento (descrição, dimensões, quantidade, valor total, validade) e o Link_Aprovacao
2. THE Sistema_Orcamentos SHALL formatar a Mensagem_WhatsApp com quebras de linha e emojis adequados para leitura em dispositivos móveis, com limite máximo de 1000 caracteres
3. WHEN o Operador clicar no botão de envio WhatsApp, THE Sistema_Orcamentos SHALL abrir o link `https://wa.me/{telefone_cliente}?text={mensagem_codificada}` em uma nova aba do navegador, onde o telefone do cliente é obtido do cadastro e a mensagem é codificada com encodeURIComponent
4. IF o cliente cadastrado não possuir número de telefone registrado, THEN THE Sistema_Orcamentos SHALL exibir campo para o Operador inserir o número de telefone manualmente (formato brasileiro com DDD, 10 ou 11 dígitos) antes de gerar o link de WhatsApp
5. THE Sistema_Orcamentos SHALL permitir ao Operador visualizar e editar a Mensagem_WhatsApp antes do envio

### Requirement 6: Extensão da Tabela de Orçamentos

**User Story:** Como Operador, quero que o sistema armazene os novos dados de orçamento (modalidade de precificação, desconto por volume, token de aprovação), para que as funcionalidades avançadas sejam persistidas.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL estender a tabela `orcamentos_adesivo` com os campos: modalidade_preco (texto, valores "m2" ou "unidade", padrão "m2"), preco_unitario (numérico com 2 casas decimais, permitido somente quando modalidade é "unidade"), desconto_volume_percentual (numérico com 2 casas decimais, entre 0 e 99.99), token_aprovacao (UUID, único, pode ser nulo) e origem_aprovacao (texto, valores "interno", "link_externo" ou nulo)
2. THE Sistema_Orcamentos SHALL criar a tabela `regras_desconto_volume` com os campos: id (bigserial, chave primária), empresa_id (bigint, FK para empresas), quantidade_minima (inteiro entre 2 e 99999), desconto_percentual (numérico com 2 casas decimais entre 0.01 e 99.99), ativo (boolean, padrão true) e created_at (timestamptz, padrão now())
3. THE Sistema_Orcamentos SHALL aplicar constraint UNIQUE em (empresa_id, quantidade_minima) na tabela `regras_desconto_volume` para impedir faixas duplicadas na mesma empresa
4. THE Sistema_Orcamentos SHALL aplicar constraint UNIQUE no campo token_aprovacao da tabela `orcamentos_adesivo` para garantir unicidade dos tokens
5. THE Sistema_Orcamentos SHALL habilitar Row Level Security na tabela `regras_desconto_volume` com política de tenant idêntica às demais tabelas do módulo (empresa_id do perfil do usuário autenticado)

### Requirement 7: Página Pública de Aprovação

**User Story:** Como cliente, quero visualizar o orçamento em uma página clara e aprovar ou rejeitar sem precisar criar conta no sistema, para que o processo de aprovação seja simples e rápido.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL renderizar a página pública de aprovação (`/orcamento-aprovacao/{token}`) sem exigir autenticação, utilizando layout minimalista com logo da empresa, dados do orçamento e botões de ação
2. THE Sistema_Orcamentos SHALL exibir na página pública: nome da empresa, data do orçamento, validade, descrição do serviço, material, dimensões (largura × altura), quantidade, valor total com descriminação (material + mão de obra - descontos), e prazo estimado de produção
3. WHEN o cliente aprovar o orçamento pela página pública, THE Sistema_Orcamentos SHALL registrar a forma de pagamento como pendente (a ser definida pelo Operador internamente após a aprovação)
4. THE Sistema_Orcamentos SHALL exibir na página pública de aprovação as artes anexadas ao pedido como miniaturas clicáveis que abrem a imagem em tamanho completo
5. IF a página pública for acessada em dispositivo móvel, THEN THE Sistema_Orcamentos SHALL renderizar o layout de forma responsiva adaptando-se a telas de 320px a 768px de largura

### Requirement 8: Navegação e Integração com Sistema Existente

**User Story:** Como Operador, quero acessar a página de orçamentos a partir do menu lateral e manter integração com o fluxo existente de pedidos, para que a experiência seja consistente.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL adicionar o item "Orçamentos" ao menu lateral na seção "Adesivos", com ícone diferenciado, posicionado entre "Pedidos" e "Catálogo"
2. WHEN o Operador clicar no link "Orçamentos" no menu lateral, THE Sistema_Orcamentos SHALL navegar para a rota `/adesivos-orcamentos`
3. WHEN um orçamento for aprovado via Link_Aprovacao (externamente), THE Sistema_Orcamentos SHALL refletir a mudança de status na página `adesivos-pedidos` na próxima recarga ou consulta de dados
4. THE Sistema_Orcamentos SHALL manter compatibilidade com o fluxo de aprovação interna existente na página `adesivos-pedidos`, onde o Operador registra a aprovação manualmente com seleção de forma de pagamento
5. WHEN o Operador visualizar detalhes de um orçamento na página `/adesivos-orcamentos`, THE Sistema_Orcamentos SHALL exibir botão de navegação para o pedido correspondente na página `adesivos-pedidos`
