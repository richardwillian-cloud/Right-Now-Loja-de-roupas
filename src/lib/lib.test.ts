import { describe, expect, it } from 'vitest'
import { isValidCardNumber, isValidCpf, isValidExpiry } from './validators'
import { calcShippingOptions, FREE_SHIPPING_FROM } from './shipping'
import { computeTotals, findCoupon } from './pricing'
import { maskCep, maskCpf, maskPhone } from './format'
import { emptyFilters, filterProducts } from './catalog'
import { checkoutSchema } from './schemas'
import { seedProducts } from '@/data/products'

describe('validators', () => {
  it('valida CPF', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true)
    expect(isValidCpf('111.111.111-11')).toBe(false)
    expect(isValidCpf('123.456.789-00')).toBe(false)
  })
  it('valida cartão (Luhn)', () => {
    expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true)
    expect(isValidCardNumber('4242 4242 4242 4241')).toBe(false)
  })
  it('valida validade', () => {
    const now = new Date('2026-11-05')
    expect(isValidExpiry('12/30', now)).toBe(true)
    expect(isValidExpiry('01/20', now)).toBe(false)
    expect(isValidExpiry('13/30', now)).toBe(false)
  })
})

describe('máscaras', () => {
  it('formata CEP, CPF e telefone', () => {
    expect(maskCep('21000000')).toBe('21000-000')
    expect(maskCpf('52998224725')).toBe('529.982.247-25')
    expect(maskPhone('21999998888')).toBe('(21) 99999-8888')
  })
})

describe('frete e preços', () => {
  it('calcula opções e frete grátis', () => {
    const paid = calcShippingOptions('21000-000', 300)
    expect(paid).toHaveLength(2)
    expect(paid[0].price).toBeGreaterThan(0)
    expect(calcShippingOptions('21000-000', FREE_SHIPPING_FROM)[0].price).toBe(0)
    expect(calcShippingOptions('123', 300)).toEqual([])
  })
  it('aplica cupom e desconto Pix', () => {
    expect(findCoupon('rightnow10')?.percent).toBe(10)
    const t = computeTotals({ subtotal: 1000, couponCode: 'RIGHTNOW10', shipping: 30, paymentMethod: 'pix' })
    expect(t.couponDiscount).toBe(100)
    expect(t.pixDiscount).toBe(45)
    expect(t.total).toBe(885)
  })
})

describe('catálogo', () => {
  it('tem 4+ camisas, 4+ calças, 3 bonés e 3 casacos', () => {
    const count = (c: string) => seedProducts.filter((p) => p.category === c).length
    expect(count('camisas')).toBeGreaterThanOrEqual(4)
    expect(count('calcas')).toBeGreaterThanOrEqual(4)
    expect(count('bones')).toBe(3)
    expect(count('casacos')).toBe(3)
  })
  it('filtra por categoria, busca e tamanho', () => {
    const calcas = filterProducts(seedProducts, { ...emptyFilters, categories: ['calcas'] })
    expect(calcas.every((p) => p.category === 'calcas')).toBe(true)
    expect(filterProducts(seedProducts, { ...emptyFilters, q: 'tigre' })).toHaveLength(1)
    expect(filterProducts(seedProducts, { ...emptyFilters, sizes: ['46'] }).every((p) => (p.stock['46'] ?? 0) > 0)).toBe(true)
  })
})

describe('schema de checkout', () => {
  const valid = {
    name: 'Richard Willian',
    email: 'richard@example.com',
    cpf: '529.982.247-25',
    phone: '(21) 99999-8888',
    cep: '21000-000',
    street: 'Rua das Notas',
    number: '10',
    district: 'Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    shippingId: 'standard',
    paymentMethod: 'pix',
    acceptTerms: true,
  }
  it('aceita dados válidos (Pix)', () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true)
  })
  it('exige dados do cartão quando o pagamento é cartão', () => {
    const r = checkoutSchema.safeParse({ ...valid, paymentMethod: 'card' })
    expect(r.success).toBe(false)
  })
  it('rejeita CPF e termos inválidos', () => {
    expect(checkoutSchema.safeParse({ ...valid, cpf: '111.111.111-11' }).success).toBe(false)
    expect(checkoutSchema.safeParse({ ...valid, acceptTerms: false }).success).toBe(false)
  })
})
