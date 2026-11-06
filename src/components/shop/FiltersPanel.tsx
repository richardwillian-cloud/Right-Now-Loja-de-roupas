import clsx from 'clsx'
import { useMemo, type ReactNode } from 'react'
import type { CatalogFilters } from '@/lib/catalog'
import { allSizes, priceBounds, uniqueColors } from '@/lib/catalog'
import { CATEGORY_LABEL, type Category, type Product } from '@/types'

interface Props {
  products: Product[]
  filters: CatalogFilters
  toggle: <K extends 'categories' | 'sizes' | 'colors'>(key: K, value: CatalogFilters[K][number]) => void
  update: (patch: Partial<CatalogFilters>) => void
  reset: () => void
  activeCount: number
}

const CATS: Category[] = ['camisas', 'calcas', 'casacos', 'bones']

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-ink/15 py-6">
      <legend className="eyebrow mb-4 float-left w-full">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  )
}

export function FiltersPanel({ products, filters, toggle, update, reset, activeCount }: Props) {
  const colors = useMemo(() => uniqueColors(products), [products])
  const bounds = useMemo(() => priceBounds(products), [products])
  const sizes = useMemo(
    () => allSizes.filter((s) => products.some((p) => p.sizes.includes(s))),
    [products],
  )

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <p className="eyebrow text-ink">Filtros {activeCount > 0 && `(${activeCount})`}</p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={reset}
            className="link-underline text-[11px] uppercase tracking-wide2 text-ink/60"
          >
            Limpar
          </button>
        )}
      </div>

      <Group title="Categoria">
        <ul className="space-y-3">
          {CATS.map((c) => {
            const count = products.filter((p) => p.category === c).length
            const checked = filters.categories.includes(c)
            return (
              <li key={c}>
                <label className="flex cursor-pointer items-center justify-between text-[14px]">
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle('categories', c)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="flex h-4 w-4 items-center justify-center border border-ink/50 transition-colors peer-checked:border-navy peer-checked:bg-navy peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-royal"
                    >
                      {checked && <span className="h-1.5 w-1.5 bg-paper" />}
                    </span>
                    {CATEGORY_LABEL[c]}
                  </span>
                  <span className="text-ink/40">{count}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </Group>

      <Group title="Tamanho">
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const on = filters.sizes.includes(s)
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggle('sizes', s)}
                className={clsx(
                  'min-w-11 border px-3 py-2 text-[12px] transition-colors duration-300',
                  on ? 'border-navy bg-navy text-paper' : 'border-ink/25 hover:border-ink',
                )}
              >
                {s}
              </button>
            )
          })}
        </div>
      </Group>

      <Group title="Cor">
        <div className="flex flex-wrap gap-3">
          {colors.map((c) => {
            const on = filters.colors.includes(c.name)
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={on}
                aria-label={c.name}
                title={c.name}
                onClick={() => toggle('colors', c.name)}
                className={clsx(
                  'h-8 w-8 rounded-full border transition-all duration-300',
                  on ? 'scale-110 border-royal ring-2 ring-royal ring-offset-2 ring-offset-paper' : 'border-ink/25',
                )}
                style={{ backgroundColor: c.hex }}
              />
            )
          })}
        </div>
      </Group>

      <Group title="Preço (R$)">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-price" className="field-label">
              Mínimo
            </label>
            <input
              id="min-price"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(bounds.min)}
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                update({ minPrice: e.target.value === '' ? null : Number(e.target.value) })
              }
              className="field"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="field-label">
              Máximo
            </label>
            <input
              id="max-price"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(bounds.max)}
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                update({ maxPrice: e.target.value === '' ? null : Number(e.target.value) })
              }
              className="field"
            />
          </div>
        </div>
      </Group>

      <div className="py-6">
        <label className="flex cursor-pointer items-center gap-3 text-[14px]">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => update({ inStockOnly: e.target.checked })}
            className="h-4 w-4 accent-navy"
          />
          Somente disponíveis
        </label>
      </div>
    </div>
  )
}
