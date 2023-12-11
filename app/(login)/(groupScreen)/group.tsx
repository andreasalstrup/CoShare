import { Redirect } from 'expo-router';
import { ImageBackground, Pressable, View, Text, TextInput } from 'react-native';
import styles from '../styles';
import { useState, useRef } from 'react';
import { LogoAndName } from '../../../components/LogoAndName';
import getBluetoothComponent from './joinGroupBluetooth';
import getIdComponent from './joinGroup';
import getCreateComponent from './createGroup';
import { router } from 'expo-router';
import { userHandle } from '../../../handlers/user';

enum State {
  buttons,
  bluetooth,
  id,
  create,
}

export default function GroupScreen() {
  const user = useRef(userHandle(gun));
  const [currentState, setCurrentState] = useState(State.buttons)
  const createComponent = getCreateComponent()
  const bluetoothComponent = getBluetoothComponent()
  const idComponent = getIdComponent()

  function getActiveComponent (state : State){
    if (state == State.buttons){
      return getButtonsComponent()
    }
    else if (state == State.bluetooth){
      return bluetoothComponent
    }
    else if (state == State.id){
      return idComponent
    }
    else if (state == State.create){
      return createComponent
    }
  }
  
  function getButtonsComponent() {
    return (
      <>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText} onPress={() => {setCurrentState(State.bluetooth)}}> Join with bluetooth </Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {setCurrentState(State.id)}}>
            <Text style={styles.buttonText}> Join with group id </Text>
          </Pressable>
          <Pressable style={styles.buttonAlt} onPress={() => {setCurrentState(State.create)}}>
            <Text style={styles.buttonText}> Create new group </Text>
          </Pressable>
      </>
    )
  }

  function getMainScreenTextComponent() {
    return (
      <View style={{alignItems: "center"}}>        
        <Pressable onPress={() => logout()}><Text style={styles.descriptiveText}>Log out</Text></Pressable>
      </View>
    )
  }
  
  function getNonMainScreenTextComponent() {
    return (
      <View style={{alignItems: "center"}}>        
        <Pressable onPress={() => setCurrentState(State.buttons)}><Text style={styles.descriptiveText}>Go back</Text></Pressable>
        <Pressable onPress={() => logout()}><Text style={styles.descriptiveText}>Log out</Text></Pressable>
      </View>
    )
  }

  function logout() {
    console.log("tried to log out")
    user.current.logout()
    router.replace('/login')
  }

  return (
    <>
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/images/accountScreensImage.png')} style={styles.backgroundImage}>
        <LogoAndName/>        
        {getActiveComponent(currentState)}    
        {currentState == State.buttons && getMainScreenTextComponent()}
        {currentState != State.buttons && getNonMainScreenTextComponent()}
      </ImageBackground>
    </View>
    </>
  )
}