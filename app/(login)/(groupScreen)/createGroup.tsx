import { useState, useRef } from "react"
import { View, Text, Pressable, TextInput } from "react-native"
import styles from "../styles"
import { groupHandle } from '../../../handlers/group';
import { router } from "expo-router";

export default function getCreateComponent(){
    const group = useRef(groupHandle(gun));
    const [groupName, setGroupName] = useState("")
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(false)

    function createNewGroup(groupName : string){
        if (groupName != ""){
            group.current.create(groupName, () => {router.replace('/shoppingList')})         
        }else {
            setError(true)
            setProcessing(false)
        }
    }

    return (        
        <>
          <View style={{alignItems:"center"}}><Text style={styles.explainerText}>What is the name of your new group?</Text></View>
          <Text style={styles.descriptiveText}>Group name</Text>
          <View style={styles.inputBox}>
          <TextInput style={styles.inputField} value={groupName} onChangeText={(groupName) =>{setGroupName(groupName)}}/>
          </View>
          <Pressable style={styles.button}onPress={() => {
            if (!processing){
                setProcessing(true)
                createNewGroup(groupName)
            }
          }
        }><Text style={styles.descriptiveText}>Create new group</Text></Pressable>
        {error && <Text style={styles.error}>A group must have a name</Text>}
        </>
    )
  }
