import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export const StorageKeys = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken'
}

export const saveToken = (accessToken: string, refreshToken: string) => {
  storage.set(StorageKeys.ACCESS_TOKEN, accessToken)
  storage.set(StorageKeys.REFRESH_TOKEN, refreshToken)
}

export const clearTokens = () => {
  storage.delete(StorageKeys.ACCESS_TOKEN)
  storage.delete(StorageKeys.REFRESH_TOKEN)
}

export const storageLogout = () => {
  storage.delete(StorageKeys.ACCESS_TOKEN)
  storage.delete(StorageKeys.REFRESH_TOKEN)
  storage.delete('_id')
  storage.delete('email')
  storage.delete('firstName')
  storage.delete('lastName')
  storage.delete('middleName')
  storage.delete('phone')
  storage.delete('bloodGroup')
  storage.delete('birthDate')
  storage.delete('gender')
  storage.delete('position')
}
