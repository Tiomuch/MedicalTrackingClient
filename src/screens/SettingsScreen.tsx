import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { Button, Icon } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const SettingsScreen: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.iconContainer}>
          <Icon source="account-edit-outline" color="blue" size={100} />
        </View>

        <Button
          icon="account-cowboy-hat-outline"
          mode="elevated"
          style={styles.editButton}
          onPress={() => {}}
        >
          Change Email
        </Button>

        <Button
          icon="account-multiple-plus-outline"
          mode="elevated"
          style={styles.editButton}
          onPress={() => {}}
        >
          Change Password
        </Button>

        <Button
          icon="account-multiple-plus-outline"
          mode="elevated"
          style={styles.logoutButton}
          onPress={() => {}}
        >
          Log out
        </Button>
      </View>
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
    justifyContent: 'center',
    gap: 16
  },
  iconContainer: {
    alignItems: 'center',
    width: '100%'
  },
  editButton: {
    backgroundColor: 'green'
  },
  logoutButton: {
    backgroundColor: 'red'
  }
})

export default SettingsScreen
