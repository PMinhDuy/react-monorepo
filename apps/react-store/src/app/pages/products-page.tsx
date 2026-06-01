import { useState } from 'react'
import { ProductGrid, CategoryFilter } from '@react-monorepo/products'
import { useCart, useCartUIStore } from '@react-monorepo/orders'

export function ProductsPage() {
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const { addToCart } = useCart()
  const openCart = useCartUIStore((s) => s.openCart)

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1)
    openCart()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>
      <CategoryFilter selected={categoryId} onChange={setCategoryId} />
      <ProductGrid categoryId={categoryId} onAddToCart={handleAddToCart} />
    </div>
  )
}
