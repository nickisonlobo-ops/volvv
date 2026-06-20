# Requirements Document

## Introduction

Sistema integrado para empresa de adesivos que opera em dois modelos de venda simultâneos: **sob encomenda** (cliente envia arte/medida, recebe orçamento, aprova, entra em produção) e **catálogo fixo / loja online** (cliente compra modelos prontos diretamente). O sistema será utilizado por equipe pequena (2–5 pessoas) e se integra ao sistema multi-tenant existente (Nuxt 4 + Supabase). Nesta primeira versão não haverá portal externo para clientes.

## Glossary

- **Sistema_Adesivos**: Módulo do sistema responsável pelo gerenciamento completo de pedidos de adesivos (sob encomenda e catálogo)
- **Pedido_Encomenda**: Pedido iniciado pelo operador a partir de uma solicitação do cliente contendo arte, medidas e especificações personalizadas
- **Pedido_Catalogo**: Pedido gerado a partir da compra de itens prontos do catálogo de adesivos
- **Orcamento**: Documento com valores, materiais e prazo estimado enviado ao cliente antes da aprovação de um Pedido_Encomenda
- **Catalogo_Adesivos**: Conjunto de produtos de adesivos prontos com preço fixo disponíveis para venda direta
- **Fila_Producao**: Lista ordenada de pedidos aprovados aguardando ou em processo de produção
- **Operador**: Usuário do sistema (funcionário da empresa de adesivos) com permissão para gerenciar pedidos, orçamentos e produção
- **Material_Adesivo**: Tipo de material/substrato usado na produção (vinil, transparente, jateado, etc.)
- **Arte_Cliente**: Arquivo de imagem ou vetor enviado pelo cliente para produção sob encomenda
- **Status_Pedido**: Estado atual de um pedido no fluxo (novo, orcamento_enviado, aprovado, em_producao, pronto, entregue, cancelado)

## Requirements

### Requirement 1: Cadastro de Produtos do Catálogo

**User Story:** Como Operador, quero cadastrar e gerenciar produtos de adesivos prontos no catálogo, para que eu possa vender itens de pronta entrega.

#### Acceptance Criteria

1. THE Sistema_Adesivos SHALL permitir o cadastro de produtos com os seguintes campos obrigatórios: nome (máximo 100 caracteres), categoria, material (selecionado da lista de materiais ativos), dimensões (largura e altura em cm, entre 0.1 e 500), preço de venda (entre 0.01 e 999999.99 em R$) e imagem de referência; e o campo opcional: descrição (máximo 500 caracteres)
2. THE Sistema_Adesivos SHALL associar cada produto do catálogo à empresa_id do Operador logado
3. WHEN o Operador marcar um produto como inativo, THE Sistema_Adesivos SHALL ocultar o produto das listagens de venda sem removê-lo do banco de dados
4. THE Sistema_Adesivos SHALL exibir a lista paginada de produtos do catálogo (máximo 20 itens por página), ordenada por nome em ordem alfabética, com filtros por categoria, material e status (ativo/inativo)
5. WHEN o Operador editar um produto do catálogo, THE Sistema_Adesivos SHALL salvar as alterações e manter o histórico de pedidos anteriores inalterado
6. THE Sistema_Adesivos SHALL aceitar imagens de referência nos formatos PNG, JPG e WEBP com tamanho máximo de 5 MB por arquivo
7. IF o Operador submeter o formulário de cadastro ou edição com campos obrigatórios vazios ou valores fora dos limites permitidos, THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando cada campo inválido sem salvar o produto

### Requirement 2: Cadastro de Materiais

**User Story:** Como Operador, quero cadastrar os tipos de materiais de adesivo disponíveis, para que eu possa associá-los a orçamentos e produtos.

#### Acceptance Criteria

