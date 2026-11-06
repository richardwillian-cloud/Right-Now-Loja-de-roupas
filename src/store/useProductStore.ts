import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'
import { seedProducts } from '@/data/products'

interface ProductState {
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  removeProduct: (id: string) => void
  resetCatalog: () => void
  /** baixa o estoque após uma compra demonstrativa */
  decrementStock: (items: CartItem[]) => void
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: seedProducts,

      addProduct: (product) =>
        set((s) => ({ products: [product, ...s.products] })),

      updateProduct: (id, patch) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      removeProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      resetCatalog: () => set({ products: seedProducts }),

      decrementStock: (items) =>
        set((s) => ({
          products: s.products.map((p) => {
            const bought = items.filter((i) => i.productId === p.id)
            if (!bought.length) return p
            const stock = { ...p.stock }
            bought.forEach((i) => {
              stock[i.size] = Math.max(0, (stock[i.size] ?? 0) - i.quantity)
            })
            return { ...p, stock }
          }),
        })),
    }),
    { name: 'right-now:products', version: 1 },
  ),
)

export const totalStock = (p: Product) =>
  Object.values(p.stock).reduce((acc, n) => acc + n, 0)
