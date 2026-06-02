import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetProductsQuery, GetProductsQueryVariables } from '@react-monorepo/shared-graphql'
import { Card, CardContent } from '@react-monorepo/shared-ui'
import { Package, AlertTriangle } from 'lucide-react'

const GET_PRODUCTS_COUNT: TypedDocumentNode<GetProductsQuery, GetProductsQueryVariables> = gql`
  query GetProductsCount {
    products(limit: 1, offset: 0) { total }
  }
`

export function DashboardPage() {
  const { data: productsData } = useQuery(GET_PRODUCTS_COUNT, {
    variables: { limit: 1, offset: 0 },
  })

  const totalProducts = productsData?.products?.total ?? 0

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your store performance</p>
      </div>

      {/* Warning: admin-scoped orders query not yet implemented */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium">Order metrics coming soon</p>
          <p className="text-amber-700 mt-0.5">
            Revenue, order count, and pending stats require an admin-scoped orders query (Phase 1).
            Until then, only the product count is shown.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground truncate">Total Products</p>
                <p className="text-2xl font-bold mt-1 tracking-tight">{totalProducts}</p>
              </div>
              <div className="p-2.5 rounded-lg shrink-0 bg-blue-50">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
