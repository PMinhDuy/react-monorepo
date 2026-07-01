import { useQuery } from '@apollo/client/react'
import { GetCategoriesDocument } from '@react-monorepo/shared-graphql'
import { cn } from '@react-monorepo/shared-ui'

interface CategoryFilterProps {
  selected?: string
  onChange: (categoryId?: string) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { data } = useQuery(GetCategoriesDocument)
  const categories = data?.categories ?? []

  const pillClass = (active: boolean) =>
    cn(
      'px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer select-none',
      active
        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
        : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
    )

  return (
    <div className="flex flex-wrap gap-2">
      <button className={pillClass(!selected)} onClick={() => onChange(undefined)}>
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={pillClass(selected === cat.id)}
          onClick={() => onChange(selected === cat.id ? undefined : cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
