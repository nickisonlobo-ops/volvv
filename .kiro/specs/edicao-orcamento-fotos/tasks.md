# Implementation Plan: Edição de Orçamento e Upload de Fotos

## Overview

Implementação incremental das quatro capacidades: edição de orçamentos existentes (modo edit no modal), override de preço por m² por item, upload de foto do local de instalação e upload de foto da arte por item. A abordagem segue: migração de banco → composable (lógica pura) → componente genérico de upload → extensão de componentes existentes → integração e wiring.

## Tasks

- [x] 1. Migração de banco de dados e configuração de Storage
  - [x] 1.1 Criar migração SQL para novos campos nas tabelas existentes
    - Adicionar campo `foto_local_url text` na tabela `orcamentos_adesivo`
    - Adicionar campo `foto_arte_url text` na tabela `itens_orcamento`
    - Adicionar campo `preco_m2 numeric(10,2)` na tabela `itens_orcamento` com CHECK constraint (preco_m2 IS NULL OR preco_m2 BETWEEN 0.01 AND 9999.99)
    - Adicionar campo `foto_arte_url text` na tabela `itens_ordem_servico`
    - Usar `ADD COLUMN IF NOT EXISTS` para idempotência
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 1.2 Criar migração SQL para bucket de Storage e RLS policies
    - Criar bucket "orcamentos" no Supabase Storage (public: true, file_size_limit: 10485760, allowed_mime_types: JPEG, PNG, WebP, PDF)
    - Criar policy de INSERT para authenticated users (empresa_id via profiles)
    - Criar policy de SELECT para authenticated users da mesma empresa
    - Criar policy de SELECT público para arquivos vinculados a orçamentos com token_aprovacao
    - Criar policy de DELETE para authenticated users da empresa proprietária
    - _Requirements: 5.4, 5.6_

- [x] 2. Checkpoint - Validar migrações
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Extensão do composable `useOrcamentos.ts` com lógica de edição e upload
  - [x] 3.1 Implementar funções de edição e diff de itens no composable
    - Implementar `isStatusEditavel(status: string): boolean` — retorna true para 'rascunho' e 'enviado'
    - Implementar `calcularDiffItens(originais, atuais): DiffItens` — determina itens para inserir, atualizar e deletar
    - Implementar `atualizarOrcamento(id, dados, diffItens)` — persiste alterações no orçamento e sincroniza itens
    - Adicionar interface `OrcamentoCompleto` e `ItemOrcamentoCompleto` com campos de foto
    - _Requirements: 1.1, 1.6, 1.7, 1.8_

  - [x] 3.2 Implementar funções de validação de upload e geração de paths
    - Implementar `validarArquivoUpload(file, tiposAceitos, tamanhoMaxBytes): ValidacaoArquivo`
    - Implementar `validarPrecoM2(valor): ValidacaoResult` — aceita se entre 0.01 e 9999.99
    - Implementar `isPrecoOverride(precoItem, precoMaterial): boolean`
    - Implementar `gerarPathFotoLocal(empresaId, orcamentoId, extensao): string`
    - Implementar `gerarPathFotoArte(empresaId, orcamentoId, itemId, extensao): string`
    - Implementar `mapearItensParaOS(itensOrcamento, osId): ItemOrdemServico[]` — propaga foto_arte_url
    - _Requirements: 2.4, 2.6, 3.2, 4.2, 5.5_

  - [ ]* 3.3 Write property test para diff de itens (Property 1)
    - **Property 1: Item Sync Diff Correctness**
    - Gerar listas aleatórias de itens originais (com IDs) e modificados (alguns com IDs existentes, alguns novos, alguns removidos)
    - Verificar que inserir contém exatamente itens sem ID existente, atualizar contém itens com ID presente nos originais, deletar contém IDs ausentes nos modificados
    - **Validates: Requirements 1.6**

  - [ ]* 3.4 Write property test para status guard (Property 2)
    - **Property 2: Edit Button Status Guard**
    - Gerar strings aleatórias de status e verificar que isStatusEditavel retorna true somente para 'rascunho' e 'enviado'
    - **Validates: Requirements 1.7**

  - [ ]* 3.5 Write property test para cálculo de preço com override (Property 3)
    - **Property 3: Price Calculation with Override**
    - Gerar itens com modalidade 'm2', dimensões válidas e preco_m2 válido; verificar que valor = (largura × altura × quantidade) / 10000 × preco_m2
    - **Validates: Requirements 2.2**

  - [ ]* 3.6 Write property test para validação de preço m² (Property 4)
    - **Property 4: Price Override Validation Range**
    - Gerar valores numéricos e verificar que validarPrecoM2 aceita se e somente se valor >= 0.01 e <= 9999.99
    - **Validates: Requirements 2.4**

  - [ ]* 3.7 Write property test para indicador de override (Property 5)
    - **Property 5: Override Indicator Correctness**
    - Gerar pares de valores e verificar que isPrecoOverride retorna true se e somente se os valores são diferentes
    - **Validates: Requirements 2.6**

  - [ ]* 3.8 Write property test para validação de arquivo (Property 6)
    - **Property 6: File Upload Validation**
    - Gerar file descriptors com tipos e tamanhos aleatórios; verificar que validarArquivoUpload aceita se tipo está na lista E tamanho <= max
    - **Validates: Requirements 3.2, 4.2**

  - [ ]* 3.9 Write property test para propagação de foto para OS (Property 7)
    - **Property 7: Art Photo Propagation to OS**
    - Gerar listas de itens com foto_arte_url variadas (null e com URLs); verificar que mapearItensParaOS preserva cada foto_arte_url nos itens da OS
    - **Validates: Requirements 5.5**