1. THE Sistema_Adesivos SHALL permitir o cadastro de materiais com os campos: nome (obrigatório, máximo 100 caracteres), descrição (opcional, máximo 500 caracteres), preço por metro quadrado (obrigatório, valor entre 0.01 e 99999.99 com até 2 casas decimais) e status (ativo/inativo, padrão ativo)
2. THE Sistema_Adesivos SHALL associar cada material à empresa_id do Operador logado e impedir duplicidade de nome de material dentro da mesma empresa
3. WHEN o Operador desativar um material, THE Sistema_Adesivos SHALL impedir a seleção desse material em novos orçamentos e produtos, porém manter registros históricos existentes inalterados
4. THE Sistema_Adesivos SHALL exibir a lista de materiais ativos e inativos da empresa do Operador logado, ordenada alfabeticamente por nome, com indicação visual do status de cada material
5. IF o Operador submeter o cadastro de material com nome vazio, nome duplicado na mesma empresa ou preço fora do intervalo permitido, THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando o campo inválido e não salvar o registro

### Requirement 3: Criação de Pedido Sob Encomenda

**User Story:** Como Operador, quero registrar pedidos sob encomenda com as especificações do cliente, para que eu possa gerar um orçamento personalizado.

#### Acceptance Criteria

1. WHEN o Operador criar um novo Pedido_Encomenda, THE Sistema_Adesivos SHALL registrar os campos obrigatórios: cliente (selecionado da base de clientes existente ou cadastrado na hora), descrição do serviço (máximo 500 caracteres), dimensões (largura x altura em cm, valores entre 0.1 e 9999.9), material desejado (somente materiais com status ativo), quantidade (inteiro entre 1 e 99999); e o campo opcional: observações (máximo 1000 caracteres)
2. WHEN o Operador anexar uma Arte_Cliente ao pedido, THE Sistema_Adesivos SHALL fazer upload do arquivo para o Supabase Storage e vincular a URL ao pedido, permitindo no máximo 5 arquivos por pedido
3. IF o Operador tentar anexar um arquivo de arte com formato diferente de PNG, JPG, PDF, SVG ou AI, ou com tamanho superior a 20 MB, THEN THE Sistema_Adesivos SHALL rejeitar o upload e exibir mensagem de erro indicando o motivo da rejeição (formato inválido ou tamanho excedido)
4. WHEN um Pedido_Encomenda for criado, THE Sistema_Adesivos SHALL atribuir o status inicial "novo" ao pedido e associar o pedido à empresa_id do Operador logado
5. THE Sistema_Adesivos SHALL calcular automaticamente a área total em metros quadrados ((largura cm × altura cm × quantidade) ÷ 10000) para uso no orçamento
6. IF o Operador tentar criar um Pedido_Encomenda sem preencher cliente, descrição, dimensões, material ou quantidade, THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando os campos obrigatórios não preenchidos

### Requirement 4: Geração e Envio de Orçamento

**User Story:** Como Operador, quero gerar um orçamento a partir do pedido sob encomenda, para que o cliente possa avaliar e aprovar o valor.

#### Acceptance Criteria

1. WHEN o Operador gerar um Orcamento para um Pedido_Encomenda, THE Sistema_Adesivos SHALL calcular o valor com base em: área total × preço por m² do material selecionado + valor de mão de obra informado pelo Operador, onde o valor de mão de obra deve ser maior ou igual a zero
2. THE Sistema_Adesivos SHALL permitir que o Operador adicione desconto percentual (de 0% a 100%) ou valor fixo ao orçamento antes de finalizar, desde que o valor final do orçamento permaneça maior que zero
3. WHEN o Operador finalizar o Orcamento, THE Sistema_Adesivos SHALL gerar um PDF com os dados do orçamento (cliente, descrição, material, dimensões, valores, prazo estimado e validade)
4. WHEN o Orcamento for finalizado, THE Sistema_Adesivos SHALL alterar o Status_Pedido para "orcamento_enviado"
5. THE Sistema_Adesivos SHALL registrar a data de criação e a data de validade (configurável pelo Operador, entre 1 e 90 dias a partir da data de criação) em cada Orcamento
6. IF o Operador tentar gerar um Orcamento sem material selecionado ou sem dimensões, THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando os campos obrigatórios
7. IF o Operador tentar gerar um Orcamento para um Pedido_Encomenda cujo Status_Pedido não seja "novo", THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando que orçamentos só podem ser gerados para pedidos com status "novo"
8. IF a geração do PDF falhar, THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando a falha na geração do documento e manter o Status_Pedido inalterado

