import styles from './styles'
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { Button, ImageBackground, Image, Pressable } from 'react-native';
import { Component } from 'react';
// import useGun from '../../hooks/useGun';
import { Redirect, Link } from 'expo-router';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogoAndName } from '../../components/LogoAndName';
import '../shims'
import crypto from 'isomorphic-webcrypto';
// import crypto from 'isomorphic-webcrypto';
// const { gun, app, user, SEA} = useGun();

type Props = {
  text: any
}

type State = {
  phoneNumber: string
  password: string,
  wrongCredentials: boolean,  
  hidePassword: boolean,
}

export default class loginScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      phoneNumber: '',
      password: '',
      wrongCredentials: false,   
      hidePassword: true,   
    };
  }
  getPair  = async () => {
    crypto.ensureSecure()
    
    console.log("Start of getPair")
    // console.log(crypto)
    // console.log(crypto.subtle)
    const hello = await crypto.subtle
        .generateKey( 
          {
            name: 'ECDSA',
            namedCurve: 'P-256', //can be "P-256", "P-384", or "P-521"
          },
          true, //whether the key is extractable (i.e. can be used in exportKey)
          ['sign', 'verify'], //can be any combination of "sign" and "verify"
        )
        .then(function(key : any) {
          //returns a keypair object
          console.log(key);
          console.log(key.publicKey);
          console.log(key.privateKey);
        })
        .catch(function(err: any) {
          console.error(err);
        });
    console.log("hello")
    console.log("gettingPair")
  }

  componentDidMount(): void {   
    // console.log("hej" + user)
    this.getPair()
  }
  
  toggleHidePassword = () => {
    this.setState({hidePassword:!this.state.hidePassword})    
  }

//   checkSuccesfulLogin = (ack: any) => {
//     console.log('Login ack: ')    
//     console.log(ack)
//     if (!ack.err){            
//         if (user.is){
//             let newUser = gun.user(ack.pub)
//             let inGroup = true                        
//             newUser.get("group", function(ack: any){
//               if(ack.err){
//                 console.log("its all wrong brother")
//               } else
//               if(!ack.put){
//                 console.log("Group not found")
//                 inGroup = false
//                 not found
//               } else {
//                 console.log("Group found")
//                 data!
//               }
//             })

//             if (inGroup){                
//                 console.log("Redirect to ShoppingListScreen")
//                 router.replace('../(tabs)/ShoppingListScreen')
//             }else{              
//                 console.log("Redirect to GroupScreen")
//                 router.replace('/GroupScreen')          
//             }
//         }else{
//             console.log("User somehow doesn't exist");
//         }
//     }else{     
//         this.setState({wrongCredentials: true});
//     }
//   }
  
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
            // user.auth(this.state.phoneNumber, this.state.password, this.checkSuccesfulLogin)                                  
          }}>
            <Text style={styles.buttonText}> Sign in</Text>
        </Pressable>                    
        <Text style={styles.descriptiveText}><Link href={"/CreateAccountScreen"}> Create new account</Link></Text>        
      </ImageBackground>
      </View>
    );
  }
}
