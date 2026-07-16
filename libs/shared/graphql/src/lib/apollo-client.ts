import { ApolloClient, InMemoryCache, from, HttpLink, Observable } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

const GRAPHQL_URL = (import.meta as { env?: Record<string, string> }).env?.VITE_GRAPHQL_URL ?? '/graphql'

const httpLink = new HttpLink({ uri: GRAPHQL_URL })

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('access_token')
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

function notifyAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:tokens-updated', { detail: { accessToken, refreshToken } }))
  }
}

function notifyAuthCleared() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_profile')
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:cleared'))
  }
}

// Refresh access token via plain fetch to avoid Apollo loop
async function refreshAccessToken(): Promise<string | null> {
  const token = localStorage.getItem('refresh_token')
  if (!token) {
    notifyAuthCleared()
    return null
  }

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation RefreshToken($token: String!) { refreshToken(token: $token) { accessToken refreshToken } }`,
        variables: { token },
      }),
    })
    const json = await res.json() as { data?: { refreshToken?: { accessToken: string; refreshToken: string } } }
    const result = json.data?.refreshToken
    if (!result) {
      notifyAuthCleared()
      return null
    }

    notifyAuthTokens(result.accessToken, result.refreshToken)
    return result.accessToken
  } catch {
    notifyAuthCleared()
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorLink = onError((errCtx: any) => {
  const graphQLErrors: Array<{ extensions?: Record<string, unknown> }> | undefined = errCtx.graphQLErrors
  const { operation, forward } = errCtx
  const isUnauthenticated = graphQLErrors?.some((e) => e.extensions?.['code'] === 'UNAUTHENTICATED')
  if (!isUnauthenticated) return

  // Prevent infinite retry loop
  if (operation.getContext()['_refreshed']) {
    notifyAuthCleared()
    return
  }

  return new Observable((observer) => {
    refreshAccessToken()
      .then((newToken) => {
        if (!newToken) {
          notifyAuthCleared()
          observer.error(graphQLErrors?.[0] || new Error('Unauthenticated'))
          return
        }
        operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
          headers: { ...headers, authorization: `Bearer ${newToken}` },
          _refreshed: true,
        }))
        const subscriber = forward(operation).subscribe(observer)
        return () => subscriber.unsubscribe()
      })
      .catch((err: unknown) => {
        notifyAuthCleared()
        observer.error(err)
      })
  })
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ['categoryId'],
            merge(_existing, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
})
