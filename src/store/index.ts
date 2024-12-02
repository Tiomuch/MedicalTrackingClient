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

export const getAccessToken = () =>
  storage.getString(StorageKeys.ACCESS_TOKEN) || null

export const getRefreshToken = () =>
  storage.getString(StorageKeys.REFRESH_TOKEN) || null

export const clearTokens = () => {
  storage.delete(StorageKeys.ACCESS_TOKEN)
  storage.delete(StorageKeys.REFRESH_TOKEN)
}
