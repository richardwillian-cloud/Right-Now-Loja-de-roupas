import clsx from 'clsx'
import { formatBRL } from '@/lib/format'

export function Price({
  value,
  compareAt,
  className,
}: {
  value: number
  compareAt?: number
  className?: string
}) {
  return (
    <span className={clsx('inline-flex items-baseline gap-2 tabular-nums', className)}>
      <span>{formatBRL(value)}</span>
      {compareAt && compareAt > value && (
        <span className="text-[0.85em] text-ink/40 line-through">{formatBRL(compareAt)}</span>
      )}
    </span>
  )
}
