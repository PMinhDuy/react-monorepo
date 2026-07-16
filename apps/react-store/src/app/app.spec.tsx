import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from '@react-monorepo/shared-graphql'
import App from './app'

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ApolloProvider client={apolloClient}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </ApolloProvider>,
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render the Store header', () => {
    const { getAllByText } = render(
      <ApolloProvider client={apolloClient}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </ApolloProvider>,
    )
    expect(getAllByText(/Store/i).length).toBeGreaterThan(0)
  })
})
