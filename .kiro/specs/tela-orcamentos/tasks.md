# Implementation Plan: Tela de Orçamentos

## Overview

Implementação da página dedicada de gerenciamento de orçamentos (`/adesivos-orcamentos`) para o módulo de adesivos. Inclui: migração de banco, composable de lógica pura, página de listagem com filtros/KPIs, página pública de aprovação, integração WhatsApp e integração com menu lateral. A implementação usa TypeScript, Vue 3 (script setup), Supabase e TailwindCSS.

## Tasks

- [x] 1. Migração de banco de dados e infraestrutura
  - [x] 1.1 Criar migração SQL para extensão da tabela `orcamentos_adesivo` e criação da tabela `regras_desconto_volume`
    - Criar arquivo de migração em `supabase/migrations/` com ALTER TABLE para adicionar campos: `modalidade_preco`, `preco_unitario`, `desconto_volume_percentual`, `token_aprovacao`, `origem_aprovacao`
    - Adicionar CHECK constraints e UNIQUE constraint em `token_aprovacao`
    - Adicionar constraint condicional `chk_preco_unitario_modalidade`
    - Criar tabela `regras_desconto_volume` com campos: id, empresa_id, quantidade_minima, desconto_percentual, ativo, created_at
    - Adicionar UNIQUE(empresa_id, quantidade_minima)
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 1.2 Criar migração SQL para políticas de Row Level Security
    - Habilitar RLS na tabela `regras_desconto_volume`
    - Criar políticas SELECT/INSERT/UPDATE/DELETE filtrando por `empresa_id` do perfil autenticado
    - Criar política de acesso anônimo para `orcamentos_adesivo` (SELECT e UPDATE via token)
    - Criar política de acesso anônimo para `pedidos_adesivo` e `pedidos_adesivo_artes` vinculados a orçamentos com token
    - _Requirements: 6.5, 1.3, 4.3_

- [x] 2. Composable `useOrcamentos()` — lógica pura
  - [x] 2.1 Implementar composable `useOrcamentos` com funções de cálculo e validação
    - Criar `app/composables/useOrcamentos.ts`
    - Implementar `calcularValorMaterial(modalidade, opts)` — cálculo por m² e por unidade
    - Implementar `selecionarDescontoVolume(regras, quantidade)` — seleção da maior faixa atendida
    - Implementar `calcularValorFinal(...)` — cálculo com invariante > 0 (mínimo 0.01)
    - Implementar `classificarStatusOrcamento(statusPedido, dataValidade, now)` — classificação mutualmente exclusiva
    - Implementar `truncarDescricao(texto, max)` — truncamento com "..."
    - _Requirements: 2.2, 2.3, 3.3, 3.4, 3.6, 1.5, 1.2_

  - [x] 2.2 Implementar funções de composição de links e mensagens WhatsApp
    - Implementar `comporMensagemWhatsApp(dados)` — mensagem formatada com limite 1000 chars
    - Implementar `comporLinkWhatsApp(telefone, mensagem)` — URL com prefixo 55 e encodeURIComponent
    - Implementar `comporLinkAprovacao(baseUrl, token)` — formato `{baseUrl}/orcamento-aprovacao/{token}`
    - _Requirements: 5.1, 5.2, 5.3, 4.2_

  - [x] 2.3 Implementar funções de validação e filtragem
    - Implementar `validarTelefone(telefone)` — 10 ou 11 dígitos
    - Implementar `validarRegraDesconto(data)` — ranges de quantidade e percentual
    - Implementar `detectarSobreposicao(regrasExistentes, novaQuantidade)` — verificação de duplicidade
    - Implementar `calcularKPIs(orcamentos, now)` — pendentes, vencidos, valorAprovadosMes, taxaConversao
    - Implementar `filtrarOrcamentos(orcamentos, filtros, now)` — filtragem multi-critério
    - _Requirements: 5.4, 3.1, 3.8, 1.7, 1.4_

  - [ ]* 2.4 Write property tests for material value calculation
    - **Property 1: Material Value Calculation by Pricing Mode**
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 2.5 Write property tests for volume discount rule selection
    - **Property 2: Volume Discount Rule Selection**
    - **Validates: Requirements 3.3, 3.4**

  - [ ]* 2.6 Write property tests for final value invariant
    - **Property 3: Final Value Always Positive**
    - **Validates: Requirements 3.6**

  - [ ]* 2.7 Write property tests for status classification
    - **Property 4: Orçamento Status Classification**
    - **Validates: Requirements 1.5, 4.7**

  - [ ]* 2.8 Write property tests for filter correctness
    - **Property 5: Filter Correctness**
    - **Validates: Requirements 1.4**

  - [ ]* 2.9 Write property tests for description truncation
    - **Property 6: Description Truncation**
    - **Validates: Requirements 1.2**

  - [ ]* 2.10 Write property tests for KPI aggregation
    - **Property 7: KPI Aggregation Correctness**
    - **Validates: Requirements 1.7**

  - [ ]* 2.11 Write property tests for WhatsApp message and link composition
    - **Property 8: WhatsApp Message Composition**
    - **Property 9: WhatsApp Link Composition**
    - **Validates: Requirements 5.1, 5.2, 5.3**

  - [ ]* 2.12 Write property tests for phone validation and discount rule validation
    - **Property 10: Phone Number Validation**
    - **Property 11: Discount Rule Validation**
    - **Property 12: Overlap Detection for Discount Rules**
    - **Validates: Requirements 5.4, 3.1, 3.8**

  - [ ]* 2.13 Write property tests for approval link composition
    - **Property 13: Approval Link Composition**
    - **Validates: Requirements 4.2**

