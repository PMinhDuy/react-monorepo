import { useMutation, useApolloClient } from '@apollo/client/react'
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
  const client = useApolloClient()
  const [placeOrder, { loading }] = useMutation(PLACE_ORDER)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handlePlaceOrder = async () => {
    setErrorMsg(null)
    try {
      // Fetch current user's addresses to get a valid shippingAddressId
      const { data: meData } = await client.query({ query: ME_QUERY, fetchPolicy: 'network-only' })
      const addresses = meData?.me?.addresses ?? []
      const address =
        addresses.find((a: { id: string; isDefault: boolean }) => a.isDefault) ?? addresses[0]

      if (!address) {
        setErrorMsg('No shipping address on file. Please contact support.')
        return
      }

      const { data } = await placeOrder({ variables: { shippingAddressId: address.id } })
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

      {errorMsg && <p className="text-sm text-destructive mt-4">{errorMsg}</p>}

      <Button className="w-full mt-6" disabled={loading} onClick={handlePlaceOrder}>
        {loading ? 'Placing order…' : 'Place Order'}
      </Button>
    </div>
  )
}
