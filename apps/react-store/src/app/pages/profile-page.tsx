import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import type { TypedDocumentNode } from '@apollo/client'
import type {
  GetMyAddressesQuery,
  GetMyAddressesQueryVariables,
  AddAddressMutation,
  AddAddressMutationVariables,
  RemoveAddressMutation,
  RemoveAddressMutationVariables,
  SetDefaultAddressMutation,
  SetDefaultAddressMutationVariables,
  Address,
} from '@react-monorepo/shared-graphql'
import { Button, Card, CardContent } from '@react-monorepo/shared-ui'
import { MapPin, Plus, Trash2, Star } from 'lucide-react'

const ADDRESS_FIELDS = gql`
  fragment AddressFields on Address {
    id street city country postalCode isDefault createdAt
  }
`

const GET_MY_ADDRESSES: TypedDocumentNode<GetMyAddressesQuery, GetMyAddressesQueryVariables> = gql`
  ${ADDRESS_FIELDS}
  query GetMyAddresses {
    myAddresses { ...AddressFields }
  }
`

const ADD_ADDRESS: TypedDocumentNode<AddAddressMutation, AddAddressMutationVariables> = gql`
  ${ADDRESS_FIELDS}
  mutation AddAddress($street: String!, $city: String!, $country: String!, $postalCode: String, $isDefault: Boolean!) {
    addAddress(input: { street: $street, city: $city, country: $country, postalCode: $postalCode, isDefault: $isDefault }) {
      ...AddressFields
    }
  }
`

const REMOVE_ADDRESS: TypedDocumentNode<RemoveAddressMutation, RemoveAddressMutationVariables> = gql`
  mutation RemoveAddress($id: ID!) {
    removeAddress(id: $id)
  }
`

const SET_DEFAULT_ADDRESS: TypedDocumentNode<SetDefaultAddressMutation, SetDefaultAddressMutationVariables> = gql`
  ${ADDRESS_FIELDS}
  mutation SetDefaultAddress($id: ID!) {
    setDefaultAddress(id: $id) { ...AddressFields }
  }
`

const refetchAddresses = { refetchQueries: [{ query: GET_MY_ADDRESSES }] }

interface AddressFormValues {
  street: string
  city: string
  country: string
  postalCode: string
  isDefault: boolean
}

const emptyForm: AddressFormValues = { street: '', city: '', country: '', postalCode: '', isDefault: false }

function AddressCard({ address, onRemove, onSetDefault }: {
  address: Address
  onRemove: (id: string) => void
  onSetDefault: (id: string) => void
}) {
  return (
    <Card className={address.isDefault ? 'border-primary' : ''}>
      <CardContent className="p-4 flex items-start justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="text-sm min-w-0">
            <p className="font-medium">{address.street}</p>
            <p className="text-muted-foreground">
              {address.city}, {address.country}
              {address.postalCode ? ` ${address.postalCode}` : ''}
            </p>
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-1">
                <Star className="h-3 w-3" /> Default
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {!address.isDefault && (
            <Button variant="ghost" size="sm" onClick={() => onSetDefault(address.id)}>
              Set default
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onRemove(address.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AddressForm({ onSubmit, onCancel }: {
  onSubmit: (values: AddressFormValues) => Promise<void>
  onCancel: () => void
}) {
  const [values, setValues] = useState<AddressFormValues>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof AddressFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.street || !values.city || !values.country) {
      setError('Street, city, and country are required.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(values)
    } catch {
      setError('Failed to save address.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="street">Street *</label>
              <input id="street" value={values.street} onChange={set('street')} placeholder="123 Main St" className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground" htmlFor="city">City *</label>
              <input id="city" value={values.city} onChange={set('city')} placeholder="Ho Chi Minh City" className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground" htmlFor="country">Country *</label>
              <input id="country" value={values.country} onChange={set('country')} placeholder="Vietnam" className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground" htmlFor="postalCode">Postal code</label>
              <input id="postalCode" value={values.postalCode} onChange={set('postalCode')} placeholder="700000" className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input id="isDefault" type="checkbox" checked={values.isDefault} onChange={set('isDefault')} className="h-4 w-4" />
              <label htmlFor="isDefault" className="text-sm">Set as default address</label>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save address'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function ProfilePage() {
  const [showForm, setShowForm] = useState(false)
  const { data, loading } = useQuery(GET_MY_ADDRESSES)
  const [addAddress] = useMutation(ADD_ADDRESS, refetchAddresses)
  const [removeAddress] = useMutation(REMOVE_ADDRESS, refetchAddresses)
  const [setDefaultAddress] = useMutation(SET_DEFAULT_ADDRESS, refetchAddresses)

  const addresses = data?.myAddresses ?? []

  const handleAdd = async (values: AddressFormValues) => {
    await addAddress({
      variables: {
        street: values.street,
        city: values.city,
        country: values.country,
        postalCode: values.postalCode || null,
        isDefault: values.isDefault,
      },
    })
    setShowForm(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Profile</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your shipping addresses</p>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Addresses</h2>
        {!showForm && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add address
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {showForm && (
          <AddressForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <div className="h-20 rounded-lg bg-muted animate-pulse" />
        ) : addresses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No addresses yet. Add one to enable checkout.
          </p>
        ) : (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onRemove={(id) => removeAddress({ variables: { id } })}
              onSetDefault={(id) => setDefaultAddress({ variables: { id } })}
            />
          ))
        )}
      </div>
    </div>
  )
}
