# E-commerce — Spec

## Visão Geral
Página pública de e-commerce que puxa produtos do catálogo existente (`adesivos-catalogo`), permitindo que clientes da empresa visualizem produtos e façam pedidos via WhatsApp.

URL: `/loja/{empresa_slug}` (pública, sem login)

---

## Requisitos

### R1 — Página pública sem login
- Acessível via slug da empresa (ex: `/loja/aplick`)
- Puxa tema/cores/logo da empresa automaticamente
- Layout responsivo (mobile-first)

### R2 — Listagem de produtos
- Grid de cards com: foto, nome, preço, descrição curta
- Filtros: categoria, busca por nome
- Ordenação: preço, mais recentes
- Apenas produtos com `ativo = true`

### R3 — Página do produto (modal ou rota)
- Foto ampliada (galeria se tiver múltiplas)
- Nome, descrição completa, preço
- Botão "Comprar via WhatsApp" (abre conversa com texto pré-preenchido)
- Botão "Adicionar ao carrinho"

### R4 — Carrinho (localStorage)
- Armazenado no localStorage (sem login)
- Adicionar/remover itens, alterar quantidade
- Total calculado
- Botão "Finalizar pedido" → envia resumo via WhatsApp

### R5 — Checkout via WhatsApp
- Monta mensagem com: lista de itens + quantidades + total
- Abre `wa.me/{numero_empresa}?text={mensagem_formatada}`
- Sem pagamento online (por enquanto)

### R6 — SEO e compartilhamento
- Meta tags dinâmicas (Open Graph) com nome/logo da empresa
- Título da página: "Loja | {nome_empresa}"

### R7 — Personalização visual
- Herda cores do tema da empresa (primary, bg, card)
- Logo no header
- Nome da empresa no header

---

## Estrutura Técnica

### Rota
- `app/pages/loja/[slug].vue` — página pública do e-commerce

### Dados
- Tabela existente: `adesivos_catalogo` (ou similar) — verificar nome exato
- Tabela `empresas` — para resolver slug → empresa_id
- Tabela `empresa_personalizacao` — para tema

### Componentes
- `EcommerceHeader.vue` — logo + nome + carrinho
- `EcommerceProdutoCard.vue` — card do produto no grid
- `EcommerceProdutoModal.vue` — detalhes do produto
- `EcommerceCarrinho.vue` — drawer/modal do carrinho
- `EcommerceFiltros.vue` — busca + categorias

### Layout
- Usar layout `public` (sem sidebar/header do admin)

---

## Fases

### Fase 1 (MVP)
- [ ] Página pública com grid de produtos
- [ ] Filtro por categoria + busca
- [ ] Modal do produto com "Comprar via WhatsApp"
- [ ] Tema da empresa aplicado

### Fase 2
- [ ] Carrinho com localStorage
- [ ] Checkout formatado via WhatsApp
- [ ] SEO/Open Graph

### Fase 3
- [ ] Domínio próprio (custom domain)
- [ ] Analytics (visualizações, cliques)
- [ ] Avaliações/reviews
