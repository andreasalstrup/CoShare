import 'react-native-get-random-values'
import WebviewCrypto from 'react-native-webview-crypto'

import "gun/lib/mobile";
import Gun from "gun/gun";
import SEA from "gun/sea";

const useGun = () => {
	const gun = Gun("https://gun-manhattan.herokuapp.com/gun");
	const app = gun.get("test");
	const user = gun.user();
	return { gun, app, user, SEA}
};

export default useGun;