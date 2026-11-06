import { useState, type MouseEvent } from 'react'
import clsx from 'clsx'
import { productImage } from '@/lib/assets'

const LABELS = ['Frente', 'Costas', 'Detalhe']

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div className="grid gap-3 md:grid-cols-[84px_1fr]">
      {/* miniaturas */}
      {images.length > 1 && (
        <div className="order-2 flex gap-3 md:order-1 md:flex-col" role="tablist" aria-label="Fotos do produto">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={LABELS[i] ?? `Foto ${i + 1}`}
              onClick={() => setActive(i)}
              className={clsx(
                'aspect-[4/5] w-20 bg-paper-deep/70 transition-all duration-500 md:w-full',
                active === i ? 'ring-1 ring-navy' : 'opacity-60 hover:opacity-100',
              )}
            >
              <img src={productImage(img)} alt="" className="product-img h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* imagem principal */}
      <div
        className="relative order-1 aspect-[4/5] cursor-zoom-in overflow-hidden bg-paper-deep/70 md:order-2"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
      >
        {images.map((img, i) => (
          <img
            key={img}
            src={productImage(img)}
            alt={i === active ? `${alt} — ${LABELS[i] ?? `foto ${i + 1}`}` : ''}
            className={clsx(
              'product-img absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-[700ms] ease-silk',
              i === active ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={
              i === active && zoom
                ? { transform: 'scale(2.1)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
                : undefined
            }
            draggable={false}
          />
        ))}
        <span className="pointer-events-none absolute bottom-3 left-3 text-[10px] uppercase tracking-wide2 text-ink/50">
          {LABELS[active] ?? ''} · passe o mouse para ampliar
        </span>
      </div>
    </div>
  )
}
