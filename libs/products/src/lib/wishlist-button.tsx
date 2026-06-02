import { Heart } from 'lucide-react'
import { cn } from '@react-monorepo/shared-ui'
import { useWishlist } from './use-wishlist'

interface WishlistButtonProps {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { wishlistIds, toggle } = useWishlist()
  const isWishlisted = wishlistIds.has(productId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      className={cn(
        'rounded-full p-1.5 transition-colors',
        isWishlisted
          ? 'text-red-500 hover:text-red-600'
          : 'text-muted-foreground hover:text-red-400',
        className,
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
    </button>
  )
}
