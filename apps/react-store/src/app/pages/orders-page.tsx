import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import { GetMyOrdersDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { Card, CardContent } from '@react-monorepo/shared-ui'
import { OrderStatusBadge } from '@react-monorepo/orders'
import { Package } from 'lucide-react'

export function OrdersPage() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const { data, loading } = useQuery(GetMyOrdersDocument, { skip: !accessToken })
  const orders = data?.myOrders ?? []

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No orders yet</p>
        <p className="text-sm mt-1">
          <Link to="/products" className="underline">
            Start shopping
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-6">My Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Order #{order.id.slice(-8)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <OrderStatusBadge status={order.status} />
                  <p className="font-semibold text-sm">${order.totalAmount.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
