import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import type {
  LoginMutation,
  LoginMutationVariables,
  RegisterMutation,
  RegisterMutationVariables,
} from '@react-monorepo/shared-graphql'
import { useAuthStore } from './auth-store'

// NestJS is bundled/minified on Lambda — input type names like LoginInput do not
// exist in the schema. Inline input objects with scalar variable types instead.
const LOGIN_MUTATION: TypedDocumentNode<LoginMutation, LoginMutationVariables> = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      user { id email name role }
    }
  }
`

const REGISTER_MUTATION: TypedDocumentNode<RegisterMutation, RegisterMutationVariables> = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(input: { name: $name, email: $email, password: $password }) {
      accessToken
      user { id email name role }
    }
  }
`

export function useAuth() {
  const { setAuth, clearAuth, accessToken } = useAuthStore()

  const [loginMutation, { loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_MUTATION)
  const [registerMutation, { loading: registerLoading, error: registerError }] =
    useMutation(REGISTER_MUTATION)

  const login = async (email: string, password: string) => {
    const { data } = await loginMutation({ variables: { email, password } })
    if (data?.login) {
      setAuth(data.login.accessToken, data.login.user.id)
    }
  }

  const register = async (input: { name: string; email: string; password: string }) => {
    const { data } = await registerMutation({ variables: input })
    if (data?.register) {
      setAuth(data.register.accessToken, data.register.user.id)
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
