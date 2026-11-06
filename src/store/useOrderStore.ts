import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, OrderStatus } from '@/types'

interface OrderState {
  orders: Order[]
  counter: number
  /** gera o próximo número de pedido (RN-AAAA-000001) */
  nextOrderId: () => string
  addOrder: (order: Order) => void
  updateStatus: (id: string, status: OrderStatus) => void
  clear: () => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      counter: 1000,

      nextOrderId: () => {
        const next = get().counter + 1
        set({ counter: next })
        return `RN-${new Date().getFullYear()}-${String(next).padStart(6, '0')}`
      },

      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),

      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      clear: () => set({ orders: [] }),
    }),
    { name: 'right-now:orders', version: 1 },
  ),
)
