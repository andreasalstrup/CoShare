import styles from './styles'
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { Button, ImageBackground, Image, Pressable } from 'react-native';
import { Component } from 'react';
import { Redirect, Link, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogoAndName } from '../../components/LogoAndName';

type Props = {
  text: any
}

type State = {
  phoneNumber: string
  password: string,
  wrongCredentials: boolean,  
  hidePassword: boolean,
  authing: boolean
}

export default class loginScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      phoneNumber: '',
      password: '',
      wrongCredentials: false,   
      hidePassword: true,   
      authing: false,
    };
  }

  

  componentDidMount(): void {   
    const gun = global.gun
    const SEA = global.SEA
    const user = global.user    
  }
  
  toggleHidePassword = () => {
    this.setState({hidePassword:!this.state.hidePassword})    
  }

  checkSuccesfulLogin = (ack: any) => {
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
        this.setState({wrongCredentials: true, authing: false});        
    }
  }
  render() {
    return (         
      <View style={styles.container}>      
      <ImageBackground source={require('../../assets/images/accountScreensImage.png')} style={styles.backgroundImage}>     
        <LogoAndName/>
        <Text style={styles.descriptiveText}>Phone Number</Text>      
        <View style={styles.inputBox}>
          <TextInput maxLength={8} inputMode='tel' autoComplete={'tel'} style={styles.inputField}
                        value={this.state.phoneNumber}
                        onChangeText={(phoneNumber) =>{                      
                        this.setState({phoneNumber});
                      }                  
              }
            />
          </View>                      
        <Text style={styles.descriptiveText}>Password</Text>
        <View style={styles.inputBox}>
          <TextInput secureTextEntry={this.state.hidePassword} style={styles.inputField}
                    autoCapitalize='none'
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}
                    />
                    
          <MaterialCommunityIcons 
                    name={this.state.hidePassword ? 'eye' : 'eye-off'}                   
                    style={styles.eye}
                    size={24}
                    onPress={this.toggleHidePassword}
              />
        </View>
        {this.state.wrongCredentials && <Text style={styles.error}> Wrong credentials</Text>}
        <View style={styles.separator}/>
        
        <Pressable 
          style={styles.button} 
          onPress={()=>{   
            if (!this.state.authing){
              this.setState({authing: true})
              user.auth(this.state.phoneNumber, this.state.password, this.checkSuccesfulLogin)                       
            }
          }}>
            <Text style={styles.buttonText}> Sign in</Text>
        </Pressable>                    
        <Text style={styles.descriptiveText}><Link href={"/CreateAccountScreen"}> Create new account</Link></Text>        
      </ImageBackground>
      
      </View>
    );
  }
}
