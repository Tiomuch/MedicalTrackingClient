import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  Observable
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename'
import { createUploadLink } from 'apollo-upload-client'

import { clearTokens, saveToken, storage, StorageKeys } from '@store/index'

export const LOCAL_URL = 'http://localhost:3001/graphql/'
export const URL = 'http://192.168.0.111:3001/graphql/'

const removeTypenameLink = removeTypenameFromVariables()

const httpLink = createUploadLink({
  uri: URL
})

const authLink = setContext(async (_, { headers }) => {
  const token = await storage.getString(StorageKeys.ACCESS_TOKEN)

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
        console.log('err', err)
        if (
          err.extensions?.code === 'UNAUTHENTICATED' ||
          err.extensions?.code === 'INTERNAL_SERVER_ERROR'
        ) {
          const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN)
          console.log('refreshToken', refreshToken)

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
  link: ApolloLink.from([authLink, errorLink, removeTypenameLink, httpLink]),
  cache: new InMemoryCache()
})
