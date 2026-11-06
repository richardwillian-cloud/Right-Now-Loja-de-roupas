export type Category = 'camisas' | 'calcas' | 'casacos' | 'bones'

export const CATEGORY_LABEL: Record<Category, string> = {
  camisas: 'Camisas',
  calcas: 'Calças',
  casacos: 'Casacos',
  bones: 'Bonés',
}

export interface Colorway {
  /** produtos do mesmo grupo são o mesmo modelo em cores diferentes */
  group: string
  name: string
  hex: string
}

export interface SizeChart {
  columns: string[]
  rows: { size: string; values: number[] }[]
  note: string
}

export interface ProductSpecs {
  composition: string
  weight: string
  fit: string
  length: string
  origin: string
  technique: string
  closure?: string
  details: string[]
  care: string[]
}

export interface Product {
  id: string
  slug: string
  name: string
  category: Category
  collection: string
  price: number
  compareAtPrice?: number
  shortDescription: string
  description: string
  colorway: Colorway
  sizes: string[]
  stock: Record<string, number>
  images: string[]
  specs: ProductSpecs
  sizeChart: SizeChart
  modelInfo: string
  tags: string[]
  isNew: boolean
  featured: boolean
  createdAt: string
}

export interface CartItem {
  key: string
  productId: string
  size: string
  quantity: number
}

export type OrderStatus =
  | 'Aguardando pagamento'
  | 'Pago'
  | 'Em separação'
  | 'Enviado'
  | 'Entregue'

export const ORDER_STATUSES: OrderStatus[] = [
  'Aguardando pagamento',
  'Pago',
  'Em separação',
  'Enviado',
  'Entregue',
]

export type PaymentMethod = 'pix' | 'card' | 'boleto'

export interface OrderLine {
  productId: string
  name: string
  colorName: string
  size: string
  quantity: number
  unitPrice: number
  image: string
}

export interface Order {
  id: string
  createdAt: string
  status: OrderStatus
  lines: OrderLine[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  shippingLabel: string
  couponCode?: string
  customer: { name: string; email: string; phone: string }
  address: {
    cep: string
    street: string
    number: string
    complement?: string
    district: string
    city: string
    state: string
  }
  payment: { method: PaymentMethod; installments?: number; cardLast4?: string }
}

export type ShippingOptionId = 'standard' | 'express'

export interface ShippingOption {
  id: ShippingOptionId
  label: string
  price: number
  minDays: number
  maxDays: number
}
