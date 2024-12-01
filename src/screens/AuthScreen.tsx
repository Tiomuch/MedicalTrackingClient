import React, { FC, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, Icon, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RootStackParamList } from '@navigation/AppNavigator'

type AuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>

const AuthScreen: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [eyeEnabled, setEyeEnabled] = useState(true)

  const { navigate, replace } = useNavigation<AuthScreenNavigationProp>()

  const onEyePress = () => {
    setEyeEnabled((prev) => !prev)
  }

  const onSignUpPress = () => {
    navigate('Registration')
  }

  const onSignInPress = () => {
    // TODO change navigation to main screen
    replace('Home')
  }

  const eyeIcon = useMemo(() => (eyeEnabled ? 'eye' : 'eye-off'), [eyeEnabled])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.iconContainer}>
          <Icon source="hospital-building" color="blue" size={100} />
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
          right={
            <TextInput.Icon icon={eyeIcon} color="blue" onPress={onEyePress} />
          }
        />

        <Button
          icon="account-cowboy-hat-outline"
          mode="elevated"
          onPress={onSignInPress}
        >
          Sign In
        </Button>

        <Button
          icon="account-multiple-plus-outline"
          mode="text"
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

export default AuthScreen
