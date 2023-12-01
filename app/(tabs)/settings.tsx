import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import AreYouSureModal from '../../components/AreYouSureModal';

export default function SettingsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const toggleModal = () => setIsModalVisible(() => !isModalVisible);

  const leaveGroup = () => {
    //Remove from GUN group here
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
