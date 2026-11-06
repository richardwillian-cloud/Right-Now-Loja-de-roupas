import { formatBRL } from '@/lib/format'
import type { Totals } from '@/lib/pricing'
import type { Coupon } from '@/lib/pricing'

export function OrderSummary({
  totals,
  coupon,
  shippingLabel,
  hasShipping,
}: {
  totals: Totals
  coupon: Coupon | null
  shippingLabel?: string
  hasShipping: boolean
}) {
  return (
    <dl className="space-y-3 text-[14px]">
      <div className="flex justify-between">
        <dt className="text-ink/65">Subtotal</dt>
        <dd className="tabular-nums">{formatBRL(totals.subtotal)}</dd>
      </div>
      {coupon && (
        <div className="flex justify-between text-royal">
          <dt>Cupom {coupon.code}</dt>
          <dd className="tabular-nums">− {formatBRL(totals.couponDiscount)}</dd>
        </div>
      )}
      {totals.pixDiscount > 0 && (
        <div className="flex justify-between text-royal">
          <dt>Desconto Pix</dt>
          <dd className="tabular-nums">− {formatBRL(totals.pixDiscount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-ink/65">Frete{shippingLabel ? ` (${shippingLabel})` : ''}</dt>
        <dd className="tabular-nums">
          {!hasShipping ? 'A calcular' : totals.shipping === 0 ? 'Grátis' : formatBRL(totals.shipping)}
        </dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-ink/20 pt-4">
        <dt className="eyebrow text-ink">Total</dt>
        <dd className="font-display text-4xl tabular-nums">{formatBRL(totals.total)}</dd>
      </div>
    </dl>
  )
}
