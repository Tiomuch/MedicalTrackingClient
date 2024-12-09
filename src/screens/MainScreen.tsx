import React, { FC, useEffect, useMemo, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import { useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import {
  ActivityIndicator,
  Button,
  Icon,
  Text,
  TextInput
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import * as yup from 'yup'

import { UPDATE_USER } from '@api/mutations'
import { GET_USER } from '@api/queries'
import { storage } from '@store/index'

type validData = {
  firstName: string
  lastName: string
  middleName: string
  phone: string
}

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  middleName: yup.string().required('Middle name is required'),
  phone: yup.string().required('Phone number is required')
})

const MainScreen: FC = () => {
  const [editEnabled, setEditEnabled] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    loading: getUserLoading,
    data,
    refetch
  } = useQuery(GET_USER, {
    context: {
      headers: {
        Authorization: `Bearer ${storage.getString('accessToken')}`
      }
    },
    variables: { id: storage.getString('_id') }
  })

  const [updateUser, { loading: updateUserLoading }] = useMutation(
    UPDATE_USER,
    {
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
    }
  )

  console.log('data', data)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  })

  const handleEditPress = () => {
    setEditEnabled((prev) => !prev)
  }

  const handleSavePress = async (data: validData) => {
    await updateUser({
      variables: { _id: storage.getString('_id'), input: { ...data } }
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch({ id: storage.getString('_id') })
    setIsRefreshing(false)
  }

  useEffect(() => {
    console.log('First')
    if (data?.getUser && !isRefreshing) {
      console.log('Second')
      const {
        firstName,
        lastName,
        middleName,
        phone,
        role
        // eslint-disable-next-line no-unsafe-optional-chaining
      } = data?.getUser

      setValue('firstName', firstName ?? '')
      setValue('lastName', lastName ?? '')
      setValue('middleName', middleName ?? '')
      setValue('phone', phone ?? '')

      storage.set('firstName', firstName ?? '')
      storage.set('lastName', lastName ?? '')
      storage.set('middleName', middleName ?? '')
      storage.set('phone', phone ?? '')
      storage.set('role', role)
    }
  }, [data?.getUser, isRefreshing])

  const inputDisabled = useMemo(
    () => !editEnabled || getUserLoading || updateUserLoading,
    [editEnabled, getUserLoading]
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerPartContainer}>
          <Text variant="headlineMedium">Profile</Text>

          {getUserLoading && <ActivityIndicator />}
        </View>

        <View style={styles.headerPartContainer}>
          {editEnabled && (
            <Button
              icon="content-save-outline"
              mode="contained-tonal"
              onPress={handleSubmit(handleSavePress)}
              loading={updateUserLoading}
              disabled={updateUserLoading}
            >
              Save
            </Button>
          )}

          <TouchableOpacity onPress={handleEditPress}>
            <Icon
              source={editEnabled ? 'pencil-off-outline' : 'pencil-outline'}
              color="blue"
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.box}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="First Name"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.firstName}
                disabled={inputDisabled}
              />
            )}
          />
          {errors.firstName && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.firstName.message}
            </Text>
          )}

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Last Name"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.lastName}
                disabled={inputDisabled}
              />
            )}
          />
          {errors.lastName && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.lastName.message}
            </Text>
          )}

          <Controller
            control={control}
            name="middleName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Middle Name"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.middleName}
                disabled={inputDisabled}
              />
            )}
          />
          {errors.middleName && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.middleName.message}
            </Text>
          )}

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Phone Number"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.phone}
                disabled={inputDisabled}
              />
            )}
          />
          {errors.phone && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.phone.message}
            </Text>
          )}
        </View>
      </ScrollView>

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
    padding: 16,
    gap: 16
  },
  errorText: {
    color: 'red'
  },
  headerContainer: {
    width: '100%',
    backgroundColor: '#ADD8E6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60
  },
  headerPartContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8
  },
  scrollContainer: {
    paddingBottom: 16
  }
})

export default MainScreen
