import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  ids: string[]
  toggle: (productId: string) => boolean
  clear: () => void
}

/** Favoritos persistentes (localStorage). `toggle` retorna true se favoritou. */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const isFav = get().ids.includes(productId)
        set((s) => ({
          ids: isFav ? s.ids.filter((id) => id !== productId) : [productId, ...s.ids],
        }))
        return !isFav
      },
      clear: () => set({ ids: [] }),
    }),
    { name: 'right-now:favorites', version: 1 },
  ),
)
