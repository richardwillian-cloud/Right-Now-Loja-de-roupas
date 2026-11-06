import { Link } from 'react-router-dom'
import { GLYPHS, NoteField } from '@/components/music/Notes'

export default function NotFoundPage() {
  return (
    <section className="relative overflow-hidden bg-navy py-32 text-paper">
      <NoteField variant="hero" />
      <div className="staff-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-rn relative text-center">
        <p className="font-music text-7xl text-royal-light">{GLYPHS.rest}</p>
        <h1 className="display-title mt-6 text-[clamp(56px,10vw,140px)]">Pausa.</h1>
        <p className="mx-auto mt-6 max-w-md font-display text-2xl italic text-paper/80">
          Essa página não está na partitura. Volte para o compasso da loja.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to="/" className="btn-light">
            Início
          </Link>
          <Link to="/shop" className="btn-outline-light">
            Ver a loja
          </Link>
        </div>
      </div>
    </section>
  )
}
