import React, { FC } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Icon, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RootStackParamList } from '@navigation/AppNavigator'

type RoleSelectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoleSelection'
>

const RoleSelectionScreen: FC = () => {
  const { replace } = useNavigation<RoleSelectionScreenNavigationProp>()

  const onContinuePress = () => {
    replace('Home')
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <View style={styles.box}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onContinuePress}
        >
          <Icon source="account-injury-outline" size={80} />

          <Text style={styles.buttonText}>Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onContinuePress}
        >
          <Icon source="doctor" size={80} />

          <Text style={styles.buttonText}>Doctor</Text>
        </TouchableOpacity>
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
