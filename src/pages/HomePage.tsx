import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GLYPHS, NoteDivider, NoteField, StaffWave } from '@/components/music/Notes'
import { ProductCard } from '@/components/product/ProductCard'
import { Reveal } from '@/components/ui/Reveal'
import { ArrowRightIcon, SwapIcon, TruckIcon } from '@/components/ui/Icons'
import { useProductStore } from '@/store/useProductStore'
import { productImage } from '@/lib/assets'
import { CATEGORY_LABEL, type Category } from '@/types'
import { FREE_SHIPPING_FROM } from '@/lib/shipping'
import { formatBRL } from '@/lib/format'

const CATEGORY_ORDER: Category[] = ['camisas', 'calcas', 'casacos', 'bones']

const ease = [0.22, 0.8, 0.2, 1] as const

export default function HomePage() {
  const products = useProductStore((s) => s.products)

  const featured = products.filter((p) => p.featured).slice(0, 4)
  const bySlug = (slug: string) => products.find((p) => p.slug === slug)
  const heroTee = bySlug('camiseta-partitura-marinho') ?? products[0]
  const heroJacket = bySlug('jaqueta-ameixeira') ?? products[1] ?? heroTee
  const tiger = bySlug('sueter-tigre-carmim')
  const hoodie = bySlug('moletom-costelas-violeta')
  const plum = bySlug('jaqueta-ameixeira')
  const caps = products.filter((p) => p.category === 'bones')

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section className="relative overflow-hidden bg-navy text-paper">
        <NoteField variant="hero" />
        <div className="staff-bg pointer-events-none absolute inset-0" aria-hidden />

        <div className="container-rn relative grid min-h-[calc(100svh-110px)] items-center gap-10 py-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative z-10">
            <motion.p
              className="eyebrow-light flex items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              <span className="font-music text-lg text-royal-light">{GLYPHS.beamed}</span>
              Coleção 01 — Partitura
            </motion.p>

            <h1 className="display-title mt-6 text-[clamp(72px,13vw,210px)]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease }}
              >
                Right
              </motion.span>
              <motion.span
                className="block italic text-royal-light"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.25, ease }}
              >
                Now.
              </motion.span>
            </h1>

            <motion.p
              className="mt-8 max-w-md font-display text-[26px] italic leading-snug text-paper/85"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease }}
            >
              Moda urbana premium em que cada bordado é uma partitura. Peças para usar no tempo certo:
              agora.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease }}
            >
              <Link to="/shop" className="btn-light">
                Explorar a coleção <ArrowRightIcon width={16} height={16} />
              </Link>
              <Link to="/shop?sort=new" className="btn-outline-light">
                Novidades
              </Link>
            </motion.div>
          </div>

          <div className="relative mx-auto w-full max-w-[620px]">
            {heroTee && (<>
            <motion.div
              className="relative z-10 ml-auto aspect-[4/5] w-[74%] bg-paper"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease }}
            >
              <img
                src={productImage(heroTee.images[0])}
                alt={`${heroTee.name} ${heroTee.colorway.name}`}
                className="product-img h-full w-full object-contain"
              />
              <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wide2 text-ink/60">
                01 — {heroTee.name}
              </span>
            </motion.div>
            <motion.div
              className="absolute -bottom-6 left-0 z-20 aspect-[4/5] w-[50%] bg-paper-deep shadow-2xl"
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease }}
            >
              <img
                src={productImage(heroJacket.images[0])}
                alt={`${heroJacket.name}`}
                className="product-img h-full w-full object-contain"
              />
              <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wide2 text-ink/60">
                02 — {heroJacket.name}
              </span>
            </motion.div>
            </>)}
          </div>
        </div>

        <StaffWave
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full"
          opacity={0.55}
          amplitude={22}
        />
      </section>

      {/* ----------------------------- MARQUEE ---------------------------- */}
      <div className="overflow-hidden border-b border-ink/15 bg-paper py-5">
        <div className="flex w-max animate-marquee gap-14 whitespace-nowrap font-display text-3xl italic text-navy">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex items-center gap-14">
              {['Partitura', 'Bordado à mão livre', 'Denim cru', 'Tricô jacquard', 'Edição limitada', 'Feito no Brasil'].map(
                (t) => (
                  <span key={t + k} className="flex items-center gap-14">
                    {t}
                    <span className="font-music text-2xl not-italic text-royal">{GLYPHS.beamed}</span>
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------- CATEGORIAS --------------------------- */}
      <section className="container-rn pt-24">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Compre por categoria</p>
              <h2 className="display-title mt-3 text-[clamp(44px,6vw,88px)]">Quatro movimentos</h2>
            </div>
            <Link to="/shop" className="link-underline hidden text-[11px] uppercase tracking-wide2 md:block">
              Ver tudo
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {CATEGORY_ORDER.map((cat, i) => {
            const sample = products.find((p) => p.category === cat && p.featured) ?? products.find((p) => p.category === cat)
            const count = products.filter((p) => p.category === cat).length
            return (
              <Reveal key={cat} delay={i * 0.08}>
                <Link to={`/shop?cat=${cat}`} className="group relative block aspect-[3/4] overflow-hidden bg-paper-deep/70">
                  {sample && (
                    <img
                      src={productImage(sample.images[0])}
                      alt=""
                      loading="lazy"
                      className="product-img absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.06]"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-navy/85 to-transparent p-4 pt-14 text-paper md:p-5">
                    <div>
                      <p className="font-display text-3xl leading-none md:text-4xl">{CATEGORY_LABEL[cat]}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide2 text-paper/70">{count} peças</p>
                    </div>
                    <ArrowRightIcon className="transition-transform duration-500 ease-silk group-hover:translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* --------------------------- DESTAQUES ---------------------------- */}
      <section className="container-rn pt-32">
        <Reveal>
          <NoteDivider />
          <div className="mt-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">Em destaque</p>
              <h2 className="display-title mt-3 text-[clamp(44px,6vw,88px)]">
                Peças <span className="italic text-royal">assinatura</span>
              </h2>
            </div>
            <Link to="/shop" className="link-underline hidden text-[11px] uppercase tracking-wide2 md:block">
              Ver coleção completa
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-4 md:gap-x-5">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------- MANIFESTO --------------------------- */}
      <section className="relative mt-32 overflow-hidden bg-navy py-28 text-paper">
        <div className="staff-bg pointer-events-none absolute inset-0" aria-hidden />
        <NoteField variant="hero" />
        <div className="container-rn relative">
          <Reveal>
            <p className="eyebrow-light flex items-center gap-3">
              <span className="font-music text-lg text-royal-light">{GLYPHS.treble}</span>
              Manifesto
            </p>
            <p className="mt-8 max-w-5xl font-display text-[clamp(36px,5.4vw,84px)] font-medium italic leading-[1.02]">
              Roupa também tem <span className="text-royal-light">ritmo</span>. Cada pauta bordada é uma
              melodia que você veste, no compasso exato do seu agora.
            </p>
          </Reveal>

          <div className="mt-20 grid gap-10 border-t border-paper/20 pt-12 md:grid-cols-3">
            {[
              {
                n: '01',
                t: 'Bordado de partitura',
                d: 'Pautas e notas bordadas ponto a ponto, com mais de 30 mil pontos por peça e efeito de traço manual.',
              },
              {
                n: '02',
                t: 'Tecidos pesados',
                d: 'Algodão 260 g/m², denim cru de 13 oz, tricô jacquard e veludo cotelê. Peças feitas para durar.',
              },
              {
                n: '03',
                t: 'Modelagem urbana',
                d: 'Oversized, wide leg e flare. Cada produto traz medidas reais, comprimento e a altura do modelo.',
              },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 0.1}>
                <p className="font-music text-3xl text-royal-light">{GLYPHS.eighth}</p>
                <p className="mt-3 text-[11px] uppercase tracking-wide3 text-paper/50">{item.n}</p>
                <h3 className="mt-3 font-display text-3xl font-medium">{item.t}</h3>
                <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-paper/70">{item.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------- COLEÇÃO JARDIM DE INVERNO ---------------------- */}
      {tiger && hoodie && plum && (
        <section className="container-rn pt-32">
          <Reveal>
            <p className="eyebrow">Coleção 03</p>
            <h2 className="display-title mt-3 text-[clamp(44px,6vw,96px)]">
              Jardim de <span className="italic text-royal">Inverno</span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/65">
              Tigres, ameixeiras e costelas: o desenho assume o protagonismo. Jaquetas, tricô e moletom
              pensados como obras para vestir.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[plum, tiger, hoodie].map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <Link
                  to={`/produto/${p.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden bg-paper-deep/70"
                >
                  <img
                    src={productImage(p.images[0])}
                    alt={p.name}
                    loading="lazy"
                    className="product-img h-full w-full object-contain transition-transform duration-[1200ms] ease-silk group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-navy px-5 py-4 text-paper">
                    <span className="font-display text-2xl">{p.name}</span>
                    <span className="text-[13px] tabular-nums">{formatBRL(p.price)}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------ BONÉS ----------------------------- */}
      <section className="container-rn pt-32">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Acessórios</p>
              <h2 className="display-title mt-3 text-[clamp(44px,6vw,88px)]">
                Bonés <span className="italic text-royal">bordados</span>
              </h2>
            </div>
            <Link
              to="/shop?cat=bones"
              className="link-underline hidden text-[11px] uppercase tracking-wide2 md:block"
            >
              Ver bonés
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-3">
          {caps.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------- BENEFÍCIOS DE COMPRA ------------------------ */}
      <section className="container-rn pt-32">
        <div className="grid divide-y divide-ink/15 border-y border-ink/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            {
              icon: <TruckIcon />,
              t: 'Frete grátis',
              d: `Entrega padrão grátis acima de ${formatBRL(FREE_SHIPPING_FROM)}.`,
            },
            {
              icon: <SwapIcon />,
              t: 'Troca em 30 dias',
              d: 'Primeira troca sem custo. Peça sem uso e com etiqueta.',
            },
            {
              icon: <span className="font-music text-xl">{GLYPHS.beamed}</span>,
              t: '5% off no Pix · 6x sem juros',
              d: 'Parcelas a partir de R$ 60. Cupom RIGHTNOW10 vale 10% no pedido.',
            },
          ].map((b) => (
            <div key={b.t} className="flex items-start gap-5 px-2 py-8 md:px-8">
              <span className="mt-1 text-royal">{b.icon}</span>
              <div>
                <p className="font-display text-2xl">{b.t}</p>
                <p className="mt-1 text-[14px] text-ink/60">{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