- [x] 3. Checkpoint — Validar lógica pura
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Página de listagem de orçamentos
  - [x] 4.1 Criar página `adesivos-orcamentos.vue` com estrutura base, KPIs e listagem paginada
    - Criar `app/pages/adesivos-orcamentos.vue` com `<script setup lang="ts">`
    - Implementar cartões de resumo (KPIs): pendentes, vencidos, valor aprovados mês, taxa de conversão
    - Implementar listagem paginada (20 itens/página) ordenada por data de criação decrescente
    - Exibir para cada item: número do pedido, nome do cliente, descrição truncada (60 chars), valor total, data de criação, data de validade, indicador visual de status (cores por status)
    - Integrar com Supabase filtrando por empresa_id via RLS
    - _Requirements: 1.1, 1.2, 1.3, 1.7_

  - [x] 4.2 Implementar filtros de orçamentos na página de listagem
    - Adicionar filtros de período (data início, data fim), status e nome do cliente
    - Aplicar filtros simultaneamente (AND lógico)
    - Atualizar listagem em tempo real ao alterar filtros
    - _Requirements: 1.4, 1.5_

  - [x] 4.3 Implementar modal de detalhes do orçamento
    - Criar componente modal com dados completos: cliente, pedido, material, dimensões, quantidade, área, cálculos discriminados (material, mão de obra, descontos volume/manual, total), prazo, validade, artes anexadas
    - Abrir ao clicar em item da listagem
    - Incluir botão de navegação para o pedido em `adesivos-pedidos`
    - _Requirements: 1.6, 8.5_

  - [x] 4.4 Implementar seleção de modalidade de precificação e cálculo em tempo real
    - Adicionar toggle/select "por m²" / "por unidade" no formulário de geração de orçamento
    - Exibir campo preço unitário quando modalidade "unidade" (R$ 0.01 a R$ 99999.99)
    - Exibir valor do material calculado em tempo real (reativo)
    - Persistir modalidade e preço unitário no registro do orçamento
    - _Requirements: 2.1, 2.4, 2.5_

  - [x] 4.5 Implementar desconto por volume automático no formulário de orçamento
    - Buscar regras de desconto da empresa via Supabase
    - Aplicar automaticamente o desconto da maior faixa atendida
    - Exibir desconto de volume como item separado (antes/depois)
    - Permitir desconto manual cumulativo (percentual ou valor fixo) com validação valor final > 0
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

  - [x] 4.6 Implementar modal de configuração de regras de desconto por volume
    - Criar modal com tabela editável: Quantidade Mínima, Desconto (%), Ações
    - Botão "Adicionar Faixa" com validação inline
    - Validação de sobreposição em tempo real (bloquear duplicatas)
    - CRUD (criar, editar, excluir) de regras via Supabase
    - Regras novas não afetam orçamentos já existentes
    - _Requirements: 3.1, 3.2, 3.7, 3.8_

