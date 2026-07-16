import { useMutation, useQuery } from '@apollo/client/react'
import { Link, useSearchParams } from 'react-router-dom'
import { CreateCheckoutSessionDocument, MeForCheckoutDocument, PlaceOrderDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { useCart } from '@react-monorepo/orders'
import { Button, Card, CardContent } from '@react-monorepo/shared-ui'
import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'

export function CheckoutPage() {
  const { items, total } = useCart()
  const [searchParams] = useSearchParams()
  const accessToken = useAuthStore((s) => s.accessToken)
  const wasCancelled = searchParams.get('cancelled') === 'true'
  const { data: meData, loading: meLoading, error: meError } = useQuery(MeForCheckoutDocument, { skip: !accessToken })
  const [placeOrder, { loading: placing }] = useMutation(PlaceOrderDocument)
  const [createCheckoutSession, { loading: redirecting }] = useMutation<
    { createCheckoutSession: string },
    { orderId: string }
  >(CreateCheckoutSessionDocument)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  const addresses = meData?.me?.addresses ?? []
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null

  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id)
    }
  }, [defaultAddress, selectedAddressId])

  const shippingAddress = addresses.find((a) => a.id === selectedAddressId) ?? defaultAddress
  const hasAddress = shippingAddress !== null

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return
    setErrorMsg(null)
    try {
      const { data: orderData } = await placeOrder({ variables: { shippingAddressId: shippingAddress.id } })
      const orderId = orderData?.placeOrder?.id
      if (!orderId) return

      const { data: sessionData } = await createCheckoutSession({ variables: { orderId } })
      if (sessionData?.createCheckoutSession) {
        window.location.href = sessionData.createCheckoutSession
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to place order.')
    }
  }

  const isSubmitting = placing || redirecting

  if (items.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center text-muted-foreground">
        Your cart is empty.{' '}
        <a href="/products" className="underline">
          Continue shopping
        </a>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {wasCancelled && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Payment was cancelled. Your order is saved — try again when ready.
        </div>
      )}

      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span>
                {item.product?.name} × {item.quantity}
              </span>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Network error loading addresses */}
      {meError && (
        <div className="flex items-start gap-3 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <p>Could not load your addresses. Please refresh and try again.</p>
        </div>
      )}

      {/* Address selector */}
      {!meLoading && !meError && addresses.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Shipping address</label>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            value={selectedAddressId ?? ''}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.street}, {a.city}, {a.country}
                {a.isDefault ? ' (default)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* No address warning — shown before the place-order button */}
      {!meLoading && !meError && !hasAddress && (
        <div className="flex items-start gap-3 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">No shipping address on file</p>
            <p className="text-amber-700 mt-0.5">
              Please{' '}
              <Link to="/profile" className="underline font-medium">
                add a shipping address in your profile
              </Link>{' '}
              before placing an order.
            </p>
          </div>
        </div>
      )}

      {errorMsg && <p className="text-sm text-destructive mt-4">{errorMsg}</p>}

      <Button
        className="w-full mt-6"
        disabled={isSubmitting || meLoading || !hasAddress || !!meError}
        onClick={handlePlaceOrder}
      >
        {placing ? 'Placing order…' : redirecting ? 'Redirecting to payment…' : meLoading ? 'Loading…' : 'Place Order & Pay'}
      </Button>
    </div>
  )
}
