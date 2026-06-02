import { useMutation, useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import type {
  PlaceOrderMutation,
  PlaceOrderMutationVariables,
  MeQuery,
  MeQueryVariables,
} from '@react-monorepo/shared-graphql'
import { useCart } from '@react-monorepo/orders'
import { Button, Card, CardContent } from '@react-monorepo/shared-ui'
import { useState } from 'react'
import { MapPin } from 'lucide-react'

// placeOrder takes a direct shippingAddressId arg, not an input object
const PLACE_ORDER: TypedDocumentNode<PlaceOrderMutation, PlaceOrderMutationVariables> = gql`
  mutation PlaceOrder($shippingAddressId: ID!) {
    placeOrder(shippingAddressId: $shippingAddressId) {
      id
      status
      totalAmount
      createdAt
    }
  }
`

const ME_QUERY: TypedDocumentNode<MeQuery, MeQueryVariables> = gql`
  query MeForCheckout {
    me {
      id
      addresses { id isDefault }
    }
  }
`

export function CheckoutPage() {
  const { items, total } = useCart()
  const navigate = useNavigate()
  // MeQuery type is a superset of this partial query — only `addresses` is accessed
  const { data: meData, loading: meLoading, error: meError } = useQuery(ME_QUERY)
  const [placeOrder, { loading: placing }] = useMutation(PLACE_ORDER)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const addresses = meData?.me?.addresses ?? []
  const shippingAddress =
    addresses.find((a) => a.isDefault) ?? addresses[0] ?? null
  const hasAddress = shippingAddress !== null

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return
    setErrorMsg(null)
    try {
      const { data } = await placeOrder({ variables: { shippingAddressId: shippingAddress.id } })
      if (data?.placeOrder) {
        navigate(`/orders/success/${data.placeOrder.id}`)
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to place order.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Your cart is empty.{' '}
        <a href="/products" className="underline">
          Continue shopping
        </a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

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

      {/* No address warning — shown before the place-order button */}
      {!meLoading && !meError && !hasAddress && (
        <div className="flex items-start gap-3 mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">No shipping address on file</p>
            <p className="text-amber-700 mt-0.5">
              Please add a shipping address to your profile before placing an order.
              Address management is coming soon.
            </p>
          </div>
        </div>
      )}

      {errorMsg && <p className="text-sm text-destructive mt-4">{errorMsg}</p>}

      <Button
        className="w-full mt-6"
        disabled={placing || meLoading || !hasAddress || !!meError}
        onClick={handlePlaceOrder}
      >
        {placing ? 'Placing order…' : meLoading ? 'Loading…' : 'Place Order'}
      </Button>
    </div>
  )
}
