import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  GetProductsQuery,
  GetProductsQueryVariables,
  GetOrdersQuery,
  GetOrdersQueryVariables,
} from '@react-monorepo/shared-graphql'
import { Card, CardContent } from '@react-monorepo/shared-ui'
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react'

const GET_PRODUCTS_COUNT: TypedDocumentNode<GetProductsQuery, GetProductsQueryVariables> = gql`
  query GetProductsCount {
    products(limit: 1, offset: 0) { total }
  }
`

const GET_ALL_ORDERS: TypedDocumentNode<GetOrdersQuery, GetOrdersQueryVariables> = gql`
  query GetDashboardOrders {
    orders(limit: 200, offset: 0) {
      id status totalAmount
    }
  }
`

export function DashboardPage() {
  const { data: productsData } = useQuery(GET_PRODUCTS_COUNT, {
    variables: { limit: 1, offset: 0 },
  })
  const { data: ordersData } = useQuery(GET_ALL_ORDERS)

  const totalProducts = productsData?.products?.total ?? 0
  const orders = ordersData?.orders ?? []
  const totalOrders = orders.length
  const revenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Revenue',
      value: `$${revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, iconColor }) => (
          <Card key={label} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{label}</p>
                  <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
                </div>
                <div className={`p-2.5 rounded-lg shrink-0 ${color}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
