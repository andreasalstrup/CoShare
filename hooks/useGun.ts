import 'react-native-get-random-values'
import WebviewCrypto from 'react-native-webview-crypto'

import "gun/lib/mobile";
import Gun from "gun/gun";
import SEA from "gun/sea";
import not from "gun/lib/not.js"
const useGun = () => {
	const gun = Gun("https://gun-manhattan.herokuapp.com/gun");
	const app = gun.get("test");
	const user = gun.user();
	console.log("Use gun called 2")
	console.log(app.get("paste"))	
	return { gun, app, user, SEA, not}
};

export default useGun;