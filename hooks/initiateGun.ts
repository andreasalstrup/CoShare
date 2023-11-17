import 'react-native-get-random-values'
import 'react-native-webview-crypto';
import "gun/lib/mobile";
import Gun from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
const asyncsStore = require('gun/lib/ras.js')

const initiateGun = () => {
  console.log("Initting gun")
  //rad asyncstorage adapter, on Android asyncstorage has 6mb limit by default
  const asyncStore = asyncsStore({AsyncStorage});
  // console.log(crypto.pair())
  let gun = Gun({
    peers: ['https://gun-manhattan.herokuapp.com/gun'],
    store: asyncStore,
    radisk: true,
    localStorage: false,
  });


  // For testing 
  AsyncStorage.clear()
  const user = gun.user()
  return { gun, user, SEA}
}
export default initiateGun;



// /////////////////////////////////// Setup for sqlite if needed


// // import React, { useEffect, useState } from 'react';
// // import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
// // import Constants from 'expo-constants';
// // import * as SQLite from 'expo-sqlite';
// // import { registerRootComponent } from 'expo';
// // import 'gun/lib/mobile'; // most important!
// // import Gun from 'gun/gun';
// // import SEA from 'gun/sea';
// // import 'gun/lib/promise';
// // import 'gun/lib/radix';
// // import 'gun/lib/radisk';
// // import 'gun/lib/store';
// // import { makeStoreAdapter } from '@altrx/gundb-expo-sqlite-adapter';


// // const useGun = () => {
// //   makeStoreAdapter(Gun);
// //   const gun = new Gun({
// //     localStorage: false,
// //     radisk: true,
// //     sqlite: {
// //       SQLite,
// //       databaseName: 'todo.db',
// //       onOpen: () => {
// //         console.log('DB OPENED');
// //       },
// //       onError: (err : any) => {
// //         console.log('ERROR');
// //       },
// //       onReady: (err : any) => {
// //         console.log('READY');
// //       },
// //     },
// //   });
// //   const app = gun.get('hello');
// //   const user = gun.user()
// //   console.log("Using gun")
// //   return { gun, app, user, SEA}
// // }
// // export default useGun;
