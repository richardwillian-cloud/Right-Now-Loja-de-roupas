import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { Product } from '@/types'
import { CATEGORY_LABEL } from '@/types'
import { productImage } from '@/lib/assets'
import { inStock } from '@/lib/catalog'
import { FavoriteButton } from './FavoriteButton'
import { Price } from './Price'

export function ProductCard({
  product,
  priority = false,
  tone = 'light',
}: {
  product: Product
  priority?: boolean
  tone?: 'light' | 'dark'
}) {
  const available = inStock(product)
  const [front, back] = product.images
  const dark = tone === 'dark'

  return (
    <article className="group relative">
      <Link
        to={`/produto/${product.slug}`}
        className="block focus-visible:outline-offset-4"
        aria-label={`${product.name} — ${product.colorway.name}`}
      >
        <div
          className={clsx(
            'relative aspect-[4/5] overflow-hidden',
            dark ? 'bg-paper' : 'bg-paper-deep/70',
          )}
        >
          <img
            src={productImage(front)}
            alt={`${product.name} ${product.colorway.name}, frente`}
            loading={priority ? 'eager' : 'lazy'}
            className={clsx(
              'product-img absolute inset-0 h-full w-full object-contain transition-all duration-[900ms] ease-silk',
              back ? 'group-hover:scale-[1.02] group-hover:opacity-0' : 'group-hover:scale-[1.05]',
              !available && 'opacity-60',
            )}
          />
          {back && (
            <img
              src={productImage(back)}
              alt={`${product.name} ${product.colorway.name}, costas`}
              loading="lazy"
              className="product-img absolute inset-0 h-full w-full scale-[0.98] object-contain opacity-0 transition-all duration-[900ms] ease-silk group-hover:scale-100 group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && available && (
              <span className="bg-navy px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide2 text-paper">
                Novo
              </span>
            )}
            {!available && (
              <span className="bg-ink/80 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide2 text-paper">
                Esgotado
              </span>
            )}
          </div>

          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-navy/95 py-3 text-center text-[10px] font-medium uppercase tracking-wide2 text-paper transition-transform duration-500 ease-silk group-hover:translate-y-0">
            Ver peça
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p
              className={clsx(
                'text-[10px] uppercase tracking-wide2',
                dark ? 'text-paper/55' : 'text-ink/50',
              )}
            >
              {CATEGORY_LABEL[product.category]}
            </p>
            <h3
              className={clsx(
                'mt-1 font-display text-[22px] font-medium leading-tight',
                dark ? 'text-paper' : 'text-ink',
              )}
            >
              {product.name}
            </h3>
            <p
              className={clsx(
                'mt-1 flex items-center gap-2 text-[12px]',
                dark ? 'text-paper/60' : 'text-ink/55',
              )}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border border-ink/20"
                style={{ backgroundColor: product.colorway.hex }}
              />
              {product.colorway.name}
            </p>
          </div>
          <Price
            value={product.price}
            compareAt={product.compareAtPrice}
            className={clsx('pt-5 text-[14px]', dark ? 'text-paper' : 'text-ink')}
          />
        </div>
      </Link>

      <FavoriteButton
        productId={product.id}
        productName={product.name}
        className={clsx(
          'absolute right-3 top-3 z-10 h-9 w-9 items-center justify-center rounded-full backdrop-blur',
          dark ? 'bg-navy/70 text-paper' : 'bg-paper/80',
        )}
      />
    </article>
  )
}
