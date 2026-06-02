import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { OrderStatus } from '@react-monorepo/shared-graphql'

interface OrderStatusPieProps {
  data: { status: OrderStatus; count: number }[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PROCESSING: '#8b5cf6',
  SHIPPED: '#06b6d4',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
}

export function OrderStatusPie({ data }: OrderStatusPieProps) {
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No order data available</p>
  }

  const chartData = data.map((d) => ({ name: d.status, value: d.count }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [Number(v), 'Orders']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
