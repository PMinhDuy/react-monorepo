import { Link } from 'react-router-dom'
import { Card, CardContent, Button } from '@react-monorepo/shared-ui'
import { useWishlist } from '@react-monorepo/products'
import { useCart, useCartUIStore } from '@react-monorepo/orders'
import { Heart, ShoppingCart } from 'lucide-react'

export function WishlistPage() {
  const { wishlistItems, toggle } = useWishlist()
  const { addToCart } = useCart()
  const openCart = useCartUIStore((s) => s.openCart)

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1)
    openCart()
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center text-muted-foreground">
        <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">Your wishlist is empty</p>
        <p className="text-sm mt-1">
          <Link to="/products" className="underline">
            Browse products
          </Link>{' '}
          and save items you love.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Wishlist <span className="text-muted-foreground text-lg font-normal">({wishlistItems.length})</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistItems.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link to={`/products/${product.id}`}>
              <img
                src={(product.imageUrls ?? [])[0] ?? 'https://placehold.co/300x200?text=No+Image'}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
            </Link>
            <CardContent className="p-3 space-y-2">
              <Link to={`/products/${product.id}`} className="block text-sm font-medium leading-tight hover:underline line-clamp-2">
                {product.name}
              </Link>
              <p className="text-base font-bold">${product.price.toFixed(2)}</p>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  className="flex-1 gap-1 text-xs h-8"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Add to cart
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-400 hover:text-red-500"
                  onClick={() => toggle(product.id)}
                  aria-label="Remove from wishlist"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
