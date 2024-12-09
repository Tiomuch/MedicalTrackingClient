import React, { FC, useRef } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'

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

import { CHANGE_EMAIL, SEND_CODE } from '@api/mutations'
import VerifyCodeBottomSheet from '@components/VerifyCodeBottomSheet'
import { RootStackParamList } from '@navigation/AppNavigator'
import { storage } from '@store/index'

type ChangeEmailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChangeEmail'
>

type validData = {
  email: string
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
})

const ChangeEmailScreen: FC = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const { goBack } = useNavigation<ChangeEmailScreenNavigationProp>()

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm({
    resolver: yupResolver(schema)
  })

  const [sendCode, { loading: sendCodeLoading }] = useMutation(SEND_CODE, {
    onError(error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Something went wrong'
      })
    }
  })

  const [changeEmail, { loading: changeEmailLoading }] = useMutation(
    CHANGE_EMAIL,
    {
      onError(error) {
        console.log('Error', error)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong'
        })
      }
    }
  )

  const onChangeEmailPress = async (data: validData) => {
    const response = await sendCode({ variables: { email: data.email.trim() } })

    if (response.errors) return

    Keyboard.dismiss()
    bottomSheetRef.current?.present()
  }

  const onContinuePress = async (code: string) => {
    const currentEmail = getValues('email')
    const prevEmail = storage.getString('email')

    const response = await changeEmail({
      variables: {
        newEmail: currentEmail.trim(),
        code,
        currentEmail: prevEmail
      }
    })

    console.log('response', response)

    if (response.errors) return

    storage.set('email', currentEmail)

    Keyboard.dismiss()
    bottomSheetRef.current?.close()
    goBack()
  }

  const onResendCodePress = async () => {
    const currentEmail = getValues('email')
    await sendCode({ variables: { email: currentEmail.trim() } })
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <View style={styles.iconContainer}>
            <Icon source="email-edit-outline" color="blue" size={100} />
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
                onSubmitEditing={handleSubmit(onChangeEmailPress)}
              />
            )}
          />
          {errors.email && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.email.message}
            </Text>
          )}

          <Button
            icon="email-edit-outline"
            mode="elevated"
            onPress={handleSubmit(onChangeEmailPress)}
            loading={sendCodeLoading}
            disabled={sendCodeLoading}
          >
            Change Email
          </Button>
        </View>

        <Toast position="bottom" />
      </SafeAreaView>

      <VerifyCodeBottomSheet
        bottomSheetRef={bottomSheetRef}
        onContinuePress={onContinuePress}
        onResendCodePress={onResendCodePress}
        loading={changeEmailLoading}
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

export default ChangeEmailScreen
