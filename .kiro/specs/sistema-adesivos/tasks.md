# Implementation Plan: Sistema de Adesivos

## Overview

Implementação do módulo completo de gestão de adesivos para o sistema multi-tenant existente (Nuxt 4 + Supabase). O plano segue uma abordagem incremental: banco de dados → composable → páginas por domínio → integração. Cada tarefa produz código funcional que se conecta às etapas anteriores.

## Tasks

- [x] 1. Configurar banco de dados e infraestrutura
  - [x] 1.1 Criar migration SQL com todas as novas tabelas
    - Criar arquivo `supabase/migrations/XXXXXX_sistema_adesivos.sql` contendo:
    - Tabela `materiais_adesivo` com CHECK constraints e UNIQUE(empresa_id, nome)
    - Tabela `catalogo_adesivos` com FK para materiais_adesivo
    - Tabela `pedidos_adesivo` com status CHECK, campo gerado `area_total_m2`
    - Tabela `pedidos_adesivo_itens` com valor_total gerado
    - Tabela `orcamentos_adesivo` com validação de valor_total > 0
    - Tabela `pedidos_adesivo_artes`
    - Tabela `estoque_movimentacoes`
    - Tabela `pedidos_adesivo_historico`
    - ALTER TABLE vendas para adicionar `forma_pagamento`
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 9.1_

  - [x] 1.2 Criar RLS policies para todas as novas tabelas
    - Aplicar ENABLE ROW LEVEL SECURITY em cada tabela
    - Criar policies de tenant isolation (empresa_id via profiles.id = auth.uid())
    - Seguir padrão existente do sistema multi-tenant
    - _Requirements: 1.2, 2.2, 3.4_

  - [x] 1.3 Configurar Supabase Storage bucket `artes-cliente`
    - Criar bucket com path pattern `{empresa_id}/{pedido_id}/{filename}`
    - Configurar max file size 20MB
    - Configurar allowed MIME types: image/png, image/jpeg, application/pdf, image/svg+xml, application/postscript
    - Criar storage policies para isolamento por empresa
    - _Requirements: 3.2, 3.3_

- [x] 2. Implementar composable e lógica de domínio
  - [x] 2.1 Criar composable `useAdesivos`
    - Criar `app/composables/useAdesivos.ts`
    - Implementar `calcularArea(larguraCm, alturaCm, quantidade): number`
    - Implementar `calcularOrcamento(area, precoM2, maoObra, descontoPercentual, descontoValor): number`
    - Implementar `calcularTotalCarrinho(itens): number`
    - Implementar maps `statusLabels`, `statusColors`, `transicoesValidas`
    - Implementar `podeTransitar(statusAtual, statusNovo): boolean`
    - Implementar helpers de classificação de urgência (overdue, urgent, normal)
    - Implementar helpers de validação de formulário (materiais, produtos, pedidos)
    - _Requirements: 3.5, 4.1, 4.2, 6.5, 8.2_

  - [ ]* 2.2 Write property test: State Machine Transition Validity
    - **Property 1: State Machine Transition Validity**
    - Usar fast-check para gerar status aleatórios e verificar que apenas transições válidas são aceitas
    - Arquivo: `tests/property/stateMachine.property.ts`
    - **Validates: Requirements 4.7, 5.1, 5.2, 5.5, 6.2, 6.3, 6.7, 6.8, 7.1, 7.3, 11.3**

  - [ ]* 2.3 Write property test: Area Calculation Correctness
    - **Property 2: Area Calculation Correctness**
    - Gerar dimensões e quantidades aleatórias dentro dos limites e verificar fórmula (l×a×q)/10000
    - Arquivo: `tests/property/areaCalculo.property.ts`
    - **Validates: Requirements 3.5**

  - [ ]* 2.4 Write property test: Quote Value Calculation
    - **Property 3: Quote Value Calculation**
    - Gerar inputs válidos e verificar que total = (area × preco_m2 + mao_obra) - desconto, sempre > 0
    - Arquivo: `tests/property/orcamento.property.ts`
    - **Validates: Requirements 4.1, 4.2**

  - [ ]* 2.5 Write property test: Cart Total Calculation
    - **Property 4: Cart Total Calculation**
    - Gerar itens de carrinho com preços e quantidades variados; verificar soma e desconto
    - Arquivo: `tests/property/carrinho.property.ts`
    - **Validates: Requirements 8.2, 8.4**

  - [ ]* 2.6 Write property test: Urgency Classification
    - **Property 11: Urgency Classification**
    - Gerar prazos relativos ao now e verificar classificação mutualmente exclusiva
    - Arquivo: `tests/property/urgencia.property.ts`
    - **Validates: Requirements 6.5**

  - [ ]* 2.7 Write property test: Input Validation Completeness
    - **Property 14: Input Validation Completeness**
    - Gerar combinações de campos inválidos e verificar que todos são reportados
    - Arquivo: `tests/property/validacao.property.ts`
    - **Validates: Requirements 1.1, 1.6, 1.7, 2.1, 2.5, 3.1, 3.3, 3.6**

