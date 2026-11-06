import type { ShippingOption } from '@/types'
import { onlyDigits } from './format'

/** Valor mínimo (subtotal) para frete padrão grátis. */
export const FREE_SHIPPING_FROM = 900

interface Region {
  name: string
  states: string
  base: number
  extraDays: number
}

/**
 * Cálculo DEMONSTRATIVO: usa apenas o primeiro dígito do CEP para estimar
 * região, prazo e valor. Não consulta transportadoras nem Correios.
 */
const REGIONS: Record<string, Region> = {
  '0': { name: 'Grande São Paulo', states: 'SP', base: 24.9, extraDays: 0 },
  '1': { name: 'Interior de São Paulo', states: 'SP', base: 27.9, extraDays: 1 },
  '2': { name: 'Rio de Janeiro e Espírito Santo', states: 'RJ/ES', base: 26.9, extraDays: 1 },
  '3': { name: 'Minas Gerais', states: 'MG', base: 29.9, extraDays: 2 },
  '4': { name: 'Bahia e Sergipe', states: 'BA/SE', base: 38.9, extraDays: 4 },
  '5': { name: 'Nordeste (Leste)', states: 'PE/AL/PB/RN', base: 42.9, extraDays: 5 },
  '6': { name: 'Norte e Nordeste (Oeste)', states: 'CE/PI/MA/PA/AM', base: 49.9, extraDays: 7 },
  '7': { name: 'Centro-Oeste', states: 'DF/GO/MT/MS/TO', base: 39.9, extraDays: 4 },
  '8': { name: 'Paraná e Santa Catarina', states: 'PR/SC', base: 33.9, extraDays: 3 },
  '9': { name: 'Rio Grande do Sul', states: 'RS', base: 36.9, extraDays: 3 },
}

export function isValidCep(cep: string) {
  return onlyDigits(cep).length === 8
}

export function regionFromCep(cep: string): Region | null {
  const d = onlyDigits(cep)
  if (d.length !== 8) return null
  return REGIONS[d[0]] ?? null
}

export function calcShippingOptions(cep: string, subtotal: number): ShippingOption[] {
  const region = regionFromCep(cep)
  if (!region) return []

  const freeStandard = subtotal >= FREE_SHIPPING_FROM
  const standardDays = 4 + region.extraDays

  return [
    {
      id: 'standard',
      label: 'Padrão',
      price: freeStandard ? 0 : region.base,
      minDays: standardDays,
      maxDays: standardDays + 3,
    },
    {
      id: 'express',
      label: 'Expresso',
      price: Math.round((region.base * 1.9 + 8) * 100) / 100,
      minDays: Math.max(1, 1 + Math.floor(region.extraDays / 2)),
      maxDays: Math.max(2, 2 + Math.floor(region.extraDays / 2)),
    },
  ]
}

export function deliveryEstimate(option: ShippingOption, from = new Date()) {
  const add = (days: number) => {
    const d = new Date(from)
    let remaining = days
    while (remaining > 0) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0 && d.getDay() !== 6) remaining--
    }
    return d
  }
  const fmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
  return `${fmt.format(add(option.minDays))} – ${fmt.format(add(option.maxDays))}`
}