- [x] 5. Checkpoint — Validar listagem e cálculos
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Aprovação externa via link e WhatsApp
  - [x] 6.1 Implementar geração de link de aprovação e integração WhatsApp na página de orçamentos
    - Gerar Token_Aprovacao (UUID v4) e salvar no banco ao solicitar link
    - Exibir link copiável com botão copiar para clipboard
    - Compor mensagem WhatsApp com dados do orçamento e link de aprovação
    - Permitir edição da mensagem antes do envio
    - Abrir `https://wa.me/{telefone}?text={msg}` em nova aba
    - Validar telefone do cliente (10/11 dígitos) com campo manual se ausente
    - _Requirements: 4.1, 4.2, 4.8, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.2 Criar página pública de aprovação `orcamento-aprovacao/[token].vue`
    - Criar `app/pages/orcamento-aprovacao/[token].vue` sem layout autenticado
    - Buscar orçamento por token via Supabase (anônimo)
    - Exibir: logo empresa, dados do orçamento (descrição, material, dimensões, quantidade, valores discriminados, validade, prazo)
    - Exibir artes anexadas como miniaturas clicáveis (lightbox)
    - Layout responsivo (320px a 768px)
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 4.3_

  - [x] 6.3 Implementar lógica de aprovação e rejeição na página pública
    - Botão "Aprovar": alterar status para "aprovado", registrar origem "link_externo", inserir na fila de produção
    - Botão "Rejeitar": solicitar motivo opcional (max 500 chars), alterar status para "cancelado", registrar origem
    - Token inválido/inexistente: exibir página de erro
    - Orçamento já aprovado/rejeitado/vencido: exibir página informativa sem botões de ação
    - _Requirements: 4.4, 4.5, 4.6, 4.7, 7.3_

  - [ ]* 6.4 Write property tests for external approval state transition and access control
    - **Property 14: External Approval State Transition**
    - **Property 15: Public Page Access Control**
    - **Validates: Requirements 4.4, 4.5, 4.7**

- [x] 7. Navegação e integração com sistema existente
  - [x] 7.1 Adicionar item "Orçamentos" ao menu lateral e integrar com fluxo de pedidos
    - Adicionar "Orçamentos" ao menu lateral na seção "Adesivos", entre "Pedidos" e "Catálogo", com ícone diferenciado
    - Navegar para `/adesivos-orcamentos` ao clicar
    - Manter compatibilidade com fluxo de aprovação interna em `adesivos-pedidos`
    - Aprovação externa reflete na página de pedidos na próxima consulta
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 8. Final checkpoint — Validação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (Properties 1–15)
- Unit tests validate specific examples and edge cases
- Integration tests (RLS, constraints) require Supabase local instance
- The composable `useOrcamentos()` contains pure logic enabling thorough property-based testing with fast-check + Vitest
- All code uses TypeScript with Vue 3 `<script setup>` pattern and TailwindCSS

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "2.10", "2.11", "2.12", "2.13"] },
    { "id": 3, "tasks": ["4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3", "4.4"] },
    { "id": 5, "tasks": ["4.5", "4.6"] },
    { "id": 6, "tasks": ["6.1"] },
    { "id": 7, "tasks": ["6.2", "6.3"] },
    { "id": 8, "tasks": ["6.4", "7.1"] }
  ]
}
```
