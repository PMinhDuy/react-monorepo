import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  GetMyOrdersQuery,
  UpdateOrderStatusMutation,
  UpdateOrderStatusMutationVariables,
  OrderStatus,
} from '@react-monorepo/shared-graphql'
import { cn } from '@react-monorepo/shared-ui'
import { ShoppingCart } from 'lucide-react'

type Order = GetMyOrdersQuery['myOrders'][number]

const UPDATE_ORDER_STATUS: TypedDocumentNode<
  UpdateOrderStatusMutation,
  UpdateOrderStatusMutationVariables
> = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

const statusStyles: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
}

interface OrderTableProps {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  const [updateStatus, { error: updateError }] = useMutation(UPDATE_ORDER_STATUS)

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-sm">No orders found</p>
        <p className="text-xs text-muted-foreground">Orders will appear here once placed</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto space-y-2">
      {updateError && (
        <p className="text-xs text-destructive px-1">
          Status update failed: {updateError.message}
        </p>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground bg-muted/30">
            <th className="py-3 pl-4 pr-4 font-medium">Order ID</th>
            <th className="py-3 pr-4 font-medium">Total</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Items</th>
            <th className="py-3 pr-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/20 transition-colors">
              <td className="py-3 pl-4 pr-4 font-mono text-xs text-muted-foreground">
                #{order.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="py-3 pr-4 font-medium">${order.totalAmount.toFixed(2)}</td>
              <td className="py-3 pr-4 text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4 text-muted-foreground">{order.items.length}</td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
                      statusStyles[order.status] ?? 'bg-muted text-muted-foreground border-border',
                    )}
                  >
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus({
                        variables: { id: order.id, status: e.target.value as OrderStatus },
                      })
                    }
                    className="text-xs border rounded-md px-2 py-1 bg-background text-foreground hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
