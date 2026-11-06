import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloseIcon, SearchIcon } from '@/components/ui/Icons'
import { useUiStore } from '@/store/useUiStore'
import { useProductStore } from '@/store/useProductStore'
import { searchMatches } from '@/lib/catalog'
import { productImage } from '@/lib/assets'
import { formatBRL } from '@/lib/format'
import { CATEGORY_LABEL } from '@/types'

const SUGGESTIONS = ['partitura', 'wide leg', 'bordado', 'tigre', 'boné', 'azul']

export function SearchOverlay() {
  const open = useUiStore((s) => s.searchOpen)
  const setSearchOpen = useUiStore((s) => s.setSearchOpen)
  const products = useProductStore((s) => s.products)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 250)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setSearchOpen])

  const results = useMemo(
    () => (query.trim() ? products.filter((p) => searchMatches(p, query)).slice(0, 6) : []),
    [products, query],
  )

  const submit = (value: string) => {
    if (!value.trim()) return
    setSearchOpen(false)
    navigate(`/shop?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[85] overflow-y-auto text-paper backdrop-blur-md"
          style={{ backgroundColor: 'rgba(10,19,48,0.97)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-modal="true"
          aria-label="Busca"
        >
          <div className="container-rn pt-8">
            <div className="flex justify-end">
              <button type="button" aria-label="Fechar busca" onClick={() => setSearchOpen(false)} className="p-2">
                <CloseIcon />
              </button>
            </div>

            <form
              className="mx-auto mt-10 max-w-3xl"
              onSubmit={(e) => {
                e.preventDefault()
                submit(query)
              }}
              role="search"
            >
              <label htmlFor="global-search" className="eyebrow-light">
                Buscar na loja
              </label>
              <div className="mt-2 flex items-center gap-4 border-b border-paper/40 pb-3">
                <SearchIcon width={26} height={26} />
                <input
                  id="global-search"
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Camiseta, calça, boné, cor…"
                  className="w-full bg-transparent font-display text-4xl placeholder:text-paper/30 focus:outline-none sm:text-5xl"
                  autoComplete="off"
                />
              </div>
            </form>

            <div className="mx-auto mt-10 max-w-3xl">
              {!query.trim() ? (
                <div>
                  <p className="eyebrow-light">Sugestões</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="border border-paper/30 px-4 py-2 text-[11px] uppercase tracking-wide2 transition-colors hover:bg-paper hover:text-navy"
                        onClick={() => submit(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <p className="font-display text-2xl text-paper/70">
                  Nenhuma peça encontrada para “{query}”.
                </p>
              ) : (
                <>
                  <ul className="divide-y divide-paper/10">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link
                          to={`/produto/${p.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="group flex items-center gap-5 py-3"
                        >
                          <span className="h-20 w-16 shrink-0 bg-paper">
                            <img
                              src={productImage(p.images[0])}
                              alt=""
                              className="product-img h-full w-full object-contain"
                            />
                          </span>
                          <span className="flex-1">
                            <span className="block font-display text-2xl leading-tight transition-colors group-hover:text-royal-light">
                              {p.name}
                            </span>
                            <span className="text-[12px] text-paper/60">
                              {CATEGORY_LABEL[p.category]} · {p.colorway.name}
                            </span>
                          </span>
                          <span className="text-sm tabular-nums">{formatBRL(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="link-underline mt-6 text-[11px] uppercase tracking-wide2"
                    onClick={() => submit(query)}
                  >
                    Ver todos os resultados
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
