import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { RootStackParamList } from '@navigation/AppNavigator'
import { storage } from '@store/index'

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>

const SplashScreen = () => {
  const { reset } = useNavigation<SplashScreenNavigationProp>()

  useEffect(() => {
    const initializeApp = async () => {
      const accessToken = await storage.getString('accessToken')

      reset({
        index: 0,
        routes: [{ name: accessToken ? 'Home' : 'Auth' }]
      })
    }

    initializeApp()
  }, [reset])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default SplashScreen
