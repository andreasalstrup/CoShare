import styles from './styles'
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { ImageBackground, Pressable } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogoAndName } from '../../components/LogoAndName';

export default function loginScreen () {
  const [phoneNumber, setPhoneNumber] = useState('12345678')
  const [password, setPassword] = useState('12345678')
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const [hidePassword, setHidePassword] = useState(true)
  const [authing, setAuthing] = useState(false)  
  
  function toggleHidePassword () {
    setHidePassword(!hidePassword)
  }

  function checkSuccesfulLogin (ack: any) {
    if (!ack.err){            
        if (user.is){
            let newUser = gun.user(ack.pub)
            let inGroup = true                        
            newUser.get("group").once((ack) =>{              
              if(ack == undefined){
                console.log("Group not found")                
                router.replace('/GroupScreen')
              } else {
                console.log("Group found")
                router.replace('../(tabs)/ShoppingList/index')                              
              }
            })          
        }else{
            console.log("User somehow doesn't exist");
        }
    }else{     
        setWrongCredentials(true)
        setAuthing(false)
    }
  }
    return (         
      <View style={styles.container}>      
      <ImageBackground source={require('../../assets/images/accountScreensImage.png')} style={styles.backgroundImage}>     
        <LogoAndName/>
        <Text style={styles.descriptiveText}>Phone Number</Text>      
        <View style={styles.inputBox}>
          <TextInput maxLength={8} inputMode='tel' autoComplete={'tel'} style={styles.inputField}
                        value={phoneNumber}
                        onChangeText={(phoneNumber) =>{                      
                        setPhoneNumber(phoneNumber)
                      }                  
              }
            />
          </View>                      
        <Text style={styles.descriptiveText}>Password</Text>
        <View style={styles.inputBox}>
          <TextInput secureTextEntry={hidePassword} style={styles.inputField}
                    autoCapitalize='none'
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    />
                    
          <MaterialCommunityIcons 
                    name={hidePassword ? 'eye' : 'eye-off'}                   
                    style={styles.eye}
                    size={24}
                    onPress={toggleHidePassword}
              />
        </View>
        {wrongCredentials && <Text style={styles.error}> Wrong credentials</Text>}
        <View style={styles.separator}/>
        
        <Pressable 
          style={styles.button} 
          onPress={()=>{   
            if (!authing){
              setAuthing(true)
              user.auth(phoneNumber,password, checkSuccesfulLogin)                       
            }
          }}>
            <Text style={styles.buttonText}> Sign in</Text>
        </Pressable>                    
        <Text style={styles.descriptiveText}><Link href={"/CreateAccountScreen"}> Create new account</Link></Text>        
      </ImageBackground>
      
      </View>
    );
 }
