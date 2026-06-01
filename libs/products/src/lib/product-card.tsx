import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, Button, Badge } from '@react-monorepo/shared-ui'
import type { GetProductsQuery } from '@react-monorepo/shared-graphql'
import { ShoppingCart } from 'lucide-react'

type Product = GetProductsQuery['products']['items'][number]

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="flex flex-col group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link to={`/products/${product.id}`} className="overflow-hidden block">
        <img
          src={product.imageUrls?.[0] ?? 'https://placehold.co/400x300?text=No+Image'}
          alt={product.name}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-xl"
        />
      </Link>
      <CardContent className="flex-1 p-4 space-y-2">
        {product.category?.name && (
          <Badge variant="secondary" className="text-xs font-normal">
            {product.category.name}
          </Badge>
        )}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-bold tracking-tight">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2" size="sm" onClick={() => onAddToCart(product.id)}>
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
