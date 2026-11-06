import type { Category, Product } from '@/types'

export type SortKey = 'featured' | 'new' | 'price-asc' | 'price-desc' | 'name'

export interface CatalogFilters {
  q: string
  categories: Category[]
  sizes: string[]
  colors: string[]
  minPrice: number | null
  maxPrice: number | null
  inStockOnly: boolean
  sort: SortKey
}

export const emptyFilters: CatalogFilters = {
  q: '',
  categories: [],
  sizes: [],
  colors: [],
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  sort: 'featured',
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export const inStock = (p: Product) => Object.values(p.stock).some((n) => n > 0)

export function searchMatches(p: Product, q: string) {
  const query = normalize(q.trim())
  if (!query) return true
  const haystack = normalize(
    [p.name, p.collection, p.category, p.colorway.name, p.shortDescription, ...p.tags].join(' '),
  )
  return query.split(/\s+/).every((term) => haystack.includes(term))
}

export function filterProducts(products: Product[], f: CatalogFilters): Product[] {
  const list = products.filter((p) => {
    if (!searchMatches(p, f.q)) return false
    if (f.categories.length && !f.categories.includes(p.category)) return false
    if (f.sizes.length && !f.sizes.some((s) => (p.stock[s] ?? 0) > 0)) return false
    if (f.colors.length && !f.colors.includes(p.colorway.name)) return false
    if (f.minPrice !== null && p.price < f.minPrice) return false
    if (f.maxPrice !== null && p.price > f.maxPrice) return false
    if (f.inStockOnly && !inStock(p)) return false
    return true
  })

  const sorted = [...list]
  switch (f.sort) {
    case 'new':
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      break
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      break
    default:
      sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt),
      )
  }
  return sorted
}

/** Outras cores do mesmo modelo (mesmo `colorway.group`). */
export function getColorways(products: Product[], product: Product) {
  return products
    .filter((p) => p.colorway.group === product.colorway.group)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function getRelated(products: Product[], product: Product, limit = 4) {
  const others = products.filter((p) => p.id !== product.id)
  const sameCategory = others.filter((p) => p.category === product.category)
  const rest = others.filter((p) => p.category !== product.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

export const uniqueColors = (products: Product[]) => {
  const map = new Map<string, string>()
  products.forEach((p) => map.set(p.colorway.name, p.colorway.hex))
  return [...map.entries()].map(([name, hex]) => ({ name, hex }))
}

export const allSizes = ['P', 'M', 'G', 'GG', '38', '40', '42', '44', '46', 'Único']

export const priceBounds = (products: Product[]) => {
  if (!products.length) return { min: 0, max: 0 }
  const prices = products.map((p) => p.price)
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
}
