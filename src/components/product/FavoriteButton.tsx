import clsx from 'clsx'
import { HeartIcon } from '@/components/ui/Icons'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { useUiStore } from '@/store/useUiStore'

export function FavoriteButton({
  productId,
  productName,
  className,
  withLabel = false,
}: {
  productId: string
  productName: string
  className?: string
  withLabel?: boolean
}) {
  const isFav = useFavoritesStore((s) => s.ids.includes(productId))
  const toggle = useFavoritesStore((s) => s.toggle)
  const pushToast = useUiStore((s) => s.pushToast)

  return (
    <button
      type="button"
      aria-pressed={isFav}
      aria-label={isFav ? `Remover ${productName} dos favoritos` : `Favoritar ${productName}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const added = toggle(productId)
        pushToast(added ? 'Adicionado aos favoritos' : 'Removido dos favoritos')
      }}
      className={clsx(
        'group/fav inline-flex items-center gap-2 transition-colors duration-500',
        isFav ? 'text-royal' : 'text-ink/70 hover:text-royal',
        className,
      )}
    >
      <HeartIcon filled={isFav} className="transition-transform duration-500 ease-silk group-active/fav:scale-125" />
      {withLabel && (
        <span className="text-[11px] font-medium uppercase tracking-wide2">
          {isFav ? 'Nos favoritos' : 'Favoritar'}
        </span>
      )}
    </button>
  )
}
