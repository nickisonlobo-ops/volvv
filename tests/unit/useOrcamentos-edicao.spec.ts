import { describe, it, expect } from 'vitest'
import { useOrcamentos } from '../../app/composables/useOrcamentos'
import type { ItemOrcamento, ItemOrcamentoCompleto } from '../../app/composables/useOrcamentos'

describe('useOrcamentos - edição', () => {
  const { isStatusEditavel, calcularDiffItens } = useOrcamentos()

  // ─── isStatusEditavel ───────────────────────────────────
  describe('isStatusEditavel', () => {
    it('retorna true para status "rascunho"', () => {
      expect(isStatusEditavel('rascunho')).toBe(true)
    })

    it('retorna true para status "enviado"', () => {
      expect(isStatusEditavel('enviado')).toBe(true)
    })

    it('retorna false para status "aprovado"', () => {
      expect(isStatusEditavel('aprovado')).toBe(false)
    })

    it('retorna false para status "rejeitado"', () => {
      expect(isStatusEditavel('rejeitado')).toBe(false)
    })

    it('retorna false para status "vencido"', () => {
      expect(isStatusEditavel('vencido')).toBe(false)
    })

    it('retorna false para string vazia', () => {
      expect(isStatusEditavel('')).toBe(false)
    })

    it('retorna false para status desconhecido', () => {
      expect(isStatusEditavel('em_producao')).toBe(false)
    })
  })

  // ─── calcularDiffItens ─────────────────────────────────
  describe('calcularDiffItens', () => {
    const itemBase: ItemOrcamentoCompleto = {
      id: 1,
      descricao: 'Adesivo vinílico',
      material_id: 1,
      largura_cm: 100,
      altura_cm: 50,
      quantidade: 2,
      modalidade_preco: 'm2',
      preco_m2: 50,
      valor_item: 100,
      foto_arte_url: null,
    }

    it('identifica itens novos (sem id) como inserir', () => {
      const originais: ItemOrcamentoCompleto[] = [itemBase]
      const atuais: ItemOrcamento[] = [
        { ...itemBase, id: 1 },
        { descricao: 'Novo item', material_id: 2, largura_cm: 50, altura_cm: 50, quantidade: 1, modalidade_preco: 'unidade', preco_unitario: 20, valor_item: 20 },
      ]

      const diff = calcularDiffItens(originais, atuais)
      expect(diff.inserir).toHaveLength(1)
      expect(diff.inserir[0].descricao).toBe('Novo item')
      expect(diff.atualizar).toHaveLength(1)
      expect(diff.deletar).toHaveLength(0)
    })

    it('identifica itens removidos como deletar', () => {
      const originais: ItemOrcamentoCompleto[] = [
        { ...itemBase, id: 1 },
        { ...itemBase, id: 2, descricao: 'Item 2' },
      ]
      const atuais: ItemOrcamento[] = [
        { ...itemBase, id: 1 },
      ]

      const diff = calcularDiffItens(originais, atuais)
      expect(diff.inserir).toHaveLength(0)
      expect(diff.atualizar).toHaveLength(1)
      expect(diff.deletar).toEqual([2])
    })

    it('identifica itens existentes como atualizar', () => {
      const originais: ItemOrcamentoCompleto[] = [itemBase]
      const atuais: ItemOrcamento[] = [
        { ...itemBase, id: 1, descricao: 'Adesivo modificado', quantidade: 5 },
      ]

      const diff = calcularDiffItens(originais, atuais)
      expect(diff.inserir).toHaveLength(0)
      expect(diff.atualizar).toHaveLength(1)
      expect(diff.atualizar[0].descricao).toBe('Adesivo modificado')
      expect(diff.deletar).toHaveLength(0)
    })

    it('lida com combinação de inserir, atualizar e deletar', () => {
      const originais: ItemOrcamentoCompleto[] = [
        { ...itemBase, id: 1 },
        { ...itemBase, id: 2, descricao: 'Item para deletar' },
        { ...itemBase, id: 3, descricao: 'Item para atualizar' },
      ]
      const atuais: ItemOrcamento[] = [
        { ...itemBase, id: 1, descricao: 'Item 1 atualizado' },
        { ...itemBase, id: 3, descricao: 'Item 3 atualizado' },
        { descricao: 'Item novo', material_id: 5, largura_cm: 30, altura_cm: 40, quantidade: 1, modalidade_preco: 'unidade', preco_unitario: 10, valor_item: 10 },
      ]

      const diff = calcularDiffItens(originais, atuais)
      expect(diff.inserir).toHaveLength(1)
      expect(diff.inserir[0].descricao).toBe('Item novo')
      expect(diff.atualizar).toHaveLength(2)
      expect(diff.deletar).toEqual([2])
    })

    it('retorna tudo vazio quando não há mudanças', () => {
      const originais: ItemOrcamentoCompleto[] = [itemBase]
      const atuais: ItemOrcamento[] = [{ ...itemBase, id: 1 }]

      const diff = calcularDiffItens(originais, atuais)
      expect(diff.inserir).toHaveLength(0)
      expect(diff.atualizar).toHaveLength(1)
      expect(diff.deletar).toHaveLength(0)
    })

    it('lida com listas vazias', () => {
      const diff = calcularDiffItens([], [])
      expect(diff.inserir).toHaveLength(0)
      expect(diff.atualizar).toHaveLength(0)
      expect(diff.deletar).toHaveLength(0)
    })

    it('todos originais deletados quando atuais está vazio', () => {
      const originais: ItemOrcamentoCompleto[] = [
        { ...itemBase, id: 1 },
        { ...itemBase, id: 2 },
      ]

      const diff = calcularDiffItens(originais, [])
      expect(diff.inserir).toHaveLength(0)
      expect(diff.atualizar).toHaveLength(0)
      expect(diff.deletar).toEqual([1, 2])
    })

    it('todos novos quando originais está vazio', () => {
      const atuais: ItemOrcamento[] = [
        { descricao: 'Novo 1', material_id: 1, largura_cm: 100, altura_cm: 50, quantidade: 1, modalidade_preco: 'm2', valor_item: 50 },
        { descricao: 'Novo 2', material_id: 2, largura_cm: 50, altura_cm: 30, quantidade: 2, modalidade_preco: 'unidade', valor_item: 30 },
      ]

      const diff = calcularDiffItens([], atuais)
      expect(diff.inserir).toHaveLength(2)
      expect(diff.atualizar).toHaveLength(0)
      expect(diff.deletar).toHaveLength(0)
    })
  })
})
