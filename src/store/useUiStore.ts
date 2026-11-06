import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  tone: 'default' | 'success' | 'error'
}

interface UiState {
  cartOpen: boolean
  searchOpen: boolean
  menuOpen: boolean
  toasts: Toast[]
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
  pushToast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
}

let toastId = 0

export const useUiStore = create<UiState>()((set, get) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  toasts: [],

  setCartOpen: (cartOpen) => set({ cartOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),

  pushToast: (message, tone = 'default') => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    setTimeout(() => get().dismissToast(id), 3600)
  },

  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
