import { computed } from 'vue'
import { usePersonalizacao } from './usePersonalizacao'

export type PaisCode = 'BR' | 'PT'

export interface LocaleConfig {
  pais: PaisCode
  moeda: string
  simboloMoeda: string
  localeCurrency: string
  localeDate: string
  docFiscalLabel: string
  docFiscalPlaceholder: string
  enderecoPlaceholder: string
  telefonePlaceholder: string
  pixLabel: string
  pixPlaceholder: string
  tipoContaOptions: { value: string; label: string }[]
}

const locales: Record<PaisCode, Omit<LocaleConfig, 'pais'>> = {
  BR: {
    moeda: 'BRL',
    simboloMoeda: 'R$',
    localeCurrency: 'pt-BR',
    localeDate: 'pt-BR',
    docFiscalLabel: 'CNPJ',
    docFiscalPlaceholder: '00.000.000/0000-00',
    enderecoPlaceholder: 'Rua, número, bairro, cidade - UF, CEP',
    telefonePlaceholder: '(11) 99999-9999',
    pixLabel: 'Chave PIX',
    pixPlaceholder: 'CPF, CNPJ, e-mail, telefone ou chave aleatória',
    tipoContaOptions: [
      { value: 'corrente', label: 'Corrente' },
      { value: 'poupanca', label: 'Poupança' },
    ],
  },
  PT: {
    moeda: 'EUR',
    simboloMoeda: '€',
    localeCurrency: 'pt-PT',
    localeDate: 'pt-PT',
    docFiscalLabel: 'NIF',
    docFiscalPlaceholder: '123 456 789',
    enderecoPlaceholder: 'Rua, nº, código postal, localidade',
    telefonePlaceholder: '+351 912 345 678',
    pixLabel: 'IBAN',
    pixPlaceholder: 'PT50 0000 0000 0000 0000 0000 0',
    tipoContaOptions: [
      { value: 'corrente', label: 'Conta à Ordem' },
      { value: 'poupanca', label: 'Conta Poupança' },
    ],
  },
}

export function useLocale() {
  const { config } = usePersonalizacao()

  const pais = computed<PaisCode>(() => {
    return (config.value as any)?.pais === 'PT' ? 'PT' : 'BR'
  })

  const locale = computed<LocaleConfig>(() => ({
    pais: pais.value,
    ...locales[pais.value],
  }))

  function formatCurrency(value: number | null | undefined): string {
    if (value == null) return locale.value.simboloMoeda + ' 0,00'
    return new Intl.NumberFormat(locale.value.localeCurrency, {
      style: 'currency',
      currency: locale.value.moeda,
      minimumFractionDigits: 2,
    }).format(value)
  }

  // Aplica IVA 23% ao valor se empresa PT (para exibição de totais ao cliente)
  function valorComIva(value: number | null | undefined): number {
    if (value == null) return 0
    return pais.value === 'PT' ? value * 1.23 : value
  }

  // Calcula valor do IVA
  function ivaValor(value: number | null | undefined): number {
    if (value == null) return 0
    return pais.value === 'PT' ? value * 0.23 : 0
  }

  function formatDate(date: string | null | undefined): string {
    if (!date) return '—'
    return new Intl.DateTimeFormat(locale.value.localeDate, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  return {
    pais,
    locale,
    formatCurrency,
    formatDate,
    valorComIva,
    ivaValor,
  }
}
