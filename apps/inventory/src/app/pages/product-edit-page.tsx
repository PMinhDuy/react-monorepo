import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  GetProductQuery,
  GetProductQueryVariables,
  CreateProductMutation,
  CreateProductMutationVariables,
  UpdateProductMutation,
  UpdateProductMutationVariables,
} from '@react-monorepo/shared-graphql'
import { ProductForm, type ProductFormData } from '@react-monorepo/catalog'

const GET_PRODUCT: TypedDocumentNode<GetProductQuery, GetProductQueryVariables> = gql`
  query GetProductForEdit($id: ID!) {
    product(id: $id) { id name description price stock imageUrls category { id name } }
  }
`

// NestJS Lambda — inline input objects with scalar vars (no named input types)
const CREATE_PRODUCT: TypedDocumentNode<
  CreateProductMutation,
  CreateProductMutationVariables
> = gql`
  mutation CreateProduct(
    $name: String!
    $description: String
    $price: Float!
    $stock: Int!
    $categoryId: ID!
    $imageKeys: [String!]!
  ) {
    createProduct(input: {
      name: $name
      description: $description
      price: $price
      stock: $stock
      categoryId: $categoryId
      imageKeys: $imageKeys
    }) { id name }
  }
`

const UPDATE_PRODUCT: TypedDocumentNode<
  UpdateProductMutation,
  UpdateProductMutationVariables
> = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $description: String
    $price: Float
    $stock: Int
    $categoryId: ID
    $imageKeys: [String]
    $isActive: Boolean
  ) {
    updateProduct(id: $id, input: {
      name: $name
      description: $description
      price: $price
      stock: $stock
      categoryId: $categoryId
      imageKeys: $imageKeys
      isActive: $isActive
    }) { id name }
  }
`

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const { data } = useQuery(GET_PRODUCT, {
    variables: { id: id! },
    skip: !isEdit,
  })

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT)
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT)

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
