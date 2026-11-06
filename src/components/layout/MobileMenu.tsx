import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CloseIcon } from '@/components/ui/Icons'
import { NoteField, GLYPHS } from '@/components/music/Notes'
import { useUiStore } from '@/store/useUiStore'
import { NAV_LINKS } from './Header'

const EXTRA = [
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/pedidos', label: 'Meus pedidos' },
  { to: '/admin', label: 'Admin' },
]

export function MobileMenu() {
  const open = useUiStore((s) => s.menuOpen)
  const setMenuOpen = useUiStore((s) => s.setMenuOpen)
  const { pathname, search } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname, search, setMenuOpen])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] overflow-hidden bg-navy text-paper"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <NoteField variant="hero" />
          <div className="staff-bg pointer-events-none absolute inset-0" aria-hidden />

          <div className="relative flex h-full flex-col px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-semibold uppercase tracking-[0.3em]">
                Right Now
              </span>
              <button type="button" aria-label="Fechar menu" className="p-2" onClick={() => setMenuOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <nav className="mt-12 flex flex-1 flex-col gap-1" aria-label="Menu móvel">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}
                >
                  <Link
                    to={l.to}
                    className="flex items-baseline gap-4 border-b border-paper/10 py-3 font-display text-[44px] font-medium leading-none"
                  >
                    <span className="font-music text-lg text-royal-light">{GLYPHS.eighth}</span>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pb-4 text-[11px] uppercase tracking-wide2 text-paper/70">
              {EXTRA.map((l) => (
                <Link key={l.to} to={l.to}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
