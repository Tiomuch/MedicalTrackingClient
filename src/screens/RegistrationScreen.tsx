import React, { FC, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, Icon, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RootStackParamList } from '@navigation/AppNavigator'

type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Registration'
>

const RegistrationScreen: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [eyeEnabled, setEyeEnabled] = useState(true)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmEyeEnabled, setConfirmEyeEnabled] = useState(true)

  const { navigate } = useNavigation<RegistrationScreenNavigationProp>()

  const onEyePress = () => {
    setEyeEnabled((prev) => !prev)
  }

  const onConfirmEyePress = () => {
    setConfirmEyeEnabled((prev) => !prev)
  }

  const onSignUpPress = () => {
    navigate('RoleSelection')
  }

  const eyeIcon = useMemo(() => (eyeEnabled ? 'eye' : 'eye-off'), [eyeEnabled])

  const confirmEyeIcon = useMemo(
    () => (confirmEyeEnabled ? 'eye' : 'eye-off'),
    [confirmEyeEnabled]
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.iconContainer}>
          <Icon source="account-plus" color="blue" size={100} />
        </View>

        <TextInput
          label="Email"
          autoComplete="email"
          inputMode="email"
          keyboardType="email-address"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          label="Password"
          autoComplete="password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={eyeEnabled}
          right={<TextInput.Icon icon={eyeIcon} onPress={onEyePress} />}
        />

        <TextInput
          label="Confirm Password"
          autoComplete="password"
          mode="outlined"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={confirmEyeEnabled}
          right={
            <TextInput.Icon icon={confirmEyeIcon} onPress={onConfirmEyePress} />
          }
        />

        <Button
          icon="account-multiple-plus-outline"
          mode="elevated"
          onPress={onSignUpPress}
        >
          Sign Up
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
  }
})

export default RegistrationScreen
