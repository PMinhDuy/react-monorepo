interface SortOption {
  label: string
  sortBy: string
  sortOrder: string
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest', sortBy: 'createdAt', sortOrder: 'DESC' },
  { label: 'Price: Low → High', sortBy: 'price', sortOrder: 'ASC' },
  { label: 'Price: High → Low', sortBy: 'price', sortOrder: 'DESC' },
  { label: 'Name A–Z', sortBy: 'name', sortOrder: 'ASC' },
]

interface SortSelectProps {
  sortBy: string
  sortOrder: string
  onChange: (sortBy: string, sortOrder: string) => void
}

export function SortSelect({ sortBy, sortOrder, onChange }: SortSelectProps) {
  const current = SORT_OPTIONS.find((o) => o.sortBy === sortBy && o.sortOrder === sortOrder)
  const value = current ? `${current.sortBy}|${current.sortOrder}` : `${SORT_OPTIONS[0].sortBy}|${SORT_OPTIONS[0].sortOrder}`

  return (
    <select
      value={value}
      onChange={(e) => {
        const [by, order] = e.target.value.split('|')
        onChange(by, order)
      }}
      className="text-sm rounded-md border px-3 py-2 bg-background outline-none focus:ring-2 focus:ring-primary/50"
      aria-label="Sort products"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={`${opt.sortBy}|${opt.sortOrder}`} value={`${opt.sortBy}|${opt.sortOrder}`}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
