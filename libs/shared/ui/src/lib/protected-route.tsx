import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, UserRole } from '@react-monorepo/shared-auth'

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({ allowedRoles, redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized, user, hasRole } = useAuth()
  const location = useLocation()

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <Navigate
        to={redirectTo}
        state={{
          from: location,
          error: `Access Denied: You need ${allowedRoles.join(' or ')} permission.`,
        }}
        replace
      />
    )
  }

  return <Outlet />
}

export function RoleProtectedRoute(props: ProtectedRouteProps) {
  return <ProtectedRoute {...props} />
}
