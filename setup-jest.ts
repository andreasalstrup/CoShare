import '@testing-library/react-native/extend-expect';
import 'react-native-get-random-values'
const { Crypto } = require("@peculiar/webcrypto");
const cryptoModule = new Crypto();
Object.defineProperty(window, 'crypto', {
  get(){
    return cryptoModule
  }
})
global.userPub = ""