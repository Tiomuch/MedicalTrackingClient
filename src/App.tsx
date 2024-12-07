import React from 'react'

import { ApolloProvider } from '@apollo/client'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import ErrorBoundary from 'react-native-error-boundary'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { apolloClient } from '@api/client'
import AppNavigator from '@navigation/AppNavigator'

export default function App() {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <SafeAreaProvider>
          <GestureHandlerRootView>
            <BottomSheetModalProvider>
              <PaperProvider>
                <AppNavigator />
              </PaperProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}
