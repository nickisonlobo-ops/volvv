# Requirements Document

## Introduction

Aprimoramentos no módulo de Orçamentos de Adesivos (Nuxt 4 + Supabase) para suportar: edição de orçamentos existentes (reutilizando o modal de criação em modo edição), edição do preço por m² individual por item (override do valor padrão do material), upload de foto do local de instalação vinculada ao orçamento, e upload de foto da arte/adesivo vinculada a cada item do orçamento. Esses recursos complementam o fluxo de orçamento independente multi-itens já implementado, melhorando a flexibilidade de precificação e fornecendo referências visuais para a equipe de produção.

## Glossary

- **Sistema_Orcamentos**: Módulo de gerenciamento de orçamentos de adesivos, acessível via `/adesivos-orcamentos`
- **Orcamento**: Proposta comercial criada pelo Operador contendo um ou mais itens/produtos com precificação, prazos e condições para aprovação do cliente
- **Item_Orcamento**: Produto individual dentro de um Orçamento, contendo material, dimensões, quantidade e preço calculado
- **Operador**: Usuário do sistema (funcionário da empresa) com permissão para criar e gerenciar orçamentos
- **OrcamentoNovoModal**: Componente Vue (modal) utilizado para criação de orçamentos, que será reutilizado em modo edição
- **OrcamentoItemRow**: Componente Vue que renderiza os campos de um item individual no formulário de orçamento
- **Preco_M2_Override**: Valor de preço por m² definido manualmente pelo Operador para um Item_Orcamento específico, substituindo o preço padrão do material
- **Foto_Local_Instalacao**: Imagem do local onde o adesivo será aplicado, vinculada ao Orcamento para referência da equipe de produção
- **Foto_Arte_Adesivo**: Imagem da arte/design do adesivo, vinculada a um Item_Orcamento individual para referência visual da produção
- **Supabase_Storage**: Serviço de armazenamento de arquivos do Supabase utilizado para guardar as imagens enviadas
- **Status_Editavel**: Conjunto de status do Orcamento que permitem edição: "rascunho" e "enviado"

## Requirements

### Requirement 1: Edição de Orçamento Existente

**User Story:** Como Operador, quero editar um orçamento existente que esteja em status "rascunho" ou "enviado", para que eu possa corrigir dados, alterar itens, modificar valores e ajustar o cliente sem precisar recriar o orçamento do zero.

#### Acceptance Criteria

1. WHEN o Operador clicar no botão "Editar" de um Orcamento com Status_Editavel ("rascunho" ou "enviado"), THE Sistema_Orcamentos SHALL abrir o OrcamentoNovoModal em modo edição, pré-preenchido com todos os dados atuais do Orcamento (cliente, validade, prazo, mão de obra, itens e descontos)
2. WHILE o OrcamentoNovoModal estiver em modo edição, THE Sistema_Orcamentos SHALL exibir o título "Editar Orçamento" e o número do orçamento (ORC-N) no cabeçalho do modal, diferenciando visualmente do modo criação
3. THE Sistema_Orcamentos SHALL permitir ao Operador modificar o cliente selecionado, a validade em dias, o prazo estimado, o valor de mão de obra global e os descontos manuais de um Orcamento em modo edição
4. THE Sistema_Orcamentos SHALL permitir ao Operador adicionar novos itens, remover itens existentes e modificar campos de itens já cadastrados (material, dimensões, quantidade, modalidade de preço, preço unitário) durante a edição do Orcamento
5. WHEN o Operador confirmar as alterações no modo edição, THE Sistema_Orcamentos SHALL validar todos os campos com as mesmas regras aplicadas na criação (pelo menos 1 item, campos obrigatórios preenchidos, valor total maior que zero) antes de persistir as alterações
6. WHEN o Operador confirmar a edição, THE Sistema_Orcamentos SHALL atualizar o registro do Orcamento na tabela `orcamentos_adesivo` e sincronizar os itens na tabela `itens_orcamento` (inserindo novos, atualizando modificados e removendo excluídos) em uma única operação
7. IF o Operador tentar editar um Orcamento com status "aprovado", "rejeitado" ou "vencido", THEN THE Sistema_Orcamentos SHALL exibir o botão "Editar" como desabilitado com tooltip informando que orçamentos nesse status não podem ser alterados
8. WHEN a edição de um Orcamento com status "enviado" for confirmada, THE Sistema_Orcamentos SHALL manter o status como "enviado" e preservar o token_aprovacao existente para que o link de aprovação continue funcionando com os dados atualizados

