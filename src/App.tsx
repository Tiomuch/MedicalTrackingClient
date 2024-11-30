import React from 'react'

import ErrorBoundary from 'react-native-error-boundary'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppNavigator from '@navigation/AppNavigator'

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  )
}
