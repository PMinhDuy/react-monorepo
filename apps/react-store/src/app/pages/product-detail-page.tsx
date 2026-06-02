import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetProductQuery, GetProductQueryVariables } from '@react-monorepo/shared-graphql'
import { Button, Badge } from '@react-monorepo/shared-ui'
import { useCart, useCartUIStore } from '@react-monorepo/orders'
import { RelatedProducts, ReviewList, StarRating } from '@react-monorepo/products'
import { ShoppingCart, ChevronLeft } from 'lucide-react'

const GET_PRODUCT: TypedDocumentNode<GetProductQuery, GetProductQueryVariables> = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id name description price imageUrls
      category { id name }
      averageRating reviewCount
      relatedProducts(limit: 4) { id name price imageUrls }
    }
  }
`

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, loading } = useQuery(GET_PRODUCT, { variables: { id: id! } })
  const { addToCart } = useCart()
  const openCart = useCartUIStore((s) => s.openCart)

  const handleAddToCart = async () => {
    if (!id) return
    await addToCart(id, 1)
    openCart()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="h-96 bg-muted rounded-2xl" />
          <div className="space-y-4 py-2">
            <div className="h-3 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-7 bg-muted rounded w-1/4" />
            <div className="h-24 bg-muted rounded" />
            <div className="h-11 bg-muted rounded w-44" />
          </div>
        </div>
      </div>
    )
  }

  if (!data?.product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/products">
          <Button variant="outline" className="mt-4 gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  const { product } = data

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={(product.imageUrls ?? [])[0] ?? 'https://placehold.co/600x400?text=No+Image'}
          alt={product.name}
          className="rounded-2xl w-full object-cover shadow-sm border"
        />
        <div className="space-y-5 py-2">
          {product.category?.name && (
            <Badge variant="secondary" className="font-normal">
              {product.category.name}
            </Badge>
          )}
          <h1 className="text-3xl font-bold tracking-tight leading-tight">{product.name}</h1>
          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
          {(product.reviewCount ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={product.averageRating ?? 0} size="sm" />
              <span className="text-sm text-muted-foreground">
                {(product.averageRating ?? 0).toFixed(1)} ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          )}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          <Button size="lg" className="gap-2" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      <RelatedProducts
        products={product.relatedProducts ?? []}
        onAddToCart={async (productId) => {
          await addToCart(productId, 1)
          openCart()
        }}
      />

      <ReviewList productId={product.id} />
    </div>
  )
}
