import { Badge } from '@react-monorepo/shared-ui'
import type { OrderStatus } from '@react-monorepo/shared-graphql'
import { cn } from '@react-monorepo/shared-ui'

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
}

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('capitalize text-xs font-medium', STATUS_STYLES[status])}
    >
      {status.toLowerCase()}
    </Badge>
  )
}
