import { useState, useRef } from "react"
import { View, Text, Pressable, TextInput } from "react-native"
import styles from "../styles"
import { groupHandle } from '../../../handlers/group';
import { router } from "expo-router";

export default function getCreateComponent(){
    const group = useRef(groupHandle(gun));
    const [uuid, setUuid] = useState("");
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(false)

    function joinGroup(groupName : string){        
          group.current.join(groupName, (ack: Boolean) => {
               if (ack){                          
                    router.replace('/shoppingList')
               } else{
                    setError(true)
                    setProcessing(false)
               }
          })     
    }

    return (
        <>
          <View style={{alignItems:"center"}}><Text style={styles.explainerText}> Join a group by typing its unique id </Text></View>
          <Text style={styles.descriptiveText}>Group id</Text>
          <View style={styles.inputBox}>
          <TextInput style={styles.inputField} autoCapitalize='none' value={uuid} onChangeText={(uuid) =>{setUuid(uuid)}}/>
          </View>
          <Pressable style={styles.button} onPress={() => {
               if (!processing){
                    setProcessing(true)
                    joinGroup(uuid)                    
               }
          }}>     
          <Text style={styles.descriptiveText}>Join group</Text></Pressable>
          {error && <Text style={styles.error}>Wrong id</Text>}
          <View style={{height:10}}/>
        </>
    )
  }
