import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { BulkDeleteProductsDocument, BulkUpdateProductsDocument, GetAdminProductsQuery, RemoveProductDocument } from '@react-monorepo/shared-graphql'
import { Button, Badge, cn } from '@react-monorepo/shared-ui'
import { Package, Pencil, Trash2, AlertTriangle } from 'lucide-react'

type Product = GetAdminProductsQuery['adminProducts']['items'][number]

interface ProductTableProps {
  products: Product[]
  onDeleted: () => void
}

export function ProductTable({ products, onDeleted }: ProductTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const [removeProduct] = useMutation(RemoveProductDocument, { onCompleted: onDeleted })
  const [bulkUpdate] = useMutation(BulkUpdateProductsDocument, { onCompleted: () => { setSelected(new Set()); onDeleted() } })
  const [bulkDelete] = useMutation(BulkDeleteProductsDocument, { onCompleted: () => { setSelected(new Set()); onDeleted() } })

  const allSelected = products.length > 0 && selected.size === products.length
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)))
  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const selectedIds = Array.from(selected)

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
    <div className="space-y-2">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border rounded-lg text-sm">
          <span className="font-medium text-primary">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={() => bulkUpdate({ variables: { ids: selectedIds, isActive: false } })}>
              Deactivate
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkUpdate({ variables: { ids: selectedIds, isActive: true } })}>
              Activate
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                if (confirm(`Delete ${selected.size} products? This cannot be undone.`)) {
                  bulkDelete({ variables: { ids: selectedIds } })
                }
              }}
            >
              Delete selected
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground bg-muted/30">
              <th className="py-3 pl-4 pr-2 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-muted-foreground/30 cursor-pointer"
                />
              </th>
              <th className="py-3 pr-4 w-12"></th>
              <th className="py-3 pr-4 font-medium">Name</th>
              <th className="py-3 pr-4 font-medium">Price</th>
              <th className="py-3 pr-4 font-medium">Stock</th>
              <th className="py-3 pr-4 font-medium">Category</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLowStock = p.stock < (p.lowStockThreshold ?? 10)
              return (
                <tr key={p.id} className={cn('border-b hover:bg-muted/20 transition-colors', selected.has(p.id) && 'bg-primary/5')}>
                  <td className="py-3 pl-4 pr-2">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                      className="rounded border-muted-foreground/30 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <img
                      src={p.imageUrls?.[0] ?? 'https://placehold.co/40x40?text=·'}
                      alt={p.name}
                      className="h-9 w-9 rounded-md object-cover border"
                    />
                  </td>
                  <td className="py-3 pr-4 font-medium">{p.name}</td>
                  <td className="py-3 pr-4 font-mono">${p.price.toFixed(2)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('tabular-nums', isLowStock && 'text-red-600 font-semibold')}>{p.stock}</span>
                      {isLowStock && (
                        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                          <AlertTriangle className="h-2.5 w-2.5" />
                          Low
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="secondary" className="font-normal">{p.category?.name ?? '—'}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={p.isActive ? 'default' : 'outline'} className="font-normal text-xs">
                      {p.isActive ? 'Active' : 'Inactive'}
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
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
