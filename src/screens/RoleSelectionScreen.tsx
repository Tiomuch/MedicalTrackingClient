import React, { FC, useState } from 'react'
import { TextInput as RNTextInput, StyleSheet, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, TextInput } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RootStackParamList } from '@navigation/AppNavigator'

type RoleSelectionScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'RoleSelection'
>

const RoleSelectionScreen: FC = () => {
  const [code, setCode] = useState<string>('')
  const { replace } = useNavigation<RoleSelectionScreenNavigationProp>()

  const handleChangeText = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '').slice(0, 6)
    setCode(sanitized)
  }

  const onContinuePress = () => {
    replace('Home')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.codeInputContainer}>
          {[...Array(6)].map((_, index) => (
            <TextInput
              key={index}
              value={code[index] || ''}
              editable={false}
              style={styles.input}
            />
          ))}
        </View>

        <RNTextInput
          value={code}
          onChangeText={handleChangeText}
          keyboardType="numeric"
          style={styles.hiddenInput}
          autoFocus
        />

        <Button
          icon="checkbox-marked-circle-outline"
          mode="elevated"
          onPress={onContinuePress}
        >
          Continue
        </Button>

        <Button icon="email-sync-outline" mode="text" onPress={() => {}}>
          Resend Code
        </Button>
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
    justifyContent: 'center',
    gap: 16
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  input: {
    flex: 1,
    fontSize: 24,
    backgroundColor: '#f2f2f2',
    borderRadius: 8
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0
  }
})

export default RoleSelectionScreen
