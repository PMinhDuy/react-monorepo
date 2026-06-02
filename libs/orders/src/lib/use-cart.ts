import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  GetMyCartQuery,
  GetMyCartQueryVariables,
  AddToCartMutation,
  AddToCartMutationVariables,
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables,
  UpdateCartItemQuantityMutation,
  UpdateCartItemQuantityMutationVariables,
} from '@react-monorepo/shared-graphql'

const GET_CART: TypedDocumentNode<GetMyCartQuery, GetMyCartQueryVariables> = gql`
  query GetMyCart {
    myCart {
      total
      items {
        productId
        quantity
        subtotal
        product { id name price imageUrls }
      }
    }
  }
`

// NestJS Lambda — inline input object with scalar vars (no named input types)
const ADD_TO_CART: TypedDocumentNode<AddToCartMutation, AddToCartMutationVariables> = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity })
  }
`

// removeFromCart takes a direct arg, not an input object
const REMOVE_FROM_CART: TypedDocumentNode<RemoveFromCartMutation, RemoveFromCartMutationVariables> = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId)
  }
`

const UPDATE_CART_ITEM: TypedDocumentNode<UpdateCartItemQuantityMutation, UpdateCartItemQuantityMutationVariables> = gql`
  mutation UpdateCartItemQuantity($productId: ID!, $quantity: Int!) {
    updateCartItemQuantity(productId: $productId, quantity: $quantity)
  }
`

const refetchCart = { refetchQueries: [{ query: GET_CART }] }

export function useCart() {
  const { data, loading } = useQuery(GET_CART)
  const [addToCartMutation] = useMutation(ADD_TO_CART, refetchCart)
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, refetchCart)
  const [updateCartItemMutation] = useMutation(UPDATE_CART_ITEM, refetchCart)

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
