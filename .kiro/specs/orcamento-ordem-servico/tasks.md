# Implementation Plan: Orçamento → Ordem de Serviço

## Overview

Reformulação do fluxo de orçamentos no módulo de Adesivos: o Orçamento torna-se a entidade primária com múltiplos itens, e ao ser aprovado gera automaticamente uma Ordem de Serviço (OS). A implementação segue a abordagem incremental: schema de banco → composables → componentes Vue → páginas → integração final.

## Tasks

- [x] 1. Migração de banco de dados e infraestrutura
  - [x] 1.1 Criar migração SQL para alteração da tabela `orcamentos_adesivo` e criação da tabela `itens_orcamento`
    - Tornar `pedido_id` nullable
    - Adicionar campos: `cliente_id`, `numero_orcamento`, `status`, `valor_mao_obra_global`, `quantidade_total_itens`, `motivo_rejeicao`, `data_aprovacao`
    - Adicionar constraint UNIQUE (empresa_id, numero_orcamento)
    - Criar tabela `itens_orcamento` com todos os campos definidos no design (id, orcamento_id, material_id, descricao, largura_cm, altura_cm, quantidade, modalidade_preco, preco_unitario, area_m2, valor_item, created_at)
    - Adicionar CHECK constraints para ranges (largura_cm 0.1-9999.9, altura_cm 0.1-9999.9, quantidade 1-99999, modalidade_preco IN ('m2', 'unidade'))
    - _Requirements: 4.1, 4.2_

  - [x] 1.2 Criar migração SQL para tabelas `ordens_servico_adesivo` e `itens_ordem_servico`
    - Criar tabela `ordens_servico_adesivo` com todos os campos do design
    - Criar tabela `itens_ordem_servico` com ON DELETE CASCADE
    - Adicionar constraint UNIQUE (empresa_id, numero_os)
    - Adicionar CHECK constraints para status válidos
    - _Requirements: 4.3, 4.4, 4.6_

  - [x] 1.3 Criar migração SQL para RLS policies em todas as novas tabelas
    - Habilitar RLS em `itens_orcamento`, `ordens_servico_adesivo`, `itens_ordem_servico`
    - Criar policy tenant para authenticated (via empresa_id do profiles)
    - Criar policy anon para `itens_orcamento` (SELECT via token_aprovacao)
    - Criar policy anon para `orcamentos_adesivo` (SELECT via token_aprovacao) para página pública
    - _Requirements: 4.5, 8.3_

  - [x] 1.4 Criar migração SQL com a database function `gerar_ordem_servico`
    - Implementar RPC conforme design: validação, criação OS, cópia de itens, atualização status, cálculo posicao_fila
    - Usar SECURITY DEFINER para bypass RLS interno
    - Incluir RAISE EXCEPTION para cenários de erro (orçamento não encontrado, status inválido, OS já existente)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8_

- [x] 2. Checkpoint - Validar migrações
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Extensão do composable `useOrcamentos.ts` para multi-itens
  - [x] 3.1 Implementar interfaces e funções de cálculo multi-item no composable existente
    - Adicionar interface `ItemOrcamento` com todos os campos
    - Implementar `calcularAreaItem(largura_cm, altura_cm, quantidade)` → area em m²
    - Implementar `calcularValorItem(item: ItemOrcamento)` → valor baseado na modalidade (m2 ou unidade)
    - Implementar `calcularTotalItens(itens: ItemOrcamento[])` → soma dos valores
    - Implementar `calcularQuantidadeTotal(itens: ItemOrcamento[])` → soma das quantidades
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 3.2 Implementar funções de validação e numeração do orçamento
    - Implementar `validarOrcamento(dados)` → valida mínimo 1 item, campos obrigatórios, valor > 0
    - Implementar `gerarNumeroOrcamento(ultimoNumero)` → formato "ORC-{N}"
    - Implementar `classificarStatusOrcamentoV2(status, dataValidade, now?)` para novos status (rascunho, enviado, aprovado, rejeitado, vencido)
    - _Requirements: 1.6, 1.8, 2.5_

  - [x] 3.3 Implementar composição de mensagem WhatsApp para multi-itens
    - Implementar `comporMensagemWhatsAppMultiItens(dados)` com resumo de múltiplos itens
    - Garantir limite de 1000 caracteres com truncamento inteligente
    - Incluir: saudação, quantidade de itens, descrição resumida, valor total, validade, link
    - _Requirements: 6.1, 6.2_

  - [ ]* 3.4 Write property tests para cálculos do composable (useOrcamentos.pbt.spec.ts)
    - **Property 1: Cálculo de valor do item por m²**
    - **Property 2: Cálculo de valor do item por unidade**
    - **Property 3: Valor total do orçamento é soma dos itens + mão de obra - descontos**
    - **Validates: Requirements 1.3, 1.4, 1.5**

  - [ ]* 3.5 Write property tests para validações e lógica de negócio
    - **Property 4: Seleção de desconto por volume escolhe a maior faixa atendida**
    - **Property 5: Validação de orçamento rejeita itens inválidos**
    - **Property 6: Mensagem WhatsApp respeita limite de 1000 caracteres**
    - **Property 7: Link de aprovação contém token válido**
    - **Validates: Requirements 7.3, 7.4, 1.6, 6.1, 6.2, 5.2**

  - [ ]* 3.6 Write property tests para regras de desconto e numeração
    - **Property 8: Detecção de sobreposição de faixas de desconto**
    - **Property 9: Validação de regra de desconto**
    - **Property 11: Número de orçamento é sequencial e único por empresa**
    - **Validates: Requirements 7.8, 7.1, 1.8**

