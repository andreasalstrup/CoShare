import '@testing-library/react-native/extend-expect';
import 'react-native-get-random-values'
const { Crypto } = require("@peculiar/webcrypto");
const cryptoModule = new Crypto();
// cryptoModule.getRandomValues = crypto.getRandomValues//function (input) {throw new Error("This my function")}
Object.defineProperty(window, 'crypto', {
  get(){
    return cryptoModule
  }
})
global.userPub = ""

let a : Int16Array = new Int16Array([1,2,3,4,5])
console.log(window.crypto)
window.crypto.getRandomValues(a)

// window.crypto.getRandomValues(a)
console.log(a)
window.crypto.subtle
        .generateKey(
          {
            name: "ECDSA",
            namedCurve: "P-256" //can be "P-256", "P-384", or "P-521"
          },
          true, //whether the key is extractable (i.e. can be used in exportKey)
          ["sign", "verify"] //can be any combination of "sign" and "verify"
        )
        .then(function(key) {
          //returns a keypair object
          console.log(key);
          console.log(key.publicKey);
          console.log(key.privateKey);
        })
        .catch(function(err) {
          console.error(err);
        });