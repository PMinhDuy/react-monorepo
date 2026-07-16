import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, loginSchema, type LoginFormData } from '@react-monorepo/shared-auth'
import { Button, Input, Label } from '@react-monorepo/shared-ui'
import { Store, ShieldAlert } from 'lucide-react'

export function LoginPage() {
  const { login, loginLoading, loginError, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [roleError, setRoleError] = useState<string | null>(null)

  const locationState = location.state as { from?: Location; error?: string } | null
  const redirectFrom = locationState?.from?.pathname || '/dashboard'
  const routeError = locationState?.error

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    setRoleError(null)
    try {
      const loggedInUser = await login(data.email, data.password)
      if (loggedInUser && loggedInUser.role !== 'ADMIN') {
        logout()
        setRoleError('Access Denied: Only ADMIN accounts can access the Inventory Portal.')
        return
      }
      navigate(redirectFrom, { replace: true })
    } catch {
      // loginError handles display
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6 p-8 bg-card border rounded-xl shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">Inventory</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Sign In</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage your store inventory</p>
        </div>

        {(routeError || roleError) && (
          <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{roleError || routeError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register('email')} type="email" placeholder="admin@example.com" />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" {...register('password')} type="password" placeholder="••••••••" />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          {loginError && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {loginError.message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loginLoading}>
            {loginLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
