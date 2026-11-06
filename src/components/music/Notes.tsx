import { useMemo, type CSSProperties } from 'react'
import clsx from 'clsx'

/** Glifos musicais (fonte Noto Music). */
export const GLYPHS = {
  treble: '𝄞',
  bass: '𝄢',
  eighth: '♪',
  beamed: '♫',
  quarter: '♩',
  sharp: '♯',
  flat: '♭',
  natural: '♮',
  rest: '𝄽',
} as const

type GlyphName = keyof typeof GLYPHS

interface NoteSpec {
  glyph: GlyphName
  top: string
  left: string
  size: number
  rotate: number
  delay: number
  opacity: number
}

/** Posições fixas (determinísticas) para evitar "pulos" entre renders. */
const HEADER_NOTES: NoteSpec[] = [
  { glyph: 'beamed', top: '12%', left: '3%', size: 26, rotate: -12, delay: 0, opacity: 0.55 },
  { glyph: 'treble', top: '-6%', left: '14%', size: 58, rotate: 6, delay: 1.2, opacity: 0.22 },
  { glyph: 'eighth', top: '52%', left: '24%', size: 22, rotate: 10, delay: 0.6, opacity: 0.5 },
  { glyph: 'sharp', top: '20%', left: '36%', size: 20, rotate: 0, delay: 2.1, opacity: 0.35 },
  { glyph: 'quarter', top: '58%', left: '47%', size: 24, rotate: -8, delay: 0.3, opacity: 0.4 },
  { glyph: 'beamed', top: '8%', left: '61%', size: 24, rotate: 14, delay: 1.7, opacity: 0.45 },
  { glyph: 'flat', top: '48%', left: '72%', size: 22, rotate: 0, delay: 0.9, opacity: 0.35 },
  { glyph: 'eighth', top: '14%', left: '84%', size: 26, rotate: -10, delay: 2.4, opacity: 0.5 },
  { glyph: 'bass', top: '2%', left: '92%', size: 40, rotate: 0, delay: 1.5, opacity: 0.22 },
  { glyph: 'quarter', top: '56%', left: '97%', size: 20, rotate: 12, delay: 0.4, opacity: 0.4 },
]

const HERO_NOTES: NoteSpec[] = [
  { glyph: 'treble', top: '10%', left: '6%', size: 180, rotate: -6, delay: 0, opacity: 0.12 },
  { glyph: 'beamed', top: '62%', left: '10%', size: 64, rotate: -10, delay: 1, opacity: 0.35 },
  { glyph: 'eighth', top: '24%', left: '44%', size: 48, rotate: 12, delay: 0.5, opacity: 0.3 },
  { glyph: 'sharp', top: '78%', left: '40%', size: 42, rotate: 0, delay: 2, opacity: 0.25 },
  { glyph: 'quarter', top: '14%', left: '68%', size: 54, rotate: -8, delay: 1.4, opacity: 0.3 },
  { glyph: 'beamed', top: '70%', left: '82%', size: 70, rotate: 10, delay: 0.8, opacity: 0.32 },
  { glyph: 'flat', top: '36%', left: '92%', size: 46, rotate: 0, delay: 2.2, opacity: 0.25 },
]

export function NoteField({
  variant = 'header',
  className,
  tone = 'light',
}: {
  variant?: 'header' | 'hero'
  className?: string
  tone?: 'light' | 'dark' | 'royal'
}) {
  const notes = variant === 'header' ? HEADER_NOTES : HERO_NOTES
  const color =
    tone === 'light' ? 'text-paper' : tone === 'royal' ? 'text-royal-light' : 'text-navy'

  return (
    <div
      aria-hidden
      className={clsx('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {notes.map((n, i) => (
        <span
          key={i}
          className={clsx('font-music absolute animate-floaty select-none leading-none', color)}
          style={
            {
              top: n.top,
              left: n.left,
              fontSize: n.size,
              opacity: n.opacity,
              animationDelay: `${n.delay}s`,
              '--r': `${n.rotate}deg`,
            } as CSSProperties
          }
        >
          {GLYPHS[n.glyph]}
        </span>
      ))}
    </div>
  )
}

/**
 * Pauta musical desenhada com cinco linhas onduladas (estilo bordado).
 * As linhas se "desenham" na entrada e as notas pousam sobre elas.
 */
export function StaffWave({
  className,
  color = '#F3F0E8',
  accent = '#5C82F0',
  opacity = 0.9,
  amplitude = 34,
  animate = true,
  notes = true,
}: {
  className?: string
  color?: string
  accent?: string
  opacity?: number
  amplitude?: number
  animate?: boolean
  notes?: boolean
}) {
  const width = 1600
  const height = 220
  const gap = 10

  const lines = useMemo(() => {
    const yAt = (x: number, i: number) =>
      110 + i * gap + amplitude * Math.sin(x / 210 + i * 0.045) + 10 * Math.sin(x / 70)
    return [0, 1, 2, 3, 4].map((i) => {
      const pts: string[] = []
      for (let x = 0; x <= width; x += 16) {
        pts.push(`${x === 0 ? 'M' : 'L'}${x} ${yAt(x, i).toFixed(1)}`)
      }
      return pts.join(' ')
    })
  }, [amplitude])

  const noteSpots = useMemo(
    () =>
      [
        { x: 180, i: 1, g: GLYPHS.eighth },
        { x: 360, i: 3, g: GLYPHS.beamed },
        { x: 540, i: 0, g: GLYPHS.quarter },
        { x: 720, i: 4, g: GLYPHS.eighth },
        { x: 900, i: 2, g: GLYPHS.beamed },
        { x: 1080, i: 1, g: GLYPHS.sharp },
        { x: 1260, i: 3, g: GLYPHS.eighth },
        { x: 1440, i: 0, g: GLYPHS.beamed },
      ].map((n) => ({
        ...n,
        y: 110 + n.i * gap + amplitude * Math.sin(n.x / 210 + n.i * 0.045) + 10 * Math.sin(n.x / 70),
      })),
    [amplitude],
  )

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
      fill="none"
    >
      <g stroke={color} strokeOpacity={opacity} strokeWidth={1.4} strokeLinecap="round">
        {lines.map((d, i) => (
          <path
            key={i}
            d={d}
            className={animate ? 'stroke-draw animate-draw' : undefined}
            style={animate ? { animationDelay: `${i * 0.18}s` } : undefined}
          />
        ))}
      </g>
      {notes && (
        <g className="font-music" fill={accent}>
          <text x={26} y={160} fontSize={92} fill={color} fillOpacity={opacity}>
            {GLYPHS.treble}
          </text>
          {noteSpots.map((n, i) => (
            <text key={i} x={n.x} y={n.y + 8} fontSize={46} className="font-music">
              {n.g}
            </text>
          ))}
        </g>
      )}
    </svg>
  )
}

/** Faixa de notas usada como divisor de seção. */
export function NoteDivider({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const color = tone === 'dark' ? 'text-navy' : 'text-paper'
  return (
    <div
      aria-hidden
      className={clsx('flex items-center gap-4', color, className)}
    >
      <span className="h-px flex-1 bg-current opacity-25" />
      <span className="font-music text-2xl opacity-70">{GLYPHS.beamed}</span>
      <span className="h-px flex-1 bg-current opacity-25" />
    </div>
  )
}
