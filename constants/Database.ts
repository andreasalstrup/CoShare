import 'react-native-get-random-values'
import "gun/lib/mobile";
import Gun from 'gun/gun';
import SEA from 'gun/sea';
import 'gun/lib/radix.js';
import 'gun/lib/radisk.js';
import 'gun/lib/store.js';
import 'gun/lib/open.js'
import 'gun/lib/load.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IGunInstance, IGunInstanceRoot, IGunUserInstance, ISEA } from 'gun/types';
const asyncsStore = require('gun/lib/ras.js')

AsyncStorage.clear()

//rad asyncstorage adapter, on Android asyncstorage has 6mb limit by default
const asyncStore = asyncsStore({AsyncStorage});
let gun = Gun({
// peers: ['http://130.225.39.205:8080/gun'],
store: asyncStore,
radisk: true,
localStorage: false,
});


declare global {
    var gun : IGunInstance<any>;
    var SEA : ISEA;
    var userPub : string;
}
gun.user().create("12345678","12345678",(ack : any)=>{gun.user('~' + ack.pub).get("fullName").put("myName")})
global.gun = gun
global.SEA = SEA
global.userPub = ""