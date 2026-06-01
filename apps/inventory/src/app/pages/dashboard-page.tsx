import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  GetProductsQuery,
  GetProductsQueryVariables,
  GetMyOrdersQuery,
  GetMyOrdersQueryVariables,
} from '@react-monorepo/shared-graphql'
import { Card, CardContent, cn } from '@react-monorepo/shared-ui'
import { Package, ShoppingCart, Clock, DollarSign } from 'lucide-react'

const GET_PRODUCTS_COUNT: TypedDocumentNode<GetProductsQuery, GetProductsQueryVariables> = gql`
  query GetProductsCount {
    products(limit: 1, offset: 0) { total hasMore }
  }
`

const GET_ORDERS: TypedDocumentNode<GetMyOrdersQuery, GetMyOrdersQueryVariables> = gql`
  query GetOrdersForDashboard {
    myOrders { id status totalAmount }
  }
`

const statConfig = [
  { label: 'Total Products', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Orders', icon: ShoppingCart, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Pending Orders', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Total Revenue', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

export function DashboardPage() {
  const { data: productsData } = useQuery(GET_PRODUCTS_COUNT, {
    variables: { limit: 1, offset: 0 },
  })
  const { data: ordersData } = useQuery(GET_ORDERS)

  const totalProducts = productsData?.products?.total ?? 0
  const orders = ordersData?.myOrders ?? []
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length

  const stats = [
    { ...statConfig[0], value: totalProducts },
    { ...statConfig[1], value: orders.length },
    { ...statConfig[2], value: pendingOrders },
    { ...statConfig[3], value: `$${totalRevenue.toFixed(2)}` },
  ]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{label}</p>
                  <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
                </div>
                <div className={cn('p-2.5 rounded-lg shrink-0', bg)}>
                  <Icon className={cn('h-5 w-5', color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
