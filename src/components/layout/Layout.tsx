import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileMenu } from './MobileMenu'
import { CartDrawer } from './CartDrawer'
import { SearchOverlay } from './SearchOverlay'
import { ToastHost } from './ToastHost'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

/** Entrada suave a cada troca de página (sem animação de saída, para não piscar). */
function AnimatedOutlet() {
  const { pathname } = useLocation()
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.8, 0.2, 1] }}
    >
      <Outlet />
    </motion.div>
  )
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only z-[200] bg-royal px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <ScrollToTop />
      <Header />
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <ToastHost />
      <main id="conteudo" className="flex-1">
        <AnimatedOutlet />
      </main>
      <Footer />
    </div>
  )
}
