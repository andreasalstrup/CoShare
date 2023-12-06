import { View, Text, Pressable, TextInput } from "react-native"
import styles from "../styles"
import { router } from "expo-router"
import GroupScreen from "./group"

export default function getBluetoothComponent() {
    return (
        <View>
            <Text> Bluetooth placeholder </Text>
            <Pressable onPress={() => router.replace("./group")}><Text style={styles.descriptiveText}>Go back</Text></Pressable>
        </View>
    )
  }