import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@react-monorepo/shared-ui'
import type { GetCategoriesQuery } from '@react-monorepo/shared-graphql'

const categorySchema = z.object({
  name: z.string().min(1, 'Required'),
  parentId: z.string().optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>

type Category = GetCategoriesQuery['categories'][number]

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormData>
  categories: Category[]
  onSubmit: (data: CategoryFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function CategoryForm({
  defaultValues,
  categories,
  onSubmit,
  onCancel,
  loading,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <Input {...register('name')} placeholder="Category name" />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <select
          {...register('parentId')}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">No parent (top-level)</option>
          {categories
            .filter((c) => c.id !== defaultValues?.parentId)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
