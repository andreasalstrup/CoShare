import styles from './styles'
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { ImageBackground, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogoAndName } from '../../components/LogoAndName';
import { useState, useRef } from 'react';
import { userHandle } from '../../handlers/user';

export default function CreateAccountScreen() {
  const user = useRef(userHandle(gun));

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

  const validatePhone = (phone: string) => phone.length == 8

  const validatePass = (pass: string) => pass.length > 7 || pass == ''

  const validateName = (name: string) => name != ''

  function passwordsMatch(pass: string, repPass: string) {
    let equal: boolean = pass == repPass
    let value: boolean = (pass != '' && repPass != '') && (!equal)
    setShowWrongPasswords(value)
    return equal
  }

  function toggleSubmitButton(phone: string, pass: string, repPass: string, name: string) { //We need params to mitigate the async updating
    setSubmitActive(passwordsMatch(pass, repPass) && validatePhone(phone) && validatePass(pass) && validateName(name))
  }

  function redirect(ack: any): boolean {
    if (ack.err == undefined) {
      router.replace('/group')
      return true;
    }

    if (ack.err == "User already created!") {
      setError("User already exists")
    }

    setCreatingUser(false);

    return false;
  }

  function onSubmit(submitActive: Boolean, creatingUser: Boolean): void {
    if (submitActive && !creatingUser) {
      setCreatingUser(true);
      user.current.create(fullName, email, phoneNumber, password, redirect);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/accountScreensImage.png')} style={styles.backgroundImage}>
        <LogoAndName />
        {error != "" && <Text style={styles.error}> {error} </Text>}
        <View style={styles.textboxContainer}>
          <Text style={styles.descriptiveText}>Phone Number*</Text>
          <View style={styles.inputBox}>
            <TextInput
              maxLength={8} inputMode='tel' autoComplete={'tel'} style={styles.inputField}
              value={phoneNumber}
              onChangeText={
                (newPhoneNumber) => {
                  setPhoneNumber(newPhoneNumber)
                  toggleSubmitButton(newPhoneNumber, password, repeatPassword, fullName)
                }}
            />
          </View>
        </View>
        <View style={styles.textboxContainer}>

          <Text style={styles.descriptiveText}>Password*</Text>
          <View style={styles.inputBox}>
            <TextInput
              secureTextEntry={hidePassword}
              style={styles.inputField}
              value={password}
              autoCapitalize='none'
              onChangeText={
                (newPassword) => {
                  setPassword(newPassword)
                  toggleSubmitButton(phoneNumber, newPassword, repeatPassword, fullName)
                }}
            />
            <MaterialCommunityIcons
              name={hidePassword ? 'eye' : 'eye-off'}
              style={styles.eye}
              size={24}
              onPress={toggleHidePassword}
            />
          </View>
          {!validatePass(password) && <Text style={(styles.descriptiveText, { color: 'red' })}>Password needs at least 7 characters</Text>}
        </View>
        <View style={styles.textboxContainer}>

          <Text style={styles.descriptiveText}>Repeat Password*</Text>
          <View style={styles.inputBox}>
            <TextInput
              autoCapitalize='none'
              secureTextEntry={hidePassword}
              style={styles.inputField}
              value={repeatPassword}
              onChangeText={(newRepeatPassword) => {
                setRepeatPassword(newRepeatPassword)
                toggleSubmitButton(phoneNumber, password, newRepeatPassword, fullName)
              }}
            />
          </View>
          {showWrongPasswords && <Text style={(styles.error, { color: 'red' })}> Passwords do not match</Text>}
        </View>
        <View style={styles.textboxContainer}>

          <Text style={styles.descriptiveText}>Username*</Text>
          <View style={styles.inputBox}>
            <TextInput
              autoComplete={'name'} style={styles.inputField}
              value={fullName}
              onChangeText={(newFullName) =>{
                setFullName(newFullName)
                toggleSubmitButton(phoneNumber, password, repeatPassword, newFullName)
              }
            }
            />
          </View>
        </View>
        <View style={styles.textboxContainer}>

          <Text style={styles.descriptiveText}>E-mail</Text>
          <View style={styles.inputBox}>
            <TextInput
              inputMode='email' autoComplete={'email'} style={styles.inputField}
              value={email}
              onChangeText={(email) => setEmail(email)}
            />
          </View>
        </View>
        <View style={styles.separator} />
        <Pressable
          style={submitActive ? styles.button : styles.disabledButton}
          onPress={() => { onSubmit(submitActive, creatingUser) }}>
          <Text style={styles.buttonText}> Create account </Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
}