- [x] 3. Checkpoint - Verificar infraestrutura e lógica de domínio
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implementar página de Materiais (CRUD)
  - [x] 4.1 Criar página `app/pages/adesivos-materiais.vue`
    - Listagem de materiais com ordenação alfabética e indicação visual de status ativo/inativo
    - Modal de criação/edição com campos: nome, descrição, preço/m², estoque mínimo, status
    - Validação frontend: nome obrigatório (max 100), preço entre 0.01–99999.99, duplicidade de nome
    - Toggle de ativação/desativação com confirmação
    - Integração direta com Supabase filtrado por empresa_id (via useEmpresa)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 4.2 Write property test: Material Name Uniqueness Per Tenant
    - **Property 12: Material Name Uniqueness Per Tenant**
    - Gerar nomes de materiais e empresa_ids; verificar unicidade intra-empresa
    - Arquivo: `tests/property/unicidade.property.ts`
    - **Validates: Requirements 2.2**

  - [ ]* 4.3 Write property test: Active-Only Filtering (materials)
    - **Property 6: Active-Only Filtering**
    - Gerar listas de materiais ativos/inativos e verificar filtragem correta
    - Arquivo: `tests/property/filtragem.property.ts`
    - **Validates: Requirements 2.3, 8.1, 8.6**

- [x] 5. Implementar página de Catálogo de Produtos
  - [x] 5.1 Criar página `app/pages/adesivos-catalogo.vue`
    - Listagem paginada (20 itens/página) ordenada alfabeticamente
    - Filtros por categoria, material e status (ativo/inativo)
    - Modal de criação/edição com campos: nome, categoria, material (select ativos), dimensões, preço, descrição, imagem
    - Upload de imagem (PNG, JPG, WEBP, max 5MB) para Supabase Storage
    - Toggle ativo/inativo (soft delete)
    - Validação de todos os campos obrigatórios com mensagens inline
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ]* 5.2 Write property test: Pagination Invariants
    - **Property 8: Pagination Invariants**
    - Gerar datasets de tamanho variável e verificar pages com max 20 itens, ordenação correta
    - Arquivo: `tests/property/paginacao.property.ts`
    - **Validates: Requirements 1.4, 12.1**

