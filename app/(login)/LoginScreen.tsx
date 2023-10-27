import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View, } from '../../components/Themed';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native';
import { Component } from 'react';
// import { Password } from 'primereact/password';
import useGun from '../../hooks/useGun';
import { Redirect } from 'expo-router';
import { router } from 'expo-router';
const { gun, app, user, SEA } = useGun();

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
    if (!ack.err){            
        if (user.is){
            let newUser = gun.user(ack.pub)
            let group = newUser.get("group").map()            
            if (group){
                console.log("Redirect to ShoppingListScreen")
                router.replace('../(tabs)/ShoppingListScreen')
            }else{
                console.log("Redirect to ShoppingListScreen")
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
        <Text style={styles.title}>Login</Text>
        <TextInput style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1, color: "white"}}
                   value={this.state.phoneNumber} 
                   placeholder='Phone number'
                   onChangeText={(phoneNumber) => this.setState({phoneNumber})}                   
                   />
        <TextInput secureTextEntry={true} style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1, color: "white"}}
                    value={this.state.password}
                    placeholder='Password'
                    onChangeText={(password) => this.setState({password})}
                    />        
        <Button title='Login' 
                onPress={()=>{
                user.auth(this.state.phoneNumber, this.state.password, this.checkSuccesfulLogin)                              
                }}/>
        {this.state.wrongCredentials && <Text style={styles.error}> Wrong phone number or password</Text>}
        <link href="(/CreateAccountScreen"> Create account </link>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />    
        <EditScreenInfo path="app/index.tsx" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
