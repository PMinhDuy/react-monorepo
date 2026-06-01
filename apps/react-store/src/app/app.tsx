import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute } from '@react-monorepo/shared-auth'
import { Navbar } from '@react-monorepo/shared-ui'
import { CartBadge, CartDrawer } from '@react-monorepo/orders'
import { LoginPage } from './pages/login-page'
import { RegisterPage } from './pages/register-page'
import { ProductsPage } from './pages/products-page'
import { ProductDetailPage } from './pages/product-detail-page'
import { CheckoutPage } from './pages/checkout-page'
import { OrderSuccessPage } from './pages/order-success-page'

function Layout() {
  return (
    <>
      <Navbar cartSlot={<CartBadge />} />
      <CartDrawer />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export function App() {
  return (
    <Routes>
      {/* Public auth routes (no navbar) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App shell with Navbar + CartDrawer */}
      <Route element={<Layout />}>
        {/* Public browsing routes */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/orders" element={<div className="p-8">My Orders (Phase 5)</div>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  )
}

export default App
