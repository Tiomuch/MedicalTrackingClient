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

import { CHANGE_PASSWORD } from '@api/mutations'
import { RootStackParamList } from '@navigation/AppNavigator'
import { storage } from '@store/index'

type ChangeEmailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChangePassword'
>

type validData = {
  password: string
  newPassword: string
}

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New Password is required')
})

const ChangePasswordScreen: FC = () => {
  const [eyeEnabled, setEyeEnabled] = useState(true)
  const [newPasswordEyeEnabled, setNewPasswordEyeEnabled] = useState(true)

  const { goBack } = useNavigation<ChangeEmailScreenNavigationProp>()

  const newPasswordRef = useRef<RNTextInput>(null)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onError(error) {
      console.log('Error', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong'
      })
    }
  })

  const onChangePasswordPress = async (data: validData) => {
    const currentEmail = storage.getString('email')
    const response = await changePassword({
      variables: {
        email: currentEmail,
        currentPassword: data.password,
        newPassword: data.newPassword
      }
    })

    if (response.errors) return

    Keyboard.dismiss()
    goBack()
  }

  const onEyePress = () => {
    setEyeEnabled((prev) => !prev)
  }

  const onNewPasswordEyePress = () => {
    setNewPasswordEyeEnabled((prev) => !prev)
  }

  const onPasswordSubmitEditing = () => {
    newPasswordRef.current?.focus()
  }

  const eyeIcon = useMemo(() => (eyeEnabled ? 'eye' : 'eye-off'), [eyeEnabled])

  const newPasswordEyeIcon = useMemo(
    () => (newPasswordEyeEnabled ? 'eye' : 'eye-off'),
    [newPasswordEyeEnabled]
  )

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <View style={styles.iconContainer}>
            <Icon source="shield-edit-outline" color="blue" size={100} />
          </View>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
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
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                ref={newPasswordRef}
                label="New Password"
                autoComplete="password"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.newPassword}
                secureTextEntry={newPasswordEyeEnabled}
                right={
                  <TextInput.Icon
                    icon={newPasswordEyeIcon}
                    onPress={onNewPasswordEyePress}
                  />
                }
                onSubmitEditing={handleSubmit(onChangePasswordPress)}
              />
            )}
          />
          {errors.newPassword && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.newPassword.message}
            </Text>
          )}

          <Button
            icon="shield-edit-outline"
            mode="elevated"
            onPress={handleSubmit(onChangePasswordPress)}
            loading={loading}
            disabled={loading}
          >
            Change Password
          </Button>
        </View>

        <Toast position="bottom" />
      </SafeAreaView>
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

export default ChangePasswordScreen
