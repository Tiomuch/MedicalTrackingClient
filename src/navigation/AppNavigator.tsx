import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Icon } from 'react-native-paper'

import AuthScreen from '@screens/AuthScreen'
import ChangeEmailScreen from '@screens/ChangeEmailScreen'
import ChangePasswordScreen from '@screens/ChangePasswordScreen'
import MainScreen from '@screens/MainScreen'
import ProfileScreen from '@screens/ProfileScreen'
import RegistrationScreen from '@screens/RegistrationScreen'
import RoleSelectionScreen from '@screens/RoleSelectionScreen'
import SearchScreen from '@screens/SearchScreen'
import SettingsScreen from '@screens/SettingsScreen'
import SplashScreen from '@screens/SplashScreen'

export type RootStackParamList = {
  Auth: undefined
  Registration: undefined
  RoleSelection: undefined
  Home: undefined
  Search: undefined
  Profile: { userId: string }
  Settings: undefined
  ChangeEmail: undefined
  ChangePassword: undefined
  Splash: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

function SearchStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  )
}

function SettingsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChangeEmail" component={ChangeEmailScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  )
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Main',
          tabBarIcon: ({ color, size }) => (
            <Icon source="home" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Icon source="folder-search" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon source="account-settings" color={color} size={size} />
          )
        }}
      />
    </Tab.Navigator>
  )
}

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{
            headerTitle: 'Registration',
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={{
            headerTitle: 'Role Selection',
            headerTitleAlign: 'center'
          }}
        />
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
