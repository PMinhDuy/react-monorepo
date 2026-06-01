import { Button } from '@react-monorepo/shared-ui'
import type { CartItem } from '@react-monorepo/shared-graphql'
import { useCart } from './use-cart'

interface CartItemRowProps {
  item: CartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { addToCart, removeFromCart } = useCart()

  return (
    <div className="flex items-center gap-3">
      <img
        src={item.product?.imageUrls?.[0] ?? 'https://placehold.co/64x64?text=?'}
        alt={item.product?.name}
        className="h-16 w-16 rounded object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.product?.name}</p>
        <p className="text-sm text-muted-foreground">
          ${item.product?.price.toFixed(2)}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => removeFromCart(item.productId)}
        >
          −
        </Button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => addToCart(item.productId)}
        >
          +
        </Button>
      </div>
    </div>
  )
}
