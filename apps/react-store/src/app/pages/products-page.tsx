import { useSearchParams } from 'react-router-dom'
import { ProductGrid, CategoryFilter, SearchBar, SortSelect } from '@react-monorepo/products'
import { useCart, useCartUIStore } from '@react-monorepo/orders'

export function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const categoryId = params.get('category') ?? undefined
  const search = params.get('search') ?? ''
  const sortBy = params.get('sortBy') ?? 'createdAt'
  const sortOrder = params.get('sortOrder') ?? 'DESC'

  const { addToCart } = useCart()
  const openCart = useCartUIStore((s) => s.openCart)

  const setParam = (key: string, value: string | undefined) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    })
  }

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1)
    openCart()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(val) => setParam('search', val || undefined)}
          />
        </div>
        <SortSelect
          sortBy={sortBy}
          sortOrder={sortOrder}
          onChange={(by, order) => {
            setParam('sortBy', by)
            setParam('sortOrder', order)
          }}
        />
      </div>

      <CategoryFilter
        selected={categoryId}
        onChange={(id) => setParam('category', id)}
      />

      <ProductGrid
        categoryId={categoryId}
        search={search || undefined}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
