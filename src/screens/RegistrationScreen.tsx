import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native'

import { useMutation } from '@apollo/client'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Controller, useForm } from 'react-hook-form'
import { Button, Icon, Text, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import * as yup from 'yup'

import { SEND_CODE } from '@api/mutations'
import VerifyCodeBottomSheet from '@components/VerifyCodeBottomSheet'
import { RootStackParamList } from '@navigation/AppNavigator'

type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Registration'
>

type validData = {
  email: string
  password: string
  confirmPassword: string
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
})

const RegistrationScreen: FC = () => {
  const [eyeEnabled, setEyeEnabled] = useState(true)
  const [confirmEyeEnabled, setConfirmEyeEnabled] = useState(true)

  const passwordRef = useRef<RNTextInput>(null)
  const confirmPasswordRef = useRef<RNTextInput>(null)
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const { navigate } = useNavigation<RegistrationScreenNavigationProp>()

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [sendCode, { loading }] = useMutation(SEND_CODE, {
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

  const onConfirmEyePress = () => {
    setConfirmEyeEnabled((prev) => !prev)
  }

  const onSignUpPress = async (data: validData) => {
    await sendCode({ variables: { email: data.email.trim() } })
    bottomSheetRef.current?.present()
  }

  const onContinuePress = () => {
    navigate('RoleSelection')
  }

  const onResendCodePress = async () => {
    const currentEmail = getValues('email')
    await sendCode({ variables: { email: currentEmail.trim() } })
  }

  const onEmailSubmitEditing = () => {
    passwordRef.current?.focus()
  }

  const onPasswordSubmitEditing = () => {
    confirmPasswordRef.current?.focus()
  }

  const eyeIcon = useMemo(() => (eyeEnabled ? 'eye' : 'eye-off'), [eyeEnabled])

  const confirmEyeIcon = useMemo(
    () => (confirmEyeEnabled ? 'eye' : 'eye-off'),
    [confirmEyeEnabled]
  )

  useEffect(() => {
    if (bottomSheetRef) {
      setTimeout(() => {
        bottomSheetRef.current?.present()
      }, 500)
    }
  }, [bottomSheetRef])

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <View style={styles.iconContainer}>
            <Icon source="account-plus" color="blue" size={100} />
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
                onSubmitEditing={onPasswordSubmitEditing}
              />
            )}
          />
          {errors.password && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.password.message}
            </Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={confirmPasswordRef}
                label="Confirm Password"
                autoComplete="password"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.confirmPassword}
                secureTextEntry={confirmEyeEnabled}
                right={
                  <TextInput.Icon
                    icon={confirmEyeIcon}
                    onPress={onConfirmEyePress}
                  />
                }
                onSubmitEditing={handleSubmit(onSignUpPress)}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.confirmPassword.message}
            </Text>
          )}

          <Button
            icon="account-multiple-plus-outline"
            mode="elevated"
            onPress={handleSubmit(onSignUpPress)}
            loading={loading}
            disabled={loading}
          >
            Sign Up
          </Button>
        </View>

        <Toast position="bottom" />
      </SafeAreaView>

      <VerifyCodeBottomSheet
        bottomSheetRef={bottomSheetRef}
        onContinuePress={onContinuePress}
        onResendCodePress={onResendCodePress}
      />
    </>
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

export default RegistrationScreen
