import { useState } from "react"
import { View, Text, Pressable, TextInput } from "react-native"
import styles from "../styles"
import {randomUUID} from 'expo-crypto';

export default function getCreateComponent(){
    const [groupName, setGroupName] = useState("")

    function createNewGroup(groupName : string){
        if (true){ // Some val
            let user = gun.user(userPub)
            let groupId : string = randomUUID();     
            gun.get("groups").set({name: groupName, id: groupId }).get("members").set({userPub})
            user.get("group").put({name: groupName, id: groupId})
        }
    }
    return (
        <>
          <Text style={styles.descriptiveText}>Group name</Text>
          <View style={styles.inputBox}>
          <TextInput style={styles.inputField} value={groupName} onChangeText={(groupName) =>{setGroupName(groupName)}}/>
          <Pressable onPress={() => createNewGroup(groupName)}><Text style={styles.descriptiveText}>Create new group</Text></Pressable>
          </View>
        </>
    )
  }
