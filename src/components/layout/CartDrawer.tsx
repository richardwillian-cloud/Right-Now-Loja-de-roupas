import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { CloseIcon, MinusIcon, PlusIcon } from '@/components/ui/Icons'
import { GLYPHS } from '@/components/music/Notes'
import { useUiStore } from '@/store/useUiStore'
import { useCartStore, MAX_PER_ITEM } from '@/store/useCartStore'
import { useCartSummary } from '@/hooks/useCartSummary'
import { productImage } from '@/lib/assets'
import { formatBRL } from '@/lib/format'
import { FREE_SHIPPING_FROM } from '@/lib/shipping'

export function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen)
  const setCartOpen = useUiStore((s) => s.setCartOpen)
  const { setQuantity, removeItem } = useCartStore()
  const { lines, subtotal, count } = useCartSummary()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setCartOpen(false)
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setCartOpen])

  const remaining = Math.max(0, FREE_SHIPPING_FROM - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-[460px] flex-col bg-paper shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho"
          >
            <div className="flex items-center justify-between bg-navy px-6 py-5 text-paper">
              <h2 className="font-display text-2xl font-medium">
                Seu carrinho <span className="font-music text-base text-royal-light">{GLYPHS.beamed}</span>
                <span className="ml-2 text-sm text-paper/60">({count})</span>
              </h2>
              <button type="button" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <span className="font-music text-6xl text-navy/30">{GLYPHS.rest}</span>
                <p className="font-display text-2xl">Silêncio por aqui.</p>
                <p className="text-sm text-ink/60">Seu carrinho está vazio. Que tal compor um look?</p>
                <Link to="/shop" className="btn-primary" onClick={() => setCartOpen(false)}>
                  Explorar a loja
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-ink/10 px-6 py-4">
                  <p className="text-[12px] text-ink/70">
                    {remaining > 0
                      ? `Faltam ${formatBRL(remaining)} para frete grátis`
                      : 'Você ganhou frete grátis (entrega padrão)'}
                  </p>
                  <div className="mt-2 h-[3px] bg-ink/10">
                    <div
                      className="h-full bg-royal transition-all duration-700 ease-silk"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                  {lines.map(({ item, product, lineTotal, stock }) => (
                    <li key={item.key} className="flex gap-4 py-5">
                      <Link
                        to={`/produto/${product.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="block h-28 w-24 shrink-0 bg-paper-deep/70"
                      >
                        <img
                          src={productImage(product.images[0])}
                          alt={product.name}
                          className="product-img h-full w-full object-contain"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-display text-lg leading-tight">{product.name}</p>
                            <p className="mt-1 text-[12px] text-ink/60">
                              {product.colorway.name} · Tam. {item.size}
                            </p>
                          </div>
                          <p className="text-[14px] tabular-nums">{formatBRL(lineTotal)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-ink/25">
                            <button
                              type="button"
                              aria-label="Diminuir quantidade"
                              className="p-2"
                              onClick={() => setQuantity(item.key, item.quantity - 1)}
                            >
                              <MinusIcon width={14} height={14} />
                            </button>
                            <span className="w-7 text-center text-[13px] tabular-nums">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Aumentar quantidade"
                              className="p-2 disabled:opacity-30"
                              disabled={item.quantity >= Math.min(stock, MAX_PER_ITEM)}
                              onClick={() => setQuantity(item.key, item.quantity + 1)}
                            >
                              <PlusIcon width={14} height={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="link-underline text-[11px] uppercase tracking-wide2 text-ink/60"
                            onClick={() => removeItem(item.key)}
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4 border-t border-ink/15 bg-paper-deep/50 px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow">Subtotal</span>
                    <span className="font-display text-3xl tabular-nums">{formatBRL(subtotal)}</span>
                  </div>
                  <p className="text-[12px] text-ink/55">Frete e descontos calculados no carrinho e no checkout.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/cart" className="btn-outline" onClick={() => setCartOpen(false)}>
                      Ver carrinho
                    </Link>
                    <Link to="/checkout" className="btn-primary" onClick={() => setCartOpen(false)}>
                      Finalizar
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
