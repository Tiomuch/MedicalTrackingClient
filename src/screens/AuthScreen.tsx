import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const AuthScreen: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is an empty screen. AUTH</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 18,
    color: '#333'
  }
})

export default AuthScreen
