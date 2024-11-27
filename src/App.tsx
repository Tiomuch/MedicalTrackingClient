import React from 'react'

import ErrorBoundary from 'react-native-error-boundary'
import { PaperProvider } from 'react-native-paper'

import AppNavigator from '@navigation/AppNavigator'

export default function App() {
  return (
    <ErrorBoundary>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </ErrorBoundary>
  )
}
