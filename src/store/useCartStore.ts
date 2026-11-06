import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, ShippingOptionId } from '@/types'
import { useProductStore } from './useProductStore'
import { findCoupon } from '@/lib/pricing'

export const MAX_PER_ITEM = 5

interface CartState {
  items: CartItem[]
  couponCode: string | null
  cep: string
  shippingId: ShippingOptionId

  addItem: (productId: string, size: string, quantity?: number) => 'ok' | 'no-stock' | 'limit'
  setQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clear: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  setCep: (cep: string) => void
  setShippingId: (id: ShippingOptionId) => void
}

export const cartKey = (productId: string, size: string) => `${productId}__${size}`

const availableStock = (productId: string, size: string) =>
  useProductStore.getState().products.find((p) => p.id === productId)?.stock[size] ?? 0

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      cep: '',
      shippingId: 'standard',

      addItem: (productId, size, quantity = 1) => {
        const stock = availableStock(productId, size)
        if (stock <= 0) return 'no-stock'

        const key = cartKey(productId, size)
        const existing = get().items.find((i) => i.key === key)
        const current = existing?.quantity ?? 0
        const cap = Math.min(stock, MAX_PER_ITEM)
        if (current >= cap) return 'limit'

        const next = Math.min(cap, current + quantity)
        set((s) => ({
          items: existing
            ? s.items.map((i) => (i.key === key ? { ...i, quantity: next } : i))
            : [...s.items, { key, productId, size, quantity: next }],
        }))
        return 'ok'
      },

      setQuantity: (key, quantity) => {
        const item = get().items.find((i) => i.key === key)
        if (!item) return
        const cap = Math.min(availableStock(item.productId, item.size), MAX_PER_ITEM)
        if (quantity <= 0) return get().removeItem(key)
        set((s) => ({
          items: s.items.map((i) =>
            i.key === key ? { ...i, quantity: Math.min(quantity, Math.max(cap, 1)) } : i,
          ),
        }))
      },

      removeItem: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),

      clear: () => set({ items: [], couponCode: null }),

      applyCoupon: (code) => {
        const coupon = findCoupon(code)
        if (!coupon) return false
        set({ couponCode: coupon.code })
        return true
      },

      removeCoupon: () => set({ couponCode: null }),

      setCep: (cep) => set({ cep }),
      setShippingId: (shippingId) => set({ shippingId }),
    }),
    { name: 'right-now:cart', version: 1 },
  ),
)
