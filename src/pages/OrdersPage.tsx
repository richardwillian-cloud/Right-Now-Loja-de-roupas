import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { PageHeader } from '@/components/ui/PageHeader'
import { GLYPHS } from '@/components/music/Notes'
import { useOrderStore } from '@/store/useOrderStore'
import { productImage } from '@/lib/assets'
import { formatBRL, formatDate } from '@/lib/format'
import { ORDER_STATUSES } from '@/types'

export default function OrdersPage() {
  const orders = useOrderStore((s) => s.orders)
  const clear = useOrderStore((s) => s.clear)
  const [open, setOpen] = useState<string | null>(orders[0]?.id ?? null)

  return (
    <>
      <PageHeader
        eyebrow="Histórico"
        title="Meus pedidos"
        description="Pedidos demonstrativos feitos neste navegador."
        actions={
          orders.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="link-underline self-start text-[11px] uppercase tracking-wide2 text-ink/60 md:self-end"
            >
              Limpar histórico
            </button>
          ) : undefined
        }
      />

      <div className="container-rn">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center border-y border-ink/15 py-28 text-center">
            <span className="font-music text-7xl text-navy/25">{GLYPHS.rest}</span>
            <h2 className="mt-4 font-display text-4xl">Nenhum pedido ainda</h2>
            <p className="mt-3 max-w-sm text-[14px] text-ink/60">
              Faça uma compra demonstrativa para ver o histórico aqui.
            </p>
            <Link to="/shop" className="btn-primary mt-8">
              Ir às compras
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {orders.map((o) => {
              const isOpen = open === o.id
              const step = ORDER_STATUSES.indexOf(o.status)
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : o.id)}
                    className="grid w-full grid-cols-2 items-center gap-4 py-6 text-left md:grid-cols-[1.2fr_1.4fr_1fr_1fr]"
                  >
                    <span className="font-display text-2xl">{o.id}</span>
                    <span className="hidden text-[13px] text-ink/60 md:block">{formatDate(o.createdAt)}</span>
                    <span className="text-[11px] uppercase tracking-wide2 text-royal">{o.status}</span>
                    <span className="text-right text-[15px] tabular-nums">{formatBRL(o.total)}</span>
                  </button>

                  {isOpen && (
                    <div className="grid gap-10 pb-10 md:grid-cols-[1.4fr_1fr]">
                      <div>
                        <ol className="mb-8 flex items-center gap-2" aria-label="Andamento do pedido">
                          {ORDER_STATUSES.map((s, i) => (
                            <li key={s} className="flex flex-1 flex-col gap-2">
                              <span className={clsx('h-[3px]', i <= step ? 'bg-royal' : 'bg-ink/15')} />
                              <span
                                className={clsx(
                                  'text-[10px] uppercase tracking-wide2',
                                  i <= step ? 'text-ink' : 'text-ink/35',
                                )}
                              >
                                {s}
                              </span>
                            </li>
                          ))}
                        </ol>
                        <ul className="divide-y divide-ink/10">
                          {o.lines.map((l) => (
                            <li key={`${l.productId}-${l.size}`} className="flex gap-4 py-4">
                              <span className="block aspect-[4/5] w-16 shrink-0 bg-paper-deep/70">
                                <img src={productImage(l.image)} alt="" className="product-img h-full w-full object-contain" />
                              </span>
                              <div className="flex flex-1 justify-between gap-3 text-[13px]">
                                <div>
                                  <p className="font-display text-xl leading-tight">{l.name}</p>
                                  <p className="text-ink/55">
                                    {l.colorName} · {l.size} · Qtd. {l.quantity}
                                  </p>
                                </div>
                                <p className="tabular-nums">{formatBRL(l.unitPrice * l.quantity)}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4 text-[13px] leading-relaxed text-ink/75">
                        <p>
                          <span className="eyebrow block">Entrega</span>
                          {o.address.street}, {o.address.number} — {o.address.district}, {o.address.city}/{o.address.state}
                        </p>
                        <p>
                          <span className="eyebrow block">Envio</span>
                          {o.shippingLabel}
                        </p>
                        <p>
                          <span className="eyebrow block">Valores</span>
                          Subtotal {formatBRL(o.subtotal)}
                          {o.discount > 0 && <> · Descontos − {formatBRL(o.discount)}</>} · Frete{' '}
                          {o.shipping === 0 ? 'grátis' : formatBRL(o.shipping)}
                        </p>
                        {o.couponCode && (
                          <p>
                            <span className="eyebrow block">Cupom</span>
                            {o.couponCode}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
