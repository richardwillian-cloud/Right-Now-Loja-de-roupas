import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { NoteField, GLYPHS } from '@/components/music/Notes'
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from '@/components/ui/Icons'
import { useCartStore } from '@/store/useCartStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { useUiStore } from '@/store/useUiStore'
import { FREE_SHIPPING_FROM } from '@/lib/shipping'
import { formatBRL } from '@/lib/format'

export const NAV_LINKS = [
  { to: '/shop?sort=new', label: 'Novidades' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?cat=camisas', label: 'Camisas' },
  { to: '/shop?cat=calcas', label: 'Calças' },
  { to: '/shop?cat=casacos', label: 'Casacos' },
  { to: '/shop?cat=bones', label: 'Bonés' },
]

function AnnouncementBar() {
  const items = [
    `Frete grátis acima de ${formatBRL(FREE_SHIPPING_FROM)}`,
    'Projeto de portfólio · loja fictícia',
    '5% off no Pix',
    'Cupom RIGHTNOW10',
    'Bordados com pauta musical em cada peça',
  ]
  const track = [...items, ...items]

  return (
    <div className="overflow-hidden bg-ink py-2 text-paper">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-[10px] uppercase tracking-wide3">
        {track.map((text, i) => (
          <span key={i} className="flex items-center gap-12">
            {text}
            <span className="font-music text-sm text-royal-light">{GLYPHS.eighth}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Header() {
  const cartCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))
  const favCount = useFavoritesStore((s) => s.ids.length)
  const { setCartOpen, setSearchOpen, setMenuOpen } = useUiStore()

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      <div className="relative overflow-hidden bg-navy text-paper">
        <NoteField variant="header" />
        <div className="staff-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />

        <div className="container-rn relative grid h-[76px] grid-cols-[1fr_auto_1fr] items-center">
          {/* esquerda */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              aria-label="Abrir menu"
              className="-ml-2 p-2 lg:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
              {NAV_LINKS.slice(0, 4).map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  className="link-underline text-[11px] font-medium uppercase tracking-wide2 text-paper/85 hover:text-paper"
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* logo */}
          <Link
            to="/"
            aria-label="Right Now — página inicial"
            className="group flex flex-col items-center leading-none"
          >
            <span className="font-display text-[30px] font-semibold uppercase tracking-[0.32em] text-paper sm:text-[36px]">
              Right Now
            </span>
            <span className="font-music mt-0.5 text-[13px] text-royal-light transition-transform duration-700 ease-silk group-hover:translate-x-1">
              {GLYPHS.beamed}
            </span>
          </Link>

          {/* direita */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <nav className="mr-3 hidden items-center gap-7 xl:flex" aria-label="Secundária">
              {NAV_LINKS.slice(4).map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  className="link-underline text-[11px] font-medium uppercase tracking-wide2 text-paper/85 hover:text-paper"
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              aria-label="Buscar"
              className="p-2 transition-colors hover:text-royal-light"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <Link
              to="/pedidos"
              aria-label="Meus pedidos"
              className="hidden p-2 transition-colors hover:text-royal-light sm:block"
            >
              <UserIcon />
            </Link>
            <Link
              to="/favoritos"
              aria-label={`Favoritos (${favCount})`}
              className="relative p-2 transition-colors hover:text-royal-light"
            >
              <HeartIcon />
              {favCount > 0 && <Badge>{favCount}</Badge>}
            </Link>
            <button
              type="button"
              aria-label={`Abrir carrinho (${cartCount} itens)`}
              className="relative p-2 transition-colors hover:text-royal-light"
              onClick={() => setCartOpen(true)}
            >
              <BagIcon />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className={clsx(
        'absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-royal px-1',
        'text-[9px] font-semibold leading-none text-paper',
      )}
    >
      {children}
    </span>
  )
}
