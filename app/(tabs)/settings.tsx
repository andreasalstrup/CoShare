import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import AreYouSureModal from '../../components/AreYouSureModal';
import { router } from 'expo-router';
import { userHandle } from '../../handlers/user';
import { groupHandle } from '../../handlers/group';

export default function SettingsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useRef(userHandle(gun));
  const group = useRef(groupHandle(gun));
  const toggleModal = () => setIsModalVisible(() => !isModalVisible);

  function leaveGroup () : void {
    group.current.leave()
    router.replace('/group')
  }

  function logout () : void {
    user.current.logout()
    router.replace('/login')
  }
  
  return (
    <View>
      <View>
        <Pressable style={styles.listButton}>
          <Text style={styles.accountSettingsText}>Account Settings</Text>
        </Pressable>
        <Pressable style={styles.listButton} onPress={toggleModal}>
          <Text style={styles.leaveGroupText}>Leave Group</Text>
          <FontAwesome5
            name="sign-out-alt" 
            size={20} 
            color={'red'}
          />
        </Pressable>
      </View>
      <AreYouSureModal
        title='Leave Group'
        text='Are you sure you want to leave the group?'
        isVisible={isModalVisible}
        onBackdropPress={() => {
          toggleModal()
        }}
        onYes={() =>{
          leaveGroup()
          toggleModal()
        }}
        onNo={() =>{
          toggleModal()
        }}/>
        <Pressable style={styles.listButton} onPress={logout}>
          <Text style={styles.leaveGroupText}>Logout</Text>          
        </Pressable>        
    </View>
  );
}

const styles = StyleSheet.create({
  listButton: {
    padding: 12,
    justifyContent: 'space-between',
    alignContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  leaveGroupText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red'
  },
  accountSettingsText: {
    fontSize: 16,
  },
});
