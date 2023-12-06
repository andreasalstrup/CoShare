import { useState, useRef } from "react"
import { View, Text, Pressable, TextInput } from "react-native"
import styles from "../styles"
import { groupHandle } from '../../../handlers/group';
import { router } from "expo-router";

export default function getCreateComponent(){
    const group = useRef(groupHandle(gun));
    const [uuid, setUuid] = useState("");
    const [processing, setProcessing] = useState(false)

    function redirect(ack: Boolean){
          if (ack){
               router.replace('../../shoppingList')
          } else{
               setProcessing(false)
          }
    }
    function joinGroup(groupName : string){
        if (true){ // Some val
            group.current.join(groupName, redirect)
        }
    }
    return (
        <>
          <Text style={styles.descriptiveText}> Join a group by typing its unique id </Text>
          <Text style={styles.descriptiveText}>Group id</Text>
          <View style={styles.inputBox}>
          <TextInput style={styles.inputField} value={uuid} onChangeText={(uuid) =>{setUuid(uuid)}}/>
          </View>          
          <Pressable onPress={() => {
               if (!processing){
                    joinGroup(uuid)
                    setProcessing(true)
               }
          }}>     
          <Text style={styles.descriptiveText}>Join group</Text></Pressable>
          <View style={{height:10}}/>
        </>
    )
  }