### Requirement 2: Edição do Preço por m² Individual por Item

**User Story:** Como Operador, quero poder editar o preço por m² de cada item individualmente no orçamento, para que eu possa aplicar preços negociados, condições especiais ou ajustes pontuais sem alterar o cadastro do material.

#### Acceptance Criteria

1. THE OrcamentoItemRow SHALL exibir um campo editável de preço por m² (R$/m²) quando a modalidade de preço do Item_Orcamento for "m2", pré-preenchido com o valor padrão do material selecionado
2. WHEN o Operador alterar o valor do campo de preço por m² no OrcamentoItemRow, THE Sistema_Orcamentos SHALL recalcular o valor do item utilizando o Preco_M2_Override informado em vez do preço padrão do material, com a fórmula: (largura_cm × altura_cm × quantidade) / 10000 × preco_m2_override
3. WHEN o Operador selecionar um novo material no OrcamentoItemRow, THE Sistema_Orcamentos SHALL atualizar o campo de preço por m² com o valor padrão do novo material selecionado, permitindo que o Operador o modifique posteriormente
4. THE Sistema_Orcamentos SHALL validar que o preço por m² informado está entre R$ 0,01 e R$ 9999,99 e exibir mensagem de erro inline caso o valor esteja fora dessa faixa
5. THE Sistema_Orcamentos SHALL persistir o campo `preco_m2` na tabela `itens_orcamento` com o valor definido pelo Operador (override ou padrão do material) para cada item com modalidade "m2"
6. THE OrcamentoItemRow SHALL exibir indicação visual (ícone ou badge) quando o preço por m² de um item for diferente do preço padrão do material, sinalizando que houve override manual

### Requirement 3: Upload de Foto do Local de Instalação

**User Story:** Como Operador, quero anexar uma foto do local de instalação ao orçamento, para que a equipe de produção tenha referência visual de onde o adesivo será aplicado.

#### Acceptance Criteria

1. THE OrcamentoNovoModal SHALL exibir um campo de upload de imagem rotulado "Foto do Local de Instalação" na seção de dados gerais do orçamento (acima da lista de itens)
2. WHEN o Operador selecionar uma imagem para upload, THE Sistema_Orcamentos SHALL aceitar arquivos nos formatos JPEG, PNG e WebP com tamanho máximo de 5 MB
3. WHEN o Operador selecionar uma imagem válida, THE Sistema_Orcamentos SHALL exibir uma pré-visualização (thumbnail) da imagem no formulário antes de salvar o orçamento
4. WHEN o Operador salvar ou atualizar o Orcamento com uma foto do local de instalação selecionada, THE Sistema_Orcamentos SHALL fazer upload da imagem para o Supabase_Storage no bucket "orcamentos" com path `{empresa_id}/{orcamento_id}/local-instalacao.{extensao}` e armazenar a URL pública no campo `foto_local_url` da tabela `orcamentos_adesivo`
5. WHEN o Operador abrir um Orcamento que já possua Foto_Local_Instalacao, THE Sistema_Orcamentos SHALL exibir a pré-visualização da imagem existente com opção de substituir ou remover a foto
6. WHEN o Operador remover a Foto_Local_Instalacao de um Orcamento, THE Sistema_Orcamentos SHALL excluir o arquivo do Supabase_Storage e limpar o campo `foto_local_url` na tabela `orcamentos_adesivo`
7. IF o Operador selecionar um arquivo com formato não suportado ou tamanho superior a 5 MB, THEN THE Sistema_Orcamentos SHALL exibir mensagem de erro informando as restrições aceitas sem permitir o upload
8. THE Sistema_Orcamentos SHALL exibir a Foto_Local_Instalacao na visualização de detalhes do orçamento e na página pública de aprovação, permitindo que o Cliente visualize o local de aplicação

