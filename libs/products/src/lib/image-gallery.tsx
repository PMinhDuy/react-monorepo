import { useState } from 'react'
import { cn } from '@react-monorepo/shared-ui'

interface ImageGalleryProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageGallery({ images, alt, className }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0)

  if (!images.length) return null

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="aspect-square overflow-hidden rounded-2xl border bg-muted">
        <img
          src={images[selected]}
          alt={alt}
          className="h-full w-full object-cover transition-opacity duration-200"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                'flex-shrink-0 h-16 w-16 rounded-lg border-2 overflow-hidden transition-all',
                i === selected
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-transparent hover:border-muted-foreground/30'
              )}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === selected}
            >
              <img src={src} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
