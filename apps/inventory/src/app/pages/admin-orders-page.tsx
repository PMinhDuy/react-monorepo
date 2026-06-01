import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetMyOrdersQuery, GetMyOrdersQueryVariables } from '@react-monorepo/shared-graphql'
import { OrderTable } from '@react-monorepo/catalog'

// Backend exposes myOrders — no separate admin orders query exists
const GET_MY_ORDERS: TypedDocumentNode<GetMyOrdersQuery, GetMyOrdersQueryVariables> = gql`
  query GetAdminOrders {
    myOrders {
      id status totalAmount createdAt
      items { id productId quantity unitPrice }
    }
  }
`

export function AdminOrdersPage() {
  const { data, loading } = useQuery(GET_MY_ORDERS)
  const orders = data?.myOrders ?? []

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage customer orders</p>
      </div>
      {loading ? (
        <p className="text-muted-foreground text-sm animate-pulse">Loading…</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  )
}
