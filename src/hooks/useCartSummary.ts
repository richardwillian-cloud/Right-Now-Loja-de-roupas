import { useMemo } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useProductStore } from '@/store/useProductStore'
import type { CartItem, PaymentMethod, Product, ShippingOption } from '@/types'
import { calcShippingOptions } from '@/lib/shipping'
import { computeTotals, findCoupon } from '@/lib/pricing'

export interface CartLine {
  item: CartItem
  product: Product
  lineTotal: number
  stock: number
}

export function useCartSummary(paymentMethod?: PaymentMethod) {
  const items = useCartStore((s) => s.items)
  const couponCode = useCartStore((s) => s.couponCode)
  const cep = useCartStore((s) => s.cep)
  const shippingId = useCartStore((s) => s.shippingId)
  const products = useProductStore((s) => s.products)

  return useMemo(() => {
    const lines: CartLine[] = items.flatMap((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return []
      return [
        {
          item,
          product,
          lineTotal: product.price * item.quantity,
          stock: product.stock[item.size] ?? 0,
        },
      ]
    })

    const subtotal = lines.reduce((acc, l) => acc + l.lineTotal, 0)
    const count = lines.reduce((acc, l) => acc + l.item.quantity, 0)
    const shippingOptions: ShippingOption[] = calcShippingOptions(cep, subtotal)
    const selectedShipping =
      shippingOptions.find((o) => o.id === shippingId) ?? shippingOptions[0] ?? null

    const totals = computeTotals({
      subtotal,
      couponCode,
      shipping: selectedShipping?.price ?? 0,
      paymentMethod,
    })

    return {
      lines,
      count,
      subtotal,
      coupon: findCoupon(couponCode),
      shippingOptions,
      selectedShipping,
      totals,
      hasShipping: Boolean(selectedShipping),
    }
  }, [items, products, couponCode, cep, shippingId, paymentMethod])
}
