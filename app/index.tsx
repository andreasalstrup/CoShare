import { StyleSheet } from 'react-native';

import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Component } from 'react';


import { useRootNavigationState, Redirect, router } from 'expo-router';

export default class RedirectBasedOnLoginState extends Component<{}, {}> {
  render() {
    //return <Redirect href='/(login)/CreateAccountScreen'/>
    return <Redirect href='/(login)/LoginScreen'/>
  }
  // //If logged in go to normal tab screen
  // const rootNavigationState = useRootNavigationState();
  // console.log("This is the index file")
  // if (!rootNavigationState?.key){
  //   console.log("nope")
  //   setTimeout(() => {
  //     router.replace('/(login)/LoginScreen');
  //   }, 5)
  // }else{
  //   router.replace('/(login)/LoginScreen')
  // }
}
