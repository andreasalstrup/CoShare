import 'react-native-get-random-values'
import 'react-native-webview-crypto';
import "gun/lib/mobile";
import Gun from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IGunInstance, IGunInstanceRoot, IGunUserInstance, ISEA } from 'gun/types';
const asyncsStore = require('gun/lib/ras.js')


console.log("Constanting gun")
//rad asyncstorage adapter, on Android asyncstorage has 6mb limit by default
const asyncStore = asyncsStore({AsyncStorage});
let gun = Gun({
peers: ['https://gun-manhattan.herokuapp.com/gun'],
store: asyncStore,
radisk: true,
localStorage: false,
});

declare global {    
    var gun : IGunInstance<any>;
    var user :IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>;
    var SEA : ISEA;
}
global.gun = gun
global.user = gun.user()
global.SEA = SEA


