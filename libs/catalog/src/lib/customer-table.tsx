import { Link } from 'react-router-dom'
import type { CustomerProfile } from '@react-monorepo/shared-graphql'
import { Button, Badge } from '@react-monorepo/shared-ui'
import { Users } from 'lucide-react'

interface CustomerTableProps {
  customers: CustomerProfile[]
}

export function CustomerTable({ customers }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-sm">No customers found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground bg-muted/30">
            <th className="py-3 pl-4 pr-4 font-medium">Name</th>
            <th className="py-3 pr-4 font-medium">Email</th>
            <th className="py-3 pr-4 font-medium">Status</th>
            <th className="py-3 pr-4 font-medium text-right">Orders</th>
            <th className="py-3 pr-4 font-medium text-right">Total Spent</th>
            <th className="py-3 pr-4 font-medium">Joined</th>
            <th className="py-3 pr-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(({ user, totalOrders, totalSpent }) => (
            <tr key={user.id} className="border-b hover:bg-muted/20 transition-colors">
              <td className="py-3 pl-4 pr-4 font-medium">{user.name}</td>
              <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
              <td className="py-3 pr-4">
                <Badge variant={user.isActive ? 'default' : 'destructive'} className="font-normal text-xs">
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-right tabular-nums">{totalOrders}</td>
              <td className="py-3 pr-4 text-right tabular-nums font-medium">${totalSpent.toFixed(2)}</td>
              <td className="py-3 pr-4 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
              </td>
              <td className="py-3 pr-4">
                <div className="flex justify-end">
                  <Link to={`/customers/${user.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
