// import Gun from "gun/gun";
// import SEA from 'gun/sea';
// import WebviewCrypto from 'react-native-webview-crypto';
// import { IGunInstance, IGunInstanceRoot, IGunUserInstance, ISEA } from 'gun/types';
// import { useRef, } from "react";
// import { userHandle } from "../../handlers/user";
// import { Text, View } from '../../components/Themed';
// import { render } from '@testing-library/react-native'
// import { WebView } from 'react-native-webview'

// const gun = Gun({
//     radisk: true,
//     localStorage: false,
// });

// type GunDB = {
//     gun: IGunInstance<any>,
//     user: IGunUserInstance<any, any, any, IGunInstanceRoot<any, IGunInstance<any>>>,
//     SEA: ISEA,
// }

// const GunDB: GunDB = {
//     gun: gun,
//     user: gun.user(),//Tror hverken vi vil have user eller SEA herfra
//     SEA: SEA,    
// }

// GunDB.gun.user().create = function (alias: string, password: string, callback : any ){
//     if (alias != "" && password.length > 7){
//         callback(true)
//     }else{
//         callback(false)
//     }
// } //We mock the create user function

// test('first GunDb test', (done) => {
//     // const handle = useRef(userHandle(GunDB.gun));
//     const hello = GunDB.gun.user()
//     function testCallback(ack : any) {
//         expect(ack).toBe(true);
//         // expect(ack.err).toBe(ack.err !== "Password too short!");
//         done()
//     }
//     GunDB.user.create('12345678', '12345678', testCallback);    
// })