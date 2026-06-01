import { useNavigate } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
} from '@react-monorepo/shared-ui'
import { useCartUIStore } from './cart-store'
import { useCart } from './use-cart'
import { CartItemRow } from './cart-item-row'
import { ShoppingCart, ArrowRight } from 'lucide-react'

export function CartDrawer() {
  const { isOpen, closeCart } = useCartUIStore()
  const { items, total, loading } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col w-80 sm:w-96">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
            {items.length > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading && (
            <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
          )}
          {!loading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">Your cart is empty</p>
              <p className="text-xs text-muted-foreground">Add items to get started</p>
            </div>
          )}
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4 mt-auto">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold tracking-tight">${total.toFixed(2)}</span>
            </div>
            <Button className="w-full gap-2" onClick={handleCheckout}>
              Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