- [x] 4. Checkpoint - Validar composable e property tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Componente genérico de upload de foto (`FotoUpload.vue`)
  - [x] 5.1 Criar componente `FotoUpload.vue` com validação, preview e upload
    - Criar arquivo `app/components/FotoUpload.vue`
    - Props: modelValue (URL existente), label, accept (mime types), maxSizeMb, storagePath
    - Emits: update:modelValue, file-selected, file-removed, error
    - Validação client-side de tipo e tamanho ao selecionar arquivo
    - Exibir thumbnail de preview para imagens; ícone de arquivo para PDF
    - Botões substituir/remover quando há foto existente
    - Upload para Supabase Storage via `supabase.storage.from('orcamentos').upload()`
    - Estado de loading durante upload com indicador visual
    - Exibir mensagens de erro inline (formato inválido, tamanho excedido)
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3, 4.5, 4.6, 4.7_

  - [ ]* 5.2 Write unit tests para FotoUpload.vue
    - Testar rejeição de arquivo .gif (formato inválido)
    - Testar rejeição de arquivo com 6 MB para foto local (> 5 MB)
    - Testar exibição de preview após seleção de arquivo válido
    - Testar remoção de foto existente
    - _Requirements: 3.2, 3.7, 4.7_

- [x] 6. Extensão do `OrcamentoItemRow.vue` com preço override e foto da arte
  - [x] 6.1 Adicionar campo editável de preço por m² no OrcamentoItemRow
    - Exibir campo `R$/m²` quando `modalidade_preco === 'm2'`
    - Pré-preencher com preço padrão do material selecionado
    - Ao alterar material, atualizar campo com preço padrão do novo material
    - Recalcular valor do item ao alterar preço m²: (largura × altura × quantidade) / 10000 × preco_m2
    - Validação inline: exibir erro se valor fora de R$ 0,01 a R$ 9.999,99
    - Exibir badge/ícone de override quando preço difere do padrão do material
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 6.2 Adicionar upload de foto da arte no OrcamentoItemRow
    - Integrar componente `FotoUpload` com label "Arte do Adesivo"
    - Configurar accept: "image/jpeg,image/png,image/webp,application/pdf"
    - Configurar maxSizeMb: 10
    - Gerar storagePath com `gerarPathFotoArte(empresaId, orcamentoId, itemId, extensao)`
    - Exibir preview da arte existente ao abrir item em modo edição
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Extensão do `OrcamentoNovoModal.vue` com modo edição e foto do local
  - [x] 7.1 Implementar modo edição no OrcamentoNovoModal
    - Adicionar props: `mode ('create' | 'edit')` e `orcamentoParaEditar (OrcamentoCompleto)`
    - Título dinâmico: "Editar Orçamento" + "ORC-N" em modo edit vs "Novo Orçamento" em modo create
    - Pré-preencher todos os campos com dados do orcamentoParaEditar (cliente, validade, prazo, mão de obra, itens, descontos)
    - Botão de ação: "Salvar Alterações" em modo edit vs "Salvar Rascunho" em modo create
    - Ao confirmar edit: validar campos com mesmas regras de criação; chamar `atualizarOrcamento()` com diff de itens
    - Preservar token_aprovacao e status "enviado" ao salvar edição de orçamento enviado
    - Emit 'updated' ao concluir edição com sucesso
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.8_

  - [x] 7.2 Adicionar upload de foto do local de instalação no modal
    - Integrar componente `FotoUpload` na seção de dados gerais (acima da lista de itens)
    - Label: "Foto do Local de Instalação"
    - Configurar accept: "image/jpeg,image/png,image/webp"
    - Configurar maxSizeMb: 5
    - Gerar storagePath com `gerarPathFotoLocal(empresaId, orcamentoId, extensao)`
    - Exibir preview de foto existente ao abrir orçamento em edição
    - Upload staged: enviar ao Storage quando file-selected, cleanup se modal cancelado
    - Persistir foto_local_url na tabela orcamentos_adesivo ao salvar
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 7.3 Write unit tests para modo edição do modal
    - Testar que título exibe "Editar Orçamento" + número em modo edit
    - Testar que campos são pré-preenchidos com dados do orçamento
    - Testar preservação de token_aprovacao em orçamento "enviado"
    - _Requirements: 1.1, 1.2, 1.8_

