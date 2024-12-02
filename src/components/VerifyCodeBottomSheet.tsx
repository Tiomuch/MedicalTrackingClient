import { FC, RefObject, useState } from 'react'
import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native'

import BottomSheet from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { Button, TextInput } from 'react-native-paper'

type Props = {
  bottomSheetRef: RefObject<BottomSheetMethods>
}

const VerifyCodeBottomSheet: FC<Props> = ({ bottomSheetRef }) => {
  const [code, setCode] = useState<string>('')

  const handleChangeText = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '').slice(0, 6)
    setCode(sanitized)
  }

  const onContinuePress = () => {}

  const onResendCodePress = () => {}

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={['50%']} enablePanDownToClose>
      <View style={styles.bottomSheetContainer}>
        <Text style={styles.title}>Enter Verification Code</Text>

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
          disabled={code.length < 6}
        >
          Verify Code
        </Button>

        <Button
          icon="email-sync-outline"
          mode="text"
          onPress={onResendCodePress}
        >
          Resend Code
        </Button>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    gap: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
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

export default VerifyCodeBottomSheet