### Requirement 5: Aprovação e Rejeição de Orçamento

**User Story:** Como Operador, quero registrar a aprovação ou rejeição do orçamento pelo cliente, para que pedidos aprovados entrem na fila de produção.

#### Acceptance Criteria

1. WHEN o Operador registrar a aprovação do Orcamento com Status_Pedido "orcamento_enviado", THE Sistema_Adesivos SHALL alterar o Status_Pedido para "aprovado" e inserir o pedido na Fila_Producao com data e hora de entrada
2. WHEN o Operador registrar a rejeição do Orcamento com Status_Pedido "orcamento_enviado", THE Sistema_Adesivos SHALL alterar o Status_Pedido para "cancelado" e registrar o motivo da rejeição informado pelo Operador (campo obrigatório, máximo de 500 caracteres)
3. WHEN o Operador registrar a aprovação, THE Sistema_Adesivos SHALL registrar a forma de pagamento selecionada (dinheiro, PIX, cartão, boleto ou parcelado) sendo a seleção obrigatória para concluir a aprovação
4. IF o Operador tentar aprovar um orçamento com validade expirada, THEN THE Sistema_Adesivos SHALL exibir aviso informando que o orçamento está vencido e solicitar confirmação para prosseguir, procedendo com a aprovação normalmente caso o Operador confirme
5. IF o Operador tentar aprovar ou rejeitar um pedido cujo Status_Pedido não é "orcamento_enviado", THEN THE Sistema_Adesivos SHALL exibir mensagem de erro informando que apenas pedidos com orçamento enviado podem ser aprovados ou rejeitados

### Requirement 6: Fila de Produção

**User Story:** Como Operador, quero visualizar e gerenciar a fila de produção, para que eu possa organizar a ordem de trabalho e acompanhar prazos.

#### Acceptance Criteria

1. THE Sistema_Adesivos SHALL exibir a Fila_Producao contendo apenas pedidos com Status_Pedido "aprovado" ou "em_producao", em formato de lista ordenada por data de entrada (mais antigos primeiro)
2. WHEN o Operador iniciar a produção de um pedido com Status_Pedido "aprovado", THE Sistema_Adesivos SHALL alterar o Status_Pedido para "em_producao" e registrar a data/hora de início
3. WHEN o Operador concluir a produção de um pedido com Status_Pedido "em_producao", THE Sistema_Adesivos SHALL alterar o Status_Pedido para "pronto", registrar a data/hora de conclusão e remover o pedido da Fila_Producao
4. THE Sistema_Adesivos SHALL exibir na Fila_Producao: nome do cliente, descrição do pedido (truncada em 80 caracteres), material, dimensões, data de entrada e prazo estimado
5. THE Sistema_Adesivos SHALL destacar visualmente com indicador de cor diferenciada pedidos cujo prazo estimado está a menos de 24 horas, e com um segundo nível de destaque distinto para pedidos cujo prazo já venceu
6. WHEN o Operador reordenar um pedido na fila, THE Sistema_Adesivos SHALL atualizar a posição e manter a nova ordem persistida
7. IF o Operador tentar iniciar a produção de um pedido cujo Status_Pedido não é "aprovado", THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando que apenas pedidos aprovados podem entrar em produção
8. IF o Operador tentar concluir a produção de um pedido cujo Status_Pedido não é "em_producao", THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando que apenas pedidos em produção podem ser concluídos

### Requirement 7: Registro de Entrega e Conclusão

**User Story:** Como Operador, quero registrar a entrega do pedido ao cliente, para que o ciclo do pedido seja concluído e os dados financeiros sejam atualizados.

#### Acceptance Criteria

