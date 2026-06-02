import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import { useAuthStore } from '@react-monorepo/shared-auth'
import type {
  GetMyWishlistQuery,
  GetMyWishlistQueryVariables,
  AddToWishlistMutation,
  AddToWishlistMutationVariables,
  RemoveFromWishlistMutation,
  RemoveFromWishlistMutationVariables,
} from '@react-monorepo/shared-graphql'

export const GET_MY_WISHLIST: TypedDocumentNode<GetMyWishlistQuery, GetMyWishlistQueryVariables> = gql`
  query GetMyWishlist {
    myWishlist { id name price imageUrls }
  }
`

const ADD_TO_WISHLIST: TypedDocumentNode<AddToWishlistMutation, AddToWishlistMutationVariables> = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(productId: $productId)
  }
`

const REMOVE_FROM_WISHLIST: TypedDocumentNode<RemoveFromWishlistMutation, RemoveFromWishlistMutationVariables> = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId)
  }
`

const refetchWishlist = { refetchQueries: [{ query: GET_MY_WISHLIST }] }

export function useWishlist() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const { data } = useQuery(GET_MY_WISHLIST, { skip: !accessToken })
  const [addMutation] = useMutation(ADD_TO_WISHLIST, refetchWishlist)
  const [removeMutation] = useMutation(REMOVE_FROM_WISHLIST, refetchWishlist)

  const wishlistIds = new Set((data?.myWishlist ?? []).map((p) => p.id))

  const toggle = (productId: string) => {
    if (!accessToken) return
    if (wishlistIds.has(productId)) {
      removeMutation({ variables: { productId } })
    } else {
      addMutation({ variables: { productId } })
    }
  }

  return { wishlistIds, wishlistItems: data?.myWishlist ?? [], toggle }
}
