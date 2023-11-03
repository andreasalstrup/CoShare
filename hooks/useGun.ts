import 'react-native-crypto'
import WebviewCrypto from 'react-native-webview-crypto'
import 'react-native-get-random-values'
import "gun/lib/mobile";
import Gun from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import {getObject, storeObject} from './asyncStorageHelpers';

import AsyncStorage from '@react-native-async-storage/async-storage';
const asyncsStore = require('gun/lib/ras.js')

const useGun = () => {
//rad asyncstorage adapter, on Android asyncstorage has 6mb limit by default
// console.log("useGun Hook called")
const asyncStore = asyncsStore({AsyncStorage});

let gun = Gun({
  peers: ['https://mvp-gun.herokuapp.com/gun'],
  store: asyncStore,
  radisk: true,
  localStorage: false,
  file: '../gunDB.json',
});
const app = gun.get("test");
const user = gun.user()
// console.log("useGun Hook completed")
// console.log('useGun GUN' + gun)
return { gun, app, user, SEA}
}

export default useGun;