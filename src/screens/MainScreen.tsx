import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'

import { Icon, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const MainScreen: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.topPartContainer}>
          <View style={styles.iconContainer}>
            <Icon source="account" size={80} />
          </View>

          <View style={styles.topRightPartContainer}>
            <Text>Name: Test Test Test</Text>

            <Text>Date of birth: 01.01.1999</Text>

            <Text>Gender: Male</Text>

            <Text>Role: Patient</Text>

            <Text>Blood group: O+</Text>

            <Text>Phone number: +380999999999</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 30 }}>Cardiology</Text>

          <Icon source="chevron-down" size={40} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 30 }}>Dermatology</Text>

          <Icon source="chevron-down" size={40} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 30 }}>Family Medicine</Text>

          <Icon source="chevron-down" size={40} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 30 }}>Forensic Pathology</Text>

          <Icon source="chevron-down" size={40} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 30 }}>Genetics and Genomics</Text>

          <Icon source="chevron-down" size={40} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 30 }}>Neurology</Text>

          <Icon source="chevron-down" size={40} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 30 }}>Gynecology</Text>

          <Icon source="chevron-down" size={40} />
        </View>
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
    padding: 16,
    gap: 16
  },
  topPartContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 16
  },
  topRightPartContainer: {
    gap: 16,
    flex: 0.5,
    padding: 16
  },
  iconContainer: {
    backgroundColor: '#ADD8E6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    height: 200
  }
})

export default MainScreen
