import { z } from 'zod'
import { onlyDigits } from './format'
import { isValidCardNumber, isValidCpf, isValidExpiry } from './validators'
import { isValidCep } from './shipping'

const required = (label: string) =>
  z.string({ required_error: `Informe ${label}` }).trim().min(1, `Informe ${label}`)

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */
export const checkoutSchema = z
  .object({
    name: required('seu nome completo').refine(
      (v) => v.split(/\s+/).filter(Boolean).length >= 2,
      'Informe nome e sobrenome',
    ),
    email: required('seu e-mail').email('E-mail inválido'),
    cpf: required('seu CPF').refine(isValidCpf, 'CPF inválido'),
    phone: required('seu telefone').refine(
      (v) => [10, 11].includes(onlyDigits(v).length),
      'Telefone inválido (com DDD)',
    ),

    cep: required('o CEP').refine(isValidCep, 'CEP deve ter 8 dígitos'),
    street: required('a rua'),
    number: required('o número'),
    complement: z.string().trim().optional(),
    district: required('o bairro'),
    city: required('a cidade'),
    state: required('o estado').length(2, 'Use a sigla (ex.: SP)'),

    shippingId: z.enum(['standard', 'express'], {
      required_error: 'Escolha uma forma de entrega',
    }),

    paymentMethod: z.enum(['pix', 'card', 'boleto']),
    cardNumber: z.string().optional(),
    cardName: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    installments: z.number().int().min(1).max(6).optional(),

    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Aceite os termos para continuar' }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod !== 'card') return
    if (!data.cardNumber || !isValidCardNumber(data.cardNumber)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cardNumber'],
        message: 'Número de cartão inválido',
      })
    }
    if (!data.cardName || data.cardName.trim().length < 3) {
      ctx.addIssue({
        code: 'custom',
        path: ['cardName'],
        message: 'Informe o nome impresso no cartão',
      })
    }
    if (!data.cardExpiry || !isValidExpiry(data.cardExpiry)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cardExpiry'],
        message: 'Validade inválida (MM/AA)',
      })
    }
    if (!data.cardCvv || !/^\d{3,4}$/.test(data.cardCvv)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cardCvv'],
        message: 'CVV inválido',
      })
    }
  })

export type CheckoutFormValues = z.infer<typeof checkoutSchema>

/* ------------------------------------------------------------------ */
/* Admin: produto                                                      */
/* ------------------------------------------------------------------ */
export const productFormSchema = z.object({
  name: z.string().trim().min(3, 'Mínimo de 3 caracteres'),
  category: z.enum(['camisas', 'calcas', 'casacos', 'bones']),
  collection: z.string().trim().min(2, 'Informe a coleção'),
  price: z
    .number({ invalid_type_error: 'Informe um preço' })
    .positive('Preço deve ser maior que zero'),
  compareAtPrice: z.number().positive('Valor inválido').optional(),
  colorName: z.string().trim().min(2, 'Informe o nome da cor'),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use o formato #RRGGBB'),
  shortDescription: z.string().trim().min(10, 'Descreva em pelo menos 10 caracteres'),
  description: z.string().trim().min(30, 'Descrição deve ter pelo menos 30 caracteres'),
  composition: z.string().trim().min(3, 'Informe a composição'),
  fit: z.string().trim().min(3, 'Informe a modelagem'),
  length: z.string().trim().min(3, 'Informe o comprimento'),
  isNew: z.boolean(),
  featured: z.boolean(),
  stock: z.array(
    z.object({
      size: z.string(),
      qty: z
        .number({ invalid_type_error: 'Informe a quantidade' })
        .int('Use números inteiros')
        .min(0, 'Não pode ser negativo'),
    }),
  ),
  imageFront: z.string().min(1, 'Envie ao menos a foto principal'),
  imageBack: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */
export const newsletterSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu e-mail').email('E-mail inválido'),
})

export type NewsletterValues = z.infer<typeof newsletterSchema>

/* ------------------------------------------------------------------ */
/* Cupom                                                               */
/* ------------------------------------------------------------------ */
export const couponSchema = z.object({
  code: z.string().trim().min(3, 'Cupom inválido'),
})
