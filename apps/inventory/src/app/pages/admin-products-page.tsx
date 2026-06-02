import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetAdminProductsQuery, GetAdminProductsQueryVariables } from '@react-monorepo/shared-graphql'
import { Button, Input, Pagination } from '@react-monorepo/shared-ui'
import { Link } from 'react-router-dom'
import { ProductTable } from '@react-monorepo/catalog'
import { Plus, Search, X } from 'lucide-react'

const GET_PRODUCTS: TypedDocumentNode<GetAdminProductsQuery, GetAdminProductsQueryVariables> = gql`
  query GetAdminProductsPage($limit: Int!, $offset: Int!, $search: String, $sortBy: String, $sortOrder: String) {
    adminProducts(limit: $limit, offset: $offset, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
      items {
        id name price stock lowStockThreshold isActive imageUrls
        category { id name }
      }
      total
      hasMore
    }
  }
`

const PAGE_SIZE = 20

export function AdminProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [draftSearch, setDraftSearch] = useState('')

  const { data, refetch } = useQuery(GET_PRODUCTS, {
    variables: { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, search: search || undefined },
  })

  const products = data?.adminProducts.items ?? []
  const total = data?.adminProducts.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(draftSearch)
    setPage(1)
  }

  const clearSearch = () => {
    setDraftSearch('')
    setSearch('')
    setPage(1)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {total > 0 ? `${total} product${total !== 1 ? 's' : ''}` : 'Manage your product catalog'}
          </p>
        </div>
        <Link to="/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search products…"
            className="pl-9 pr-8"
          />
          {draftSearch && (
            <button type="button" onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button type="submit" variant="outline" size="sm">Search</Button>
      </form>

      <ProductTable products={products} onDeleted={() => refetch()} />

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
