import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@react-monorepo/shared-ui'
import { AdminLayout } from './layout/admin-layout'
import { LoginPage } from './pages/login-page'
import { DashboardPage } from './pages/dashboard-page'
import { AdminProductsPage } from './pages/admin-products-page'
import { ProductEditPage } from './pages/product-edit-page'
import { AdminCategoriesPage } from './pages/admin-categories-page'
import { AdminOrdersPage } from './pages/admin-orders-page'
import { AdminCustomersPage } from './pages/admin-customers-page'
import { CustomerDetailPage } from './pages/customer-detail-page'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<AdminProductsPage />} />
          <Route path="/products/new" element={<ProductEditPage />} />
          <Route path="/products/:id/edit" element={<ProductEditPage />} />
          <Route path="/categories" element={<AdminCategoriesPage />} />
          <Route path="/orders" element={<AdminOrdersPage />} />
          <Route path="/customers" element={<AdminCustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