1. WHEN o Operador registrar a entrega de um pedido com Status_Pedido "pronto", THE Sistema_Adesivos SHALL alterar o Status_Pedido para "entregue" e registrar a data/hora atual do sistema como data de entrega
2. WHEN um pedido for marcado como "entregue", THE Sistema_Adesivos SHALL registrar automaticamente uma venda na tabela vendas do sistema existente contendo: cliente do pedido, valor total do orçamento aprovado (com desconto aplicado), forma de pagamento registrada na aprovação e referência ao pedido de origem
3. IF o Operador tentar registrar entrega de um pedido que não está com Status_Pedido "pronto", THEN THE Sistema_Adesivos SHALL exibir mensagem de erro informando que apenas pedidos prontos podem ser entregues
4. IF o pedido já possuir uma venda vinculada na tabela vendas, THEN THE Sistema_Adesivos SHALL impedir o registro duplicado de entrega e exibir mensagem de erro indicando que a entrega já foi registrada

### Requirement 8: Venda Direta do Catálogo

**User Story:** Como Operador, quero registrar vendas de produtos prontos do catálogo, para que eu possa processar vendas de itens de pronta entrega de forma rápida.

#### Acceptance Criteria

1. WHEN o Operador iniciar uma venda de catálogo, THE Sistema_Adesivos SHALL permitir a seleção de um ou mais produtos do Catalogo_Adesivos (somente produtos com status ativo) e associar a um cliente (selecionado da base existente ou cadastrado na hora)
2. THE Sistema_Adesivos SHALL permitir ao Operador definir a quantidade (inteiro entre 1 e 9999) para cada produto selecionado e calcular automaticamente o valor total da venda com a fórmula: soma de (preço unitário × quantidade) para cada item
3. WHEN o Operador confirmar a venda de catálogo, THE Sistema_Adesivos SHALL registrar a venda na tabela vendas e criar os itens correspondentes em vendas_itens com produto_id, descrição, quantidade e preço_unitario
4. THE Sistema_Adesivos SHALL permitir que o Operador aplique desconto percentual (0% a 100%) ou valor fixo à venda de catálogo antes da confirmação, desde que o valor final permaneça maior que zero
5. WHEN o Operador confirmar a venda, THE Sistema_Adesivos SHALL registrar a forma de pagamento selecionada (dinheiro, PIX, cartão, boleto ou parcelado) sendo a seleção obrigatória para concluir a venda
6. IF o Operador selecionar um produto do catálogo marcado como inativo, THEN THE Sistema_Adesivos SHALL exibir mensagem informando que o produto não está disponível para venda e impedir sua adição ao carrinho
7. IF o Operador tentar confirmar a venda sem nenhum produto selecionado ou sem cliente associado, THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando os campos obrigatórios

### Requirement 9: Controle de Estoque de Materiais

**User Story:** Como Operador, quero controlar o estoque de materiais de adesivo, para que eu saiba quando preciso repor insumos.

#### Acceptance Criteria

1. THE Sistema_Adesivos SHALL registrar a quantidade em estoque (em metros quadrados, com precisão de duas casas decimais, variando de 0.00 a 99999.99 m²) para cada Material_Adesivo
2. WHEN um pedido for movido para "em_producao", THE Sistema_Adesivos SHALL subtrair a área total do pedido do estoque do material correspondente e registrar a movimentação de saída com referência ao pedido
3. IF o estoque do Material_Adesivo for insuficiente para cobrir a área total do pedido ao mover para "em_producao", THEN THE Sistema_Adesivos SHALL exibir aviso ao Operador informando a quantidade disponível e a quantidade necessária, e solicitar confirmação para prosseguir (permitindo estoque negativo)
4. WHEN o Operador registrar entrada de material no estoque, THE Sistema_Adesivos SHALL exigir os campos obrigatórios (material, quantidade em m² entre 0.01 e 9999.99, e custo da compra em R$), somar a quantidade ao estoque atual e registrar a data da entrada
5. IF o estoque de um Material_Adesivo ficar abaixo do estoque mínimo configurado no cadastro do material, THEN THE Sistema_Adesivos SHALL exibir indicador visual de alerta junto ao nome do material na tela de estoque e no dashboard
6. THE Sistema_Adesivos SHALL exibir o histórico de movimentações de estoque (entradas e saídas) em listagem paginada com data, tipo da movimentação (entrada ou saída), quantidade em m², saldo resultante e referência do pedido quando aplicável
7. WHEN o Operador confirmar uma venda de catálogo, THE Sistema_Adesivos SHALL subtrair a área correspondente aos produtos vendidos do estoque do material de cada produto e registrar a movimentação de saída com referência à venda

