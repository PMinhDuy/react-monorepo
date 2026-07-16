import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from '@react-monorepo/shared-graphql'
import App from './app'

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ApolloProvider client={apolloClient}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </ApolloProvider>,
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render the Inventory title', () => {
    const { getAllByText } = render(
      <ApolloProvider client={apolloClient}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </ApolloProvider>,
    )
    expect(getAllByText(/Inventory/i).length).toBeGreaterThan(0)
  })
})
