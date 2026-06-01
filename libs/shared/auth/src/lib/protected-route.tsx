import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './auth-store'

export function ProtectedRoute() {
  const accessToken = useAuthStore((s) => s.accessToken)
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />
}
