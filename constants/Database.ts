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


let a : Int16Array = new Int16Array([1,2,3,4,5])
crypto.getRandomValues(a)
console.log(a)

//rad asyncstorage adapter, on Android asyncstorage has 6mb limit by default
const asyncStore = asyncsStore({AsyncStorage});
let gun = Gun({
peers: ['http://130.225.39.205:8080/gun'],
store: asyncStore,
radisk: true,
localStorage: true,
file: 'db/data.json',
});

declare global {
    var gun : IGunInstance<any>;
    var user :IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>;
    var SEA : ISEA;
    var userPub : string;
}
global.gun = gun
global.SEA = SEA
global.userPub = ""