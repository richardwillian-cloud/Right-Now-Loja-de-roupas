import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiltersPanel } from '@/components/shop/FiltersPanel'
import { ProductCard } from '@/components/product/ProductCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { CloseIcon, FilterIcon, SearchIcon } from '@/components/ui/Icons'
import { GLYPHS } from '@/components/music/Notes'
import { useProductStore } from '@/store/useProductStore'
import { useShopFilters } from '@/hooks/useShopFilters'
import { filterProducts, type SortKey } from '@/lib/catalog'
import { CATEGORY_LABEL } from '@/types'

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Em destaque',
  new: 'Mais recentes',
  'price-asc': 'Menor preço',
  'price-desc': 'Maior preço',
  name: 'Nome (A–Z)',
}

export default function ShopPage() {
  const products = useProductStore((s) => s.products)
  const { filters, update, reset, toggle, activeCount } = useShopFilters()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const results = useMemo(() => filterProducts(products, filters), [products, filters])

  const title =
    filters.categories.length === 1 ? CATEGORY_LABEL[filters.categories[0]] : filters.q ? 'Busca' : 'Shop'

  const panelProps = { products, filters, toggle, update, reset, activeCount }

  return (
    <>
      <PageHeader
        eyebrow={filters.q ? `Resultados para “${filters.q}”` : 'Catálogo completo'}
        title={title}
        description="Camisas, calças, casacos e bonés com bordados de partitura. Filtre por tamanho, cor e preço."
      />

      <div className="container-rn">
        {/* barra de ferramentas */}
        <div className="sticky top-[110px] z-30 -mx-5 flex flex-wrap items-center gap-4 border-y border-ink/15 bg-paper/95 px-5 py-3 backdrop-blur md:-mx-10 md:px-10">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide2 lg:hidden"
          >
            <FilterIcon width={18} height={18} /> Filtros {activeCount > 0 && `(${activeCount})`}
          </button>

          <div className="relative flex-1 md:max-w-sm">
            <label htmlFor="shop-search" className="sr-only">
              Buscar produtos
            </label>
            <SearchIcon width={16} height={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/50" />
            <input
              id="shop-search"
              type="search"
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Buscar peças…"
              className="field border-0 pl-7 text-[14px]"
            />
          </div>

          <p className="hidden text-[12px] text-ink/55 md:block" aria-live="polite">
            {results.length} {results.length === 1 ? 'peça' : 'peças'}
          </p>

          <div className="ml-auto flex items-center gap-3">
            <label htmlFor="sort" className="eyebrow hidden sm:block">
              Ordenar
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="cursor-pointer border-0 bg-transparent py-2 pr-6 text-[13px] focus:outline-none"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-12 pt-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-[200px] max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
              <FiltersPanel {...panelProps} />
            </div>
          </aside>

          <section aria-label="Produtos">
            {activeCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  ...filters.categories.map((c) => ({ key: `c-${c}`, label: CATEGORY_LABEL[c], off: () => toggle('categories', c) })),
                  ...filters.sizes.map((s) => ({ key: `s-${s}`, label: `Tam. ${s}`, off: () => toggle('sizes', s) })),
                  ...filters.colors.map((c) => ({ key: `k-${c}`, label: c, off: () => toggle('colors', c) })),
                ].map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.off}
                    className="flex items-center gap-2 border border-ink/25 px-3 py-1.5 text-[11px] uppercase tracking-wide2 transition-colors hover:border-ink"
                  >
                    {chip.label} <CloseIcon width={12} height={12} />
                  </button>
                ))}
              </div>
            )}

            {results.length === 0 ? (
              <div className="flex flex-col items-center py-28 text-center">
                <span className="font-music text-7xl text-navy/25">{GLYPHS.rest}</span>
                <h2 className="mt-4 font-display text-4xl">Nenhuma peça encontrada</h2>
                <p className="mt-3 max-w-sm text-[14px] text-ink/60">
                  Tente remover algum filtro ou buscar por outro termo.
                </p>
                <button type="button" onClick={reset} className="btn-primary mt-8">
                  Limpar filtros
                </button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-5 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {results.map((p, i) => (
                    <motion.div
                      layout
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: [0.22, 0.8, 0.2, 1] }}
                    >
                      <ProductCard product={p} priority={i < 3} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      {/* filtros em gaveta (mobile) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-ink/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              className="fixed inset-y-0 left-0 z-[90] flex w-[88%] max-w-sm flex-col bg-paper"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.55, ease: [0.22, 0.8, 0.2, 1] }}
            >
              <div className="flex items-center justify-between bg-navy px-6 py-5 text-paper">
                <h2 className="font-display text-2xl">Filtros</h2>
                <button type="button" aria-label="Fechar filtros" onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <FiltersPanel {...panelProps} />
              </div>
              <div className="border-t border-ink/15 p-4">
                <button type="button" className="btn-primary w-full" onClick={() => setDrawerOpen(false)}>
                  Ver {results.length} {results.length === 1 ? 'peça' : 'peças'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
