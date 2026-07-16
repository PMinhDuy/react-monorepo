import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth, loginSchema, type LoginFormData } from '@react-monorepo/shared-auth'
import { Button, Input, Label } from '@react-monorepo/shared-ui'
import { ShoppingBag, AlertCircle } from 'lucide-react'

export function LoginPage() {
  const { login, loginLoading, loginError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const locationState = location.state as { from?: Location; error?: string } | null
  const redirectFrom = locationState?.from?.pathname || '/'
  const routeError = locationState?.error

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      navigate(redirectFrom, { replace: true })
    } catch {
      // loginError handles display
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6 p-8 bg-card border rounded-xl shadow-sm">
        <div className="space-y-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-4">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Store
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {routeError && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{routeError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register('email')} type="email" placeholder="you@example.com" />
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

        <p className="text-sm text-center text-muted-foreground">
          No account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
