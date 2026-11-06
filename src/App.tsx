import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import ShopPage from '@/pages/ShopPage'
import ProductPage from '@/pages/ProductPage'
import FavoritesPage from '@/pages/FavoritesPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrderSuccessPage from '@/pages/OrderSuccessPage'
import OrdersPage from '@/pages/OrdersPage'
import AdminPage from '@/pages/AdminPage'
import HelpPage from '@/pages/HelpPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="produto/:slug" element={<ProductPage />} />
        <Route path="favoritos" element={<FavoritesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pedido-confirmado/:orderId" element={<OrderSuccessPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="ajuda" element={<HelpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
