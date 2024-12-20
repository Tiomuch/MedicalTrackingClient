import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, Icon } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RootStackParamList } from '@navigation/AppNavigator'
import { storageLogout } from '@store/index'

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>

const SettingsScreen: FC = () => {
  const { replace, navigate } = useNavigation<SettingsScreenNavigationProp>()

  const onLogoutPress = () => {
    storageLogout()

    replace('Auth')
  }

  const onChangeEmailPress = () => {
    navigate('ChangeEmail')
  }

  const onChangePasswordPress = () => {
    navigate('ChangePassword')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.iconContainer}>
          <Icon source="account-edit-outline" color="blue" size={100} />
        </View>

        <Button
          icon="email-edit-outline"
          mode="elevated"
          style={styles.editButton}
          onPress={onChangeEmailPress}
        >
          Change Email
        </Button>

        <Button
          icon="shield-edit-outline"
          mode="elevated"
          style={styles.editButton}
          onPress={onChangePasswordPress}
        >
          Change Password
        </Button>

        <Button
          icon="logout"
          mode="elevated"
          style={styles.logoutButton}
          onPress={onLogoutPress}
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
    backgroundColor: '#90EE90'
  },
  logoutButton: {
    backgroundColor: '#FF7F7F'
  }
})

export default SettingsScreen
