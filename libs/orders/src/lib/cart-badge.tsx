import { ShoppingCart } from 'lucide-react'
import { Button, Badge } from '@react-monorepo/shared-ui'
import { useCart } from './use-cart'
import { useCartUIStore } from './cart-store'

export function CartBadge() {
  const { itemCount } = useCart()
  const openCart = useCartUIStore((s) => s.openCart)

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Button>
  )
}
