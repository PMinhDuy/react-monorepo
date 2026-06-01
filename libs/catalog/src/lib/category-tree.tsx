import { Button } from '@react-monorepo/shared-ui'
import type { GetCategoriesQuery } from '@react-monorepo/shared-graphql'

type Category = GetCategoriesQuery['categories'][number]

interface CategoryTreeProps {
  categories: Category[]
  parentId?: string | null
  depth?: number
  onEdit: (cat: Category) => void
  onDelete: (id: string) => void
}

// Guard against runaway recursion from malformed parent cycles
const MAX_DEPTH = 8

export function CategoryTree({
  categories,
  parentId = null,
  depth = 0,
  onEdit,
  onDelete,
}: CategoryTreeProps) {
  if (depth > MAX_DEPTH) return null

  const children = categories.filter(
    (c) => (c.parent?.id ?? null) === (parentId ?? null),
  )
  if (!children.length) return null

  return (
    <ul className={depth > 0 ? 'ml-6 border-l pl-4 mt-1 space-y-1' : 'space-y-1'}>
      {children.map((cat) => (
        <li key={cat.id}>
          <div className="flex items-center gap-2 py-1 group">
            <span className="text-sm font-medium flex-1">{cat.name}</span>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 h-7"
              onClick={() => onEdit(cat)}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 h-7 text-destructive hover:text-destructive"
              onClick={() => {
                if (confirm(`Delete "${cat.name}"?`)) onDelete(cat.id)
              }}
            >
              Delete
            </Button>
          </div>
          <CategoryTree
            categories={categories}
            parentId={cat.id}
            depth={depth + 1}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}
