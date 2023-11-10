import 'gun-asyncstorage';
import "gun/lib/mobile";
// import 'expo-crypto';
import 'react-native-webview-crypto'
import 'react-native-get-random-values'
//import "isomorphic-webcrypto"; Could replace react native webview crypto if there are any problems with it
import Gun from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
const asyncsStore = require('gun/lib/ras.js')

const useGun = () => {
//rad asyncstorage adapter, on Android asyncstorage has 6mb limit by default

const asyncStore = asyncsStore({AsyncStorage});

let gun = Gun({
  peers: ['https://gun-manhattan.herokuapp.com/gun'],
  store: asyncStore,
  radisk: true,
  localStorage: false,
});
const app = gun.get("test"); // This is legacy
const user = gun.user()

const testUser = user.create("testuser123","password",() => {console.log(testUser)})
const pair = SEA.pair()
console.log(pair)
return { gun, app, user, SEA}
}

export default useGun;