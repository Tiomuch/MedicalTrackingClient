import React, { useCallback, useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import { useMutation, useQuery } from '@apollo/client'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Button, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { SHARE_CARD } from '@api/mutations'
import { GET_USER } from '@api/queries'
import { RootStackParamList } from '@navigation/AppNavigator'
import { storage } from '@store/index'

type User = {
  role?: string
  firstName?: string
  lastName?: string
  middleName?: string
  phone?: string
  position?: string
  _id: string
}

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const { params } = useRoute<RouteProp<RootStackParamList, 'Profile'>>()

  const { loading, data, refetch } = useQuery(GET_USER, {
    variables: { id: params.userId }
  })

  const [shareCardMutation] = useMutation(SHARE_CARD)

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }, [refetch])

  const handleShareCard = async () => {
    if (!user) return

    try {
      setIsSharing(true)
      await shareCardMutation({
        variables: {
          patientId: storage.getString('_id'),
          doctorId: params.userId
        }
      })

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Card shared successfully'
      })
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to share card'
      })
    } finally {
      setIsSharing(false)
    }
  }

  useEffect(() => {
    if (data?.getUser) {
      console.log('data?.getUser', data?.getUser)
      setUser(data.getUser)
    }
  }, [data?.getUser])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Button
            mode="contained"
            onPress={handleShareCard}
            disabled={loading || isSharing}
            loading={isSharing}
          >
            Share My Card
          </Button>
        </View>

        {user && (
          <>
            <Text
              style={styles.name}
            >{`${user.firstName ?? ''} ${user.lastName ?? ''} ${user.middleName ?? ''}`}</Text>
            <Text style={styles.info}>{`Role: ${user?.role ?? 'Doctor'}`}</Text>
            <Text style={styles.info}>{`Phone: ${user?.phone ?? ''}`}</Text>
            {user?.role === 'Doctor' && (
              <Text
                style={styles.info}
              >{`Position: ${user.position ?? ''}`}</Text>
            )}
          </>
        )}
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
  contentContainer: {
    padding: 16
  },
  header: {
    marginBottom: 16,
    alignItems: 'flex-end'
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  info: {
    fontSize: 16,
    color: '#555'
  }
})

export default ProfileScreen
