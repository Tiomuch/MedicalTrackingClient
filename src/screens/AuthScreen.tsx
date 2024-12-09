import React, { FC, useMemo, useRef, useState } from 'react'
import {
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  View
} from 'react-native'

import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Controller, useForm } from 'react-hook-form'
import { Button, Icon, Text, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import * as yup from 'yup'

import { LOGIN } from '@api/mutations'
import { RootStackParamList } from '@navigation/AppNavigator'
import { storage, StorageKeys, storageLogout } from '@store/index'

type AuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Auth'
>

type validData = {
  email: string
  password: string
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
})

const AuthScreen: FC = () => {
  const [eyeEnabled, setEyeEnabled] = useState(true)

  const passwordRef = useRef<RNTextInput>(null)

  const { navigate, replace } = useNavigation<AuthScreenNavigationProp>()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [login, { loading }] = useMutation(LOGIN, {
    onError(error) {
      console.log('Error', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong'
      })
    }
  })

  const onEyePress = () => {
    setEyeEnabled((prev) => !prev)
  }

  const onSignUpPress = () => {
    navigate('Registration')
  }

  const onSignInPress = async (data: validData) => {
    storageLogout()

    const response = await login({
      variables: { email: data.email.trim(), password: data.password }
    })
    console.log('response', response)

    if (response.errors) return

    storage.set('_id', response.data?.login?._id)
    storage.set('email', response.data?.login?.email)
    storage.set(StorageKeys.ACCESS_TOKEN, response.data?.login?.accessToken)
    storage.set(StorageKeys.REFRESH_TOKEN, response.data?.login?.refreshToken)

    Keyboard.dismiss()
    if (response.data?.login?.role) {
      replace('Home')
    } else {
      navigate('RoleSelection')
    }
  }

  const onEmailSubmitEditing = () => {
    passwordRef.current?.focus()
  }

  const eyeIcon = useMemo(() => (eyeEnabled ? 'eye' : 'eye-off'), [eyeEnabled])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.iconContainer}>
          <Icon source="hospital-building" color="blue" size={100} />
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Email"
              autoComplete="email"
              inputMode="email"
              keyboardType="email-address"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              error={!!errors.email}
              onSubmitEditing={onEmailSubmitEditing}
            />
          )}
        />
        {errors.email && (
          <Text variant="bodySmall" style={styles.errorText}>
            {errors.email.message}
          </Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              ref={passwordRef}
              label="Password"
              autoComplete="password"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              error={!!errors.password}
              secureTextEntry={eyeEnabled}
              right={<TextInput.Icon icon={eyeIcon} onPress={onEyePress} />}
              onSubmitEditing={handleSubmit(onSignInPress)}
            />
          )}
        />
        {errors.password && (
          <Text variant="bodySmall" style={styles.errorText}>
            {errors.password.message}
          </Text>
        )}

        <Button
          icon="account-cowboy-hat-outline"
          mode="elevated"
          onPress={handleSubmit(onSignInPress)}
          loading={loading}
          disabled={loading}
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
  iconContainer: {
    alignItems: 'center',
    width: '100%'
  },
  errorText: {
    color: 'red'
  }
})

export default AuthScreen
