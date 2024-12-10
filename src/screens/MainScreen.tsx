import React, { FC, useEffect, useMemo, useState } from 'react'
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import { useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import DocumentPicker from 'react-native-document-picker'
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

import { UPDATE_USER, UPLOAD_FILES } from '@api/mutations'
import { GET_USER } from '@api/queries'
import { storage } from '@store/index'

type validData = {
  firstName: string
  lastName: string
  middleName: string
  phone: string
  bloodGroup?: string
  birthDate?: string
  gender?: string
  position?: string
}

type Visit = {
  date: string
  diagnosis?: string
  description: string
  files?: string[]
}

type MedicalCategory = {
  category: string
  visits: Visit[]
}

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  middleName: yup.string().required('Middle name is required'),
  phone: yup.string().required('Phone number is required'),
  bloodGroup: yup.string(),
  birthDate: yup.string(),
  gender: yup.string(),
  position: yup.string()
})

const MainScreen: FC = () => {
  const [editEnabled, setEditEnabled] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [medicalCategories, setMedicalCategories] = useState<MedicalCategory[]>(
    []
  )
  const [currentCategory, setCurrentCategory] = useState<string>('')

  const {
    loading: getUserLoading,
    data,
    refetch
  } = useQuery(GET_USER, {
    variables: { id: storage.getString('_id') }
  })

  const [uploadFiles] = useMutation(UPLOAD_FILES)

  const [updateUser, { loading: updateUserLoading }] = useMutation(
    UPDATE_USER,
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

  console.log('data', data)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  })

  const addCategory = () => {
    if (!currentCategory) {
      return
    }
    setMedicalCategories((prev) => [
      ...prev,
      { category: currentCategory, visits: [] }
    ])
    setCurrentCategory('')
  }

  const deleteCategory = (index: number) => {
    setMedicalCategories((prev) => prev.filter((_, i) => i !== index))
  }

  const addVisit = (categoryIndex: number) => {
    const newVisit: Visit = { date: new Date().toISOString(), description: '' }
    const updatedCategories = [...medicalCategories]
    updatedCategories[categoryIndex].visits.push(newVisit)
    setMedicalCategories(updatedCategories)
  }

  const handleFilePick = async (categoryIndex: number, visitIndex: number) => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles]
      })

      const fileConfig = {
        uri: result.uri,
        type: result.type,
        name: result.name
      }

      const response = await uploadFiles({
        variables: { file: fileConfig }
      })

      const uploadedPaths = response?.data?.uploadFiles || []

      const updatedCategories = [...medicalCategories]
      const visit = updatedCategories[categoryIndex].visits[visitIndex]
      visit.files = visit.files
        ? [...visit.files, ...uploadedPaths]
        : uploadedPaths

      setMedicalCategories(updatedCategories)
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Toast.show({
          type: 'error',
          text1: 'File Error',
          text2: 'Unable to pick files'
        })
      }
    }
  }

  const handleEditPress = () => {
    setEditEnabled((prev) => !prev)
  }

  const handleSavePress = async (finalData: validData) => {
    await updateUser({
      variables: { _id: storage.getString('_id'), input: { ...finalData } }
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch({ id: storage.getString('_id') })
    setIsRefreshing(false)
  }

  useEffect(() => {
    if (data?.getUser && !isRefreshing) {
      const {
        firstName,
        lastName,
        middleName,
        phone,
        role,
        bloodGroup,
        birthDate,
        gender,
        position
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

      if (role === 'User') {
        storage.set('bloodGroup', bloodGroup ?? '')
        storage.set('birthDate', birthDate ?? '')
        storage.set('gender', gender ?? '')

        setValue('bloodGroup', bloodGroup ?? '')
        setValue('birthDate', birthDate ?? '')
        setValue('gender', gender ?? '')
      }

      if (role === 'Doctor') {
        storage.set('position', position ?? '')

        setValue('position', position ?? '')
      }
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

          {storage.getString('role') === 'User' && (
            <>
              <Controller
                control={control}
                name="bloodGroup"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Blood Group"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    disabled={inputDisabled}
                  />
                )}
              />

              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Birth Date"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    disabled={inputDisabled}
                  />
                )}
              />

              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Gender"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    disabled={inputDisabled}
                  />
                )}
              />

              <Text variant="headlineMedium">Medical Categories</Text>

              <View style={styles.inputRow}>
                <TextInput
                  label="New Category"
                  mode="outlined"
                  value={currentCategory}
                  onChangeText={setCurrentCategory}
                />
                <Button mode="contained" onPress={addCategory}>
                  Add
                </Button>
              </View>

              <FlatList
                data={medicalCategories}
                keyExtractor={(item, index) => `${item.category}-${index}`}
                renderItem={({ item, index }) => (
                  <View style={styles.categoryCard}>
                    <View style={styles.categoryHeader}>
                      <Text variant="titleLarge">{item.category}</Text>
                      <TouchableOpacity onPress={() => deleteCategory(index)}>
                        <Icon source="delete" color="red" size={24} />
                      </TouchableOpacity>
                    </View>

                    <FlatList
                      data={item.visits}
                      keyExtractor={(_, i) => `visit-${i}`}
                      renderItem={({ item: visit, index: visitIndex }) => (
                        <View style={styles.visitCard}>
                          <Text>Date: {visit.date}</Text>
                          <TextInput
                            label="Description"
                            mode="outlined"
                            value={visit.description}
                            onChangeText={(text) => {
                              const updatedCategories = [...medicalCategories]
                              updatedCategories[index].visits[
                                visitIndex
                              ].description = text
                              setMedicalCategories(updatedCategories)
                            }}
                          />
                          <Button
                            mode="outlined"
                            onPress={() => handleFilePick(index, visitIndex)}
                          >
                            {visit.files?.length
                              ? `${visit.files.length} Files`
                              : 'Upload Files'}
                          </Button>
                        </View>
                      )}
                      ListFooterComponent={
                        <Button
                          mode="contained"
                          onPress={() => addVisit(index)}
                          style={styles.addVisitButton}
                        >
                          Add Visit
                        </Button>
                      }
                    />
                  </View>
                )}
              />
            </>
          )}

          {storage.getString('role') === 'Doctor' && (
            <>
              <Controller
                control={control}
                name="position"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Position"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    disabled={inputDisabled}
                  />
                )}
              />
            </>
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
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  categoryCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  visitCard: {
    marginTop: 8,
    backgroundColor: '#e6f7ff',
    padding: 8,
    borderRadius: 8
  },
  addVisitButton: {
    marginTop: 8
  }
})

export default MainScreen
