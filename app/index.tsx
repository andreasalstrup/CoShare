import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Component, useCallback } from 'react';
import { useRootNavigationState, Redirect, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { registerRootComponent } from 'expo';

SplashScreen.preventAutoHideAsync(); //Not  needed now but might be when doing checks
export default class RedirectBasedOnLoginState extends Component<{}, {}> {
  
  render() {
    //return <Redirect href='/(login)/CreateAccountScreen'/>
    return <Redirect href='/(login)/LoginScreen'/>
  }
  // //If logged in go to normal tab screen
}