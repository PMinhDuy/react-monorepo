import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetProductsQuery, GetProductsQueryVariables } from '@react-monorepo/shared-graphql'
import { Pagination } from '@react-monorepo/shared-ui'
import { ProductCard } from './product-card'
import { ProductSkeleton } from './product-skeleton'

const GET_PRODUCTS: TypedDocumentNode<GetProductsQuery, GetProductsQueryVariables> = gql`
  query GetProducts($limit: Int!, $offset: Int!, $categoryId: ID) {
    products(limit: $limit, offset: $offset, categoryId: $categoryId) {
      items { id name description price imageUrls category { id name } }
      total
      hasMore
    }
  }
`

const PAGE_SIZE = 12

interface ProductGridProps {
  categoryId?: string
  onAddToCart: (productId: string) => void
}

export function ProductGrid({ categoryId, onAddToCart }: ProductGridProps) {
  const [page, setPage] = useState(1)

  const { data, loading } = useQuery(GET_PRODUCTS, {
    variables: { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, categoryId },
  })

  if (loading) return <ProductSkeleton count={PAGE_SIZE} />

  const { items = [], total = 0 } = data?.products ?? {}
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (items.length === 0) {
    return <p className="text-center text-muted-foreground py-16">No products found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
