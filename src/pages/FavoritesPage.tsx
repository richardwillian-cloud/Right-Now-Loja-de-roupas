import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/product/ProductCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { GLYPHS } from '@/components/music/Notes'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { useProductStore } from '@/store/useProductStore'

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids)
  const clear = useFavoritesStore((s) => s.clear)
  const products = useProductStore((s) => s.products)

  const favorites = ids.flatMap((id) => products.find((p) => p.id === id) ?? [])

  return (
    <>
      <PageHeader
        eyebrow="Sua seleção"
        title="Favoritos"
        description="As peças que você salvou ficam guardadas neste navegador, mesmo se você fechar a loja."
        actions={
          favorites.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="link-underline self-start text-[11px] uppercase tracking-wide2 text-ink/60 md:self-end"
            >
              Limpar favoritos
            </button>
          ) : undefined
        }
      />

      <div className="container-rn">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center border-y border-ink/15 py-28 text-center">
            <span className="font-music text-7xl text-navy/25">{GLYPHS.quarter}</span>
            <h2 className="mt-4 font-display text-4xl">Nenhum favorito ainda</h2>
            <p className="mt-3 max-w-sm text-[14px] text-ink/60">
              Toque no coração de qualquer peça para guardá-la aqui.
            </p>
            <Link to="/shop" className="btn-primary mt-8">
              Explorar a loja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4">
            {favorites.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
