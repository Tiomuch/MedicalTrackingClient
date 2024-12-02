import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

import { clearTokens, getAccessToken, getRefreshToken, saveToken } from 'store'

const URL = 'http://localhost:3000/graphql'

const httpLink = new HttpLink({
  uri: URL
})

const authLink = setContext(async (_, { headers }) => {
  const token = getAccessToken()
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions?.code === 'UNAUTHENTICATED') {
          const refreshToken = getRefreshToken()

          if (refreshToken) {
            // Return an Observable to retry the operation
            return new Observable((observer) => {
              fetch(`${URL}/refresh-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.accessToken && data.refreshToken) {
                    saveToken(data.accessToken, data.refreshToken)

                    const oldHeaders = operation.getContext().headers
                    operation.setContext({
                      headers: {
                        ...oldHeaders,
                        Authorization: `Bearer ${data.accessToken}`
                      }
                    })

                    // Retry the operation
                    return forward(operation).subscribe({
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer)
                    })
                  } else {
                    clearTokens()
                    observer.error(new Error('Failed to refresh token'))
                  }
                })
                .catch((error) => {
                  clearTokens()
                  observer.error(error)
                })
            })
          } else {
            clearTokens()
          }
        }
      }
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`)
    }
  }
)

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache()
})
