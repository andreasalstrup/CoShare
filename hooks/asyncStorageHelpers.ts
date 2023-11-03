import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getObject = async (key : string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

export const storeObject = async (key : string, value : any) => {
try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
} catch (e) {
    // saving error
}
};
