import { StyleSheet } from 'react-native';

import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Component } from 'react';


import { useRootNavigationState, Redirect, router } from 'expo-router';

// const RedirectBasedOnLoginState = () => {
//   //If logged in go to normal tab screen
//   const rootNavigationState = useRootNavigationState();
//   console.log("This is the index file")
//   if (!rootNavigationState?.key){
//     console.log("nope")
//     setTimeout(() => {
//       router.replace('/(login)/LoginScreen');
//     }, 5)
//   }else{
//     router.replace('/(login)/LoginScreen')
//   }
// }


import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import useGun from '../hooks/useGun';

const { gun, app, user, SEA} = useGun();
export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
// export default RedirectBasedOnLoginState
