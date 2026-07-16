import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { useParams, Link } from 'react-router-dom'
import { CancelMyOrderDocument, CreateCheckoutSessionFromDetailDocument, GetMyOrderDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { Card, CardContent, Button } from '@react-monorepo/shared-ui'
import { OrderStatusBadge } from '@react-monorepo/orders'
import { ArrowLeft, XCircle } from 'lucide-react'

const CANCELLABLE = new Set(['PENDING', 'AWAITING_PAYMENT', 'CONFIRMED'])

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const accessToken = useAuthStore((s) => s.accessToken)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const { data, loading, error } = useQuery(GetMyOrderDocument, {
    variables: { id: id! },
    skip: !id || !accessToken,
  })
  const [cancelOrder, { loading: cancelling }] = useMutation(CancelMyOrderDocument, {
    refetchQueries: [{ query: GetMyOrderDocument, variables: { id: id! } }],
  })
  const [createCheckoutSession, { loading: redirecting }] = useMutation(CreateCheckoutSessionFromDetailDocument)
  const order = data?.myOrder

  const handleRetryPayment = async () => {
    if (!id) return
    try {
      const { data: sessionData } = await createCheckoutSession({ variables: { orderId: id } })
      if (sessionData?.createCheckoutSession) {
        window.location.href = sessionData.createCheckoutSession
      }
    } catch (err) {
      console.error('Failed to create checkout session', err)
    }
  }

  const handleCancel = async () => {
    setCancelError(null)
    try {
      await cancelOrder({ variables: { id: id! } })
      setConfirmOpen(false)
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Failed to cancel order.')
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-4">
          <div className="h-8 w-40 rounded bg-muted animate-pulse" />
          <div className="h-48 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 max-w-2xl text-center text-muted-foreground">
        <p>Order not found.</p>
        <Link to="/orders">
          <Button variant="ghost" className="mt-4">
            Back to orders
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 max-w-2xl">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(-8)}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          {CANCELLABLE.has(order.status) && !confirmOpen && (
            <Button variant="outline" size="sm" className="text-destructive border-destructive/40 hover:bg-destructive/5" onClick={() => setConfirmOpen(true)}>
              <XCircle className="h-4 w-4 mr-1" /> Cancel order
            </Button>
          )}
        </div>
      </div>

      {/* Cancel confirmation */}
      {confirmOpen && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
          <p className="text-sm font-medium">Are you sure you want to cancel this order?</p>
          <p className="text-xs text-muted-foreground">This action cannot be undone. Stock will be restored automatically.</p>
          {cancelError && <p className="text-xs text-destructive">{cancelError}</p>}
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" disabled={cancelling} onClick={handleCancel}>
              {cancelling ? 'Cancelling…' : 'Yes, cancel order'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setConfirmOpen(false); setCancelError(null) }}>
              Keep order
            </Button>
          </div>
        </div>
      )}

      {order.status === 'PAYMENT_FAILED' && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-800">Payment failed</p>
            <p className="text-xs text-red-600 mt-0.5">Your payment was not completed. You can retry below.</p>
          </div>
          <Button
            size="sm"
            disabled={redirecting}
            onClick={handleRetryPayment}
            className="bg-red-600 hover:bg-red-700 text-white shrink-0"
          >
            {redirecting ? 'Redirecting…' : 'Pay Now'}
          </Button>
        </div>
      )}

      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Items
          </h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Product #{item.productId.slice(-8)} × {item.quantity}
              </span>
              <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
