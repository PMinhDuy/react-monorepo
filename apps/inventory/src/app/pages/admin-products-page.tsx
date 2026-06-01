import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetProductsQuery, GetProductsQueryVariables } from '@react-monorepo/shared-graphql'
import { Button } from '@react-monorepo/shared-ui'
import { Link } from 'react-router-dom'
import { ProductTable } from '@react-monorepo/catalog'
import { Plus } from 'lucide-react'

const GET_PRODUCTS: TypedDocumentNode<GetProductsQuery, GetProductsQueryVariables> = gql`
  query GetAdminProducts($limit: Int!, $offset: Int!) {
    products(limit: $limit, offset: $offset) {
      items { id name price imageUrls category { id name } }
      total
      hasMore
    }
  }
`

export function AdminProductsPage() {
  const { data, refetch } = useQuery(GET_PRODUCTS, {
    variables: { limit: 100, offset: 0 },
  })

  const products = data?.products.items ?? []

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your product catalog</p>
        </div>
        <Link to="/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <ProductTable products={products} onDeleted={() => refetch()} />
    </div>
  )
}
