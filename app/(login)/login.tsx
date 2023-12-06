import styles from './styles'
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { ImageBackground, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogoAndName } from '../../components/LogoAndName';
import { useRef, useState } from 'react';
import { userHandle } from '../../handlers/user';
import {groupHandle } from '../../handlers/group';
export default function loginScreen () {
  const user = useRef(userHandle(gun));
  const group = useRef(groupHandle(gun));
  const [phoneNumber, setPhoneNumber] = useState('12345678')
  const [password, setPassword] = useState('12345678')
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const [hidePassword, setHidePassword] = useState(true)
  const [authing, setAuthing] = useState(false)  
  
  const toggleHidePassword = () => setHidePassword(!hidePassword)

  function succesfulLogin (ack: any, user: UserGunDB): Boolean {    
    if (ack.err != undefined) {
      setWrongCredentials(true);
      setAuthing(false);
      return true;
    }

    // TODO: Create useGroup
    group.current.checkIfInGroup((ack: Boolean) => {
      if (ack) {
        group.current.setPeers();
        router.replace('../shoppingList');   
      }else{
        router.replace('/group');
      }
    })

    return false;
  }

  return (         
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/accountScreensImage.png')} style={styles.backgroundImage}>     
        <LogoAndName/>      
        <Text style={styles.descriptiveText}>Phone Number</Text>
        <View style={styles.inputBox}>
          <TextInput maxLength={8} inputMode='tel' autoComplete={'tel'} style={styles.inputField}
                        value={phoneNumber}
                        onChangeText={(phoneNumber) =>setPhoneNumber(phoneNumber)}/>
        </View>                      
        <Text style={styles.descriptiveText}>Password</Text>
        <View style={styles.inputBox}>
          <TextInput secureTextEntry={hidePassword} style={styles.inputField}
                    autoCapitalize='none'
                    value={password}
                    onChangeText={(password) => setPassword(password)}/>
          <MaterialCommunityIcons
                    name={hidePassword ? 'eye' : 'eye-off'}                   
                    style={styles.eye}
                    size={24}
                    onPress={toggleHidePassword}/>
        </View>
        {wrongCredentials && <Text style={styles.error}> Wrong credentials</Text>}
        <View style={styles.separator}/>
        <Pressable 
          style={styles.button} 
          onPress={()=>{   
            if (!authing){
              setAuthing(true)
              user.current.login(phoneNumber, password, succesfulLogin)                    
            }
          }}>
            <Text style={styles.buttonText}> Sign in</Text>
        </Pressable>                    
        <Text style={styles.descriptiveText}><Link href={"/createAccount"}> Create new account</Link></Text>        
      </ImageBackground>
    </View>
  );
}