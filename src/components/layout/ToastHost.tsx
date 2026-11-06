import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { useUiStore } from '@/store/useUiStore'
import { GLYPHS } from '@/components/music/Notes'

export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts)

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease: [0.22, 0.8, 0.2, 1] }}
            className={clsx(
              'flex items-center gap-3 px-5 py-3 text-[12px] uppercase tracking-wide2 text-paper shadow-xl',
              t.tone === 'error' ? 'bg-red-800' : 'bg-navy',
            )}
          >
            <span className="font-music text-base text-royal-light">{GLYPHS.eighth}</span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
