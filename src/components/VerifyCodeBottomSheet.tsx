import { FC, RefObject, useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { Button, TextInput } from 'react-native-paper'

type Props = {
  bottomSheetRef: RefObject<BottomSheetModal>
  onContinuePress: (code: string) => void
  onResendCodePress: () => void
  loading: boolean
}

const VerifyCodeBottomSheet: FC<Props> = ({
  bottomSheetRef,
  onContinuePress,
  onResendCodePress,
  loading
}) => {
  const [code, setCode] = useState<string>('')

  const inputRef = useRef<RNTextInput>(null)

  const handleChangeText = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '').slice(0, 6)
    setCode(sanitized)
  }

  const handleBoxPress = () => {
    inputRef.current?.focus()
  }

  const handleVerifyCode = () => {
    onContinuePress(code)
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      style={{
        borderWidth: 1,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderColor: 'black'
      }}
      snapPoints={['50%']}
    >
      <BottomSheetView style={styles.bottomSheetContainer}>
        <Text style={styles.title}>Enter Verification Code</Text>

        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback
            onPress={handleBoxPress}
            style={styles.keyboardAvoidingView}
          >
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
          </TouchableWithoutFeedback>

          <RNTextInput
            ref={inputRef}
            value={code}
            onChangeText={handleChangeText}
            keyboardType="numeric"
            style={styles.hiddenInput}
          />
        </KeyboardAvoidingView>

        <Button
          icon="checkbox-marked-circle-outline"
          mode="elevated"
          onPress={handleVerifyCode}
          disabled={code.length < 6 || loading}
          loading={loading}
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
      </BottomSheetView>
    </BottomSheetModal>
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
  },
  keyboardAvoidingView: {
    width: '100%'
  }
})

export default VerifyCodeBottomSheet
