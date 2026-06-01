import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type { GetCategoriesQuery, GetCategoriesQueryVariables } from '@react-monorepo/shared-graphql'
import { Button, Input } from '@react-monorepo/shared-ui'
import { useS3Upload } from './use-s3-upload'

const GET_CATEGORIES: TypedDocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables> = gql`
  query GetCategoriesForForm {
    categories { id name }
  }
`

const productSchema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  price: z.number().positive('Must be positive'),
  categoryId: z.string().min(1, 'Required'),
})

export type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  /** Pass `imageUrls` (from existing product) to show current image in edit mode. */
  defaultValues?: Partial<ProductFormData & { imageKey?: string; imageUrls?: string[] }>
  onSubmit: (data: ProductFormData & { imageKeys: string[] }) => Promise<void>
  loading?: boolean
}

export function ProductForm({ defaultValues, onSubmit, loading }: ProductFormProps) {
  const { uploadFile, uploading } = useS3Upload()

  // imageKey stores the S3 object key returned after upload
  const [imageKey, setImageKey] = useState<string | undefined>(defaultValues?.imageKey)
  // preview uses a local object URL for newly picked files, or the first existing imageUrl
  const [preview, setPreview] = useState<string | undefined>(
    defaultValues?.imageUrls?.[0]
  )
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: catData } = useQuery(GET_CATEGORIES)
  const categories = catData?.categories ?? []

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Local preview only — doesn't leak the signed upload URL to the UI
    setPreview(URL.createObjectURL(file))
    const key = await uploadFile(file)
    setImageKey(key)
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit({ ...data, imageKeys: imageKey ? [imageKey] : [] })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-lg">
      <div>
        <p className="text-sm font-medium mb-2">Product Image</p>
        <div className="flex items-center gap-4">
          {preview && (
            <img src={preview} alt="Preview" className="h-20 w-20 rounded object-cover border" />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? 'Uploading…' : preview ? 'Change Image' : 'Upload Image'}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div>
        <Input {...register('name')} placeholder="Product name" />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <textarea
          {...register('description')}
          placeholder="Description"
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('price', { valueAsNumber: true })}
          type="number"
          step="0.01"
          placeholder="Price"
        />
        {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
      </div>

      <div>
        <select
          {...register('categoryId')}
          className="w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select category…</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-sm text-destructive mt-1">{errors.categoryId.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading || uploading}>
        {loading ? 'Saving…' : 'Save Product'}
      </Button>
    </form>
  )
}
