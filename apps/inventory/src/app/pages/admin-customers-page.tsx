import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { GetCustomersDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { Input } from '@react-monorepo/shared-ui'
import { CustomerTable } from '@react-monorepo/catalog'
import { Search, X } from 'lucide-react'

export function AdminCustomersPage() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [search, setSearch] = useState('')
  const [draftSearch, setDraftSearch] = useState('')

  const { data, loading } = useQuery(GetCustomersDocument, {
    variables: { search: search || undefined, limit: 50, offset: 0 },
    skip: !accessToken,
  })

  const customers = data?.customers ?? []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(draftSearch)
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {loading ? 'Loading…' : `${customers.length} customer${customers.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-9 pr-8"
          />
          {draftSearch && (
            <button
              type="button"
              onClick={() => { setDraftSearch(''); setSearch('') }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />)}
        </div>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </div>
  )
}
