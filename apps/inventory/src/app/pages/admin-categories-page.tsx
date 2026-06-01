import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  GetCategoriesQuery,
  GetCategoriesQueryVariables,
  CreateCategoryMutation,
  CreateCategoryMutationVariables,
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables,
  RemoveCategoryMutation,
  RemoveCategoryMutationVariables,
} from '@react-monorepo/shared-graphql'
import { Button } from '@react-monorepo/shared-ui'
import { CategoryTree, CategoryForm, type CategoryFormData } from '@react-monorepo/catalog'

const GET_CATEGORIES: TypedDocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables> = gql`
  query GetAdminCategories {
    categories { id name parent { id } }
  }
`

// NestJS Lambda — inline input objects with scalar vars (no named input types)
const CREATE_CATEGORY: TypedDocumentNode<
  CreateCategoryMutation,
  CreateCategoryMutationVariables
> = gql`
  mutation CreateCategory($name: String!, $description: String, $parentId: ID) {
    createCategory(input: { name: $name, description: $description, parentId: $parentId }) {
      id name parent { id }
    }
  }
`

const UPDATE_CATEGORY: TypedDocumentNode<
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables
> = gql`
  mutation UpdateCategory($id: ID!, $name: String, $description: String, $isActive: Boolean) {
    updateCategory(id: $id, input: { name: $name, description: $description, isActive: $isActive }) {
      id name parent { id }
    }
  }
`

const REMOVE_CATEGORY: TypedDocumentNode<
  RemoveCategoryMutation,
  RemoveCategoryMutationVariables
> = gql`
  mutation RemoveCategory($id: ID!) {
    removeCategory(id: $id)
  }
`

type Category = GetCategoriesQuery['categories'][number]

export function AdminCategoriesPage() {
  const [editing, setEditing] = useState<Category | null>(null)
  const [adding, setAdding] = useState(false)

  const { data, refetch } = useQuery(GET_CATEGORIES)
  const categories = data?.categories ?? []

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => { refetch(); setAdding(false) },
  })
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => { refetch(); setEditing(null) },
  })
  const [removeCategory] = useMutation(REMOVE_CATEGORY, { onCompleted: () => refetch() })

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
