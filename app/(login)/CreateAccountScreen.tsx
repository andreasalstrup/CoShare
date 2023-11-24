import styles from './styles'
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { ImageBackground, Pressable } from 'react-native';
import { Component } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogoAndName } from '../../components/LogoAndName';

type Props = {
  text: any
}

type State = {
  phoneNumber: string
  password: string,
  repeatPassword: string,
  hidePassword: boolean,
  showWrongPasswords: boolean,
  fullName: string,
  email: string,
  error: string,
  submitActive: boolean,
  creatingUser: boolean,
}

export default class CreateAccountScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
          phoneNumber: '',
          password: '',
          repeatPassword: '',
          hidePassword: true,
          showWrongPasswords: false,
          fullName: '',
          email: '',
          error: '',
          submitActive: false,
          creatingUser: false,
        };
      }

      createAccount = (ack : any) => {
        if (ack?.err){
          this.setState({creatingUser: false });
          console.log("Some error on user creation")
          if (ack.err == "User already created!"){
              this.setState({
                error: "User already exists"
              });
          }
          else{//The other possible error is:  "User is already being created or authenticated!" which probably means the user has clicked create user multiple times
            return
          }
        }
        else{
          let newUser = gun.user(ack.pub)          
          let fullName : string = this.state.fullName
          let email : string = this.state.email        
          newUser.get("PhoneNumber").put(this.state.phoneNumber)
          if (fullName != null){
            newUser.get('fullName').put(fullName)
          }
          if (email != null) {
            newUser.get('email').put(email)
          }           
          this.setState({showWrongPasswords: false });
          user.auth(this.state.phoneNumber,this.state.password,this.login)
        }
      }

      login = (ack : any) => {            
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

      validatePhone = () => {        
        let phone : string = this.state.phoneNumber        
        return phone.length == 8 // Danish phonenumbers only atm        
      }

      validatePass = () => {
        let pass : string = this.state.password
        return (pass.length > 7) //Multiple constraints can be placed on pass        
        }

      passwordsMatch = () => {        
        let pass : string = this.state.password
        let repPass : string = this.state.repeatPassword
        let equal : boolean = pass == repPass
        let value : boolean = (pass != '' && repPass != '') && (!equal)
        this.setState({showWrongPasswords: value });        
        return equal
      }

      toggleHidePassword = () => {
        this.setState({hidePassword:!this.state.hidePassword})
      }

      toggleSubmitButton = () => {    
        let submitActive = this.passwordsMatch() && this.validatePhone() && this.validatePass()
        this.setState({submitActive: submitActive})
      }

      render() {
        return (
          <View style={styles.container}>
            
            <ImageBackground source={require('../../assets/images/accountScreensImage.png')} style={styles.backgroundImage}>
            <LogoAndName/>
            {this.state.error != "" && <Text style={styles.error}> {this.state.error} </Text>}
            <Text style={styles.descriptiveText}>Phone Number*</Text>
            <View style={styles.inputBox}>
              <TextInput maxLength={8} inputMode='tel' autoComplete={'tel'} style={styles.inputField}
                        value={this.state.phoneNumber}
                        onChangeText={
                          (phoneNumber) =>{                      
                            this.setState({phoneNumber},this.toggleSubmitButton);       
                      }                  
              }/>
            </View>            
            <Text style={styles.descriptiveText}>Password*</Text>
            <View style={styles.inputBox}>
              <TextInput secureTextEntry={this.state.hidePassword} 
                        style={styles.inputField}
                        value={this.state.password}
                        autoCapitalize='none'
                        onChangeText={
                          (password) =>{
                            this.setState({password},this.toggleSubmitButton)                                       
                          }                  
                        }                                                                
            />
            <MaterialCommunityIcons 
                    name={this.state.hidePassword ? 'eye' : 'eye-off'} 
                    style={styles.eye}
                    size={24}
                    onPress={this.toggleHidePassword}
              />
              </View>
            {!this.validatePass() && <Text style={styles.descriptiveText}>Password needs at least 7 characters</Text>}
            <Text style={styles.descriptiveText}>Repeat Password*</Text>
            <View style={styles.inputBox}>
              <TextInput  autoCapitalize='none'
                          secureTextEntry={this.state.hidePassword} 
                          style={styles.inputField}
                          value={this.state.repeatPassword}
                          onChangeText={(repeatPassword) => {
                            this.setState({repeatPassword}, this.toggleSubmitButton)                          
                          }                        
                        }                      
              />
            </View>
            {this.state.showWrongPasswords && <Text style={styles.error}> Passwords do not match</Text>}
            <Text style={styles.descriptiveText}>Full Name</Text>
            <View style={styles.inputBox}>
            <TextInput autoComplete={'name'} style={styles.inputField}
                        value={this.state.fullName}
                        onChangeText={(fullName) => this.setState({fullName})}
                        />
            </View>
            <Text style={styles.descriptiveText}>E-mail</Text>
            
            <View style={styles.inputBox}>
              <TextInput inputMode='email' autoComplete={'email'} style={styles.inputField}
                          value={this.state.email}
                          onChangeText={(email) => this.setState({email})}
            />
            </View>
            <View style={styles.separator}/>
            <Pressable style={this.state.submitActive ? styles.button : styles.disabledButton } 
                    onPress={(this.state.submitActive && !this.state.creatingUser) ? () =>{                                             
                      this.setState({creatingUser: true });                                                             
                      user.create(this.state.phoneNumber, this.state.password, this.createAccount)                                                            
                    } : () => {}}>
                      <Text style={styles.buttonText}> Create account </Text>
            </Pressable>
            </ImageBackground>            
          </View>
        );
      }
}