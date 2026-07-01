import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { DeactivateUserDocument, GetCustomerDocument, GetCustomerOrdersDocument } from '@react-monorepo/shared-graphql'
import { Button, Badge, Card, CardContent } from '@react-monorepo/shared-ui'
import { ChevronLeft, ShoppingCart, DollarSign, Calendar } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data, refetch } = useQuery(GetCustomerDocument, { variables: { id: id! } })
  const { data: ordersData, loading: ordersLoading } = useQuery(GetCustomerOrdersDocument, {
    variables: { userId: id, limit: 20 },
  })
  const [deactivate, { loading: deactivating }] = useMutation(DeactivateUserDocument, {
    onCompleted: () => refetch(),
  })

  const profile = data?.customer
  const orders = ordersData?.orders ?? []

  if (!profile) {
    return <div className="p-8 text-muted-foreground">Loading…</div>
  }

  const { user, totalOrders, totalSpent, lastOrderAt } = profile

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <Link to="/customers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={user.isActive ? 'default' : 'destructive'}>
            {user.isActive ? 'Active' : 'Inactive'}
          </Badge>
          {user.isActive && (
            <Button
              variant="outline"
              size="sm"
              disabled={deactivating}
              onClick={() => {
                if (window.confirm(`Deactivate account for ${user.name}?`)) {
                  deactivate({ variables: { id: user.id } })
                }
              }}
            >
              Deactivate
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 px-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 shrink-0"><ShoppingCart className="h-4 w-4 text-blue-600" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="text-xl font-bold">{totalOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 shrink-0"><DollarSign className="h-4 w-4 text-emerald-600" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Spent</p>
              <p className="text-xl font-bold">${totalSpent.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 px-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-50 shrink-0"><Calendar className="h-4 w-4 text-violet-600" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Last Order</p>
              <p className="text-sm font-semibold">
                {lastOrderAt ? new Date(lastOrderAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order history */}
      <div>
        <h2 className="text-base font-semibold mb-3">Order History</h2>
        {ordersLoading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-muted-foreground text-left">
                  <th className="py-2.5 pl-4 pr-4 font-medium">Order ID</th>
                  <th className="py-2.5 pr-4 font-medium">Status</th>
                  <th className="py-2.5 pr-4 font-medium">Items</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Total</th>
                  <th className="py-2.5 pr-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-2.5 pl-4 pr-4 font-mono text-xs text-muted-foreground">#{o.id.slice(-8)}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${STATUS_COLORS[o.status] ?? 'bg-muted'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{o.items.length}</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums font-medium">${o.totalAmount.toFixed(2)}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground text-xs">
                      {new Date(o.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
