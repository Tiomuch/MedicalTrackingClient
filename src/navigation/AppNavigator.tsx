import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AuthScreen from '@screens/AuthScreen'
import MainScreen from '@screens/MainScreen'
import ProfileScreen from '@screens/ProfileScreen'
import RegistrationScreen from '@screens/RegistrationScreen'
import RoleSelectionScreen from '@screens/RoleSelectionScreen'
import SearchScreen from '@screens/SearchScreen'
import SettingsScreen from '@screens/SettingsScreen'

export type RootStackParamList = {
  Auth: undefined
  Registration: undefined
  RoleSelection: undefined
  Home: undefined
  Search: undefined
  Profile: { userId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

function SearchStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
