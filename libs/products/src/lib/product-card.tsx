import { Link } from 'react-router-dom'
import { Button } from '@react-monorepo/shared-ui'
import type { GetProductsQuery } from '@react-monorepo/shared-graphql'
import { Plus } from 'lucide-react'
import { WishlistButton } from './wishlist-button'

type Product = GetProductsQuery['products']['items'][number]

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="flex flex-col group relative">
      <div className="relative overflow-hidden rounded-2xl bg-muted/30 aspect-[4/5] mb-4">
        <Link to={`/products/${product.id}`} className="absolute inset-0">
          <img
            src={product.imageUrls?.[0] ?? 'https://placehold.co/400x500?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>
        <WishlistButton
          productId={product.id}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-md shadow-sm border-none hover:bg-white text-zinc-600 transition-all duration-300"
        />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <Button 
            className="w-full shadow-lg font-medium" 
            onClick={() => onAddToCart(product.id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to cart
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between gap-2">
          {product.category?.name && (
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <span className="text-sm font-semibold">${product.price.toFixed(2)}</span>
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-base hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
      </div>
    </div>
  )
}