- [x] 4. Criação do composable `useOrdensServico.ts`
  - [x] 4.1 Implementar composable useOrdensServico com interfaces e lógica de transição
    - Criar arquivo `app/composables/useOrdensServico.ts`
    - Definir interfaces: `OrdemServico`, `ItemOS`, types `StatusOS`, `FormaPagamento`
    - Implementar `validarTransicaoOS(atual, novo)` com transições válidas (aguardando→em_producao, em_producao→pronto, pronto→entregue, qualquer→cancelado)
    - Implementar `gerarNumeroOS(ultimoNumero)` → formato "OS-{N}"
    - Implementar funções CRUD: `buscarOSPorOrcamento`, `atualizarStatusOS`, `cancelarOS`, `atualizarFormaPagamento`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 4.2 Write property tests para useOrdensServico (useOrdensServico.pbt.spec.ts)
    - **Property 10: Transições de status da OS são válidas**
    - **Validates: Requirements 9.3, 9.4**

  - [ ]* 4.3 Write unit tests para useOrdensServico (useOrdensServico.spec.ts)
    - Testar cenários específicos: cancelamento com motivo, atualização de forma de pagamento, geração de número OS
    - _Requirements: 9.3, 9.4, 9.5_

- [x] 5. Checkpoint - Validar composables e testes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Componentes Vue para formulário de orçamento multi-itens
  - [x] 6.1 Criar componente `OrcamentoItemRow.vue`
    - Linha individual para cada item no formulário: seleção de material (dropdown da tabela materiais_adesivo), campos de largura, altura, quantidade, modalidade de preço (m2/unidade), preço unitário condicional, valor calculado em tempo real
    - Botão para remover item da lista
    - Validação inline de campos obrigatórios e ranges
    - _Requirements: 1.2, 1.3, 1.4, 1.7_

  - [x] 6.2 Criar componente `OrcamentoResumoValores.vue`
    - Card de resumo exibindo: subtotal dos itens, desconto por volume (percentual e valor), desconto manual, valor de mão de obra, valor total final
    - Atualização em tempo real conforme itens são adicionados/removidos
    - _Requirements: 1.5, 7.5_

  - [x] 6.3 Criar componente `OrcamentoNovoModal.vue`
    - Modal/formulário completo para criação de orçamento
    - Seleção de cliente (dropdown com busca), data de validade, prazo estimado, valor de mão de obra global
    - Lista dinâmica de `OrcamentoItemRow` com botão "Adicionar item"
    - Integração com `OrcamentoResumoValores`
    - Campo de desconto manual (percentual ou valor fixo)
    - Botões: Salvar como rascunho, Cancelar
    - Validação completa via `validarOrcamento()` antes do submit
    - Persistência no Supabase com geração de `numero_orcamento`
    - _Requirements: 1.1, 1.2, 1.5, 1.6, 1.7, 1.8, 7.3, 7.5, 7.6_

- [x] 7. Componentes Vue para Ordem de Serviço
  - [x] 7.1 Criar componente `OSIndicadorBadge.vue`
    - Badge compacto para exibição na listagem de orçamentos
    - Mostra número da OS (OS-N) e status com cor diferenciada por status
    - Clicável para abrir detalhes da OS
    - _Requirements: 9.1_

  - [x] 7.2 Criar componente `OSDetalhesModal.vue`
    - Modal com detalhes completos da OS: número, status, lista de itens (descrição, material, dimensões, quantidade, valor), data de aprovação, forma de pagamento, prazo estimado, posição na fila
    - Seção para definir forma de pagamento quando "pendente"
    - Integração com `OSStatusTransition`
    - _Requirements: 9.2, 9.5_

  - [x] 7.3 Criar componente `OSStatusTransition.vue`
    - Botões de transição de status respeitando fluxo válido (aguardando→em_producao→pronto→entregue)
    - Botão de cancelar com modal de motivo obrigatório
    - Usa `validarTransicaoOS()` para habilitar/desabilitar botões
    - Registra data/hora de cada transição
    - _Requirements: 9.3, 9.4_

