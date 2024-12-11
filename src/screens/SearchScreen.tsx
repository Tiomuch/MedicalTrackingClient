import React, { useCallback, useEffect, useState } from 'react'
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

import { useQuery } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Card, Icon, Text, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import { GET_USERS } from '@api/queries'
import { RootStackParamList } from '@navigation/AppNavigator'

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Search'
>

type User = {
  role?: string
  firstName?: string
  lastName?: string
  middleName?: string
  phone?: string
  position?: string
  _id?: string
}

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { navigate } = useNavigation<SearchScreenNavigationProp>()

  const { loading, data, refetch } = useQuery(GET_USERS, {
    variables: { role: 'Doctor', page: 1, limit: 10 }
  })

  const handleSearch = async () => {
    console.log('searchText', searchText)
    const res = await refetch({
      search: searchText,
      page: 1,
      limit: 10,
      role: 'Doctor'
    })
    console.log('res', res.data?.getUsers)
  }

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refetch({ search: searchText, page: 1, limit: 10, role: 'Doctor' })
    setIsRefreshing(false)
  }, [searchText, refetch])

  const handlePress = (userId: string) => {
    navigate('Profile', { userId })
  }

  useEffect(() => {
    if (data?.getUsers && !isRefreshing) {
      console.log('data', data)

      setUsers(data?.getUsers)
    }
  }, [data?.getUsers, isRefreshing])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.searchContainer}>
          <TextInput
            mode="outlined"
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />

          <TouchableOpacity
            disabled={loading}
            onPress={handleSearch}
            style={styles.searchIconContainer}
          >
            <Icon source="magnify" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {users.map((user) => (
            <TouchableOpacity
              key={user._id}
              onPress={() => handlePress(user?._id ?? '')}
            >
              <Card style={styles.userCard}>
                <Card.Content style={styles.userCardContent}>
                  <Text
                    style={styles.name}
                  >{`${user?.firstName ?? ''} ${user?.lastName ?? ''} ${user?.middleName ?? ''}`}</Text>
                  <Text
                    style={styles.info}
                  >{`Role: ${user?.role ?? 'Doctor'}`}</Text>
                  <Text
                    style={styles.info}
                  >{`Phone: ${user?.phone ?? ''}`}</Text>
                  {user?.role === 'Doctor' && (
                    <Text
                      style={styles.info}
                    >{`Position: ${user?.position ?? ''}`}</Text>
                  )}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    paddingVertical: 16,
    justifyContent: 'center',
    gap: 16
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    width: '100%'
  },
  searchIconContainer: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'black',
    padding: 12,
    backgroundColor: '#f7f3f3'
  },
  searchInput: {
    flex: 1
  },
  userCard: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10
  },
  userCardContent: {
    gap: 12
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  info: {
    fontSize: 14,
    color: '#666'
  }
})

export default SearchScreen
