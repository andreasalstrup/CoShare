import styles from './styles'
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Component } from 'react';
import useGun from '../../hooks/useGun';
import { Redirect } from 'expo-router';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { gun, app, user, SEA } = useGun();

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
        };
      }
    
      componentDidMount(): void {
        app.on((data: any) => {
          console.log('data', data);      
        });
      }          
      
      createAccount = (ack : any) => {
        console.log("Creating account")
        if (ack.err){
          if (ack.err == "User already created!"){
              this.setState({
                error: ack.error
              });
          }
          else{//The other possible error is:  "User is already being created or authenticated!" which probably means the user has clicked create user multiple times
            return
          }
        }
        else{
          console.log("about to use ack")
          console.log(typeof(ack))
          let newUser = gun.user(ack.pub)          
          let fullName = this.state.fullName
          let email = this.state.email
          console.log("Typeof newUser", typeof(newUser))
          newUser.get("PhoneNumber").put(this.state.phoneNumber)
          fullName && newUser.get('fullName').put(fullName)
          email && newUser.get('email').put(email)
          user.auth(this.state.phoneNumber,this.state.password,this.login)
        }
      }
      login = (ack : any) => {    
        console.log("Typeof ack", typeof(ack))
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
        return (pass.length > 6) //Multiple constraints can be placed on pass        
        }

      passwordsMatch = () => {
        let pass : string = this.state.password
        let repPass : string = this.state.repeatPassword
        let equal = pass == repPass
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
            {this.state.error != "" && <Text style={styles.error}> {this.state.error} </Text>}
            <Text style={styles.descriptiveText}>Phone Number*</Text>
            <TextInput maxLength={8} inputMode='tel' autoComplete={'tel'} style={styles.inputField}
                      value={this.state.phoneNumber}
                      onChangeText={(phoneNumber) =>{                      
                      this.setState({phoneNumber});       
                    }                  
            }          
            onEndEditing={() => this.toggleSubmitButton()}         
                      />
            <Text style={styles.descriptiveText}>Password*</Text>
            <View style={styles.passwordBox}>
              <TextInput secureTextEntry={this.state.hidePassword} 
                        style={styles.inputField}
                        value={this.state.password}
                        autoCapitalize='none'
                        onChangeText={
                          (password) =>{
                            this.setState({password})               
                          }                          
                        }
                        onEndEditing = {() => {
                          this.passwordsMatch()
                          this.toggleSubmitButton()
                        }      
                      }                               
            />
            <MaterialCommunityIcons 
                    name={this.state.hidePassword ? 'eye' : 'eye-off'} 
                    size={24} 
                    color="#aaa"
                    style={styles.eye} 
                    onPress={this.toggleHidePassword}
              />
              </View>
            {!this.validatePass() && <Text style={styles.descriptiveText}>Password needs to have at least 7 characters</Text>}
            <Text style={styles.descriptiveText}>Repeat Password*</Text>
            <TextInput  autoCapitalize='none'
                        secureTextEntry={this.state.hidePassword} 
                        style={styles.inputField}
                        value={this.state.repeatPassword}
                        onChangeText={(repeatPassword) => {
                          this.setState({repeatPassword})
                        }                        
                      }
                      onEndEditing = {() => {
                        this.passwordsMatch()
                        console.log("No more editing")
                        this.toggleSubmitButton()
                      }
                    }
            />
            {this.state.showWrongPasswords && <Text style={styles.error}> Passwords do not match</Text>}
            <Text style={styles.descriptiveText}>Full Name</Text>
            <TextInput autoComplete={'name'} style={styles.inputField}
                        value={this.state.fullName}
                        onChangeText={(fullName) => this.setState({fullName})}
                        />
            <Text style={styles.descriptiveText}>E-mail</Text>
            <TextInput inputMode='email' autoComplete={'email'} style={styles.inputField}
                        value={this.state.email}
                        onChangeText={(email) => this.setState({email})}
                        />
            <Button title='Login' 
                    disabled={!this.state.submitActive}
                    onPress={()=>{
                      console.log(this.state.phoneNumber)
                      console.log(this.state.password)                      
                      user.create(this.state.phoneNumber, this.state.password, this.createAccount)                       
                    }}/>
            
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />    
            <EditScreenInfo path="app/index.tsx" />
          </View>    
        );
      }
}