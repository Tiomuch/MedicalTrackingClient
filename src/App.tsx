import React from 'react'

import { ApolloProvider } from '@apollo/client'
import ErrorBoundary from 'react-native-error-boundary'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { apolloClient } from '@api/client'
import AppNavigator from '@navigation/AppNavigator'

export default function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <SafeAreaProvider>
          <PaperProvider>
            <AppNavigator />
          </PaperProvider>
        </SafeAreaProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}
