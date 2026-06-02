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

// Refresh access token via plain fetch to avoid Apollo loop
async function refreshAccessToken(): Promise<string | null> {
  const token = localStorage.getItem('refresh_token')
  if (!token) return null

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
  if (!result) return null

  localStorage.setItem('access_token', result.accessToken)
  localStorage.setItem('refresh_token', result.refreshToken)
  return result.accessToken
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorLink = onError((errCtx: any) => {
  const graphQLErrors: Array<{ extensions?: Record<string, unknown> }> | undefined = errCtx.graphQLErrors
  const { operation, forward } = errCtx
  const isUnauthenticated = graphQLErrors?.some((e) => e.extensions?.['code'] === 'UNAUTHENTICATED')
  if (!isUnauthenticated) return

  // Prevent infinite retry: if this operation already went through a refresh attempt, bail out
  if (operation.getContext()['_refreshed']) return

  return new Observable((observer) => {
    refreshAccessToken().then((newToken) => {
      if (!newToken) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        observer.error(graphQLErrors![0])
        return
      }
      operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
        headers: { ...headers, authorization: `Bearer ${newToken}` },
        _refreshed: true,
      }))
      forward(operation).subscribe(observer)
    }).catch((err: unknown) => observer.error(err))
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