### Requirement 4: Upload de Foto da Arte do Adesivo por Item

**User Story:** Como Operador, quero anexar uma foto da arte/design do adesivo a cada item do orçamento, para que a equipe de produção tenha a referência visual exata do que deve ser produzido.

#### Acceptance Criteria

1. THE OrcamentoItemRow SHALL exibir um campo de upload de imagem rotulado "Arte do Adesivo" dentro de cada item do orçamento
2. WHEN o Operador selecionar uma imagem de arte para um Item_Orcamento, THE Sistema_Orcamentos SHALL aceitar arquivos nos formatos JPEG, PNG, WebP e PDF com tamanho máximo de 10 MB
3. WHEN o Operador selecionar uma imagem válida de arte, THE Sistema_Orcamentos SHALL exibir uma pré-visualização (thumbnail) da imagem no OrcamentoItemRow antes de salvar o orçamento
4. WHEN o Operador salvar ou atualizar o Orcamento com fotos de arte nos itens, THE Sistema_Orcamentos SHALL fazer upload de cada imagem para o Supabase_Storage no bucket "orcamentos" com path `{empresa_id}/{orcamento_id}/itens/{item_id}/arte.{extensao}` e armazenar a URL no campo `foto_arte_url` da tabela `itens_orcamento`
5. WHEN o Operador abrir um Item_Orcamento que já possua Foto_Arte_Adesivo, THE Sistema_Orcamentos SHALL exibir a pré-visualização da imagem existente com opção de substituir ou remover a foto
6. WHEN o Operador remover a Foto_Arte_Adesivo de um Item_Orcamento, THE Sistema_Orcamentos SHALL excluir o arquivo do Supabase_Storage e limpar o campo `foto_arte_url` na tabela `itens_orcamento`
7. IF o Operador selecionar um arquivo com formato não suportado ou tamanho superior a 10 MB, THEN THE Sistema_Orcamentos SHALL exibir mensagem de erro informando as restrições aceitas sem permitir o upload
8. THE Sistema_Orcamentos SHALL exibir a Foto_Arte_Adesivo na visualização de detalhes do orçamento, na Ordem de Serviço gerada e na página pública de aprovação, permitindo referência visual do produto

### Requirement 5: Modelo de Dados para Fotos e Preço Override

**User Story:** Como Operador, quero que o sistema armazene corretamente as URLs das fotos e o preço por m² customizado, para que os dados complementem o modelo existente sem quebrar a estrutura atual.

#### Acceptance Criteria

1. THE Sistema_Orcamentos SHALL adicionar o campo `foto_local_url` (texto, nullable) à tabela `orcamentos_adesivo` para armazenar a URL da foto do local de instalação
2. THE Sistema_Orcamentos SHALL adicionar o campo `foto_arte_url` (texto, nullable) à tabela `itens_orcamento` para armazenar a URL da foto da arte de cada item
3. THE Sistema_Orcamentos SHALL garantir que o campo `preco_m2` existente na tabela `itens_orcamento` armazene o valor override definido pelo Operador (preço negociado ou padrão do material) com constraint entre 0.01 e 9999.99
4. THE Sistema_Orcamentos SHALL criar o bucket "orcamentos" no Supabase_Storage com política de acesso que permita upload e leitura por usuários autenticados da mesma empresa_id, e leitura pública para arquivos de orçamentos com token_aprovacao válido
5. THE Sistema_Orcamentos SHALL copiar o campo `foto_arte_url` de cada Item_Orcamento para o respectivo Item_OS na tabela `itens_ordem_servico` quando a Ordem de Serviço for gerada, para que a produção tenha acesso direto às artes
6. THE Sistema_Orcamentos SHALL aplicar Row Level Security no bucket "orcamentos" do Supabase_Storage, restringindo upload e delete a usuários autenticados da empresa proprietária do orçamento
