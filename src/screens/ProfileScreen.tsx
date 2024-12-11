import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

const ProfileScreen: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}></View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  box: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16
  }
})

export default ProfileScreen
