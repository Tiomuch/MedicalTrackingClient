import React from 'react'

import ErrorBoundary from 'react-native-error-boundary'

import AppNavigator from '@navigation/AppNavigator'

export default function App() {
  return (
    <ErrorBoundary>
      <AppNavigator />
    </ErrorBoundary>
  )
}
