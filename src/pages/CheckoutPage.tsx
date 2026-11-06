import { useEffect, useRef, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { PageHeader } from '@/components/ui/PageHeader'
import { FormField, SelectField } from '@/components/ui/FormField'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { GLYPHS } from '@/components/music/Notes'
import { checkoutSchema, type CheckoutFormValues } from '@/lib/schemas'
import { calcShippingOptions, deliveryEstimate, regionFromCep } from '@/lib/shipping'
import { computeTotals } from '@/lib/pricing'
import { formatBRL, maskCard, maskCep, maskCpf, maskExpiry, maskPhone, onlyDigits } from '@/lib/format'
import { productImage } from '@/lib/assets'
import { useCartSummary } from '@/hooks/useCartSummary'
import { useCartStore } from '@/store/useCartStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useProductStore } from '@/store/useProductStore'
import { useUiStore } from '@/store/useUiStore'
import type { Order, PaymentMethod } from '@/types'

const STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

const PAYMENTS: { id: PaymentMethod; title: string; hint: string }[] = [
  { id: 'pix', title: 'Pix', hint: '5% de desconto' },
  { id: 'card', title: 'Cartão de crédito', hint: 'Até 6x sem juros' },
  { id: 'boleto', title: 'Boleto', hint: 'Vence em 3 dias' },
]

function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-ink/20 pt-8">
      <h2 className="flex items-baseline gap-4 font-display text-3xl font-medium">
        <span className="font-music text-xl text-royal">{GLYPHS.eighth}</span>
        <span className="text-[11px] font-sans uppercase tracking-wide3 text-ink/50">{number}</span>
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const cartCep = useCartStore((s) => s.cep)
  const cartShippingId = useCartStore((s) => s.shippingId)
  const couponCode = useCartStore((s) => s.couponCode)
  const clearCart = useCartStore((s) => s.clear)
  const { nextOrderId, addOrder } = useOrderStore()
  const decrementStock = useProductStore((s) => s.decrementStock)
  const pushToast = useUiStore((s) => s.pushToast)
  /** evita redirecionar para /cart quando o carrinho é esvaziado após a compra */
  const submitted = useRef(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      phone: '',
      cep: cartCep,
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      shippingId: cartShippingId,
      paymentMethod: 'pix',
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: '',
      installments: 1,
      acceptTerms: undefined as unknown as true,
    },
  })

  const paymentMethod = watch('paymentMethod')
  const cep = watch('cep')
  const shippingId = watch('shippingId')
  const installments = watch('installments')

  const summary = useCartSummary(paymentMethod)
  const { lines, count, subtotal, coupon } = summary

  // opções de frete recalculadas a partir do CEP digitado no formulário
  const shippingOptions = calcShippingOptions(cep ?? '', subtotal)
  const selectedShipping = shippingOptions.find((o) => o.id === shippingId) ?? shippingOptions[0] ?? null
  const totals = computeTotals({
    subtotal,
    couponCode,
    shipping: selectedShipping?.price ?? 0,
    paymentMethod,
  })

  // sugere o estado quando o CEP identifica uma única UF
  useEffect(() => {
    const region = regionFromCep(cep ?? '')
    if (region && !region.states.includes('/') && !watch('state')) {
      setValue('state', region.states, { shouldValidate: true })
    }
  }, [cep]) // eslint-disable-line react-hooks/exhaustive-deps

  if (lines.length === 0) return submitted.current ? null : <Navigate to="/cart" replace />

  const onSubmit = async (values: CheckoutFormValues) => {
    // simula o processamento do pagamento
    await new Promise((r) => setTimeout(r, 1200))

    const option = calcShippingOptions(values.cep, subtotal).find((o) => o.id === values.shippingId)
    if (!option) {
      pushToast('Escolha uma forma de entrega', 'error')
      return
    }

    const finalTotals = computeTotals({
      subtotal,
      couponCode,
      shipping: option.price,
      paymentMethod: values.paymentMethod,
    })

    const order: Order = {
      id: nextOrderId(),
      createdAt: new Date().toISOString(),
      status: values.paymentMethod === 'boleto' ? 'Aguardando pagamento' : 'Pago',
      lines: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        colorName: l.product.colorway.name,
        size: l.item.size,
        quantity: l.item.quantity,
        unitPrice: l.product.price,
        image: l.product.images[0],
      })),
      subtotal: finalTotals.subtotal,
      discount: finalTotals.discount,
      shipping: finalTotals.shipping,
      total: finalTotals.total,
      shippingLabel: `${option.label} · ${option.minDays}–${option.maxDays} dias úteis`,
      couponCode: couponCode ?? undefined,
      customer: { name: values.name, email: values.email, phone: values.phone },
      address: {
        cep: values.cep,
        street: values.street,
        number: values.number,
        complement: values.complement || undefined,
        district: values.district,
        city: values.city,
        state: values.state.toUpperCase(),
      },
      payment: {
        method: values.paymentMethod,
        installments: values.paymentMethod === 'card' ? values.installments ?? 1 : undefined,
        // por segurança, guarda apenas os 4 últimos dígitos (e nada de CVV)
        cardLast4:
          values.paymentMethod === 'card' ? onlyDigits(values.cardNumber ?? '').slice(-4) : undefined,
      },
    }

    submitted.current = true
    addOrder(order)
    decrementStock(lines.map((l) => l.item))
    navigate(`/pedido-confirmado/${order.id}`, { replace: true })
    clearCart()
  }

  const total = totals.total

  return (
    <>
      <PageHeader eyebrow="Finalização" title="Checkout" />

      <div className="container-rn">
        <div className="mb-10 flex items-start gap-3 border border-royal/40 bg-royal/5 px-5 py-4 text-[13px] text-ink/80">
          <span className="font-music text-xl text-royal">{GLYPHS.eighth}</span>
          <p>
            <strong className="font-medium text-ink">Ambiente demonstrativo.</strong> Nenhum pagamento é
            processado e nenhum dado sai do seu navegador. Para testar o cartão, use um número que passe no
            teste de Luhn, como <code className="font-mono text-[12px]">4242 4242 4242 4242</code>, e o CPF
            <code className="ml-1 font-mono text-[12px]">529.982.247-25</code>.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20"
        >
          <div className="space-y-14">
            {/* 1 · contato */}
            <Section number="01" title="Contato">
              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                <FormField
                  label="Nome completo"
                  autoComplete="name"
                  error={errors.name?.message}
                  className="md:col-span-2"
                  {...register('name')}
                />
                <FormField
                  label="E-mail"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <FormField
                  label="Telefone"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(21) 99999-9999"
                  error={errors.phone?.message}
                  {...register('phone', {
                    onChange: (e) => setValue('phone', maskPhone(e.target.value)),
                  })}
                />
                <FormField
                  label="CPF"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  error={errors.cpf?.message}
                  {...register('cpf', {
                    onChange: (e) => setValue('cpf', maskCpf(e.target.value)),
                  })}
                />
              </div>
            </Section>

            {/* 2 · entrega */}
            <Section number="02" title="Entrega">
              <div className="grid gap-x-8 gap-y-6 md:grid-cols-6">
                <FormField
                  label="CEP"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  error={errors.cep?.message}
                  className="md:col-span-2"
                  {...register('cep', {
                    onChange: (e) => setValue('cep', maskCep(e.target.value), { shouldValidate: true }),
                  })}
                />
                <FormField
                  label="Rua"
                  autoComplete="address-line1"
                  error={errors.street?.message}
                  className="md:col-span-4"
                  {...register('street')}
                />
                <FormField
                  label="Número"
                  inputMode="numeric"
                  error={errors.number?.message}
                  className="md:col-span-2"
                  {...register('number')}
                />
                <FormField
                  label="Complemento (opcional)"
                  autoComplete="address-line2"
                  className="md:col-span-4"
                  {...register('complement')}
                />
                <FormField
                  label="Bairro"
                  error={errors.district?.message}
                  className="md:col-span-2"
                  {...register('district')}
                />
                <FormField
                  label="Cidade"
                  autoComplete="address-level2"
                  error={errors.city?.message}
                  className="md:col-span-3"
                  {...register('city')}
                />
                <div className="md:col-span-1">
                  <SelectField label="UF" error={errors.state?.message} {...register('state')}>
                    <option value="">—</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </SelectField>
                </div>
              </div>

              <fieldset className="mt-10">
                <legend className="eyebrow mb-4">Forma de entrega</legend>
                {shippingOptions.length === 0 ? (
                  <p className="text-[13px] text-ink/55">
                    Informe um CEP válido para ver as opções de entrega.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {shippingOptions.map((o) => (
                      <label
                        key={o.id}
                        className={clsx(
                          'flex cursor-pointer items-center justify-between gap-4 border px-5 py-4 transition-colors duration-300',
                          selectedShipping?.id === o.id ? 'border-navy bg-navy/5' : 'border-ink/20 hover:border-ink',
                        )}
                      >
                        <span className="flex items-center gap-4">
                          <input type="radio" value={o.id} className="h-4 w-4 accent-navy" {...register('shippingId')} />
                          <span>
                            <span className="block text-[14px] font-medium">{o.label}</span>
                            <span className="block text-[12px] text-ink/55">
                              {o.minDays}–{o.maxDays} dias úteis · chega entre {deliveryEstimate(o)}
                            </span>
                          </span>
                        </span>
                        <span className="text-[14px] tabular-nums">
                          {o.price === 0 ? 'Grátis' : formatBRL(o.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {errors.shippingId && (
                  <p role="alert" className="mt-2 text-[12px] text-red-700">
                    {errors.shippingId.message}
                  </p>
                )}
              </fieldset>
            </Section>

            {/* 3 · pagamento */}
            <Section number="03" title="Pagamento">
              <fieldset>
                <legend className="sr-only">Forma de pagamento</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {PAYMENTS.map((p) => (
                    <label
                      key={p.id}
                      className={clsx(
                        'cursor-pointer border px-5 py-4 transition-colors duration-300',
                        paymentMethod === p.id ? 'border-navy bg-navy text-paper' : 'border-ink/20 hover:border-ink',
                      )}
                    >
                      <input type="radio" value={p.id} className="sr-only" {...register('paymentMethod')} />
                      <span className="block font-display text-2xl leading-tight">{p.title}</span>
                      <span className={clsx('block text-[12px]', paymentMethod === p.id ? 'text-paper/70' : 'text-ink/55')}>
                        {p.hint}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {paymentMethod === 'card' && (
                <div className="mt-8 grid gap-x-8 gap-y-6 md:grid-cols-2">
                  <FormField
                    label="Número do cartão"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    error={errors.cardNumber?.message}
                    className="md:col-span-2"
                    {...register('cardNumber', {
                      onChange: (e) => setValue('cardNumber', maskCard(e.target.value)),
                    })}
                  />
                  <FormField
                    label="Nome impresso no cartão"
                    autoComplete="cc-name"
                    error={errors.cardName?.message}
                    className="md:col-span-2"
                    {...register('cardName')}
                  />
                  <FormField
                    label="Validade (MM/AA)"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="12/30"
                    error={errors.cardExpiry?.message}
                    {...register('cardExpiry', {
                      onChange: (e) => setValue('cardExpiry', maskExpiry(e.target.value)),
                    })}
                  />
                  <FormField
                    label="CVV"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={4}
                    error={errors.cardCvv?.message}
                    {...register('cardCvv')}
                  />
                  <div className="md:col-span-2">
                    <SelectField
                      label="Parcelas"
                      {...register('installments', { valueAsNumber: true })}
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n} disabled={n > 1 && total / n < 60}>
                          {n}x de {formatBRL(total / n)} sem juros
                        </option>
                      ))}
                    </SelectField>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <p className="mt-6 text-[13px] leading-relaxed text-ink/65">
                  Ao finalizar, você receberia um QR Code Pix válido por 30 minutos. Nesta demonstração o
                  pagamento é aprovado automaticamente.
                </p>
              )}
              {paymentMethod === 'boleto' && (
                <p className="mt-6 text-[13px] leading-relaxed text-ink/65">
                  O boleto vence em 3 dias e o pedido fica como “Aguardando pagamento”. Nesta demonstração
                  nenhum boleto é gerado.
                </p>
              )}
            </Section>

            <label className="flex cursor-pointer items-start gap-3 text-[13px] text-ink/75">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-navy" {...register('acceptTerms')} />
              <span>
                Li e aceito os <Link to="/ajuda" className="underline">termos de compra e trocas</Link> e entendo
                que este é um site demonstrativo.
              </span>
            </label>
            {errors.acceptTerms && (
              <p role="alert" className="-mt-10 text-[12px] text-red-700">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {/* resumo */}
          <aside className="lg:sticky lg:top-[130px] lg:self-start">
            <div className="bg-paper-deep/60 p-6 md:p-8">
              <h2 className="font-display text-3xl">
                Seu pedido <span className="text-[15px] text-ink/50">({count})</span>
              </h2>
              <ul className="mt-6 divide-y divide-ink/10">
                {lines.map(({ item, product, lineTotal }) => (
                  <li key={item.key} className="flex gap-4 py-4">
                    <span className="relative block aspect-[4/5] w-16 shrink-0 bg-paper-deep">
                      <img
                        src={productImage(product.images[0])}
                        alt=""
                        className="product-img h-full w-full object-contain"
                      />
                      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-navy px-1 text-[10px] text-paper">
                        {item.quantity}
                      </span>
                    </span>
                    <div className="flex flex-1 justify-between gap-3 text-[13px]">
                      <div>
                        <p className="font-display text-lg leading-tight">{product.name}</p>
                        <p className="text-ink/55">
                          {product.colorway.name} · {item.size}
                        </p>
                      </div>
                      <p className="tabular-nums">{formatBRL(lineTotal)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 border-t border-ink/15 pt-6">
                <OrderSummary
                  totals={totals}
                  coupon={coupon}
                  hasShipping={Boolean(selectedShipping)}
                  shippingLabel={selectedShipping?.label}
                />
              </div>

              {paymentMethod === 'card' && installments && installments > 1 && (
                <p className="mt-3 text-right text-[12px] text-ink/55">
                  {installments}x de {formatBRL(total / installments)} sem juros
                </p>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary mt-8 w-full py-5">
                {isSubmitting ? 'Processando…' : `Finalizar compra · ${formatBRL(total)}`}
              </button>
              <Link to="/cart" className="link-underline mt-5 block text-center text-[11px] uppercase tracking-wide2 text-ink/60">
                ← Voltar ao carrinho
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </>
  )
}
