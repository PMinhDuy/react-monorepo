interface ProductSkeletonProps {
  count?: number
}

export function ProductSkeleton({ count = 12 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card animate-pulse">
          <div className="h-48 bg-muted rounded-t-lg" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-5 bg-muted rounded w-1/4" />
          </div>
          <div className="p-4 pt-0">
            <div className="h-9 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
