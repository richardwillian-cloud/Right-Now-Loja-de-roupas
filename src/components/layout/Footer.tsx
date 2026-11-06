import { Link } from 'react-router-dom'
import { GLYPHS, NoteField, StaffWave } from '@/components/music/Notes'
import { NewsletterForm } from './NewsletterForm'

const columns = [
  {
    title: 'Loja',
    links: [
      { to: '/shop?sort=new', label: 'Novidades' },
      { to: '/shop?cat=camisas', label: 'Camisas' },
      { to: '/shop?cat=calcas', label: 'Calças' },
      { to: '/shop?cat=casacos', label: 'Casacos' },
      { to: '/shop?cat=bones', label: 'Bonés' },
    ],
  },
  {
    title: 'Conta',
    links: [
      { to: '/favoritos', label: 'Favoritos' },
      { to: '/cart', label: 'Carrinho' },
      { to: '/pedidos', label: 'Meus pedidos' },
      { to: '/admin', label: 'Painel admin' },
    ],
  },
  {
    title: 'Ajuda',
    links: [
      { to: '/ajuda', label: 'Trocas e devoluções' },
      { to: '/ajuda#medidas', label: 'Guia de medidas' },
      { to: '/ajuda#entrega', label: 'Prazos de entrega' },
      { to: '/ajuda#cuidados', label: 'Cuidados com as peças' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden bg-navy text-paper">
      <StaffWave
        className="absolute inset-x-0 top-0 h-28 w-full opacity-60"
        notes={false}
        animate={false}
        opacity={0.35}
        amplitude={16}
      />
      <NoteField variant="hero" className="opacity-60" />

      <div className="container-rn relative pb-10 pt-32">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="eyebrow-light">Newsletter</p>
            <h2 className="mt-4 max-w-md font-display text-5xl font-medium leading-[0.95]">
              Cada drop é uma nova composição.
            </h2>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="eyebrow-light">{c.title}</p>
                <ul className="mt-5 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="link-underline text-[14px] text-paper/85 hover:text-paper">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-paper/15 pt-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-[clamp(56px,11vw,150px)] font-semibold uppercase leading-[0.85] tracking-[0.12em]">
              Right Now
              <span className="font-music ml-4 text-[0.5em] text-royal-light">{GLYPHS.beamed}</span>
            </p>
          </div>
          <div className="max-w-sm text-[12px] leading-relaxed text-paper/60">
            <p>
              Right Now é uma loja fictícia criada como projeto de portfólio. Nenhum produto é vendido e
              nenhum pagamento é processado.
            </p>
            <p className="mt-3">© {new Date().getFullYear()} Right Now · Feito com React, TypeScript, Tailwind, Zustand, React Hook Form e Zod.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
