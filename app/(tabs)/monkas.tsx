import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Component } from 'react';
import useGun from '../../hooks/useGun';

import { useRootNavigationState, Redirect, router } from 'expo-router';
const { gun, app, user, SEA } = useGun();


const RedirectBasedOnLoginState = () => {
  //If logged in go to normal tab screen
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key){
    console.log("fail")
    setTimeout(() => {
      router.replace('../(login)/LoginScreen');
    }, 5)
  }else{
    router.replace('../(login)/LoginScreen')
  }
  
}

export default RedirectBasedOnLoginState
