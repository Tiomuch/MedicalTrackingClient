import React, { FC } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useMutation } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Icon, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { UPDATE_USER } from '@api/mutations'
import { RootStackParamList } from '@navigation/AppNavigator'
import { storage } from '@store/index'

type RoleSelectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoleSelection'
>

const RoleSelectionScreen: FC = () => {
  const { replace } = useNavigation<RoleSelectionScreenNavigationProp>()

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    context: {
      headers: {
        Authorization: `Bearer ${storage.getString('accessToken')}`
      }
    },
    onError(error) {
      console.log('Error', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong'
      })
    }
  })

  const onContinuePress = async (role: 'User' | 'Doctor') => {
    const _id = storage.getString('_id')
    const response = await updateUser({ variables: { _id, input: { role } } })

    if (response.errors) return

    replace('Home')
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <View style={styles.box}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => onContinuePress('User')}
          disabled={loading}
        >
          <Icon source="account-injury-outline" size={80} />

          <Text style={styles.buttonText}>Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => onContinuePress('Doctor')}
          disabled={loading}
        >
          <Icon source="doctor" size={80} />

          <Text style={styles.buttonText}>Doctor</Text>
        </TouchableOpacity>
      </View>

      <Toast position="bottom" />
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
  buttonContainer: {
    flex: 0.4,
    backgroundColor: '#ADD8E6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 40
  }
})

export default RoleSelectionScreen
