import styles from './styles'
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Component } from 'react';
import useGun from '../../hooks/useGun';
import { Redirect, Link } from 'expo-router';
import { router } from 'expo-router';

const { gun, app, user, SEA} = useGun();

type Props = {
  text: any
}

type State = {
  phoneNumber: string
  password: string,
  wrongCredentials: Boolean,
}

export default class loginScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      phoneNumber: '',
      password: '',
      wrongCredentials: false,
    };
  }

  componentDidMount(): void {
    app.on((data: any) => {
      console.log('data', data);      
    });
  }
  
  checkSuccesfulLogin = (ack: any) => {
    console.log(ack)    
    if (!ack.err){            
        if (user.is){
            let newUser = gun.user(ack.pub)
            let inGroup = true            
            // console.log((newUser.get("monkas").map())
            
            newUser.get("group", function(ack: any){
              if(ack.err){
                console.log("its all wrong brother")
              } else
              if(!ack.put){
                console.log("Group not found")
                inGroup = false
                // not found
              } else {
                console.log("Group found")
                // data!
              }
            })

            if (inGroup){                
                console.log("Redirect to ShoppingListScreen")
                router.replace('../(tabs)/ShoppingListScreen')
            }else{              
                console.log("Redirect to GroupScreen")
                router.replace('/GroupScreen')          
            }
        }else{
            console.log("User somehow doesn't exist");
        }
    }else{     
        this.setState({wrongCredentials: true});
    }
  }

  render() {
    return (          
      <View style={styles.container}>
        <Text style={styles.descriptiveText}>Phone Number</Text>
        <TextInput style={styles.inputField}
                   value={this.state.phoneNumber} 
                   onChangeText={(phoneNumber) => this.setState({phoneNumber})}                   
                   />
        <Text style={styles.descriptiveText}>Password</Text>
        <TextInput secureTextEntry={true} style={styles.inputField}
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}
                    />        
        <Button title='Login' 
                onPress={()=>{
                  console.log(gun.get("hello"))
                  user.auth(this.state.phoneNumber, this.state.password, this.checkSuccesfulLogin)
                  user.create(this.state.phoneNumber, this.state.password, this.checkSuccesfulLogin)
                  gun.get("test")
                }}/>
        {this.state.wrongCredentials && <Text style={styles.error}> Wrong phone number or password</Text>}
        <Text><Link href={"/CreateAccountScreen"}> Create new account</Link></Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />    
        <EditScreenInfo path="app/index.tsx" />
      </View>
    );
  }
}


