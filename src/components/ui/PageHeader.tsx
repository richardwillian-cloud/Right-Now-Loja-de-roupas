import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GLYPHS } from '@/components/music/Notes'

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Você está em" className="text-[11px] uppercase tracking-wide2 text-ink/55">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.to ? (
              <Link to={item.to} className="link-underline hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="container-rn pb-10 pt-14 md:pt-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          {eyebrow && (
            <p className="eyebrow flex items-center gap-3">
              <span className="font-music text-base text-royal">{GLYPHS.eighth}</span>
              {eyebrow}
            </p>
          )}
          <h1 className="display-title mt-3 text-[clamp(52px,9vw,128px)]">{title}</h1>
          {description && <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/65">{description}</p>}
        </div>
        {actions}
      </div>
    </div>
  )
}
