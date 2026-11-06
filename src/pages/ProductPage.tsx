import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import clsx from 'clsx'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductCard } from '@/components/product/ProductCard'
import { FavoriteButton } from '@/components/product/FavoriteButton'
import { Price } from '@/components/product/Price'
import { SizeChartTable } from '@/components/product/SizeChartTable'
import { ShippingCalculator } from '@/components/cart/ShippingCalculator'
import { Accordion } from '@/components/ui/Accordion'
import { Breadcrumbs } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Reveal } from '@/components/ui/Reveal'
import { GLYPHS } from '@/components/music/Notes'
import { SwapIcon, TruckIcon } from '@/components/ui/Icons'
import { useProductStore } from '@/store/useProductStore'
import { useCartStore } from '@/store/useCartStore'
import { useUiStore } from '@/store/useUiStore'
import { getColorways, getRelated } from '@/lib/catalog'
import { formatBRL, installmentsText } from '@/lib/format'
import { PIX_DISCOUNT_PERCENT } from '@/lib/pricing'
import { FREE_SHIPPING_FROM } from '@/lib/shipping'
import { CATEGORY_LABEL } from '@/types'
import NotFoundPage from './NotFoundPage'

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const products = useProductStore((s) => s.products)
  const addItem = useCartStore((s) => s.addItem)
  const { setCartOpen, pushToast } = useUiStore()

  const product = products.find((p) => p.slug === slug)

  const [size, setSize] = useState<string | null>(null)
  const [sizeError, setSizeError] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [cep, setCep] = useState('')

  // reinicia a seleção ao trocar de produto/cor
  useEffect(() => {
    setSizeError(false)
    setSize(product && product.sizes.length === 1 && (product.stock[product.sizes[0]] ?? 0) > 0 ? product.sizes[0] : null)
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const colorways = useMemo(() => (product ? getColorways(products, product) : []), [products, product])
  const related = useMemo(() => (product ? getRelated(products, product) : []), [products, product])

  if (!product) return <NotFoundPage />

  const lowStock = size ? product.stock[size] ?? 0 : 0
  const soldOut = Object.values(product.stock).every((n) => n <= 0)

  const handleAdd = () => {
    if (!size) {
      setSizeError(true)
      pushToast('Selecione um tamanho', 'error')
      return
    }
    const result = addItem(product.id, size)
    if (result === 'ok') {
      pushToast('Adicionado ao carrinho', 'success')
      setCartOpen(true)
    } else if (result === 'limit') {
      pushToast('Quantidade máxima disponível já está no carrinho', 'error')
    } else {
      pushToast('Tamanho esgotado', 'error')
    }
  }

  const { specs } = product

  return (
    <>
      <div className="container-rn pb-24 pt-8">
        <Breadcrumbs
          items={[
            { label: 'Início', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: CATEGORY_LABEL[product.category], to: `/shop?cat=${product.category}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <ProductGallery images={product.images} alt={`${product.name} ${product.colorway.name}`} />

          {/* ---------------------------- informações ---------------------------- */}
          <div className="lg:sticky lg:top-[130px] lg:self-start">
            <p className="eyebrow flex items-center gap-3">
              <span className="font-music text-base text-royal">{GLYPHS.eighth}</span>
              {product.collection}
            </p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="display-title text-[clamp(40px,5vw,72px)]">{product.name}</h1>
              <FavoriteButton
                productId={product.id}
                productName={product.name}
                className="mt-2 shrink-0"
              />
            </div>

            <div className="mt-5 flex items-baseline gap-4">
              <Price value={product.price} compareAt={product.compareAtPrice} className="text-[26px]" />
              {product.isNew && (
                <span className="bg-navy px-2.5 py-1 text-[9px] font-medium uppercase tracking-wide2 text-paper">
                  Novo
                </span>
              )}
            </div>
            <p className="mt-2 text-[13px] text-ink/60">
              ou {installmentsText(product.price)} ·{' '}
              <span className="text-royal">
                {formatBRL(product.price * (1 - PIX_DISCOUNT_PERCENT / 100))} no Pix
              </span>
            </p>

            <p className="mt-6 text-[15px] leading-relaxed text-ink/75">{product.shortDescription}</p>

            {/* cor */}
            <div className="mt-8">
              <p className="eyebrow text-ink">
                Cor: <span className="font-normal text-ink/60">{product.colorway.name}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {colorways.map((c) => {
                  const active = c.id === product.id
                  return (
                    <Link
                      key={c.id}
                      to={`/produto/${c.slug}`}
                      aria-label={`${c.colorway.name}${active ? ' (selecionada)' : ''}`}
                      aria-current={active ? 'true' : undefined}
                      title={c.colorway.name}
                      className={clsx(
                        'h-9 w-9 rounded-full border transition-all duration-500 ease-silk',
                        active
                          ? 'scale-105 border-royal ring-2 ring-royal ring-offset-2 ring-offset-paper'
                          : 'border-ink/25 hover:scale-105',
                      )}
                      style={{ backgroundColor: c.colorway.hex }}
                    />
                  )
                })}
              </div>
              {colorways.length === 1 && (
                <p className="mt-2 text-[12px] text-ink/45">Cor única nesta edição.</p>
              )}
            </div>

            {/* tamanho */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className={clsx('eyebrow', sizeError ? 'text-red-700' : 'text-ink')}>
                  Tamanho {size && <span className="font-normal text-ink/60">: {size}</span>}
                </p>
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="link-underline text-[11px] uppercase tracking-wide2 text-ink/70"
                >
                  Guia de medidas
                </button>
              </div>
              <div
                className="mt-3 flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Tamanho"
                aria-invalid={sizeError}
              >
                {product.sizes.map((s) => {
                  const qty = product.stock[s] ?? 0
                  const unavailable = qty <= 0
                  const selected = size === s
                  return (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={unavailable}
                      onClick={() => {
                        setSize(s)
                        setSizeError(false)
                      }}
                      className={clsx(
                        'relative min-w-14 border px-4 py-3.5 text-[13px] transition-all duration-300',
                        selected
                          ? 'border-navy bg-navy text-paper'
                          : sizeError
                            ? 'border-red-700/60 hover:border-ink'
                            : 'border-ink/25 hover:border-ink',
                        unavailable && 'cursor-not-allowed text-ink/30 line-through hover:border-ink/25',
                      )}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
              {sizeError && (
                <p role="alert" className="mt-2 text-[12px] text-red-700">
                  Escolha um tamanho para continuar.
                </p>
              )}
              {size && lowStock > 0 && lowStock <= 3 && (
                <p className="mt-3 text-[12px] text-ocean-dark">
                  Últimas {lowStock} {lowStock === 1 ? 'unidade' : 'unidades'} no tamanho {size}.
                </p>
              )}
            </div>

            {/* ações */}
            <div className="mt-8 flex flex-col gap-3">
              <button type="button" className="btn-primary w-full py-5" disabled={soldOut} onClick={handleAdd}>
                {soldOut ? 'Esgotado' : 'Adicionar ao carrinho'}
              </button>
              <FavoriteButton
                productId={product.id}
                productName={product.name}
                withLabel
                className="btn-outline w-full"
              />
            </div>

            {/* benefícios */}
            <ul className="mt-8 space-y-3 text-[13px] text-ink/70">
              <li className="flex items-center gap-3">
                <TruckIcon width={18} height={18} className="text-royal" />
                Frete grátis acima de {formatBRL(FREE_SHIPPING_FROM)}
              </li>
              <li className="flex items-center gap-3">
                <SwapIcon width={18} height={18} className="text-royal" />
                Primeira troca grátis em até 30 dias
              </li>
            </ul>

            <div className="mt-8 border-t border-ink/15 pt-6">
              <ShippingCalculator cep={cep} onCepChange={setCep} subtotal={product.price} compact />
            </div>

            {/* especificações */}
            <div className="mt-10">
              <Accordion
                defaultOpen="descricao"
                items={[
                  {
                    id: 'descricao',
                    title: 'Descrição',
                    content: (
                      <div className="space-y-4">
                        <p>{product.description}</p>
                        <ul className="space-y-2">
                          {specs.details.map((d) => (
                            <li key={d} className="flex gap-3">
                              <span className="font-music text-royal">{GLYPHS.eighth}</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  },
                  {
                    id: 'modelagem',
                    title: 'Modelagem e comprimento',
                    content: (
                      <dl className="space-y-4">
                        <div>
                          <dt className="eyebrow">Modelagem</dt>
                          <dd className="mt-1">{specs.fit}</dd>
                        </div>
                        <div>
                          <dt className="eyebrow">Comprimento</dt>
                          <dd className="mt-1">{specs.length}</dd>
                        </div>
                        <div>
                          <dt className="eyebrow">Modelo</dt>
                          <dd className="mt-1">{product.modelInfo}</dd>
                        </div>
                      </dl>
                    ),
                  },
                  {
                    id: 'medidas',
                    title: 'Tabela de medidas',
                    content: <SizeChartTable chart={product.sizeChart} highlight={size} />,
                  },
                  {
                    id: 'composicao',
                    title: 'Composição e cuidados',
                    content: (
                      <div className="space-y-5">
                        <dl className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-3">
                          <dt className="eyebrow">Composição</dt>
                          <dd>{specs.composition}</dd>
                          <dt className="eyebrow">Gramatura</dt>
                          <dd>{specs.weight}</dd>
                          <dt className="eyebrow">Técnica</dt>
                          <dd>{specs.technique}</dd>
                          {specs.closure && (
                            <>
                              <dt className="eyebrow">Fechamento</dt>
                              <dd>{specs.closure}</dd>
                            </>
                          )}
                          <dt className="eyebrow">Origem</dt>
                          <dd>{specs.origin}</dd>
                        </dl>
                        <div>
                          <p className="eyebrow">Cuidados</p>
                          <ul className="mt-2 list-disc space-y-1.5 pl-5">
                            {specs.care.map((c) => (
                              <li key={c}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 'entrega',
                    title: 'Entrega, trocas e devoluções',
                    content: (
                      <ul className="list-disc space-y-2 pl-5">
                        <li>Envio em até 2 dias úteis após a confirmação do pagamento.</li>
                        <li>Primeira troca gratuita em até 30 dias, com a peça sem uso e com etiquetas.</li>
                        <li>Direito de arrependimento de 7 dias corridos após o recebimento.</li>
                        <li>Peças bordadas são conferidas manualmente antes de cada envio.</li>
                        <li>
                          Esta é uma loja demonstrativa: nenhum produto é realmente enviado.
                        </li>
                      </ul>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* complete o look */}
        {related.length > 0 && (
          <section className="mt-28">
            <Reveal>
              <p className="eyebrow">Combine com</p>
              <h2 className="display-title mt-3 text-[clamp(40px,5vw,72px)]">
                Complete o <span className="italic text-royal">look</span>
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-4 md:gap-x-5">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* barra fixa de compra no mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-ink/15 bg-paper/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-tight">{product.name}</p>
          <p className="text-[13px] tabular-nums text-ink/70">{formatBRL(product.price)}</p>
        </div>
        <button type="button" className="btn-primary px-6 py-3.5" disabled={soldOut} onClick={handleAdd}>
          {soldOut ? 'Esgotado' : 'Comprar'}
        </button>
      </div>

      <Modal open={guideOpen} onClose={() => setGuideOpen(false)} title="Guia de medidas" wide>
        <SizeChartTable chart={product.sizeChart} highlight={size} />
        <p className="mt-6 text-[13px] leading-relaxed text-ink/65">
          <strong className="font-medium text-ink">Como escolher:</strong> compare as medidas da tabela com
          uma peça sua que tenha o caimento que você gosta, deitada sobre uma superfície plana. {product.modelInfo}
        </p>
      </Modal>
    </>
  )
}
