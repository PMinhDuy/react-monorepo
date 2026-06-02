import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@react-monorepo/shared-ui'
import { cn } from '@react-monorepo/shared-ui'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  iconColor: string
  trend?: number
  trendLabel?: string
}

export function StatsCard({ label, value, icon: Icon, color, iconColor, trend, trendLabel }: StatsCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground truncate">{label}</p>
            <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
            {trend !== undefined && (
              <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-medium', isPositive ? 'text-emerald-600' : 'text-red-500')}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(trend).toFixed(1)}% {trendLabel ?? 'vs last month'}</span>
              </div>
            )}
          </div>
          <div className={`p-2.5 rounded-lg shrink-0 ${color}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
