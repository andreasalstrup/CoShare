// import "gun/lib/mobile";
// import Gun from 'gun/gun';
// import SEA from 'gun/sea';
// import 'gun/lib/radix.js';
// import 'gun/lib/radisk.js';
// import 'gun/lib/store.js';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const asyncsStore = require('gun/lib/ras.js')

// const useGun = () => {
// //rad asyncstorage adapter, on Android asyncstorage has 6mb limit by default
// ////
// // console.log(crypto.subtle)
// // crypto.subtle
// //         .generateKey( 
// //           {
// //             name: 'ECDSA',
// //             namedCurve: 'P-256', //can be "P-256", "P-384", or "P-521"
// //           },
// //           true, //whether the key is extractable (i.e. can be used in exportKey)
// //           ['sign', 'verify'], //can be any combination of "sign" and "verify"
// //         )
// //         .then(function(key : any) {
// //           //returns a keypair object
// //           console.log(key);
// //           console.log(key.publicKey);
// //           console.log(key.privateKey);
// //         })
// //         .catch(function(err: any) {
// //           console.error(err);
// //         });
// ////




// // console.log(crypto.getRandomValues(new Uint32Array(1)))
// // SEA.pair(((ack) => {console.log("Paired")
// // console.log(ack)}))
// const asyncStore = asyncsStore({AsyncStorage});
// // console.log(crypto.pair())
// let gun = Gun({
//   peers: ['https://gun-manhattan.herokuapp.com/gun'],
//   store: asyncStore,
//   radisk: true,
//   localStorage: false,
// });

// // Does not do anything
// if (typeof Gun.SEA === 'undefined') {
//     Gun.SEA = SEA;
// }
// //
// const app = gun.get("test"); // This is legacy
// const user = gun.user()
// return { gun, app, user, SEA}
// }

// export default useGun;