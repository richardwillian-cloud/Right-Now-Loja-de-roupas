import type { PaymentMethod } from '@/types'

export interface Coupon {
  code: string
  percent: number
  label: string
}

export const COUPONS: Coupon[] = [
  { code: 'RIGHTNOW10', percent: 10, label: '10% de desconto no pedido' },
  { code: 'PARTITURA15', percent: 15, label: '15% de desconto (lançamento)' },
]

export const PIX_DISCOUNT_PERCENT = 5

export function findCoupon(code?: string | null): Coupon | null {
  if (!code) return null
  const normalized = code.trim().toUpperCase()
  return COUPONS.find((c) => c.code === normalized) ?? null
}

const round2 = (n: number) => Math.round(n * 100) / 100

export interface Totals {
  subtotal: number
  couponDiscount: number
  pixDiscount: number
  discount: number
  shipping: number
  total: number
}

export function computeTotals(input: {
  subtotal: number
  couponCode?: string | null
  shipping?: number
  paymentMethod?: PaymentMethod
}): Totals {
  const { subtotal, couponCode, shipping = 0, paymentMethod } = input
  const coupon = findCoupon(couponCode)
  const couponDiscount = coupon ? round2((subtotal * coupon.percent) / 100) : 0
  const afterCoupon = subtotal - couponDiscount
  const pixDiscount =
    paymentMethod === 'pix' ? round2((afterCoupon * PIX_DISCOUNT_PERCENT) / 100) : 0
  const discount = round2(couponDiscount + pixDiscount)
  const total = round2(Math.max(0, subtotal - discount + shipping))
  return { subtotal: round2(subtotal), couponDiscount, pixDiscount, discount, shipping, total }
}
