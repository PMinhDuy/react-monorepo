import type { Review } from '@react-monorepo/shared-graphql'
import { StarRating } from './star-rating'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="space-y-1.5 py-4 border-b last:border-0">
      <div className="flex items-center gap-3">
        <StarRating value={review.rating} size="sm" />
        <span className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
        </span>
      </div>
      {review.comment && (
        <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
      )}
    </div>
  )
}
