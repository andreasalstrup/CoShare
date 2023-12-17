import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, useColorScheme, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Text, View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import { groupHandle } from '../../handlers/group';
import { noticeHandle } from '../../handlers/notice';
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { QrCodeSvg } from 'react-native-qr-svg';

export default function NoticeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const group = useRef(groupHandle(gun));
  const notice = useRef(noticeHandle(gun));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [houseRules, setHouseRules] = useState('');
  const [groupId, setGroupId] = useState('')
  const [groupName, setGroupName] = useState('')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    group.current.getUUID((id) => setGroupId(id))
    group.current.getGName((name) => setGroupName(name))
    notice.current.onUsersUpdate((data: User) => { 
      setUsers(prev => {
        if(!prev.includes(data)){
          return [...prev, data]
        }
        return prev
      })
    })
    notice.current.onHouseRulesUpdate((rules) => setHouseRules(rules))
  }, [])
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: Colors[colorScheme].background}]}>
      <ScrollView>
        <View>
          <Text style={styles.title}>Household Rules</Text>
          <View style={styles.groupInfo}>
            <View>
              <Text>Group name: {groupName}</Text>
              <Text selectable={true}>ID: {groupId}</Text>
            </View>
            <View style={{flex: 1}}>
              <Pressable
                style={styles.qrCodeIcon}
                onPress={()=>{   
                  setIsModalVisible(true)
                }}>
                <AntDesign
                  name="qrcode" 
                  size={30} 
                  color={'gray'}/>
              </Pressable>
            </View>
          </View>
          <TextInput
            style={[styles.input, {color: Colors[colorScheme].text}]}
            placeholder="Click to make rules"
            placeholderTextColor={'gray'}
            value={houseRules}
            onChangeText={(text) => {
              notice.current.updateHouseRules(text)
              setHouseRules(text)
            }}
            editable
            multiline
          />
          <Text style={styles.title}>Contact Information</Text>
          {users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <Text style={styles.userName}>{user.fullName}</Text>
              <Text>Phone: {user.phoneNumber}</Text>
              <Text>Email: {user.email}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
        style={styles.modalContainer}
        animationIn='zoomIn'
        animationOut='zoomOut'
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}>
        <QrCodeSvg
            style={styles.modalContainer}
            value={groupId}
            frameSize={200}
            dotColor={Colors[colorScheme].text}
            backgroundColor={Colors[colorScheme].background}/>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    borderColor: 'gray',
    padding: 10,
    margin: 0,
    color: 'white',
    backgroundColor: '#5CBCA9',
    borderTopWidth: 1,
  },
  input: {
    maxHeight: '50%',
    borderColor: 'gray',
    padding: 10,
    margin: 0,
    borderTopWidth: 1,
  },
  userCard: {
    border: 1,
    borderColor: 'gray',
    backgroundColor: 'rgba(92, 188, 169, 0.27)',
    padding: 10,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupInfo: {
    flexDirection: 'row'
  },
  qrCodeIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
