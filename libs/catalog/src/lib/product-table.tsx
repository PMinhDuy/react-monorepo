import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  RemoveProductMutation,
  RemoveProductMutationVariables,
  GetProductsQuery,
} from '@react-monorepo/shared-graphql'
import { Button, Badge } from '@react-monorepo/shared-ui'
import { Package, Pencil, Trash2 } from 'lucide-react'

const REMOVE_PRODUCT: TypedDocumentNode<
  RemoveProductMutation,
  RemoveProductMutationVariables
> = gql`
  mutation RemoveProduct($id: ID!) {
    removeProduct(id: $id)
  }
`

type Product = GetProductsQuery['products']['items'][number]

interface ProductTableProps {
  products: Product[]
  onDeleted: () => void
}

export function ProductTable({ products, onDeleted }: ProductTableProps) {
  const [removeProduct] = useMutation(REMOVE_PRODUCT, { onCompleted: onDeleted })

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-sm">No products found</p>
        <p className="text-xs text-muted-foreground">Add a product to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground bg-muted/30">
            <th className="py-3 pl-4 pr-4 font-medium w-12"></th>
            <th className="py-3 pr-4 font-medium">Name</th>
            <th className="py-3 pr-4 font-medium">Price</th>
            <th className="py-3 pr-4 font-medium">Category</th>
            <th className="py-3 pr-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-muted/20 transition-colors group">
              <td className="py-3 pl-4 pr-4">
                <img
                  src={p.imageUrls?.[0] ?? 'https://placehold.co/40x40?text=·'}
                  alt={p.name}
                  className="h-9 w-9 rounded-md object-cover border"
                />
              </td>
              <td className="py-3 pr-4 font-medium">{p.name}</td>
              <td className="py-3 pr-4 font-mono text-sm">${p.price.toFixed(2)}</td>
              <td className="py-3 pr-4">
                <Badge variant="secondary" className="font-normal">
                  {p.category?.name ?? '—'}
                </Badge>
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2 justify-end">
                  <Link to={`/products/${p.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"?`)) {
                        removeProduct({ variables: { id: p.id } })
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
