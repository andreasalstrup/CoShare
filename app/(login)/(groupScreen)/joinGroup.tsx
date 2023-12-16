import { useState, useRef, useEffect } from "react"
import { View, Text, Pressable, TextInput } from "react-native"
import styles from "../styles"
import { groupHandle } from '../../../handlers/group';
import { router } from "expo-router";
import Modal from "react-native-modal";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AntDesign } from "@expo/vector-icons";

export default function getCreateComponent(){
    const group = useRef(groupHandle(gun));
    const [uuid, setUuid] = useState("");
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(false)

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

     useEffect(() => {
          const getBarCodeScannerPermissions = async () => {
          const { granted } = await BarCodeScanner.requestPermissionsAsync();
               setHasPermission(granted);
          };
     
          getBarCodeScannerPermissions();
     }, []);

     const handleBarCodeScanned = ({ type, data }: { type: string, data: string }): void => {
          setUuid(data)
          setIsModalVisible(false)
     };

    function joinGroup(groupId : string){        
          group.current.join(groupId, (ack: Boolean) => {
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
               {hasPermission && <Pressable
                    style={styles.qrCodeIcon}
                    onPress={()=>{
                         setIsModalVisible(true)
                    }}>
                    <AntDesign
                         name="qrcode" 
                         size={26} 
                         color={'gray'}/>
              </Pressable>}
          </View>
          <Pressable style={styles.button} onPress={() => {
               if (!processing){
                    setProcessing(true)
                    joinGroup(uuid)                    
               }
          }}>     
          <Text style={styles.descriptiveText}>Join group</Text></Pressable>
          {error && <Text style={styles.error}>Wrong id</Text>}
          
          <Modal
               animationIn='zoomIn'
               animationOut='zoomOut'
               isVisible={isModalVisible}
               onBackdropPress={() => setIsModalVisible(false)}>
               <View style={styles.modalContainer}>
                    <BarCodeScanner
                              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                              onBarCodeScanned={handleBarCodeScanned}
                              style={{flex:1}}/>
               </View>
          </Modal>
        </>
    )
  }
