import { useState, useRef } from "react"
import { View, Text, Pressable, TextInput } from "react-native"
import styles from "../styles"
import { groupHandle } from '../../../handlers/group';
import { router } from "expo-router";

export default function getCreateComponent(){
    const group = useRef(groupHandle(gun));
    const [groupName, setGroupName] = useState("")
    const [processing, setProcessing] = useState(false)

    function redirect() {
        router.replace('/shoppingList')
    }
    function createNewGroup(groupName : string){
        if (groupName != ""){
            group.current.create(groupName, redirect)            
        }else {
            setProcessing(false)
        }
    }
    return (
        // <View>
        <>
          <View style={{alignItems:"center"}}><Text style={styles.explainerText}> What is the name of your new group?</Text></View>
          <Text style={styles.descriptiveText}>Group name</Text>
          <View style={styles.inputBox}>
          <TextInput style={styles.inputField} value={groupName} onChangeText={(groupName) =>{setGroupName(groupName)}}/>
          </View>
          <Pressable style={styles.button}onPress={() => {
            if (!processing){
                createNewGroup(groupName)
                setProcessing(true)
            }
            }
        }><Text style={styles.descriptiveText}>Create new group</Text></Pressable>
        
        {/* </View> */}
        </>
    )
  }