- [x] 8. Integração do botão editar na página de orçamentos
  - [x] 8.1 Adicionar botão "Editar" na listagem e controle de status
    - Exibir botão "Editar" nos cards/linhas de orçamentos com status editável ('rascunho', 'enviado')
    - Desabilitar botão com tooltip para status 'aprovado', 'rejeitado', 'vencido'
    - Ao clicar: buscar dados completos do orçamento (com itens e fotos) e abrir OrcamentoNovoModal em modo edit
    - Ao receber emit 'updated': atualizar listagem com dados modificados
    - _Requirements: 1.1, 1.7_

  - [x] 8.2 Exibir fotos na visualização de detalhes e página pública
    - Exibir foto_local_url na modal de detalhes do orçamento (quando existir)
    - Exibir foto_arte_url em cada item na modal de detalhes
    - Exibir foto_local_url na página pública de aprovação (`orcamento-aprovacao/[token].vue`)
    - Exibir foto_arte_url de cada item na página pública de aprovação
    - _Requirements: 3.8, 4.8_

- [x] 9. Propagação de foto_arte_url para Ordem de Serviço
  - [x] 9.1 Atualizar lógica de geração de OS para copiar foto_arte_url
    - Alterar função/RPC que gera OS para incluir foto_arte_url de cada item do orçamento no item da OS
    - Utilizar `mapearItensParaOS()` atualizado com campo foto_arte_url
    - Exibir foto_arte_url na modal de detalhes da OS (`OSDetalhesModal.vue`)
    - _Requirements: 5.5, 4.8_

- [x] 10. Limpeza de Storage e tratamento de erros
  - [x] 10.1 Implementar cleanup de fotos em cenários de erro e cancelamento
    - Ao cancelar modal com fotos staged: deletar arquivos do Storage
    - Ao falhar save do orçamento: deletar fotos uploadadas (best-effort cleanup)
    - Ao remover foto do local: deletar arquivo do Storage e limpar foto_local_url
    - Ao remover foto da arte: deletar arquivo do Storage e limpar foto_arte_url
    - _Requirements: 3.5, 3.6, 4.5, 4.6_

- [x] 11. Final checkpoint - Validação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document (7 properties)
- Unit tests validate specific examples and edge cases
- O composable `useOrcamentos.ts` existente é estendido (não substituído) para manter compatibilidade
- O componente `FotoUpload.vue` é genérico e reutilizável para ambos os cenários de upload (local e arte)
- O campo `preco_m2` já pode existir na tabela — a migração usa IF NOT EXISTS
- O bucket "orcamentos" é público para leitura mas protegido por RLS para escrita/exclusão
- A propagação de foto_arte_url para OS garante que a produção tem acesso direto às artes

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["3.1", "3.2"] },
    { "id": 2, "tasks": ["3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "3.9"] },
    { "id": 3, "tasks": ["5.1"] },
    { "id": 4, "tasks": ["5.2", "6.1"] },
    { "id": 5, "tasks": ["6.2", "7.1"] },
    { "id": 6, "tasks": ["7.2", "7.3"] },
    { "id": 7, "tasks": ["8.1", "8.2"] },
    { "id": 8, "tasks": ["9.1", "10.1"] }
  ]
}
```
