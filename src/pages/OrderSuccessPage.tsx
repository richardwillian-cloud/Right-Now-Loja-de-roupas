import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GLYPHS, NoteField, StaffWave } from '@/components/music/Notes'
import { useOrderStore } from '@/store/useOrderStore'
import { productImage } from '@/lib/assets'
import { formatBRL, formatDate } from '@/lib/format'
import NotFoundPage from './NotFoundPage'

const PAYMENT_LABEL = { pix: 'Pix', card: 'Cartão de crédito', boleto: 'Boleto' } as const

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const order = useOrderStore((s) => s.orders.find((o) => o.id === orderId))

  if (!order) return <NotFoundPage />

  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-20 text-paper">
        <NoteField variant="hero" />
        <div className="staff-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-rn relative text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 0.8, 0.2, 1] }}
            className="font-music text-7xl text-royal-light"
          >
            {GLYPHS.beamed}
          </motion.p>
          <motion.h1
            className="display-title mt-6 text-[clamp(48px,9vw,128px)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 0.8, 0.2, 1] }}
          >
            Obrigado por <span className="italic text-royal-light">testar</span> meu site
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-xl font-display text-2xl italic text-paper/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Esta foi uma compra demonstrativa: nenhum pagamento foi feito e nada será enviado. Mas a
            experiência é a de uma loja de verdade.
          </motion.p>
          <p className="mt-8 text-[11px] uppercase tracking-wide3 text-paper/60">
            Pedido {order.id} · {formatDate(order.createdAt)}
          </p>
        </div>
        <StaffWave
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full"
          opacity={0.5}
          amplitude={16}
        />
      </section>

      <div className="container-rn grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <section aria-label="Itens do pedido">
          <h2 className="font-display text-4xl">Resumo do pedido</h2>
          <ul className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
            {order.lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex gap-5 py-5">
                <span className="block aspect-[4/5] w-20 shrink-0 bg-paper-deep/70">
                  <img src={productImage(l.image)} alt="" className="product-img h-full w-full object-contain" />
                </span>
                <div className="flex flex-1 justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl leading-tight">{l.name}</p>
                    <p className="text-[12px] text-ink/60">
                      {l.colorName} · Tam. {l.size} · Qtd. {l.quantity}
                    </p>
                  </div>
                  <p className="tabular-nums">{formatBRL(l.unitPrice * l.quantity)}</p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="ml-auto mt-6 max-w-sm space-y-2 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="tabular-nums">{formatBRL(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-royal">
                <dt>Descontos</dt>
                <dd className="tabular-nums">− {formatBRL(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/60">Frete</dt>
              <dd className="tabular-nums">{order.shipping === 0 ? 'Grátis' : formatBRL(order.shipping)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-ink/20 pt-3">
              <dt className="eyebrow text-ink">Total</dt>
              <dd className="font-display text-3xl tabular-nums">{formatBRL(order.total)}</dd>
            </div>
          </dl>
        </section>

        <aside className="space-y-8 bg-paper-deep/60 p-6 md:p-8">
          <div>
            <p className="eyebrow">Entrega</p>
            <p className="mt-2 text-[14px] leading-relaxed">
              {order.customer.name}
              <br />
              {order.address.street}, {order.address.number}
              {order.address.complement ? ` — ${order.address.complement}` : ''}
              <br />
              {order.address.district} · {order.address.city}/{order.address.state}
              <br />
              CEP {order.address.cep}
            </p>
            <p className="mt-2 text-[12px] text-ink/55">{order.shippingLabel}</p>
          </div>
          <div>
            <p className="eyebrow">Pagamento</p>
            <p className="mt-2 text-[14px]">
              {PAYMENT_LABEL[order.payment.method]}
              {order.payment.cardLast4 && ` · final ${order.payment.cardLast4}`}
              {order.payment.installments && order.payment.installments > 1 && ` · ${order.payment.installments}x`}
            </p>
            <p className="mt-1 text-[12px] text-ink/55">Status: {order.status}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/pedidos" className="btn-primary">
              Ver meus pedidos
            </Link>
            <Link to="/shop" className="btn-outline">
              Continuar explorando
            </Link>
          </div>
        </aside>
      </div>
    </>
  )
}
