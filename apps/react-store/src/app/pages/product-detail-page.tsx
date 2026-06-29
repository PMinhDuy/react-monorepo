import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetProductQuery, GetProductQueryVariables } from '@react-monorepo/shared-graphql'
import { Button, Badge } from '@react-monorepo/shared-ui'
import { useCart, useCartUIStore } from '@react-monorepo/orders'
import {
  RelatedProducts,
  ReviewList,
  StarRating,
  ProductStructuredData,
  WishlistButton,
  ImageGallery,
  QuantitySelector,
} from '@react-monorepo/products'
import { SeoHead } from '@react-monorepo/shared-ui'
import { ShoppingCart, Zap, ChevronLeft } from 'lucide-react'

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
  const navigate = useNavigate()
  const { data, loading } = useQuery(GET_PRODUCT, { variables: { id: id! } })
  const { addToCart } = useCart()
  const openCart = useCartUIStore((s) => s.openCart)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    if (!id) return
    await addToCart(id, quantity)
    openCart()
  }

  const handleBuyNow = async () => {
    if (!id) return
    try {
      await addToCart(id, quantity)
    } catch {
      // ProtectedRoute on /checkout will redirect unauthenticated users to /login
    }
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="h-4 bg-muted rounded w-48 mb-6 animate-pulse" />
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="flex flex-col gap-3">
            <div className="aspect-square bg-muted rounded-2xl" />
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 w-16 bg-muted rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="space-y-4 py-2">
            <div className="h-3 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-7 bg-muted rounded w-1/4" />
            <div className="h-24 bg-muted rounded" />
            <div className="h-9 bg-muted rounded w-32" />
            <div className="flex gap-3">
              <div className="h-11 bg-muted rounded flex-1" />
              <div className="h-11 bg-muted rounded flex-1" />
            </div>
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
  const images = product.imageUrls ?? []
  const firstImage = images[0]

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <SeoHead
        title={product.name}
        description={product.description ?? undefined}
        image={firstImage}
        type="product"
      />
      <ProductStructuredData
        name={product.name}
        description={product.description}
        price={product.price}
        image={firstImage}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
        sku={product.id}
      />

      <nav
        className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
        aria-label="Breadcrumb"
      >
        <Link to="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground/60 line-clamp-1">{product.category?.name}</span>
        <span>/</span>
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <ImageGallery images={images} alt={product.name} />

        <div className="space-y-5 py-2">
          {product.category?.name && (
            <Badge variant="secondary" className="font-normal">
              {product.category.name}
            </Badge>
          )}

          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold tracking-tight leading-tight">{product.name}</h1>
            <WishlistButton productId={product.id} className="mt-1 flex-shrink-0" />
          </div>

          <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>

          {(product.reviewCount ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={product.averageRating ?? 0} size="sm" />
              <span className="text-sm text-muted-foreground">
                {(product.averageRating ?? 0).toFixed(1)} · {product.reviewCount}{' '}
                {product.reviewCount !== 1 ? 'reviews' : 'review'}
              </span>
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <QuantitySelector value={quantity} onChange={setQuantity} />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button size="lg" className="flex-1 gap-2 min-w-[140px]" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="flex-1 gap-2 min-w-[140px]"
              onClick={handleBuyNow}
            >
              <Zap className="h-5 w-5" />
              Buy Now
            </Button>
          </div>
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
