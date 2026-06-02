import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetOrdersQuery, GetOrdersQueryVariables } from '@react-monorepo/shared-graphql'
import { OrderTable } from '@react-monorepo/catalog'

const GET_ORDERS: TypedDocumentNode<GetOrdersQuery, GetOrdersQueryVariables> = gql`
  query GetAdminOrders($limit: Int, $offset: Int) {
    orders(limit: $limit, offset: $offset) {
      id status totalAmount createdAt
      items { id productId quantity unitPrice }
    }
  }
`

export function AdminOrdersPage() {
  const { data, loading } = useQuery(GET_ORDERS, {
    variables: { limit: 50, offset: 0 },
  })
  const orders = data?.orders ?? []

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage all customer orders</p>
      </div>
      {loading ? (
        <p className="text-muted-foreground text-sm animate-pulse">Loading…</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  )
}