- [x] 8. Página principal de orçamentos (refatoração)
  - [x] 8.1 Refatorar página `adesivos-orcamentos.vue` para novo fluxo
    - Botão "Novo Orçamento" em destaque no topo (abre OrcamentoNovoModal)
    - Cartões de resumo (KPIs): pendentes, vencidos, valor aprovados mês, taxa de conversão
    - Listagem paginada (20 itens/página) com colunas: número ORC-N, cliente, qtd itens, valor total, data criação, validade, status (badge colorido), indicador de OS vinculada
    - Filtros: período (data início/fim), status, nome do cliente
    - Indicação visual "legado" para orçamentos com pedido_id
    - Ordenação por data de criação decrescente
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 10.1, 10.2, 10.5_

  - [x] 8.2 Implementar modal de detalhes do orçamento na listagem
    - Ao clicar em orçamento: exibir modal com dados completos do cliente, lista de itens detalhada, mão de obra, descontos, valor total, prazo, validade
    - Botões de ação: Gerar link de aprovação, Enviar WhatsApp, Aprovar internamente
    - Integração com `OSIndicadorBadge` quando OS existir
    - _Requirements: 2.6, 9.1_

  - [x] 8.3 Implementar lógica de aprovação interna e geração de link
    - Aprovação interna: solicitar forma de pagamento → chamar RPC `gerar_ordem_servico`
    - Geração de token de aprovação (UUID v4) → compor link → botão copiar para clipboard
    - Envio WhatsApp: compor mensagem multi-itens → abrir wa.me em nova aba
    - Alterar status para "enviado" na primeira geração de link/WhatsApp
    - Tratar caso de cliente sem telefone (campo manual)
    - _Requirements: 3.5, 3.6, 5.1, 5.2, 5.8, 6.1, 6.3, 6.4, 6.5_

  - [ ]* 8.4 Write property tests para KPIs e filtragem
    - **Property 12: Cálculo de KPIs é consistente com os dados**
    - **Property 13: Filtragem de orçamentos combina todos os critérios**
    - **Validates: Requirements 2.7, 2.4**

- [x] 9. Checkpoint - Validar página principal e componentes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Página pública de aprovação
  - [x] 10.1 Criar página `app/pages/orcamento-aprovacao/[token].vue`
    - Layout minimalista sem autenticação (middleware público)
    - Buscar orçamento via token_aprovacao (Supabase anon client)
    - Exibir: logo da empresa, número ORC-N, data emissão, validade, lista completa de itens (descrição, material, dimensões, quantidade, valor), subtotal, descontos, mão de obra, valor total, prazo estimado
    - Botões "Aprovar" e "Rejeitar" (visíveis apenas se status é "enviado" e não vencido)
    - Layout responsivo (320px a 768px)
    - _Requirements: 8.1, 8.2, 8.4, 5.3_

  - [x] 10.2 Implementar fluxo de aprovação/rejeição na página pública
    - Aprovar: chamar RPC `gerar_ordem_servico` com origem "link_externo" e forma_pagamento null → exibir mensagem de confirmação
    - Rejeitar: exibir campo de motivo opcional (max 500 chars) → atualizar status para "rejeitado" com motivo e origem
    - Tratar estados inválidos: token inexistente (página erro), orçamento já aprovado/rejeitado/vencido (página informativa sem ações)
    - Impedir dupla aprovação (req 3.8)
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 8.5, 3.7_

- [x] 11. Integração e wiring final
  - [x] 11.1 Integrar navegação e coexistência com sistema existente
    - Verificar que item "Orçamentos" no menu lateral aponta para `/adesivos-orcamentos` corretamente
    - Garantir que a rota `/orcamento-aprovacao/[token]` não exige auth middleware
    - Reutilizar tabela `regras_desconto_volume` existente sem alterações
    - Garantir que OS gerada reflete na seção relevante sem duplicar na página de pedidos antiga
    - _Requirements: 10.1, 10.3, 10.4, 10.5_

  - [ ]* 11.2 Write unit tests de integração para o fluxo completo
    - Testar fluxo: criar orçamento → gerar link → verificar status "enviado"
    - Testar aprovação interna com forma de pagamento
    - Testar rejeição com motivo
    - Testar orçamento legado aparece na listagem com indicador
    - _Requirements: 3.1, 3.5, 5.4, 5.5, 10.5_

- [x] 12. Final checkpoint - Validação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The existing `useOrcamentos.ts` composable is extended (not replaced) to maintain backward compatibility
- Database migrations should be run in order (1.1 → 1.2 → 1.3 → 1.4)
- The RPC `gerar_ordem_servico` handles atomicity for the approval flow
- Existing `regras_desconto_volume` table is reused without schema changes

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4"] },
    { "id": 2, "tasks": ["3.1", "4.1"] },
    { "id": 3, "tasks": ["3.2", "3.3"] },
    { "id": 4, "tasks": ["3.4", "3.5", "3.6", "4.2", "4.3"] },
    { "id": 5, "tasks": ["6.1", "6.2", "7.1"] },
    { "id": 6, "tasks": ["6.3", "7.2", "7.3"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["8.2", "8.3"] },
    { "id": 9, "tasks": ["8.4", "10.1"] },
    { "id": 10, "tasks": ["10.2"] },
    { "id": 11, "tasks": ["11.1", "11.2"] }
  ]
}
```
