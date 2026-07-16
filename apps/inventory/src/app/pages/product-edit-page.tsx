import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { CreateProductDocument, GetProductForEditDocument, UpdateProductDocument } from '@react-monorepo/shared-graphql'
import { useAuthStore } from '@react-monorepo/shared-auth'
import { ProductForm, type ProductFormData } from '@react-monorepo/catalog'

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const accessToken = useAuthStore((s) => s.accessToken)
  const isEdit = !!id

  const { data } = useQuery(GetProductForEditDocument, {
    variables: { id: id! },
    skip: !isEdit || !accessToken,
  })

  const [createProduct, { loading: creating }] = useMutation(CreateProductDocument)
  const [updateProduct, { loading: updating }] = useMutation(UpdateProductDocument)

  const handleSubmit = async (formData: ProductFormData & { imageKeys: string[] }) => {
    if (isEdit) {
      await updateProduct({
        variables: {
          id: id!,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          categoryId: formData.categoryId,
          imageKeys: formData.imageKeys,
        },
      })
    } else {
      await createProduct({
        variables: {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: 0,
          categoryId: formData.categoryId,
          imageKeys: formData.imageKeys,
        },
      })
    }
    navigate('/products')
  }

  const defaultValues = data?.product
    ? {
        name: data.product.name,
        description: data.product.description ?? '',
        price: data.product.price,
        categoryId: data.product.category?.id ?? '',
        imageUrls: data.product.imageUrls,
      }
    : undefined

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit Product' : 'New Product'}</h1>
      <ProductForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={creating || updating}
      />
    </div>
  )
}
