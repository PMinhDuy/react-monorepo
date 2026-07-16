import { useQuery, useMutation } from '@apollo/client/react'
import { AddToCartDocument, GetMyCartDocument, RemoveFromCartDocument, UpdateCartItemQuantityDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'

const refetchCart = { refetchQueries: [{ query: GetMyCartDocument }] }

export function useCart() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const { data, loading } = useQuery(GetMyCartDocument, { skip: !accessToken })
  const [addToCartMutation] = useMutation(AddToCartDocument, refetchCart)
  const [removeFromCartMutation] = useMutation(RemoveFromCartDocument, refetchCart)
  const [updateCartItemMutation] = useMutation(UpdateCartItemQuantityDocument, refetchCart)

  const items = data?.myCart?.items ?? []
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = data?.myCart?.total ?? 0

  const addToCart = (productId: string, quantity = 1) =>
    addToCartMutation({ variables: { productId, quantity } })

  const removeFromCart = (productId: string) =>
    removeFromCartMutation({ variables: { productId } })

  const updateQuantity = (productId: string, quantity: number) =>
    updateCartItemMutation({ variables: { productId, quantity } })

  return { items, itemCount, total, loading, addToCart, removeFromCart, updateQuantity }
}
