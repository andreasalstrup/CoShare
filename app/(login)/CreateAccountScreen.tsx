import styles from './styles'
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { ImageBackground, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogoAndName } from '../../components/LogoAndName';
import { useState } from 'react';

export default function CreateAccountScreen () {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [showWrongPasswords, setShowWrongPasswords] = useState(false)
  const [hidePassword, setHidePassword] = useState(true)
  const [submitActive, setSubmitActive] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)
  
  const toggleHidePassword = () => setHidePassword(!hidePassword)
  
  const validatePhone = (phone : string) => phone.length == 8

  const validatePass = (pass: string) => pass.length > 7

  function passwordsMatch (pass : string, repPass : string) {
    let equal : boolean = pass == repPass
    let value : boolean = (pass != '' && repPass != '') && (!equal)
    setShowWrongPasswords(value)
    return equal
  }

  function toggleSubmitButton (phone : string, pass : string, repPass : string) { //We need params to mitigate the async updating
    setSubmitActive(passwordsMatch(pass, repPass) && validatePhone(phone) && validatePass(pass))
  }

  function createAccount(ack : any) {
    if (ack?.err){
      setCreatingUser(false);
      console.log("Some error on user creation")
      if (ack.err == "User already created!"){
          setError("User already exists")
      }
      else{//The other possible error is:  "User is already being created or authenticated!" which probably means the user has clicked create user multiple times
        return
      }
    }
    else{
      let newUser = gun.user(ack.pub)
      if (fullName != ''){
        newUser.get('fullName').put(fullName)
      }
      if (email != '') {
        newUser.get('email').put(email)
      }           
      setShowWrongPasswords(false)
      user.auth(phoneNumber,password, login)
    }
  }

  function login (ack : any) {
    if (!ack.err){    
      if (user.is){            
              console.log("Redirect to GroupScreen")
              router.replace('/GroupScreen')            
      }
      else{
          console.log("User somehow doesn't exist");
      }
    }
    else{
        console.log("Newly created user cannot be authenticated, something went wrong with the database"); 
        //  Not sure how this should be handled
    }
  }
    
  return (
    <>
      <View style={styles.container}>
        
        <ImageBackground source={require('../../assets/images/accountScreensImage.png')} style={styles.backgroundImage}>
        <LogoAndName/>
        {error != "" && <Text style={styles.error}> {error} </Text>}
        <Text style={styles.descriptiveText}>Phone Number*</Text>
        <View style={styles.inputBox}>
          <TextInput maxLength={8} inputMode='tel' autoComplete={'tel'} style={styles.inputField}
                    value={phoneNumber}
                    onChangeText={
                      (newPhoneNumber) =>{
                        setPhoneNumber(newPhoneNumber)             
                        toggleSubmitButton(newPhoneNumber, password, repeatPassword)       
                  }
          }/>
        </View>            
        <Text style={styles.descriptiveText}>Password*</Text>
        <View style={styles.inputBox}>
          <TextInput secureTextEntry={hidePassword} 
                    style={styles.inputField}
                    value={password}
                    autoCapitalize='none'
                    onChangeText={
                      (newPassword) =>{
                        setPassword(newPassword)
                        toggleSubmitButton(phoneNumber, newPassword, repeatPassword)                                                     
                      }      
                    }                                                              
        />
        <MaterialCommunityIcons 
                name={hidePassword ? 'eye' : 'eye-off'}
                style={styles.eye}
                size={24}
                onPress={toggleHidePassword}
          />
          </View>
        {!validatePass(password) && <Text style={styles.descriptiveText}>Password needs at least 7 characters</Text>}
        <Text style={styles.descriptiveText}>Repeat Password*</Text>
        <View style={styles.inputBox}>
          <TextInput  autoCapitalize='none'
                      secureTextEntry={hidePassword}
                      style={styles.inputField}
                      value={repeatPassword}
                      onChangeText={(newRepeatPassword) => {
                        setRepeatPassword(newRepeatPassword)
                        toggleSubmitButton(phoneNumber, password, newRepeatPassword)
                      }         
                    }                      
          />
        </View>
        {showWrongPasswords && <Text style={styles.error}> Passwords do not match</Text>}
        <Text style={styles.descriptiveText}>Full Name</Text>
        <View style={styles.inputBox}>
        <TextInput autoComplete={'name'} style={styles.inputField}
                    value={fullName}
                    onChangeText={(fullName) => setFullName(fullName)}
                    />
        </View>
        <Text style={styles.descriptiveText}>E-mail</Text>
        
        <View style={styles.inputBox}>
          <TextInput inputMode='email' autoComplete={'email'} style={styles.inputField}
                      value={email}
                      onChangeText={(email) => setEmail(email)}
        />
        </View>
        <View style={styles.separator}/>
        <Pressable style={submitActive ? styles.button : styles.disabledButton } 
                onPress={(submitActive && !creatingUser) ? () =>{                                             
                  setCreatingUser(true);                          
                  user.create(phoneNumber, password, createAccount)                                         
                } : () => {}}>
                  <Text style={styles.buttonText}> Create account </Text>
        </Pressable>
        </ImageBackground>
      </View>
    </>
  )
      
}