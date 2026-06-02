import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Button } from '@react-monorepo/shared-ui'
import { CheckCircle2, Package, ArrowRight, CreditCard } from 'lucide-react'

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const paidViaStripe = !!sessionId

  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {paidViaStripe ? 'Payment Successful!' : 'Order Placed!'}
        </h1>
        <p className="text-muted-foreground">
          {paidViaStripe
            ? 'Your payment was processed successfully. Your order is now confirmed.'
            : 'Thank you! Your order has been confirmed and is being processed.'}
        </p>
      </div>

      {paidViaStripe && (
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
          <CreditCard className="h-4 w-4 shrink-0" />
          Payment verified by Stripe
        </div>
      )}

      <div className="bg-muted/40 rounded-xl px-4 py-3 flex items-center gap-3 text-left border">
        <Package className="h-5 w-5 text-muted-foreground shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Order ID</p>
          <p className="font-mono text-sm font-medium">{orderId}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/orders">
          <Button variant="outline" className="w-full sm:w-auto">
            View Orders
          </Button>
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
