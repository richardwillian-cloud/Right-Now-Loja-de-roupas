import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { emptyFilters, type CatalogFilters, type SortKey } from '@/lib/catalog'
import type { Category } from '@/types'

const CATS: Category[] = ['camisas', 'calcas', 'casacos', 'bones']
const SORTS: SortKey[] = ['featured', 'new', 'price-asc', 'price-desc', 'name']

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const num = (v: string | null) => {
  if (v === null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

/** Mantém os filtros da loja sincronizados com a URL (links compartilháveis). */
export function useShopFilters() {
  const [params, setParams] = useSearchParams()

  const filters: CatalogFilters = useMemo(() => {
    const sort = params.get('sort') as SortKey | null
    return {
      q: params.get('q') ?? '',
      categories: list(params.get('cat')).filter((c): c is Category => CATS.includes(c as Category)),
      sizes: list(params.get('size')),
      colors: list(params.get('color')),
      minPrice: num(params.get('min')),
      maxPrice: num(params.get('max')),
      inStockOnly: params.get('stock') === '1',
      sort: sort && SORTS.includes(sort) ? sort : 'featured',
    }
  }, [params])

  const update = useCallback(
    (patch: Partial<CatalogFilters>) => {
      const next: CatalogFilters = { ...filters, ...patch }
      const p = new URLSearchParams()
      if (next.q) p.set('q', next.q)
      if (next.categories.length) p.set('cat', next.categories.join(','))
      if (next.sizes.length) p.set('size', next.sizes.join(','))
      if (next.colors.length) p.set('color', next.colors.join(','))
      if (next.minPrice !== null) p.set('min', String(next.minPrice))
      if (next.maxPrice !== null) p.set('max', String(next.maxPrice))
      if (next.inStockOnly) p.set('stock', '1')
      if (next.sort !== emptyFilters.sort) p.set('sort', next.sort)
      setParams(p, { replace: true })
    },
    [filters, setParams],
  )

  const reset = useCallback(() => setParams(new URLSearchParams(), { replace: true }), [setParams])

  const toggle = useCallback(
    <K extends 'categories' | 'sizes' | 'colors'>(key: K, value: CatalogFilters[K][number]) => {
      const current = filters[key] as string[]
      const next = current.includes(value as string)
        ? current.filter((v) => v !== value)
        : [...current, value as string]
      update({ [key]: next } as Partial<CatalogFilters>)
    },
    [filters, update],
  )

  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)

  return { filters, update, reset, toggle, activeCount }
}
