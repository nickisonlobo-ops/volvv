import { describe, it, expect } from 'vitest'
import { useOrcamentos } from '../../app/composables/useOrcamentos'
import type { ItemOrcamento, ItemOrcamentoCompleto } from '../../app/composables/useOrcamentos'

describe('useOrcamentos', () => {
  const {
    calcularValorMaterial,
    selecionarDescontoVolume,
    calcularValorFinal,
    classificarStatusOrcamento,
    classificarStatusOrcamentoV2,
    comporMensagemWhatsApp,
    comporMensagemWhatsAppMultiItens,
    comporLinkWhatsApp,
    comporLinkAprovacao,
    truncarDescricao,
    validarTelefone,
    validarRegraDesconto,
    validarOrcamento,
    detectarSobreposicao,
    calcularKPIs,
    filtrarOrcamentos,
    calcularAreaItem,
    calcularValorItem,
    calcularTotalItens,
    calcularQuantidadeTotal,
    gerarNumeroOrcamento,
    validarArquivoUpload,
    validarPrecoM2,
    isPrecoOverride,
    gerarPathFotoLocal,
    gerarPathFotoArte,
    mapearItensParaOS,
  } = useOrcamentos()

  // ─── calcularValorMaterial ──────────────────────────────
  describe('calcularValorMaterial', () => {
    it('calcula por m²: area * preco_m2', () => {
      expect(calcularValorMaterial('m2', { area_m2: 2, preco_m2: 50 })).toBe(100)
    })

    it('calcula por unidade: preco_unitario * quantidade', () => {
      expect(calcularValorMaterial('unidade', { preco_unitario: 15, quantidade: 10 })).toBe(150)
    })

    it('retorna 0 quando campos não informados (m2)', () => {
      expect(calcularValorMaterial('m2', {})).toBe(0)
    })

    it('retorna 0 quando campos não informados (unidade)', () => {
      expect(calcularValorMaterial('unidade', {})).toBe(0)
    })
  })

  // ─── selecionarDescontoVolume ───────────────────────────
  describe('selecionarDescontoVolume', () => {
    const regras = [
      { quantidade_minima: 10, desconto_percentual: 5 },
      { quantidade_minima: 50, desconto_percentual: 10 },
      { quantidade_minima: 100, desconto_percentual: 15 },
    ]

    it('seleciona a maior faixa atendida', () => {
      const result = selecionarDescontoVolume(regras, 75)
      expect(result).toEqual({ quantidade_minima: 50, desconto_percentual: 10 })
    })

    it('retorna null quando nenhuma faixa é atendida', () => {
      expect(selecionarDescontoVolume(regras, 5)).toBeNull()
    })

    it('seleciona faixa exata quando quantidade = quantidade_minima', () => {
      const result = selecionarDescontoVolume(regras, 100)
      expect(result).toEqual({ quantidade_minima: 100, desconto_percentual: 15 })
    })

    it('retorna null para lista vazia de regras', () => {
      expect(selecionarDescontoVolume([], 50)).toBeNull()
    })
  })

  // ─── calcularValorFinal ─────────────────────────────────
  describe('calcularValorFinal', () => {
    it('calcula com todos os descontos', () => {
      // subtotal = 100 + 30 = 130
      // descVolume = 130 * 10% = 13 → aposVolume = 117
      // descManualPerc = 117 * 5% = 5.85 → total = 117 - 5.85 - 10 = 101.15
      expect(calcularValorFinal(100, 30, 10, 5, 10)).toBeCloseTo(101.15, 2)
    })

    it('nunca retorna valor menor que 0.01', () => {
      expect(calcularValorFinal(10, 0, 99, 99, 9999)).toBe(0.01)
    })

    it('calcula sem descontos', () => {
      expect(calcularValorFinal(100, 50, 0, 0, 0)).toBe(150)
    })
  })

  // ─── classificarStatusOrcamento ─────────────────────────
  describe('classificarStatusOrcamento', () => {
    const now = new Date('2024-06-15T12:00:00Z')

    it('retorna aprovado para status_pedido aprovado', () => {
      expect(classificarStatusOrcamento('aprovado', '2024-06-20', now)).toBe('aprovado')
    })

    it('retorna aprovado para status_pedido em_producao', () => {
      expect(classificarStatusOrcamento('em_producao', '2024-06-20', now)).toBe('aprovado')
    })

    it('retorna rejeitado para status_pedido cancelado', () => {
      expect(classificarStatusOrcamento('cancelado', '2024-06-20', now)).toBe('rejeitado')
    })

    it('retorna vencido quando orcamento_enviado e data expirada', () => {
      expect(classificarStatusOrcamento('orcamento_enviado', '2024-06-10', now)).toBe('vencido')
    })

    it('retorna pendente quando orcamento_enviado e não expirado', () => {
      expect(classificarStatusOrcamento('orcamento_enviado', '2024-06-20', now)).toBe('pendente')
    })

    it('retorna pendente para status desconhecido', () => {
      expect(classificarStatusOrcamento('novo', '2024-06-20', now)).toBe('pendente')
    })
  })

  // ─── comporMensagemWhatsApp ─────────────────────────────
  describe('comporMensagemWhatsApp', () => {
    it('compõe mensagem com todos os dados', () => {
      const msg = comporMensagemWhatsApp({
        nomeCliente: 'João',
        descricao: 'Adesivo para carro',
        dimensoes: '100x50cm',
        quantidade: 5,
        valorTotal: 250.5,
        validade: '20/06/2024',
        linkAprovacao: 'https://app.com/orcamento-aprovacao/abc-123',
      })
      expect(msg).toContain('João')
      expect(msg).toContain('Adesivo para carro')
      expect(msg).toContain('R$ 250.50')
      expect(msg).toContain('abc-123')
      expect(msg.length).toBeLessThanOrEqual(1000)
    })

    it('trunca mensagem em 1000 caracteres', () => {
      const msg = comporMensagemWhatsApp({
        nomeCliente: 'A'.repeat(500),
        descricao: 'B'.repeat(500),
        dimensoes: '100x50cm',
        quantidade: 5,
        valorTotal: 250.5,
        validade: '20/06/2024',
        linkAprovacao: 'https://app.com/orcamento-aprovacao/abc-123',
      })
      expect(msg.length).toBeLessThanOrEqual(1000)
    })
  })

  // ─── comporMensagemWhatsAppMultiItens ───────────────────
  describe('comporMensagemWhatsAppMultiItens', () => {
    const dadosBase = {
      nomeCliente: 'João Silva',
      quantidadeItens: 3,
      descricaoResumida: 'Adesivo vinílico, Banner lona, Placa ACM',
      valorTotal: 1250.5,
      validade: '20/06/2024',
      linkAprovacao: 'https://app.com/orcamento-aprovacao/abc-123-def-456',
    }

    it('compõe mensagem com todos os dados', () => {
      const msg = comporMensagemWhatsAppMultiItens(dadosBase)
      expect(msg).toContain('João Silva')
      expect(msg).toContain('3 itens')
      expect(msg).toContain('Adesivo vinílico, Banner lona, Placa ACM')
      expect(msg).toContain('R$ 1.250,50')
      expect(msg).toContain('20/06/2024')
      expect(msg).toContain('abc-123-def-456')
    })

    it('formata valor em formato brasileiro', () => {
      const msg = comporMensagemWhatsAppMultiItens({
        ...dadosBase,
        valorTotal: 99999.99,
      })
      expect(msg).toContain('R$ 99.999,99')
    })

    it('formata valor com centavos zerados', () => {
      const msg = comporMensagemWhatsAppMultiItens({
        ...dadosBase,
        valorTotal: 500,
      })
      expect(msg).toContain('R$ 500,00')
    })

    it('mensagem tem no máximo 1000 caracteres', () => {
      const msg = comporMensagemWhatsAppMultiItens(dadosBase)
      expect(msg.length).toBeLessThanOrEqual(1000)
    })

    it('trunca descricaoResumida quando mensagem excede 1000 chars', () => {
      const msg = comporMensagemWhatsAppMultiItens({
        ...dadosBase,
        descricaoResumida: 'X'.repeat(950),
      })
      expect(msg.length).toBeLessThanOrEqual(1000)
      expect(msg).toContain('...')
      // Link must always be present
      expect(msg).toContain(dadosBase.linkAprovacao)
    })

    it('linkAprovacao nunca é truncado', () => {
      const longLink = 'https://app.com/orcamento-aprovacao/' + 'a'.repeat(200)
      const msg = comporMensagemWhatsAppMultiItens({
        ...dadosBase,
        descricaoResumida: 'Y'.repeat(800),
        linkAprovacao: longLink,
      })
      expect(msg.length).toBeLessThanOrEqual(1000)
      expect(msg).toContain(longLink)
    })

    it('inclui saudação com emoji', () => {
      const msg = comporMensagemWhatsAppMultiItens(dadosBase)
      expect(msg).toContain('Olá João Silva! 👋')
    })

    it('inclui emojis para itens, total e validade', () => {
      const msg = comporMensagemWhatsAppMultiItens(dadosBase)
      expect(msg).toContain('📦')
      expect(msg).toContain('💰')
      expect(msg).toContain('📅')
      expect(msg).toContain('👉')
    })

    it('usa line breaks para separação', () => {
      const msg = comporMensagemWhatsAppMultiItens(dadosBase)
      expect(msg).toContain('\n')
    })
  })

  // ─── comporLinkWhatsApp ─────────────────────────────────
  describe('comporLinkWhatsApp', () => {
    it('adiciona prefixo 55 quando ausente', () => {
      const link = comporLinkWhatsApp('11999998888', 'Olá')
      expect(link).toBe('https://wa.me/5511999998888?text=Ol%C3%A1')
    })

    it('não duplica prefixo 55', () => {
      const link = comporLinkWhatsApp('5511999998888', 'Olá')
      expect(link).toBe('https://wa.me/5511999998888?text=Ol%C3%A1')
    })

    it('remove caracteres não numéricos do telefone', () => {
      const link = comporLinkWhatsApp('(11) 99999-8888', 'Teste')
      expect(link).toContain('wa.me/5511999998888')
    })
  })

  // ─── comporLinkAprovacao ────────────────────────────────
  describe('comporLinkAprovacao', () => {
    it('compõe link no formato correto', () => {
      const link = comporLinkAprovacao('https://app.com', 'token-uuid-123')
      expect(link).toBe('https://app.com/orcamento-aprovacao/token-uuid-123')
    })
  })

  // ─── truncarDescricao ───────────────────────────────────
  describe('truncarDescricao', () => {
    it('não trunca texto menor que max', () => {
      expect(truncarDescricao('Adesivo', 60)).toBe('Adesivo')
    })

    it('trunca texto maior que max com "..."', () => {
      const texto = 'A'.repeat(70)
      const resultado = truncarDescricao(texto, 60)
      expect(resultado.length).toBe(60)
      expect(resultado.endsWith('...')).toBe(true)
    })

    it('não trunca texto exatamente no limite', () => {
      const texto = 'A'.repeat(60)
      expect(truncarDescricao(texto, 60)).toBe(texto)
    })

    it('usa max padrão de 60', () => {
      const texto = 'A'.repeat(70)
      expect(truncarDescricao(texto).length).toBe(60)
    })
  })

  // ─── validarTelefone ────────────────────────────────────
  describe('validarTelefone', () => {
    it('aceita telefone com 10 dígitos', () => {
      expect(validarTelefone('1133334444')).toBe(true)
    })

    it('aceita telefone com 11 dígitos', () => {
      expect(validarTelefone('11999998888')).toBe(true)
    })

    it('aceita telefone formatado', () => {
      expect(validarTelefone('(11) 99999-8888')).toBe(true)
    })

    it('rejeita telefone com 9 dígitos', () => {
      expect(validarTelefone('113333444')).toBe(false)
    })

    it('rejeita telefone com 12 dígitos', () => {
      expect(validarTelefone('551199999888')).toBe(false)
    })
  })

  // ─── validarRegraDesconto ───────────────────────────────
  describe('validarRegraDesconto', () => {
    it('aceita dados válidos', () => {
      const result = validarRegraDesconto({ quantidade_minima: 10, desconto_percentual: 5 })
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('rejeita quantidade_minima < 2', () => {
      const result = validarRegraDesconto({ quantidade_minima: 1, desconto_percentual: 5 })
      expect(result.valid).toBe(false)
      expect(result.errors.quantidade_minima).toBeDefined()
    })

    it('rejeita quantidade_minima decimal', () => {
      const result = validarRegraDesconto({ quantidade_minima: 10.5, desconto_percentual: 5 })
      expect(result.valid).toBe(false)
      expect(result.errors.quantidade_minima).toBeDefined()
    })

    it('rejeita desconto_percentual > 99.99', () => {
      const result = validarRegraDesconto({ quantidade_minima: 10, desconto_percentual: 100 })
      expect(result.valid).toBe(false)
      expect(result.errors.desconto_percentual).toBeDefined()
    })

    it('rejeita campos null', () => {
      const result = validarRegraDesconto({ quantidade_minima: null, desconto_percentual: null })
      expect(result.valid).toBe(false)
      expect(Object.keys(result.errors).length).toBe(2)
    })
  })

  // ─── detectarSobreposicao ───────────────────────────────
  describe('detectarSobreposicao', () => {
    const regras = [{ quantidade_minima: 10 }, { quantidade_minima: 50 }]

    it('detecta sobreposição existente', () => {
      expect(detectarSobreposicao(regras, 10)).toBe(true)
    })

    it('não detecta quando não há sobreposição', () => {
      expect(detectarSobreposicao(regras, 20)).toBe(false)
    })

    it('retorna false para lista vazia', () => {
      expect(detectarSobreposicao([], 10)).toBe(false)
    })
  })

  // ─── calcularKPIs ───────────────────────────────────────
  describe('calcularKPIs', () => {
    const now = new Date('2024-06-15T12:00:00Z')

    it('calcula KPIs corretamente', () => {
      const orcamentos = [
        { status_pedido: 'orcamento_enviado', data_validade: '2024-06-20', valor_total: 100, data_criacao: '2024-06-01' },
        { status_pedido: 'orcamento_enviado', data_validade: '2024-06-10', valor_total: 200, data_criacao: '2024-06-02' },
        { status_pedido: 'aprovado', data_validade: '2024-06-20', valor_total: 300, data_criacao: '2024-06-05' },
      ]
      const kpis = calcularKPIs(orcamentos, now)
      expect(kpis.pendentes).toBe(1)
      expect(kpis.vencidos).toBe(1)
      expect(kpis.valorAprovadosMes).toBe(300)
      // totalMes = 2 (June 1 + June 10), aprovadosMes = 1 (approved June 5)
      // taxaConversao = (1/2) * 100 = 50
      expect(kpis.taxaConversao).toBeCloseTo(50, 1)
    })

    it('retorna zeros para lista vazia', () => {
      const kpis = calcularKPIs([], now)
      expect(kpis.pendentes).toBe(0)
      expect(kpis.vencidos).toBe(0)
      expect(kpis.valorAprovadosMes).toBe(0)
      expect(kpis.taxaConversao).toBe(0)
    })
  })

  // ─── filtrarOrcamentos ──────────────────────────────────
  describe('filtrarOrcamentos', () => {
    const now = new Date('2024-06-15T12:00:00Z')
    const orcamentos = [
      { status_pedido: 'orcamento_enviado', data_validade: '2024-06-20', valor_total: 100, data_criacao: '2024-06-01', nome_cliente: 'João Silva' },
      { status_pedido: 'aprovado', data_validade: '2024-06-20', valor_total: 200, data_criacao: '2024-06-10', nome_cliente: 'Maria Santos' },
      { status_pedido: 'orcamento_enviado', data_validade: '2024-06-10', valor_total: 150, data_criacao: '2024-05-20', nome_cliente: 'Pedro Oliveira' },
    ]

    it('filtra por status', () => {
      const result = filtrarOrcamentos(orcamentos, { status: 'aprovado' }, now)
      expect(result).toHaveLength(1)
      expect(result[0].nome_cliente).toBe('Maria Santos')
    })

    it('filtra por nome do cliente', () => {
      const result = filtrarOrcamentos(orcamentos, { nomeCliente: 'João' }, now)
      expect(result).toHaveLength(1)
      expect(result[0].nome_cliente).toBe('João Silva')
    })

    it('filtra por data início', () => {
      const result = filtrarOrcamentos(orcamentos, { dataInicio: '2024-06-05' }, now)
      expect(result).toHaveLength(1)
      expect(result[0].nome_cliente).toBe('Maria Santos')
    })

    it('retorna todos quando filtros vazios', () => {
      const result = filtrarOrcamentos(orcamentos, {}, now)
      expect(result).toHaveLength(3)
    })

    it('ignora filtro de nome com menos de 3 caracteres', () => {
      const result = filtrarOrcamentos(orcamentos, { nomeCliente: 'Jo' }, now)
      expect(result).toHaveLength(3)
    })
  })

  // ─── calcularAreaItem ───────────────────────────────────
  describe('calcularAreaItem', () => {
    it('calcula area em m² corretamente: (largura × altura × quantidade) / 10000', () => {
      // 100cm × 50cm × 2 = 10000 / 10000 = 1 m²
      expect(calcularAreaItem(100, 50, 2)).toBe(1)
    })

    it('calcula area para dimensões fracionárias', () => {
      // 150cm × 200cm × 1 = 30000 / 10000 = 3 m²
      expect(calcularAreaItem(150, 200, 1)).toBe(3)
    })

    it('retorna 0 quando largura é 0', () => {
      expect(calcularAreaItem(0, 100, 5)).toBe(0)
    })

    it('retorna 0 quando altura é 0', () => {
      expect(calcularAreaItem(100, 0, 5)).toBe(0)
    })

    it('retorna 0 quando quantidade é 0', () => {
      expect(calcularAreaItem(100, 50, 0)).toBe(0)
    })

    it('multiplica pela quantidade corretamente', () => {
      // 100cm × 100cm × 3 = 30000 / 10000 = 3 m²
      expect(calcularAreaItem(100, 100, 3)).toBe(3)
    })
  })

  // ─── calcularValorItem ──────────────────────────────────
  describe('calcularValorItem', () => {
    it('calcula valor por m²: (largura × altura × qtd) / 10000 × preco_m2', () => {
      const item: ItemOrcamento = {
        descricao: 'Adesivo vinílico',
        material_id: 1,
        largura_cm: 100,
        altura_cm: 200,
        quantidade: 2,
        modalidade_preco: 'm2',
        preco_m2: 50,
        valor_item: 0,
      }
      // (100 × 200 × 2) / 10000 × 50 = 4 × 50 = 200
      expect(calcularValorItem(item)).toBe(200)
    })

    it('calcula valor por unidade: preco_unitario × quantidade', () => {
      const item: ItemOrcamento = {
        descricao: 'Adesivo recortado',
        material_id: 2,
        largura_cm: 50,
        altura_cm: 30,
        quantidade: 10,
        modalidade_preco: 'unidade',
        preco_unitario: 15,
        valor_item: 0,
      }
      expect(calcularValorItem(item)).toBe(150)
    })

    it('retorna 0 quando preco_m2 não informado (modalidade m2)', () => {
      const item: ItemOrcamento = {
        descricao: 'Adesivo',
        material_id: 1,
        largura_cm: 100,
        altura_cm: 100,
        quantidade: 1,
        modalidade_preco: 'm2',
        valor_item: 0,
      }
      expect(calcularValorItem(item)).toBe(0)
    })

    it('retorna 0 quando preco_unitario não informado (modalidade unidade)', () => {
      const item: ItemOrcamento = {
        descricao: 'Adesivo',
        material_id: 1,
        largura_cm: 100,
        altura_cm: 100,
        quantidade: 5,
        modalidade_preco: 'unidade',
        valor_item: 0,
      }
      expect(calcularValorItem(item)).toBe(0)
    })
  })

  // ─── calcularTotalItens ─────────────────────────────────
  describe('calcularTotalItens', () => {
    it('soma todos os valor_item dos itens', () => {
      const itens: ItemOrcamento[] = [
        { descricao: 'Item 1', material_id: 1, largura_cm: 100, altura_cm: 100, quantidade: 1, modalidade_preco: 'm2', valor_item: 100 },
        { descricao: 'Item 2', material_id: 2, largura_cm: 50, altura_cm: 50, quantidade: 2, modalidade_preco: 'unidade', valor_item: 75 },
        { descricao: 'Item 3', material_id: 3, largura_cm: 200, altura_cm: 100, quantidade: 1, modalidade_preco: 'm2', valor_item: 200 },
      ]
      expect(calcularTotalItens(itens)).toBe(375)
    })

    it('retorna 0 para lista vazia', () => {
      expect(calcularTotalItens([])).toBe(0)
    })

    it('funciona com um único item', () => {
      const itens: ItemOrcamento[] = [
        { descricao: 'Item único', material_id: 1, largura_cm: 100, altura_cm: 100, quantidade: 1, modalidade_preco: 'm2', valor_item: 250 },
      ]
      expect(calcularTotalItens(itens)).toBe(250)
    })
  })

  // ─── calcularQuantidadeTotal ────────────────────────────
  describe('calcularQuantidadeTotal', () => {
    it('soma todas as quantidades', () => {
      const itens: ItemOrcamento[] = [
        { descricao: 'Item 1', material_id: 1, largura_cm: 100, altura_cm: 100, quantidade: 5, modalidade_preco: 'm2', valor_item: 100 },
        { descricao: 'Item 2', material_id: 2, largura_cm: 50, altura_cm: 50, quantidade: 10, modalidade_preco: 'unidade', valor_item: 75 },
        { descricao: 'Item 3', material_id: 3, largura_cm: 200, altura_cm: 100, quantidade: 3, modalidade_preco: 'm2', valor_item: 200 },
      ]
      expect(calcularQuantidadeTotal(itens)).toBe(18)
    })

    it('retorna 0 para lista vazia', () => {
      expect(calcularQuantidadeTotal([])).toBe(0)
    })

    it('funciona com um único item', () => {
      const itens: ItemOrcamento[] = [
        { descricao: 'Item único', material_id: 1, largura_cm: 100, altura_cm: 100, quantidade: 7, modalidade_preco: 'm2', valor_item: 250 },
      ]
      expect(calcularQuantidadeTotal(itens)).toBe(7)
    })
  })

  // ─── gerarNumeroOrcamento ───────────────────────────────
  describe('gerarNumeroOrcamento', () => {
    it('gera formato ORC-N onde N = ultimoNumero + 1', () => {
      expect(gerarNumeroOrcamento(0)).toBe('ORC-1')
    })

    it('incrementa corretamente a partir de número existente', () => {
      expect(gerarNumeroOrcamento(5)).toBe('ORC-6')
    })

    it('funciona com números grandes', () => {
      expect(gerarNumeroOrcamento(999)).toBe('ORC-1000')
    })
  })

  // ─── classificarStatusOrcamentoV2 ──────────────────────
  describe('classificarStatusOrcamentoV2', () => {
    const now = new Date('2024-06-15T12:00:00Z')

    it('retorna vencido (cor red) para status enviado com data expirada', () => {
      const result = classificarStatusOrcamentoV2('enviado', '2024-06-10', now)
      expect(result).toEqual({ status: 'vencido', label: 'Vencido', cor: 'red' })
    })

    it('retorna rascunho com cor gray', () => {
      const result = classificarStatusOrcamentoV2('rascunho', '2024-06-20', now)
      expect(result).toEqual({ status: 'rascunho', label: 'Rascunho', cor: 'gray' })
    })

    it('retorna enviado com cor blue quando não vencido', () => {
      const result = classificarStatusOrcamentoV2('enviado', '2024-06-20', now)
      expect(result).toEqual({ status: 'enviado', label: 'Enviado', cor: 'blue' })
    })

    it('retorna aprovado com cor green', () => {
      const result = classificarStatusOrcamentoV2('aprovado', '2024-06-20', now)
      expect(result).toEqual({ status: 'aprovado', label: 'Aprovado', cor: 'green' })
    })

    it('retorna rejeitado com cor red', () => {
      const result = classificarStatusOrcamentoV2('rejeitado', '2024-06-20', now)
      expect(result).toEqual({ status: 'rejeitado', label: 'Rejeitado', cor: 'red' })
    })

    it('retorna vencido (cor orange) quando status já é vencido no DB', () => {
      const result = classificarStatusOrcamentoV2('vencido', '2024-06-20', now)
      expect(result).toEqual({ status: 'vencido', label: 'Vencido', cor: 'orange' })
    })

    it('aceita Date object como dataValidade', () => {
      const result = classificarStatusOrcamentoV2('enviado', new Date('2024-06-10'), now)
      expect(result.status).toBe('vencido')
    })

    it('usa Date atual se now não fornecido', () => {
      // Data no futuro distante - não deve estar vencido
      const result = classificarStatusOrcamentoV2('enviado', '2099-12-31')
      expect(result.status).toBe('enviado')
    })
  })

  // ─── validarOrcamento ───────────────────────────────────
  describe('validarOrcamento', () => {
    const itemValido: ItemOrcamento = {
      descricao: 'Adesivo vinílico',
      material_id: 1,
      largura_cm: 100,
      altura_cm: 50,
      quantidade: 2,
      modalidade_preco: 'm2',
      valor_item: 150,
    }

    it('aceita orçamento válido com todos os campos corretos', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        valor_mao_obra: 50,
        itens: [itemValido],
      })
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('rejeita quando cliente_id ausente', () => {
      const result = validarOrcamento({
        cliente_id: null,
        validade_dias: 15,
        itens: [itemValido],
      })
      expect(result.valid).toBe(false)
      expect(result.errors.cliente_id).toBeDefined()
    })

    it('rejeita quando cliente_id <= 0', () => {
      const result = validarOrcamento({
        cliente_id: 0,
        validade_dias: 15,
        itens: [itemValido],
      })
      expect(result.valid).toBe(false)
      expect(result.errors.cliente_id).toBeDefined()
    })

    it('rejeita quando validade_dias ausente', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: null,
        itens: [itemValido],
      })
      expect(result.valid).toBe(false)
      expect(result.errors.validade_dias).toBeDefined()
    })

    it('rejeita quando validade_dias <= 0', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 0,
        itens: [itemValido],
      })
      expect(result.valid).toBe(false)
      expect(result.errors.validade_dias).toBeDefined()
    })

    it('rejeita quando itens array está vazio', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        itens: [],
      })
      expect(result.valid).toBe(false)
      expect(result.errors.itens).toBeDefined()
    })

    it('rejeita item com descrição vazia', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        itens: [{ ...itemValido, descricao: '' }],
      })
      expect(result.valid).toBe(false)
      expect(result.errors['itens[0].descricao']).toBeDefined()
    })

    it('rejeita item com material_id <= 0', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        itens: [{ ...itemValido, material_id: 0 }],
      })
      expect(result.valid).toBe(false)
      expect(result.errors['itens[0].material_id']).toBeDefined()
    })

    it('rejeita item com largura_cm fora do range', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        itens: [{ ...itemValido, largura_cm: 10000 }],
      })
      expect(result.valid).toBe(false)
      expect(result.errors['itens[0].largura_cm']).toBeDefined()
    })

    it('rejeita item com altura_cm fora do range', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        itens: [{ ...itemValido, altura_cm: 0 }],
      })
      expect(result.valid).toBe(false)
      expect(result.errors['itens[0].altura_cm']).toBeDefined()
    })

    it('rejeita item com quantidade fora do range', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        itens: [{ ...itemValido, quantidade: 100000 }],
      })
      expect(result.valid).toBe(false)
      expect(result.errors['itens[0].quantidade']).toBeDefined()
    })

    it('rejeita item com valor_item <= 0', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        itens: [{ ...itemValido, valor_item: 0 }],
      })
      expect(result.valid).toBe(false)
      expect(result.errors['itens[0].valor_item']).toBeDefined()
    })

    it('rejeita quando valor total (itens + mao_obra - descontos) <= 0', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        valor_mao_obra: 0,
        desconto_valor: 200,
        itens: [{ ...itemValido, valor_item: 100 }],
      })
      expect(result.valid).toBe(false)
      expect(result.errors.valor_total).toBeDefined()
    })

    it('aceita quando valor total é positivo após descontos', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        valor_mao_obra: 50,
        desconto_percentual: 10,
        desconto_valor: 5,
        itens: [{ ...itemValido, valor_item: 100 }],
      })
      expect(result.valid).toBe(true)
    })

    it('valida múltiplos itens e reporta erros individuais', () => {
      const result = validarOrcamento({
        cliente_id: 1,
        validade_dias: 15,
        itens: [
          itemValido,
          { ...itemValido, descricao: '', material_id: 0 },
        ],
      })
      expect(result.valid).toBe(false)
      expect(result.errors['itens[1].descricao']).toBeDefined()
      expect(result.errors['itens[1].material_id']).toBeDefined()
    })
  })

  // ─── validarArquivoUpload ───────────────────────────────
  describe('validarArquivoUpload', () => {
    const tiposAceitos = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5 MB

    it('aceita arquivo com tipo e tamanho válidos', () => {
      const result = validarArquivoUpload({ type: 'image/jpeg', size: 1024 }, tiposAceitos, maxSize)
      expect(result.valido).toBe(true)
      expect(result.erro).toBeUndefined()
    })

    it('rejeita arquivo com tipo não suportado', () => {
      const result = validarArquivoUpload({ type: 'image/gif', size: 1024 }, tiposAceitos, maxSize)
      expect(result.valido).toBe(false)
      expect(result.erro).toBeDefined()
    })

    it('rejeita arquivo que excede tamanho máximo', () => {
      const result = validarArquivoUpload({ type: 'image/png', size: 6 * 1024 * 1024 }, tiposAceitos, maxSize)
      expect(result.valido).toBe(false)
      expect(result.erro).toBeDefined()
    })

    it('aceita arquivo exatamente no tamanho máximo', () => {
      const result = validarArquivoUpload({ type: 'image/webp', size: maxSize }, tiposAceitos, maxSize)
      expect(result.valido).toBe(true)
    })

    it('rejeita PDF quando não está na lista aceita', () => {
      const result = validarArquivoUpload({ type: 'application/pdf', size: 1024 }, tiposAceitos, maxSize)
      expect(result.valido).toBe(false)
    })

    it('aceita PDF quando está na lista aceita', () => {
      const tiposComPdf = [...tiposAceitos, 'application/pdf']
      const result = validarArquivoUpload({ type: 'application/pdf', size: 1024 }, tiposComPdf, 10 * 1024 * 1024)
      expect(result.valido).toBe(true)
    })
  })

  // ─── validarPrecoM2 ────────────────────────────────────
  describe('validarPrecoM2', () => {
    it('aceita valor dentro do range (0.01)', () => {
      const result = validarPrecoM2(0.01)
      expect(result.valid).toBe(true)
    })

    it('aceita valor dentro do range (9999.99)', () => {
      const result = validarPrecoM2(9999.99)
      expect(result.valid).toBe(true)
    })

    it('aceita valor intermediário', () => {
      const result = validarPrecoM2(50.5)
      expect(result.valid).toBe(true)
    })

    it('rejeita valor abaixo do mínimo', () => {
      const result = validarPrecoM2(0.009)
      expect(result.valid).toBe(false)
    })

    it('rejeita valor acima do máximo', () => {
      const result = validarPrecoM2(10000)
      expect(result.valid).toBe(false)
    })

    it('rejeita null', () => {
      const result = validarPrecoM2(null)
      expect(result.valid).toBe(false)
    })

    it('rejeita undefined', () => {
      const result = validarPrecoM2(undefined)
      expect(result.valid).toBe(false)
    })

    it('rejeita zero', () => {
      const result = validarPrecoM2(0)
      expect(result.valid).toBe(false)
    })
  })

  // ─── isPrecoOverride ───────────────────────────────────
  describe('isPrecoOverride', () => {
    it('retorna true quando preços são diferentes', () => {
      expect(isPrecoOverride(55, 50)).toBe(true)
    })

    it('retorna false quando preços são iguais', () => {
      expect(isPrecoOverride(50, 50)).toBe(false)
    })

    it('retorna true para diferença decimal', () => {
      expect(isPrecoOverride(50.01, 50.00)).toBe(true)
    })
  })

  // ─── gerarPathFotoLocal ────────────────────────────────
  describe('gerarPathFotoLocal', () => {
    it('gera path no formato correto com itemId', () => {
      expect(gerarPathFotoLocal(1, 42, '99', 'jpg')).toBe('1/42/itens/99/local-instalacao.jpg')
    })

    it('funciona com extensão png', () => {
      expect(gerarPathFotoLocal(5, 100, '55', 'png')).toBe('5/100/itens/55/local-instalacao.png')
    })

    it('funciona com extensão webp', () => {
      expect(gerarPathFotoLocal(3, 7, 'abc', 'webp')).toBe('3/7/itens/abc/local-instalacao.webp')
    })
  })

  // ─── gerarPathFotoArte ─────────────────────────────────
  describe('gerarPathFotoArte', () => {
    it('gera path no formato correto', () => {
      expect(gerarPathFotoArte(1, 42, '99', 'jpg')).toBe('1/42/itens/99/arte.jpg')
    })

    it('funciona com extensão pdf', () => {
      expect(gerarPathFotoArte(5, 100, 'abc', 'pdf')).toBe('5/100/itens/abc/arte.pdf')
    })

    it('funciona com itemId string qualquer', () => {
      expect(gerarPathFotoArte(2, 10, 'novo-item', 'webp')).toBe('2/10/itens/novo-item/arte.webp')
    })
  })

  // ─── mapearItensParaOS ─────────────────────────────────
  describe('mapearItensParaOS', () => {
    it('mapeia itens preservando foto_arte_url e foto_local_url', () => {
      const itens: ItemOrcamentoCompleto[] = [
        {
          id: 1,
          descricao: 'Adesivo A',
          material_id: 10,
          largura_cm: 100,
          altura_cm: 50,
          quantidade: 2,
          modalidade_preco: 'm2',
          valor_item: 200,
          foto_arte_url: 'https://storage.com/foto1.jpg',
          foto_local_url: 'https://storage.com/local1.jpg',
        },
        {
          id: 2,
          descricao: 'Adesivo B',
          material_id: 20,
          largura_cm: 80,
          altura_cm: 40,
          quantidade: 5,
          modalidade_preco: 'unidade',
          valor_item: 150,
          foto_arte_url: null,
          foto_local_url: null,
        },
      ]

      const result = mapearItensParaOS(itens, 77)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        ordem_servico_id: 77,
        item_orcamento_id: 1,
        descricao: 'Adesivo A',
        material_id: 10,
        largura_cm: 100,
        altura_cm: 50,
        quantidade: 2,
        valor_item: 200,
        foto_arte_url: 'https://storage.com/foto1.jpg',
        foto_local_url: 'https://storage.com/local1.jpg',
      })
      expect(result[1].foto_arte_url).toBeNull()
      expect(result[1].foto_local_url).toBeNull()
      expect(result[1].ordem_servico_id).toBe(77)
    })

    it('retorna array vazio para lista vazia de itens', () => {
      expect(mapearItensParaOS([], 5)).toEqual([])
    })

    it('propaga foto_arte_url e foto_local_url corretamente para cada item', () => {
      const itens: ItemOrcamentoCompleto[] = [
        {
          id: 10,
          descricao: 'Item com arte',
          material_id: 1,
          largura_cm: 50,
          altura_cm: 50,
          quantidade: 1,
          modalidade_preco: 'm2',
          valor_item: 25,
          foto_arte_url: 'https://storage.com/arte.png',
          foto_local_url: 'https://storage.com/local.png',
        },
      ]

      const result = mapearItensParaOS(itens, 3)
      expect(result[0].foto_arte_url).toBe('https://storage.com/arte.png')
      expect(result[0].foto_local_url).toBe('https://storage.com/local.png')
    })
  })
})
