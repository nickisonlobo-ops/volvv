import { describe, it, expect } from 'vitest'
import { useAdesivos } from '../../app/composables/useAdesivos'

describe('useAdesivos', () => {
  const {
    calcularArea,
    calcularOrcamento,
    calcularTotalCarrinho,
    statusLabels,
    statusColors,
    transicoesValidas,
    podeTransitar,
    classificarUrgencia,
    validarMaterial,
    validarProdutoCatalogo,
    validarPedidoEncomenda,
    validarArquivoArte,
    validarImagemProduto,
  } = useAdesivos()

  // ─────────────────────────────────────────────
  // calcularArea
  // ─────────────────────────────────────────────
  describe('calcularArea', () => {
    it('calcula área corretamente para 100cm x 100cm x 1 = 1 m²', () => {
      expect(calcularArea(100, 100, 1)).toBe(1)
    })

    it('calcula área com quantidade > 1', () => {
      expect(calcularArea(50, 50, 4)).toBe(1)
    })

    it('calcula área com valores decimais', () => {
      expect(calcularArea(30, 20, 2)).toBeCloseTo(0.12, 4)
    })
  })

  // ─────────────────────────────────────────────
  // calcularOrcamento
  // ─────────────────────────────────────────────
  describe('calcularOrcamento', () => {
    it('calcula sem desconto', () => {
      // area=2, precoM2=50, maoObra=30, descPerc=0, descValor=0
      expect(calcularOrcamento(2, 50, 30, 0, 0)).toBe(130)
    })

    it('aplica desconto percentual', () => {
      // subtotal=130, 10% = 13, total=117
      expect(calcularOrcamento(2, 50, 30, 10, 0)).toBe(117)
    })

    it('aplica desconto em valor fixo', () => {
      // subtotal=130, -20 = 110
      expect(calcularOrcamento(2, 50, 30, 0, 20)).toBe(110)
    })

    it('aplica ambos os descontos', () => {
      // subtotal=130, 10%=13, -5valor, total=112
      expect(calcularOrcamento(2, 50, 30, 10, 5)).toBe(112)
    })

    it('retorna valor mínimo de 0.01 quando desconto excede subtotal', () => {
      expect(calcularOrcamento(1, 10, 0, 0, 100)).toBe(0.01)
    })
  })

  // ─────────────────────────────────────────────
  // calcularTotalCarrinho
  // ─────────────────────────────────────────────
  describe('calcularTotalCarrinho', () => {
    it('calcula total com múltiplos itens', () => {
      const itens = [
        { preco: 25, quantidade: 2 },
        { preco: 10, quantidade: 3 },
      ]
      expect(calcularTotalCarrinho(itens)).toBe(80)
    })

    it('retorna 0 para carrinho vazio', () => {
      expect(calcularTotalCarrinho([])).toBe(0)
    })

    it('calcula com item único', () => {
      expect(calcularTotalCarrinho([{ preco: 99.99, quantidade: 1 }])).toBeCloseTo(99.99)
    })
  })

  // ─────────────────────────────────────────────
  // Status machine
  // ─────────────────────────────────────────────
  describe('statusLabels', () => {
    it('contém todos os 7 status', () => {
      expect(Object.keys(statusLabels)).toHaveLength(7)
    })
  })

  describe('statusColors', () => {
    it('contém cor para cada status', () => {
      expect(Object.keys(statusColors)).toHaveLength(7)
    })
  })

  describe('podeTransitar', () => {
    it('permite novo → orcamento_enviado', () => {
      expect(podeTransitar('novo', 'orcamento_enviado')).toBe(true)
    })

    it('permite novo → cancelado', () => {
      expect(podeTransitar('novo', 'cancelado')).toBe(true)
    })

    it('não permite novo → aprovado', () => {
      expect(podeTransitar('novo', 'aprovado')).toBe(false)
    })

    it('não permite entregue → qualquer status', () => {
      expect(podeTransitar('entregue', 'cancelado')).toBe(false)
    })

    it('não permite cancelado → qualquer status', () => {
      expect(podeTransitar('cancelado', 'novo')).toBe(false)
    })

    it('retorna false para status inexistente', () => {
      expect(podeTransitar('inexistente', 'novo')).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // classificarUrgencia
  // ─────────────────────────────────────────────
  describe('classificarUrgencia', () => {
    const now = new Date('2024-06-15T12:00:00Z')

    it('retorna null quando prazo é null', () => {
      expect(classificarUrgencia(null, now)).toBe(null)
    })

    it('retorna overdue quando prazo já passou', () => {
      const prazo = new Date('2024-06-14T12:00:00Z')
      expect(classificarUrgencia(prazo, now)).toBe('overdue')
    })

    it('retorna urgent quando falta menos de 24h', () => {
      const prazo = new Date('2024-06-16T10:00:00Z') // 22h restantes
      expect(classificarUrgencia(prazo, now)).toBe('urgent')
    })

    it('retorna normal quando faltam mais de 24h', () => {
      const prazo = new Date('2024-06-17T12:00:00Z') // 48h restantes
      expect(classificarUrgencia(prazo, now)).toBe('normal')
    })

    it('aceita string ISO como prazo', () => {
      expect(classificarUrgencia('2024-06-14T00:00:00Z', now)).toBe('overdue')
    })
  })

  // ─────────────────────────────────────────────
  // validarMaterial
  // ─────────────────────────────────────────────
  describe('validarMaterial', () => {
    it('retorna valid para dados corretos', () => {
      const result = validarMaterial({ nome: 'Vinil Adesivo', preco_m2: 25.5 })
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('reporta nome vazio e preço ausente', () => {
      const result = validarMaterial({ nome: '', preco_m2: null })
      expect(result.valid).toBe(false)
      expect(result.errors.nome).toBeDefined()
      expect(result.errors.preco_m2).toBeDefined()
    })

    it('reporta nome muito longo', () => {
      const result = validarMaterial({ nome: 'a'.repeat(101), preco_m2: 10 })
      expect(result.valid).toBe(false)
      expect(result.errors.nome).toBeDefined()
    })

    it('reporta preço fora dos limites', () => {
      const result = validarMaterial({ nome: 'Vinil', preco_m2: 100000 })
      expect(result.valid).toBe(false)
      expect(result.errors.preco_m2).toBeDefined()
    })
  })

  // ─────────────────────────────────────────────
  // validarProdutoCatalogo
  // ─────────────────────────────────────────────
  describe('validarProdutoCatalogo', () => {
    it('retorna valid para produto completo', () => {
      const result = validarProdutoCatalogo({
        nome: 'Adesivo Floral',
        categoria: 'Decoração',
        material_id: 1,
        largura_cm: 30,
        altura_cm: 20,
        preco_venda: 15.99,
      })
      expect(result.valid).toBe(true)
    })

    it('reporta todos os campos obrigatórios ausentes', () => {
      const result = validarProdutoCatalogo({})
      expect(result.valid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(5)
    })

    it('valida limites de dimensões do catálogo (0.1–500)', () => {
      const result = validarProdutoCatalogo({
        nome: 'Teste',
        categoria: 'Cat',
        material_id: 1,
        largura_cm: 501,
        altura_cm: 0,
        preco_venda: 10,
      })
      expect(result.errors.largura_cm).toBeDefined()
      expect(result.errors.altura_cm).toBeDefined()
    })
  })

  // ─────────────────────────────────────────────
  // validarPedidoEncomenda
  // ─────────────────────────────────────────────
  describe('validarPedidoEncomenda', () => {
    it('retorna valid para pedido completo', () => {
      const result = validarPedidoEncomenda({
        cliente_id: 1,
        descricao: 'Adesivo para carro',
        largura_cm: 100,
        altura_cm: 50,
        material_id: 2,
        quantidade: 3,
      })
      expect(result.valid).toBe(true)
    })

    it('reporta todos os campos obrigatórios ausentes', () => {
      const result = validarPedidoEncomenda({})
      expect(result.valid).toBe(false)
      expect(result.errors.cliente_id).toBeDefined()
      expect(result.errors.descricao).toBeDefined()
      expect(result.errors.largura_cm).toBeDefined()
      expect(result.errors.altura_cm).toBeDefined()
      expect(result.errors.material_id).toBeDefined()
      expect(result.errors.quantidade).toBeDefined()
    })

    it('valida limites de dimensões do pedido (0.1–9999.9)', () => {
      const result = validarPedidoEncomenda({
        cliente_id: 1,
        descricao: 'Teste',
        largura_cm: 10000,
        altura_cm: 0.05,
        material_id: 1,
        quantidade: 1,
      })
      expect(result.errors.largura_cm).toBeDefined()
      expect(result.errors.altura_cm).toBeDefined()
    })

    it('rejeita quantidade não inteira', () => {
      const result = validarPedidoEncomenda({
        cliente_id: 1,
        descricao: 'Teste',
        largura_cm: 10,
        altura_cm: 10,
        material_id: 1,
        quantidade: 2.5,
      })
      expect(result.errors.quantidade).toBeDefined()
    })
  })

  // ─────────────────────────────────────────────
  // validarArquivoArte
  // ─────────────────────────────────────────────
  describe('validarArquivoArte', () => {
    it('aceita PNG de 5MB', () => {
      const result = validarArquivoArte({ name: 'arte.png', size: 5 * 1024 * 1024, type: 'image/png' })
      expect(result.valid).toBe(true)
    })

    it('aceita AI pelo extensão', () => {
      const result = validarArquivoArte({ name: 'logo.ai', size: 10 * 1024 * 1024, type: '' })
      expect(result.valid).toBe(true)
    })

    it('rejeita formato inválido', () => {
      const result = validarArquivoArte({ name: 'doc.docx', size: 1024, type: 'application/vnd.openxmlformats' })
      expect(result.valid).toBe(false)
      expect(result.errors.formato).toBeDefined()
    })

    it('rejeita arquivo > 20MB', () => {
      const result = validarArquivoArte({ name: 'grande.pdf', size: 21 * 1024 * 1024, type: 'application/pdf' })
      expect(result.valid).toBe(false)
      expect(result.errors.tamanho).toBeDefined()
    })

    it('reporta formato e tamanho juntos', () => {
      const result = validarArquivoArte({ name: 'bad.exe', size: 25 * 1024 * 1024, type: 'application/x-exe' })
      expect(result.valid).toBe(false)
      expect(result.errors.formato).toBeDefined()
      expect(result.errors.tamanho).toBeDefined()
    })
  })

  // ─────────────────────────────────────────────
  // validarImagemProduto
  // ─────────────────────────────────────────────
  describe('validarImagemProduto', () => {
    it('aceita WEBP de 3MB', () => {
      const result = validarImagemProduto({ name: 'foto.webp', size: 3 * 1024 * 1024, type: 'image/webp' })
      expect(result.valid).toBe(true)
    })

    it('rejeita SVG (não permitido para imagem de produto)', () => {
      const result = validarImagemProduto({ name: 'icon.svg', size: 1024, type: 'image/svg+xml' })
      expect(result.valid).toBe(false)
      expect(result.errors.formato).toBeDefined()
    })

    it('rejeita imagem > 5MB', () => {
      const result = validarImagemProduto({ name: 'foto.jpg', size: 6 * 1024 * 1024, type: 'image/jpeg' })
      expect(result.valid).toBe(false)
      expect(result.errors.tamanho).toBeDefined()
    })
  })
})
