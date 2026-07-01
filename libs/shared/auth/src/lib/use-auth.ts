import { useMutation } from '@apollo/client/react'
import { LoginDocument, RegisterDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from './auth-store'

// NestJS is bundled/minified on Lambda — input type names like LoginInput do not
// exist in the schema. Inline input objects with scalar variable types instead.

export function useAuth() {
  const { setAuth, clearAuth, accessToken } = useAuthStore()

  const [loginMutation, { loading: loginLoading, error: loginError }] =
    useMutation(LoginDocument)
  const [registerMutation, { loading: registerLoading, error: registerError }] =
    useMutation(RegisterDocument)

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({ variables: { email, password } })
    if (data?.login) {
      setAuth(data.login.accessToken, data.login.refreshToken, data.login.user.id)
    }
  }

  const register = async (input: { name: string; email: string; password: string }) => {
    const { data } = await registerMutation({ variables: input })
    if (data?.register) {
      setAuth(data.register.accessToken, data.register.refreshToken, data.register.user.id)
    }
  }

  return {
    isAuthenticated: !!accessToken,
    login,
    loginLoading,
    loginError,
    register,
    registerLoading,
    registerError,
    logout: clearAuth,
  }
}
