import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ProtectedRoute } from '@react-monorepo/shared-auth'
import { Navbar } from '@react-monorepo/shared-ui'
import { CartBadge, CartDrawer } from '@react-monorepo/orders'
import { useWishlist } from '@react-monorepo/products'

// Always loaded (above-fold, critical)
import { LoginPage } from './pages/login-page'
import { RegisterPage } from './pages/register-page'
import { ProductsPage } from './pages/products-page'

// Lazy loaded (below-fold or gated)
const ProductDetailPage = lazy(() => import('./pages/product-detail-page').then(m => ({ default: m.ProductDetailPage })))
const CheckoutPage = lazy(() => import('./pages/checkout-page').then(m => ({ default: m.CheckoutPage })))
const OrderSuccessPage = lazy(() => import('./pages/order-success-page').then(m => ({ default: m.OrderSuccessPage })))
const OrdersPage = lazy(() => import('./pages/orders-page').then(m => ({ default: m.OrdersPage })))
const OrderDetailPage = lazy(() => import('./pages/order-detail-page').then(m => ({ default: m.OrderDetailPage })))
const ProfilePage = lazy(() => import('./pages/profile-page').then(m => ({ default: m.ProfilePage })))
const WishlistPage = lazy(() => import('./pages/wishlist-page').then(m => ({ default: m.WishlistPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  )
}

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
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  )
}

export default App
