import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { CreateCategoryDocument, GetAdminCategoriesDocument, GetCategoriesQuery, RemoveCategoryDocument, UpdateCategoryDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { Button } from '@react-monorepo/shared-ui'
import { CategoryTree, CategoryForm, type CategoryFormData } from '@react-monorepo/catalog'

type Category = GetCategoriesQuery['categories'][number]

export function AdminCategoriesPage() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [editing, setEditing] = useState<Category | null>(null)
  const [adding, setAdding] = useState(false)

  const { data, refetch } = useQuery(GetAdminCategoriesDocument, { skip: !accessToken })
  const categories = data?.categories ?? []

  const [createCategory, { loading: creating }] = useMutation(CreateCategoryDocument, {
    onCompleted: () => { refetch(); setAdding(false) },
  })
  const [updateCategory, { loading: updating }] = useMutation(UpdateCategoryDocument, {
    onCompleted: () => { refetch(); setEditing(null) },
  })
  const [removeCategory] = useMutation(RemoveCategoryDocument, { onCompleted: () => refetch() })

  const handleCreate = async (formData: CategoryFormData) => {
    await createCategory({ variables: { name: formData.name, parentId: formData.parentId } })
  }

  const handleUpdate = async (formData: CategoryFormData) => {
    if (!editing) return
    await updateCategory({ variables: { id: editing.id, name: formData.name } })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        {!adding && !editing && (
          <Button onClick={() => setAdding(true)}>Add Category</Button>
        )}
      </div>

      {(adding || editing) && (
        <div className="border rounded-lg p-4 max-w-sm">
          <p className="text-sm font-medium mb-3">
            {editing ? `Edit "${editing.name}"` : 'New Category'}
          </p>
          <CategoryForm
            defaultValues={editing ? { name: editing.name, parentId: editing.parent?.id ?? undefined } : undefined}
            categories={categories}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setEditing(null); setAdding(false) }}
            loading={creating || updating}
          />
        </div>
      )}

      <CategoryTree
        categories={categories}
        onEdit={(cat) => { setAdding(false); setEditing(cat) }}
        onDelete={(id) => removeCategory({ variables: { id } })}
      />
    </div>
  )
}
