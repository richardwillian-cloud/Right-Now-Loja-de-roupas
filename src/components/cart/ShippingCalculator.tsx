import clsx from 'clsx'
import { useMemo } from 'react'
import { calcShippingOptions, deliveryEstimate, isValidCep, regionFromCep } from '@/lib/shipping'
import { formatBRL, maskCep } from '@/lib/format'
import type { ShippingOptionId } from '@/types'

/**
 * Cálculo de frete demonstrativo. Componente controlado: quem usa decide
 * onde guardar o CEP (loja do carrinho ou estado local da página de produto).
 */
export function ShippingCalculator({
  cep,
  onCepChange,
  subtotal,
  selectedId,
  onSelect,
  compact = false,
}: {
  cep: string
  onCepChange: (cep: string) => void
  subtotal: number
  selectedId?: ShippingOptionId
  onSelect?: (id: ShippingOptionId) => void
  compact?: boolean
}) {
  const valid = isValidCep(cep)
  const options = useMemo(() => calcShippingOptions(cep, subtotal), [cep, subtotal])
  const region = regionFromCep(cep)

  return (
    <div>
      <label htmlFor="shipping-cep" className="field-label">
        Calcular frete
      </label>
      <input
        id="shipping-cep"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="00000-000"
        value={cep}
        onChange={(e) => onCepChange(maskCep(e.target.value))}
        className="field"
        aria-describedby="shipping-help"
      />
      <p id="shipping-help" className="mt-1.5 text-[12px] text-ink/45">
        Cálculo demonstrativo pela região do CEP.
      </p>

      {cep.length > 0 && !valid && (
        <p className="mt-2 text-[12px] text-ink/55">Digite os 8 dígitos do CEP.</p>
      )}

      {valid && options.length > 0 && (
        <div className="mt-4" role="radiogroup" aria-label="Opções de entrega">
          {region && <p className="mb-3 text-[12px] text-ink/60">Entrega para {region.name}</p>}
          <ul className="space-y-2">
            {options.map((o) => {
              const selected = selectedId === o.id
              const className = clsx(
                'flex w-full items-center justify-between gap-4 border px-4 text-left transition-colors duration-300',
                compact ? 'py-3' : 'py-4',
                selected ? 'border-navy bg-navy/5' : 'border-ink/20',
                onSelect && 'hover:border-ink',
              )
              const content = (
                <>
                  <span>
                    <span className="block text-[13px] font-medium">{o.label}</span>
                    <span className="block text-[12px] text-ink/55">
                      {o.minDays}–{o.maxDays} dias úteis · chega entre {deliveryEstimate(o)}
                    </span>
                  </span>
                  <span className="text-[14px] tabular-nums">
                    {o.price === 0 ? 'Grátis' : formatBRL(o.price)}
                  </span>
                </>
              )
              return (
                <li key={o.id}>
                  {onSelect ? (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => onSelect(o.id)}
                      className={className}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className={className}>{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
