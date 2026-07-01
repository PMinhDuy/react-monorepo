import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { useApolloClient } from '@apollo/client'
import { Button } from '@react-monorepo/shared-ui'
import { CheckCircle2, Package, ArrowRight, CreditCard, Loader2, XCircle, Clock } from 'lucide-react'
import { GetOrderForSuccessDocument } from '@react-monorepo/shared-graphql'

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [searchParams] = useSearchParams()
  const paidViaStripe = !!searchParams.get('session_id')
  const client = useApolloClient()
  const [timedOut, setTimedOut] = useState(false)

  const { data, loading, startPolling, stopPolling } = useQuery<{
    myOrder: { id: string; status: string }
  }>(GetOrderForSuccessDocument, {
    variables: { id: orderId! },
    skip: !orderId || !paidViaStripe,
  })
  const status = data?.myOrder?.status

  useEffect(() => {
    if (!paidViaStripe) return
    if (status === 'AWAITING_PAYMENT') {
      startPolling(3000)
      return () => stopPolling()
    }
    stopPolling()
    if (status === 'CONFIRMED') {
      client.refetchQueries({ include: ['GetMyCart'] })
    }
  }, [status, paidViaStripe, startPolling, stopPolling, client])

  useEffect(() => {
    if (!paidViaStripe) return
    const timer = setTimeout(() => setTimedOut(true), 30_000)
    return () => clearTimeout(timer)
  }, [paidViaStripe])

  if (!paidViaStripe) {
    return <SimpleOrderPlacedUI orderId={orderId} />
  }

  if (loading && !status) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-muted animate-pulse mx-auto" />
          <div className="h-4 w-64 rounded bg-muted animate-pulse mx-auto" />
        </div>
      </div>
    )
  }

  if (status === 'AWAITING_PAYMENT' && !timedOut) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Confirming payment…</h1>
          <p className="text-muted-foreground">Please wait while we verify your payment with Stripe.</p>
        </div>
      </div>
    )
  }

  if (status === 'AWAITING_PAYMENT' && timedOut) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="h-10 w-10 text-amber-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Payment processing</h1>
          <p className="text-muted-foreground">This is taking longer than expected. Your payment is being processed — check your orders for updates.</p>
        </div>
        <Link to="/orders">
          <Button variant="outline">Check my orders</Button>
        </Link>
      </div>
    )
  }

  if (status === 'PAYMENT_FAILED') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Payment failed</h1>
          <p className="text-muted-foreground">Your payment could not be completed. You can retry from your order details.</p>
        </div>
        <Link to={`/orders/${orderId}`}>
          <Button className="bg-red-600 hover:bg-red-700 text-white">View order & retry payment</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Payment Successful!</h1>
        <p className="text-muted-foreground">Your payment was processed successfully. Your order is now confirmed.</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
        <CreditCard className="h-4 w-4 shrink-0" />
        Payment verified by Stripe
      </div>

      <div className="bg-muted/40 rounded-xl px-4 py-3 flex items-center gap-3 text-left border">
        <Package className="h-5 w-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Order ID</p>
          <p className="font-mono text-sm font-medium">{orderId}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders">
          <Button variant="outline" className="w-full sm:w-auto">View Orders</Button>
        </Link>
        <Link to="/products">
          <Button className="w-full sm:w-auto gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function SimpleOrderPlacedUI({ orderId }: { orderId?: string }) {
  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Order Placed!</h1>
        <p className="text-muted-foreground">Thank you! Your order has been confirmed and is being processed.</p>
      </div>

      <div className="bg-muted/40 rounded-xl px-4 py-3 flex items-center gap-3 text-left border">
        <Package className="h-5 w-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Order ID</p>
          <p className="font-mono text-sm font-medium">{orderId}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders">
          <Button variant="outline" className="w-full sm:w-auto">View Orders</Button>
        </Link>
        <Link to="/products">
          <Button className="w-full sm:w-auto gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
