import { Link } from 'react-router-dom'
import type { Product } from '@react-monorepo/shared-graphql'
import { Card, CardContent, Button } from '@react-monorepo/shared-ui'
import { ShoppingCart } from 'lucide-react'

interface RelatedProductsProps {
  products: Pick<Product, 'id' | 'name' | 'price' | 'imageUrls'>[]
  onAddToCart: (productId: string) => void
}

export function RelatedProducts({ products, onAddToCart }: RelatedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold mb-5">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link to={`/products/${product.id}`}>
              <img
                src={(product.imageUrls ?? [])[0] ?? 'https://placehold.co/300x200?text=No+Image'}
                alt={product.name}
                className="w-full h-36 object-cover"
              />
            </Link>
            <CardContent className="p-3 space-y-2">
              <Link to={`/products/${product.id}`} className="block text-sm font-medium leading-tight hover:underline line-clamp-2">
                {product.name}
              </Link>
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0"
                  onClick={() => onAddToCart(product.id)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
