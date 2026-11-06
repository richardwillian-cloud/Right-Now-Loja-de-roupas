import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { MinusIcon, PlusIcon } from '@/components/ui/Icons'
import { GLYPHS } from '@/components/music/Notes'
import { ShippingCalculator } from '@/components/cart/ShippingCalculator'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { useCartStore, MAX_PER_ITEM } from '@/store/useCartStore'
import { useCartSummary } from '@/hooks/useCartSummary'
import { useUiStore } from '@/store/useUiStore'
import { couponSchema } from '@/lib/schemas'
import { productImage } from '@/lib/assets'
import { formatBRL } from '@/lib/format'
import { COUPONS } from '@/lib/pricing'
import { FREE_SHIPPING_FROM } from '@/lib/shipping'

type CouponValues = z.infer<typeof couponSchema>

export default function CartPage() {
  const navigate = useNavigate()
  const { setQuantity, removeItem, applyCoupon, removeCoupon, setCep, setShippingId, clear } = useCartStore()
  const cep = useCartStore((s) => s.cep)
  const shippingId = useCartStore((s) => s.shippingId)
  const pushToast = useUiStore((s) => s.pushToast)
  const { lines, count, subtotal, coupon, selectedShipping, totals, hasShipping } = useCartSummary()

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CouponValues>({ resolver: zodResolver(couponSchema) })

  const onCoupon = ({ code }: CouponValues) => {
    if (applyCoupon(code)) {
      pushToast('Cupom aplicado', 'success')
      reset()
    } else {
      setError('code', { message: 'Cupom inválido ou expirado' })
    }
  }

  if (lines.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Seu carrinho" title="Carrinho" />
        <div className="container-rn">
          <div className="flex flex-col items-center border-y border-ink/15 py-28 text-center">
            <span className="font-music text-7xl text-navy/25">{GLYPHS.rest}</span>
            <h2 className="mt-4 font-display text-4xl">Seu carrinho está em silêncio</h2>
            <p className="mt-3 max-w-sm text-[14px] text-ink/60">
              Adicione peças da coleção para compor o seu look.
            </p>
            <Link to="/shop" className="btn-primary mt-8">
              Explorar a loja
            </Link>
          </div>
        </div>
      </>
    )
  }

  const remaining = Math.max(0, FREE_SHIPPING_FROM - subtotal)

  return (
    <>
      <PageHeader
        eyebrow={`${count} ${count === 1 ? 'item' : 'itens'}`}
        title="Carrinho"
        actions={
          <button
            type="button"
            onClick={clear}
            className="link-underline self-start text-[11px] uppercase tracking-wide2 text-ink/60 md:self-end"
          >
            Esvaziar carrinho
          </button>
        }
      />

      <div className="container-rn grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        {/* itens */}
        <section aria-label="Itens do carrinho">
          <p className="mb-6 text-[13px] text-ink/65">
            {remaining > 0 ? (
              <>
                Faltam <strong className="font-medium text-ink">{formatBRL(remaining)}</strong> para frete grátis
                (entrega padrão).
              </>
            ) : (
              'Você ganhou frete grátis na entrega padrão.'
            )}
          </p>

          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {lines.map(({ item, product, lineTotal, stock }) => {
              const cap = Math.min(stock, MAX_PER_ITEM)
              return (
                <li key={item.key} className="flex gap-5 py-6">
                  <Link
                    to={`/produto/${product.slug}`}
                    className="block aspect-[4/5] w-28 shrink-0 bg-paper-deep/70 md:w-36"
                  >
                    <img
                      src={productImage(product.images[0])}
                      alt={product.name}
                      className="product-img h-full w-full object-contain"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          to={`/produto/${product.slug}`}
                          className="font-display text-2xl leading-tight hover:text-royal"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-[12px] text-ink/60">
                          {product.colorway.name} · Tam. {item.size}
                        </p>
                        <p className="mt-1 text-[12px] text-ink/45">{formatBRL(product.price)} cada</p>
                        {stock <= 0 && (
                          <p className="mt-2 text-[12px] text-red-700">
                            Tamanho esgotado — remova este item para continuar.
                          </p>
                        )}
                      </div>
                      <p className="text-[15px] tabular-nums">{formatBRL(lineTotal)}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-ink/25">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          className="p-3"
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                        >
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className="w-9 text-center text-[14px] tabular-nums" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          className="p-3 disabled:opacity-30"
                          disabled={item.quantity >= cap}
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                        >
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="link-underline text-[11px] uppercase tracking-wide2 text-ink/60"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          <Link to="/shop" className="link-underline mt-8 inline-block text-[11px] uppercase tracking-wide2">
            ← Continuar comprando
          </Link>
        </section>

        {/* resumo */}
        <aside className="lg:sticky lg:top-[130px] lg:self-start">
          <div className="bg-paper-deep/60 p-6 md:p-8">
            <h2 className="font-display text-3xl">Resumo do pedido</h2>

            <div className="mt-6 border-b border-ink/15 pb-6">
              <ShippingCalculator
                cep={cep}
                onCepChange={setCep}
                subtotal={subtotal}
                selectedId={selectedShipping?.id ?? shippingId}
                onSelect={setShippingId}
              />
            </div>

            <div className="border-b border-ink/15 py-6">
              {coupon ? (
                <div className="flex items-center justify-between text-[13px]">
                  <span>
                    Cupom <strong className="font-medium">{coupon.code}</strong> — {coupon.label}
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="link-underline text-[11px] uppercase tracking-wide2 text-ink/60"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onCoupon)} noValidate>
                  <label htmlFor="coupon" className="field-label">
                    Cupom de desconto
                  </label>
                  <div className="flex items-end gap-3">
                    <input
                      id="coupon"
                      placeholder="RIGHTNOW10"
                      autoCapitalize="characters"
                      className="field uppercase"
                      aria-invalid={Boolean(errors.code)}
                      {...register('code')}
                    />
                    <button type="submit" className="btn-outline px-5 py-3">
                      Aplicar
                    </button>
                  </div>
                  {errors.code && (
                    <p role="alert" className="mt-1.5 text-[12px] text-red-700">
                      {errors.code.message}
                    </p>
                  )}
                  <p className="mt-2 text-[12px] text-ink/45">
                    Experimente: {COUPONS.map((c) => c.code).join(' ou ')}.
                  </p>
                </form>
              )}
            </div>

            <div className="pt-6">
              <OrderSummary
                totals={totals}
                coupon={coupon}
                hasShipping={hasShipping}
                shippingLabel={selectedShipping?.label}
              />
            </div>

            <button
              type="button"
              className="btn-primary mt-8 w-full py-5"
              disabled={lines.some((l) => l.stock <= 0)}
              onClick={() => navigate('/checkout')}
            >
              Finalizar compra
            </button>
            <p className="mt-4 text-center text-[12px] text-ink/50">
              5% de desconto no Pix · Parcele em até 6x sem juros
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
