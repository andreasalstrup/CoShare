import { Redirect } from 'expo-router';
import { ImageBackground, Pressable, View, Text, TextInput } from 'react-native';
import styles from '../styles';
import { useState } from 'react';
import { LogoAndName } from '../../../components/LogoAndName';
import getBluetoothComponent from './JoinGroupBluetoothComponent';
import getIdComponent from './JoinGroupIdComponent';
import getCreateComponent from './CreateGroupComponent';
import { router } from 'expo-router';
enum State {
  buttons,
  bluetooth,
  id,
  create,
}

export default function GroupScreen() {
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

      </>
    )
  }

  function getSmallTextComponent() {
    return (
      <View style={{alignItems: "center"}}>
        <View style={styles.separator}/>
        <Pressable onPress={() => setCurrentState(State.create)}><Text style={styles.descriptiveText}>Create new group</Text></Pressable>
        <Pressable onPress={() => logout()}><Text style={styles.descriptiveText}>Log out</Text></Pressable>
      </View>
    )
  }

  function logout() {
    console.log("tried to log out")
    user.leave()
    router.replace('./LoginScreen')
  }

  return (
    <>
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/images/accountScreensImage.png')} style={styles.backgroundImage}>
        <LogoAndName/>
        {getActiveComponent(currentState)}    
        {currentState != State.create && getSmallTextComponent()}
      </ImageBackground>
    </View>
    </>
  )
}