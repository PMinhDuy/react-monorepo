import { useState, useEffect, useRef } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client/react'
import { ExportOrdersDocument, GetAdminOrdersDocument, OrderStatus } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { Button } from '@react-monorepo/shared-ui'
import { OrderTable } from '@react-monorepo/catalog'
import { downloadCsv } from '@react-monorepo/catalog'
import { Download } from 'lucide-react'

const STATUS_OPTIONS: { label: string; value: OrderStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

export function AdminOrdersPage() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [exportStatus, setExportStatus] = useState<OrderStatus | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data, loading } = useQuery(GetAdminOrdersDocument, {
    variables: { limit: 50, offset: 0 },
    skip: !accessToken,
  })

  const [exportOrders, { loading: exporting, data: exportData }] = useLazyQuery(ExportOrdersDocument)
  const exportedRef = useRef<typeof exportData>(undefined)

  useEffect(() => {
    if (exportData && exportData !== exportedRef.current) {
      exportedRef.current = exportData
      const rows = exportData.exportOrders.map((o) => ({
        orderId: o.id,
        userId: o.userId,
        status: o.status,
        total: o.totalAmount.toFixed(2),
        items: o.items.length,
        createdAt: new Date(o.createdAt).toISOString(),
      }))
      downloadCsv(`orders-export-${Date.now()}.csv`, rows)
    }
  }, [exportData])

  const orders = data?.orders ?? []

  const handleExport = () => {
    exportOrders({
      variables: {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: exportStatus || undefined,
      },
    })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">View and manage all customer orders</p>
        </div>

        {/* Export controls */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-9 rounded-md border px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
          />
          <span className="text-muted-foreground text-sm">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-9 rounded-md border px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
          />
          <select
            value={exportStatus}
            onChange={(e) => setExportStatus(e.target.value as OrderStatus | '')}
            className="h-9 rounded-md border px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none bg-background"
          >
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4" />
            {exporting ? 'Exporting…' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm animate-pulse">Loading…</p>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  )
}
