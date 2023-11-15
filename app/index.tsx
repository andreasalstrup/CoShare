import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

import WebviewCrypto from 'react-native-webview-crypto';
import { registerRootComponent } from 'expo';

import 'gun/lib/mobile'; // most important!
import Gun from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/promise';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import { makeStoreAdapter } from '@altrx/gundb-expo-sqlite-adapter';

makeStoreAdapter(Gun);
const gun = new Gun({
  localStorage: false,
  radisk: true,
  sqlite: {
    SQLite,
    databaseName: 'todo.db',
    onOpen: () => {
      console.log('DB OPENED');
    },
    onError: (err : any) => {
      console.log('ERROR');
    },
    onReady: (err : any) => {
      console.log('READY');
    },
  },
});

const node = gun.get('hello');

export default function App() {
  const [name, setName] = useState('');

  useEffect(() => {
    node.once((data, key) => {
      let name = data?.name;
      setName(name);
    });

    async function doWork() {
      const workTest = await SEA.work('test', null, null, {
        name: 'SHA-256',
        encode: 'hex',
      });
      console.log(workTest);
      const pair = await SEA.pair();
      const other = await SEA.pair();
      const msg = await SEA.sign('I wrote this message! You did not.', pair);
      const test = await SEA.verify(msg, pair.pub); // message gets printed
      const test2 = await SEA.verify(msg, other.pub); // error
      console.log('No message', test2);
      console.log('Message', test);

      gun.on('auth', () => {
        console.log('authenticated with keypair');
      });

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
      console.log("success")
      const namespace = gun.user();
      namespace.auth(pair);
    }
    doWork();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Hello {name}</Text>
      <WebviewCrypto />
      <View style={styles.flexRow}>
        <TextInput
          value={name}
          onChangeText={(value) => setName(value)}
          style={styles.input}
        />
      </View>
      <Button
        title="Save"
        onPress={() => {
          node.put({ name });
          setName(name);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  input: {
    borderColor: '#4630eb',
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
});

registerRootComponent(App);



























// import { StyleSheet } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';
// import { Button } from 'react-native';
// import { Component, useCallback } from 'react';
// import { useRootNavigationState, Redirect, router } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import useGun from '../hooks/useGun';
// const { gun, app, user, SEA } = useGun();
// import AsyncStorage from '@react-native-async-storage/async-storage';
// AsyncStorage.clear();
// SplashScreen.preventAutoHideAsync();

// export default class RedirectBasedOnLoginState extends Component<{}, {}> {
  
  
//   componentDidMount(): void {
//     // app.on((data: any) => {
//     //   console.log('data', data);
//     //   this.setState({paste: data.paste});
//     // });
//     // console.log("Authing")
//     // user.auth('testussser123','password',(ack) => (console.log(ack)))
//   }
  
//   render() {
//     //return <Redirect href='/(login)/CreateAccountScreen'/>
//     return <Redirect href='/(login)/LoginScreen'/>
//   }
//   // //If logged in go to normal tab screen
//   // const rootNavigationState = useRootNavigationState();
//   // console.log("This is the index file")
//   // if (!rootNavigationState?.key){
//   //   console.log("nope")
//   //   setTimeout(() => {
//   //     router.replace('/(login)/LoginScreen');
//   //   }, 5)
//   // }else{
//   //   router.replace('/(login)/LoginScreen')
//   // }
// }




// // import { StyleSheet } from 'react-native';

// // import EditScreenInfo from '../components/EditScreenInfo';
// // import { Text, View, } from '../components/Themed';
// // import { TextInput } from 'react-native-gesture-handler';
// // import { Button } from 'react-native';
// // import { Component } from 'react';

// // import useGun from '../hooks/useGun';
// // const { gun, app, user, SEA } = useGun();

// // type Props = {
// //   text: any
// // }

// // type State = {
// //   text: string
// //   name: string,
// //   paste: string
// // }

// // export default class TabOneScreen extends Component<Props, State> {
// //   constructor(props: Props) {
// //     super(props);
// //     this.state = {
// //       text: 'Whats your name?',
// //       name: '',
// //       paste: '',
// //     };
// //   }

// //   $user = user.create('test', 'testtest', (ack) => {console.log(ack)})

// //   componentDidMount(): void {
// //     this.$user;
// //     app.on((data: any) => {
// //       console.log('data', data);
// //       this.setState({paste: data.paste});
// //     });
// //     console.log("Authing")
// //     user.auth('test','testest',(ack) => (console.log(ack)))
// //   }

// //   render() {
// //     return (
// //       <View style={styles.container}>
// //         <Text style={styles.title}>Tab One</Text>
// //         <Text style={styles.title}>{this.state.paste}</Text>
// //         <Text style={styles.title}>Hello {this.state.name}</Text>
// //         <TextInput style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1, color: "white"}}
// //                    value={this.state.text} 
// //                    onChangeText={(text) => this.setState({text})}/>
// //         <Button title='Update' 
// //                 onPress={()=>{
// //                 app.put({paste:this.state.paste + "\n" + this.state.text})
// //                 this.setState({text:''})
// //                 }}/>
// //         <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
// //         <EditScreenInfo path="app/(tabs)/index.tsx" />
// //       </View>
// //     );
// //   }
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //   },
// //   separator: {
// //     marginVertical: 30,
// //     height: 1,
// //     width: '80%',
// //   },
// // });