### Requirement 10: Dashboard e Indicadores

**User Story:** Como Operador, quero visualizar um painel com indicadores do negócio, para que eu possa acompanhar o desempenho da empresa de adesivos.

#### Acceptance Criteria

1. THE Sistema_Adesivos SHALL exibir no dashboard: total de pedidos em cada Status_Pedido, faturamento do mês atual (soma dos valores de pedidos entregues no mês corrente), quantidade de pedidos entregues no mês e valor médio por pedido entregue no mês atual
2. THE Sistema_Adesivos SHALL exibir no dashboard alertas de estoque baixo contendo o nome do Material_Adesivo, a quantidade atual em estoque e o estoque mínimo configurado, para cada material cujo estoque esteja abaixo do mínimo configurado
3. THE Sistema_Adesivos SHALL exibir no dashboard a lista dos próximos 5 pedidos da Fila_Producao ordenados por prazo estimado mais próximo (mais urgente primeiro)
4. WHEN o Operador acessar a página principal do módulo de adesivos, THE Sistema_Adesivos SHALL carregar os indicadores do dashboard com dados filtrados pela empresa_id do Operador logado em no máximo 5 segundos
5. IF ocorrer falha ao carregar os dados do dashboard, THEN THE Sistema_Adesivos SHALL exibir mensagem de erro indicando que não foi possível carregar os indicadores e oferecer opção para tentar novamente

### Requirement 11: Cancelamento de Pedido

**User Story:** Como Operador, quero cancelar pedidos em qualquer etapa antes da entrega, para que eu possa lidar com desistências e problemas.

#### Acceptance Criteria

1. WHEN o Operador cancelar um pedido com Status_Pedido diferente de "entregue" e diferente de "cancelado", THE Sistema_Adesivos SHALL exigir o preenchimento do campo motivo (mínimo 5 caracteres, máximo 500 caracteres), alterar o Status_Pedido para "cancelado" e registrar o motivo e a data/hora do cancelamento
2. IF o pedido cancelado estava com Status_Pedido "em_producao" ou "pronto", THEN THE Sistema_Adesivos SHALL estornar a área total previamente subtraída do estoque do Material_Adesivo correspondente
3. IF o Operador tentar cancelar um pedido com Status_Pedido "entregue" ou "cancelado", THEN THE Sistema_Adesivos SHALL exibir mensagem de erro informando que o pedido não pode ser cancelado no status atual
4. WHEN um pedido com Status_Pedido "aprovado" ou "em_producao" for cancelado, THE Sistema_Adesivos SHALL remover o pedido da Fila_Producao

### Requirement 12: Histórico de Pedidos e Busca

**User Story:** Como Operador, quero consultar o histórico completo de pedidos, para que eu possa localizar informações de pedidos antigos.

#### Acceptance Criteria

1. THE Sistema_Adesivos SHALL exibir listagem paginada de todos os pedidos (encomenda e catálogo) com 20 itens por página, ordenados por data de criação decrescente, com filtros por status, período (data início e data fim), cliente e tipo de pedido
2. WHEN o Operador inserir pelo menos 3 caracteres no campo de busca, THE Sistema_Adesivos SHALL pesquisar nos campos: nome do cliente, descrição do pedido e número do pedido, e exibir os resultados correspondentes na listagem
3. WHEN o Operador clicar em um item da listagem, THE Sistema_Adesivos SHALL exibir os detalhes do pedido incluindo: cliente, descrição, material, dimensões, valores, status atual, tipo de pedido (encomenda ou catálogo) e histórico de mudanças de status com datas
4. IF a busca ou os filtros aplicados não retornarem resultados, THEN THE Sistema_Adesivos SHALL exibir mensagem informando que nenhum pedido foi encontrado com os critérios selecionados