- [x] 6. Implementar página de Pedidos (fluxo sob encomenda)
  - [x] 6.1 Criar página `app/pages/adesivos-pedidos.vue` com CRUD de pedidos
    - Listagem paginada (20/página) com filtros por status, período, cliente, tipo
    - Modal de criação de pedido encomenda: select cliente, descrição, dimensões, material, quantidade, observações
    - Upload de artes (max 5 arquivos, 20MB, formatos permitidos) via Supabase Storage
    - Cálculo automático de área exibido no formulário
    - Validação de campos obrigatórios com mensagens inline
    - Detalhe do pedido com histórico de mudanças de status
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 12.1, 12.3_

  - [x] 6.2 Implementar fluxo de geração de orçamento
    - Modal de geração com campos: mão de obra, desconto (% ou fixo), validade (1–90 dias)
    - Cálculo em tempo real: (área × preço_m2 + mão_obra) - desconto
    - Validação: só permite gerar para pedidos com status "novo"
    - Geração de PDF com dados do orçamento (usar jsPDF ou pdfmake)
    - Alterar status para "orcamento_enviado" após geração com sucesso
    - Tratamento de erro na geração do PDF (status não muda)
    - Registrar orçamento na tabela `orcamentos_adesivo`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [x] 6.3 Implementar aprovação e rejeição de orçamento
    - Botão aprovar: exige seleção de forma de pagamento (dinheiro, PIX, cartão, boleto, parcelado)
    - Ao aprovar: status → "aprovado", inserir na fila de produção com data/hora
    - Verificação de validade do orçamento com aviso e confirmação se vencido
    - Botão rejeitar: exige motivo (obrigatório, max 500 chars)
    - Ao rejeitar: status → "cancelado", registrar motivo
    - Validação: só permite ação em pedidos com status "orcamento_enviado"
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.4 Implementar componente Fila de Produção
    - Exibir pedidos com status "aprovado" ou "em_producao" ordenados por data de entrada
    - Mostrar: cliente, descrição (truncada 80 chars), material, dimensões, data entrada, prazo
    - Destaque visual: amarelo para prazo < 24h, vermelho para prazo vencido
    - Drag-and-drop para reordenação (persistir nova ordem)
    - Botão "Iniciar Produção": status "aprovado" → "em_producao", registrar data/hora início
    - Botão "Concluir": status "em_producao" → "pronto", registrar data/hora conclusão, remover da fila
    - Validação de transições de status com mensagens de erro
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

  - [x] 6.5 Implementar registro de entrega
    - Botão "Registrar Entrega" para pedidos com status "pronto"
    - Alterar status para "entregue", registrar data/hora
    - Criar registro na tabela `vendas` com: cliente, valor total (com desconto), forma de pagamento, referência ao pedido
    - Impedir entrega duplicada (verificar venda_id existente)
    - Validação: só permite para status "pronto"
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 6.6 Implementar cancelamento de pedido
    - Modal de cancelamento com campo motivo (obrigatório, 5–500 caracteres)
    - Permitir cancelar em qualquer status exceto "entregue" e "cancelado"
    - Se pedido estava "em_producao" ou "pronto": estornar área no estoque do material
    - Remover da fila de produção se status era "aprovado" ou "em_producao"
    - Registrar motivo e data/hora no pedido
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ]* 6.7 Write property test: Production Queue Membership
    - **Property 7: Production Queue Membership**
    - Gerar pedidos com status variados e verificar que fila contém apenas aprovado/em_producao
    - Arquivo: `tests/property/filaProducao.property.ts`
    - **Validates: Requirements 6.1, 11.4**

  - [ ]* 6.8 Write property test: Stock Balance Invariant
    - **Property 5: Stock Balance Invariant**
    - Simular sequência de operações (produção, entradas, cancelamentos) e verificar saldo
    - Arquivo: `tests/property/estoque.property.ts`
    - **Validates: Requirements 9.2, 9.4, 9.7, 11.2**

  - [ ]* 6.9 Write property test: Quote Expiry Detection
    - **Property 10: Quote Expiry Detection**
    - Gerar datas de validade e verificar classificação expirado/válido corretamente
    - Arquivo: `tests/property/expiracao.property.ts`
    - **Validates: Requirements 4.5, 5.4**

  - [ ]* 6.10 Write property test: Delivery Idempotence
    - **Property 13: Delivery Idempotence**
    - Verificar que pedidos com venda_id preenchido rejeitam nova entrega
    - Arquivo: `tests/property/idempotencia.property.ts`
    - **Validates: Requirements 7.4**

- [x] 7. Checkpoint - Verificar fluxo completo de pedidos
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implementar Venda Direta do Catálogo
  - [x] 8.1 Criar fluxo de venda de catálogo na página de pedidos
    - Modal POS: select cliente, busca/adição de produtos ativos do catálogo
    - Definir quantidade por produto (1–9999), calcular subtotais e total
    - Aplicar desconto (% ou fixo) com valor final > 0
    - Select forma de pagamento obrigatório
    - Ao confirmar: criar registro em `vendas` + `vendas_itens` com produto_id, descrição, quantidade, preço_unitario
    - Subtrair estoque do material de cada produto vendido (registrar movimentação)
    - Validação: não permitir produtos inativos, exigir ao menos 1 produto e cliente
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 9.7_

