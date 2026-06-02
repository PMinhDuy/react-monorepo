import { Star } from 'lucide-react'
import { cn } from '@react-monorepo/shared-ui'

interface StarRatingProps {
  value: number
  max?: number
  interactive?: boolean
  onChange?: (rating: number) => void
  size?: 'sm' | 'md'
}

export function StarRating({ value, max = 5, interactive = false, onChange, size = 'md' }: StarRatingProps) {
  const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5'

  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'group' : undefined} aria-label={`Rating: ${value} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value)
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              'transition-colors',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default',
              filled ? 'text-amber-400' : 'text-muted-foreground/30',
            )}
            aria-label={`${i + 1} star${i + 1 !== 1 ? 's' : ''}`}
          >
            <Star className={cn(iconClass, filled && 'fill-current')} />
          </button>
        )
      })}
    </div>
  )
}
