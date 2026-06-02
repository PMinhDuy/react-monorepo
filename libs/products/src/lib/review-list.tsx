import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  GetProductReviewsQuery,
  GetProductReviewsQueryVariables,
  CreateReviewMutation,
  CreateReviewMutationVariables,
  GetMyOrdersQuery,
  GetMyOrdersQueryVariables,
} from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { Button } from '@react-monorepo/shared-ui'
import { StarRating } from './star-rating'
import { ReviewCard } from './review-card'

const GET_PRODUCT_REVIEWS: TypedDocumentNode<GetProductReviewsQuery, GetProductReviewsQueryVariables> = gql`
  query GetProductReviews($productId: ID!, $limit: Int, $offset: Int) {
    productReviews(productId: $productId, limit: $limit, offset: $offset) {
      id userId rating comment createdAt
    }
  }
`

const CREATE_REVIEW: TypedDocumentNode<CreateReviewMutation, CreateReviewMutationVariables> = gql`
  mutation CreateReview($productId: ID!, $orderId: ID!, $rating: Int!, $comment: String) {
    createReview(productId: $productId, orderId: $orderId, rating: $rating, comment: $comment) {
      id rating comment createdAt
    }
  }
`

const GET_MY_ORDERS_FOR_REVIEW: TypedDocumentNode<GetMyOrdersQuery, GetMyOrdersQueryVariables> = gql`
  query GetMyOrdersForReview {
    myOrders {
      id status
      items { productId }
    }
  }
`

interface ReviewListProps {
  productId: string
}

export function ReviewList({ productId }: ReviewListProps) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: reviewsData, loading } = useQuery(GET_PRODUCT_REVIEWS, {
    variables: { productId, limit: 20, offset: 0 },
  })
  const { data: ordersData } = useQuery(GET_MY_ORDERS_FOR_REVIEW, { skip: !accessToken })
  const [createReview, { loading: submitting }] = useMutation(CREATE_REVIEW, {
    refetchQueries: [{ query: GET_PRODUCT_REVIEWS, variables: { productId, limit: 20, offset: 0 } }],
  })

  const reviews = reviewsData?.productReviews ?? []

  // Find a delivered order that contains this product and hasn't been reviewed yet
  const eligibleOrder = ordersData?.myOrders?.find(
    (o) => o.status === 'DELIVERED' && o.items.some((i) => i.productId === productId),
  )
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eligibleOrder) return
    setSubmitError(null)
    try {
      await createReview({ variables: { productId, orderId: eligibleOrder.id, rating, comment: comment || null } })
      setShowForm(false)
      setComment('')
      setRating(5)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit review.')
    }
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Reviews ({reviews.length})</h2>
        {accessToken && eligibleOrder && !showForm && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
            Write a review
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-lg border space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Your rating</label>
            <StarRating value={rating} interactive onChange={setRating} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1" htmlFor="review-comment">Comment (optional)</label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Share your experience…"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right mt-0.5">{comment.length}/500</p>
          </div>
          {submitError && <p className="text-xs text-destructive">{submitError}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {!accessToken && (
        <p className="text-sm text-muted-foreground mb-4">Sign in and purchase this product to leave a review.</p>
      )}
      {accessToken && !eligibleOrder && (
        <p className="text-sm text-muted-foreground mb-4">Purchase and receive this product to leave a review.</p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-16 rounded bg-muted animate-pulse" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">No reviews yet. Be the first!</p>
      ) : (
        <div className="divide-y">
          {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
        </div>
      )}
    </section>
  )
}
