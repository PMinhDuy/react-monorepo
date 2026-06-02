interface ProductStructuredDataProps {
  name: string
  description?: string | null
  price: number
  image?: string
  averageRating?: number | null
  reviewCount?: number | null
  sku?: string
}

export function ProductStructuredData({
  name,
  description,
  price,
  image,
  averageRating,
  reviewCount,
  sku,
}: ProductStructuredDataProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description && { description }),
    ...(image && { image }),
    ...(sku && { sku }),
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  if (averageRating && reviewCount && reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount,
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