- [x] 9. Implementar página de Estoque
  - [x] 9.1 Criar página `app/pages/adesivos-estoque.vue`
    - Exibir saldo atual de cada material (m²) com indicador visual de alerta quando abaixo do mínimo
    - Modal de entrada de estoque: select material, quantidade (0.01–9999.99 m²), custo da compra (R$)
    - Ao confirmar entrada: somar ao estoque_atual, registrar movimentação com tipo "entrada"
    - Histórico de movimentações paginado: data, tipo (entrada/saída), quantidade, saldo resultante, referência
    - _Requirements: 9.1, 9.4, 9.5, 9.6_

  - [ ]* 9.2 Write property test: Low Stock Alert Correctness
    - **Property 16: Low Stock Alert Correctness**
    - Gerar materiais com estoques e mínimos variados; verificar que alertas aparecem corretamente
    - Arquivo: `tests/property/alertaEstoque.property.ts`
    - **Validates: Requirements 9.5, 10.2**

- [x] 10. Implementar página Dashboard
  - [x] 10.1 Criar página `app/pages/adesivos-dashboard.vue`
    - KPIs: total pedidos por status, faturamento do mês, qtd entregues no mês, valor médio
    - Alertas de estoque baixo: nome do material, quantidade atual, estoque mínimo
    - Próximos 5 pedidos da fila ordenados por prazo (mais urgente primeiro)
    - Filtro automático por empresa_id do operador logado
    - Loading states com skeleton placeholders
    - Tratamento de erro com mensagem e botão "tentar novamente"
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 10.2 Write property test: Dashboard KPI Aggregation
    - **Property 15: Dashboard KPI Aggregation**
    - Gerar conjuntos de pedidos e verificar cálculo correto dos KPIs
    - Arquivo: `tests/property/dashboard.property.ts`
    - **Validates: Requirements 10.1**

- [x] 11. Implementar Histórico e Busca de Pedidos
  - [x] 11.1 Implementar busca e filtros avançados na página de pedidos
    - Campo de busca: pesquisar com min 3 caracteres em nome do cliente, descrição, número do pedido
    - Filtros combinados: status, período (data início/fim), cliente, tipo (encomenda/catálogo)
    - Exibir mensagem "nenhum pedido encontrado" quando filtros não retornam resultados
    - Detalhe completo do pedido com histórico de mudanças de status (datas)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [ ]* 11.2 Write property test: Search Result Correctness
    - **Property 9: Search Result Correctness**
    - Gerar queries e datasets; verificar que todo resultado contém o termo em campos esperados
    - Arquivo: `tests/property/busca.property.ts`
    - **Validates: Requirements 12.2**

- [x] 12. Integração com navegação do sistema
  - [x] 12.1 Adicionar links no AppSidebar
    - Adicionar seção "Adesivos" no componente AppSidebar existente
    - Links: Dashboard, Pedidos, Catálogo, Materiais, Estoque
    - Rotas: `/adesivos-dashboard`, `/adesivos-pedidos`, `/adesivos-catalogo`, `/adesivos-materiais`, `/adesivos-estoque`
    - _Requirements: 10.4_

- [x] 13. Final checkpoint - Verificar sistema completo
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- O projeto usa TypeScript com Nuxt 4, Supabase, Vitest e fast-check para PBT
- As páginas seguem o padrão existente: single-page Vue com script setup, queries diretas ao Supabase
- Todos os dados são filtrados por `empresa_id` via RLS e composable `useEmpresa`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.4", "2.5", "2.6", "2.7"] },
    { "id": 4, "tasks": ["4.1", "5.1"] },
    { "id": 5, "tasks": ["4.2", "4.3", "5.2"] },
    { "id": 6, "tasks": ["6.1"] },
    { "id": 7, "tasks": ["6.2", "6.4"] },
    { "id": 8, "tasks": ["6.3", "6.5", "6.6"] },
    { "id": 9, "tasks": ["6.7", "6.8", "6.9", "6.10", "8.1"] },
    { "id": 10, "tasks": ["9.1"] },
    { "id": 11, "tasks": ["9.2", "10.1"] },
    { "id": 12, "tasks": ["10.2", "11.1"] },
    { "id": 13, "tasks": ["11.2", "12.1"] }
  ]
}
```
