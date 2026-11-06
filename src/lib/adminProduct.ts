import type { Category, Product, SizeChart } from '@/types'
import type { ProductFormValues } from './schemas'
import { slugify } from './format'
import {
  CAP_SIZES,
  PANTS_SIZES,
  TOP_SIZES,
  capChart,
  hoodieChart,
  tankChart,
  teeChart,
  wideLegChart,
} from '@/data/sizeCharts'

export const sizesFor = (category: Category): string[] =>
  category === 'calcas' ? PANTS_SIZES : category === 'bones' ? CAP_SIZES : TOP_SIZES

const chartFor = (category: Category): SizeChart =>
  category === 'calcas'
    ? wideLegChart
    : category === 'bones'
      ? capChart
      : category === 'casacos'
        ? hoodieChart
        : category === 'camisas'
          ? teeChart
          : tankChart

/** Estoque como lista editável no formulário. */
export const stockToList = (category: Category, stock: Record<string, number>) =>
  sizesFor(category).map((size) => ({ size, qty: stock[size] ?? 0 }))

export const defaultFormValues = (): ProductFormValues => ({
  name: '',
  category: 'camisas',
  collection: 'Coleção 01 — Partitura',
  price: 0,
  compareAtPrice: undefined,
  colorName: '',
  colorHex: '#0A1330',
  shortDescription: '',
  description: '',
  composition: '',
  fit: '',
  length: '',
  isNew: true,
  featured: false,
  stock: stockToList('camisas', {}),
  imageFront: '',
  imageBack: '',
})

export const productToForm = (p: Product): ProductFormValues => ({
  name: p.name,
  category: p.category,
  collection: p.collection,
  price: p.price,
  compareAtPrice: p.compareAtPrice,
  colorName: p.colorway.name,
  colorHex: p.colorway.hex,
  shortDescription: p.shortDescription,
  description: p.description,
  composition: p.specs.composition,
  fit: p.specs.fit,
  length: p.specs.length,
  isNew: p.isNew,
  featured: p.featured,
  stock: stockToList(p.category, p.stock),
  imageFront: p.images[0] ?? '',
  imageBack: p.images[1] ?? '',
})

/** Slug único dentro do catálogo. */
export function uniqueSlug(base: string, existing: Product[], ignoreId?: string) {
  const root = slugify(base) || 'produto'
  let slug = root
  let n = 2
  while (existing.some((p) => p.slug === slug && p.id !== ignoreId)) slug = `${root}-${n++}`
  return slug
}

export function formToProduct(
  values: ProductFormValues,
  existing: Product[],
  current?: Product,
): Product {
  const sizes = sizesFor(values.category)
  const stock = Object.fromEntries(values.stock.map((s) => [s.size, s.qty]))
  const images = [values.imageFront, values.imageBack].filter((i): i is string => Boolean(i))

  const base: Product = current ?? {
    id: `rn-${Date.now().toString(36)}`,
    slug: '',
    name: '',
    category: values.category,
    collection: values.collection,
    price: values.price,
    shortDescription: '',
    description: '',
    colorway: { group: '', name: '', hex: '' },
    sizes,
    stock,
    images,
    specs: {
      composition: '',
      weight: 'Informar gramatura',
      fit: '',
      length: '',
      origin: 'Confeccionado no Brasil',
      technique: 'Bordado computadorizado',
      details: ['Etiqueta Right Now bordada'],
      care: ['Lavar do avesso em água fria', 'Secar à sombra', 'Não passar sobre o bordado'],
    },
    sizeChart: chartFor(values.category),
    modelInfo: 'Consulte a tabela de medidas.',
    tags: [],
    isNew: values.isNew,
    featured: values.featured,
    createdAt: new Date().toISOString(),
  }

  const categoryChanged = current && current.category !== values.category

  const slug = uniqueSlug(`${values.name} ${values.colorName}`, existing, base.id)

  return {
    ...base,
    slug,
    name: values.name,
    category: values.category,
    collection: values.collection,
    price: values.price,
    compareAtPrice: values.compareAtPrice,
    shortDescription: values.shortDescription,
    description: values.description,
    colorway: {
      group: current?.colorway.group ?? `grp-${slug}`,
      name: values.colorName,
      hex: values.colorHex,
    },
    sizes,
    stock,
    images,
    specs: {
      ...base.specs,
      composition: values.composition,
      fit: values.fit,
      length: values.length,
    },
    sizeChart: categoryChanged ? chartFor(values.category) : base.sizeChart,
    isNew: values.isNew,
    featured: values.featured,
  }
}

/** Reduz e converte a imagem enviada para caber no localStorage. */
export function fileToDataUrl(file: File, maxSize = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Arquivo de imagem inválido'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas indisponível'))
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}
