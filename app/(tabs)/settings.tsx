import { Pressable, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import { Text, View } from '../../components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const leaveGroup = () => {
    //Remove from GUN group here
  }

  const renderButton = (text: 'Yes' | 'No') => {
    return (
      <Pressable style={[styles.button, { backgroundColor: text === 'Yes' ? '#5CBCA9' : '#E35F52' }]} onPress={() => {
        if (text === 'Yes')
        {
          leaveGroup()
        }
        handleModal()
      }}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable> 
    );
  };

  return (
    <View>
      <View>
        <Pressable style={styles.listButton}>
          <Text style={styles.accountSettingsText}>Account Settings</Text>
        </Pressable>
        <Pressable style={styles.listButton} onPress={handleModal}>
          <Text style={styles.leaveGroupText}>Leave Group</Text>
          <FontAwesome5
            name="sign-out-alt" 
            size={20} 
            color={'red'}
          />
        </Pressable>
      </View>
      <Modal
        animationIn='zoomIn' 
        animationOut='zoomOut' 
        isVisible={isModalVisible} 
        onBackdropPress={handleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitleText}>Leave Group</Text>
            <Text style={styles.modalContentText}>Are you sure you want to leave the group?</Text>
            <View style={styles.buttonContainer}>
              {renderButton('Yes')}
              {renderButton('No')}
            </View>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
  },
  modalTitleText: {
    fontSize: 30,
  },
  modalContentText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    elevation: 3,
    width: "40%",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});
