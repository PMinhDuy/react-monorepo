import { useQuery, useMutation } from '@apollo/client/react'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { AddToWishlistDocument, GetMyWishlistDocument, RemoveFromWishlistDocument } from '@react-monorepo/shared-graphql'

const refetchWishlist = { refetchQueries: [{ query: GetMyWishlistDocument }] }

export function useWishlist() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const { data } = useQuery(GetMyWishlistDocument, { skip: !accessToken })
  const [addMutation] = useMutation(AddToWishlistDocument, refetchWishlist)
  const [removeMutation] = useMutation(RemoveFromWishlistDocument, refetchWishlist)

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
