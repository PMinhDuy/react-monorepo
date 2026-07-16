import { useQuery } from '@apollo/client/react'
import { GetDashboardStatsDocument, GetLowStockDashboardDocument, GetRecentOrdersDocument, GetRevenueChartDocument, GetTopProductsDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { Card, CardContent } from '@react-monorepo/shared-ui'
import { StatsCard, RevenueChart, TopProductsTable, OrderStatusPie } from '@react-monorepo/catalog'
import { Link } from 'react-router-dom'
import { DollarSign, ShoppingCart, Package, Clock, Users, AlertTriangle } from 'lucide-react'

export function DashboardPage() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const { data: statsData } = useQuery(GetDashboardStatsDocument, { skip: !accessToken })
  const { data: chartData } = useQuery(GetRevenueChartDocument, { variables: { days: 30 }, skip: !accessToken })
  const { data: topData } = useQuery(GetTopProductsDocument, { variables: { limit: 5 }, skip: !accessToken })
  const { data: ordersData } = useQuery(GetRecentOrdersDocument, { variables: { limit: 10 }, skip: !accessToken })
  const { data: lowStockData } = useQuery(GetLowStockDashboardDocument, { skip: !accessToken })

  const stats = statsData?.dashboardStats
  const revenueChart = chartData?.revenueChart ?? []
  const topProducts = topData?.topProducts ?? []
  const recentOrders = ordersData?.orders ?? []
  const lowStockProducts = lowStockData?.lowStockProducts ?? []

  const revenueTrend = stats?.revenueLastMonth
    ? ((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100
    : undefined

  // Build order status distribution from recent orders for the pie chart
  const statusCounts = recentOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})
  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    status: status as Parameters<typeof OrderStatusPie>[0]['data'][number]['status'],
    count,
  }))

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Store performance overview</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          label="Total Revenue"
          value={`$${(stats?.totalRevenue ?? 0).toFixed(0)}`}
          icon={DollarSign}
          color="bg-violet-50"
          iconColor="text-violet-600"
          trend={revenueTrend}
        />
        <StatsCard
          label="This Month"
          value={`$${(stats?.revenueThisMonth ?? 0).toFixed(0)}`}
          icon={DollarSign}
          color="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingCart}
          color="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          label="Pending"
          value={stats?.pendingOrders ?? 0}
          icon={Clock}
          color="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatsCard
          label="Products"
          value={stats?.totalProducts ?? 0}
          icon={Package}
          color="bg-pink-50"
          iconColor="text-pink-600"
        />
        <StatsCard
          label="Customers"
          value={stats?.totalCustomers ?? 0}
          icon={Users}
          color="bg-indigo-50"
          iconColor="text-indigo-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-5 pb-4 px-5">
            <h3 className="text-sm font-semibold mb-4">Revenue — Last 30 Days</h3>
            <RevenueChart data={revenueChart} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <h3 className="text-sm font-semibold mb-4">Orders by Status</h3>
            <OrderStatusPie data={pieData} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Top Products</h3>
            </div>
            <TopProductsTable products={topProducts} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Low stock alert */}
          {lowStockProducts.length > 0 && (
            <Card className="border-red-200 bg-red-50/40">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h3 className="text-sm font-semibold text-red-700">Low Stock ({lowStockProducts.length})</h3>
                  <Link to="/products?filter=low-stock" className="ml-auto text-xs text-red-600 hover:underline">View all</Link>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {lowStockProducts.slice(0, 5).map((p) => (
                    <li key={p.id} className="flex items-center justify-between text-red-800">
                      <span className="truncate max-w-[200px]">{p.name}</span>
                      <span className="tabular-nums font-semibold text-red-600 ml-2">{p.stock} left</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recent orders */}
          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Recent Orders</h3>
                <Link to="/orders" className="text-xs text-primary hover:underline">View all</Link>
              </div>
              <ul className="space-y-2 text-sm">
                {recentOrders.slice(0, 6).map((o) => (
                  <li key={o.id} className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(-8)}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted">{o.status}</span>
                    <span className="tabular-nums font-medium">${o.totalAmount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
