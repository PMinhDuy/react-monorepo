import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ProtectedRoute } from '@react-monorepo/shared-auth'
import { Navbar } from '@react-monorepo/shared-ui'
import { CartBadge, CartDrawer } from '@react-monorepo/orders'
import { useWishlist } from '@react-monorepo/products'
import { LoginPage } from './pages/login-page'
import { RegisterPage } from './pages/register-page'
import { ProductsPage } from './pages/products-page'
import { ProductDetailPage } from './pages/product-detail-page'
import { CheckoutPage } from './pages/checkout-page'
import { OrderSuccessPage } from './pages/order-success-page'
import { OrdersPage } from './pages/orders-page'
import { OrderDetailPage } from './pages/order-detail-page'
import { ProfilePage } from './pages/profile-page'
import { WishlistPage } from './pages/wishlist-page'

function WishlistBadge() {
  const { wishlistIds } = useWishlist()
  const count = wishlistIds.size
  return (
    <Link to="/wishlist" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
      <Heart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}

function Layout() {
  return (
    <>
      <Navbar cartSlot={<CartBadge />} wishlistSlot={<WishlistBadge />} />
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
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  )
}

export default App
