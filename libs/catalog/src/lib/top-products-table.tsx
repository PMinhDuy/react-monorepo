import type { TopProduct } from '@react-monorepo/shared-graphql'

interface TopProductsTableProps {
  products: TopProduct[]
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No sales data available</p>
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-muted-foreground">
          <th className="pb-2 font-medium">#</th>
          <th className="pb-2 font-medium">Product</th>
          <th className="pb-2 font-medium text-right">Sold</th>
          <th className="pb-2 font-medium text-right">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {products.map((tp, i) => (
          <tr key={tp.product.id} className="border-b last:border-0 hover:bg-muted/20">
            <td className="py-2.5 pr-3 text-muted-foreground">{i + 1}</td>
            <td className="py-2.5 pr-3 font-medium truncate max-w-[180px]">{tp.product.name}</td>
            <td className="py-2.5 text-right tabular-nums">{tp.totalSold}</td>
            <td className="py-2.5 text-right tabular-nums font-medium">${tp.totalRevenue.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
