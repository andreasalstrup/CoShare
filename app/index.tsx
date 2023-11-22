import { Component, useCallback } from 'react';
import '../constants/Database'
import { Redirect } from 'expo-router';

export default class RedirectBasedOnLoginState extends Component<{}, {}> {
  
  render() {    
    return <Redirect href='/(login)/LoginScreen'/>
  }
  // //If logged in go to normal tab screen
}