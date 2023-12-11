import { Pressable, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Text, View, } from './Themed';

type AreYouSureProps =  {
  title: string,
  text: string,
  isVisible: boolean, 
  onBackdropPress?: () => void, 
  onYes?: () => void, 
  onNo?: () => void
};

const renderButton = (text: string, onPress?: () => void) => {
  return (
    <Pressable style={[styles.button, { backgroundColor: text === 'Yes' ? '#5CBCA9' : '#E35F52' }]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>   
  );
};

export default function AreYouSureModal(props: AreYouSureProps) {
  return (
    <View style={styles.container}>
      <Modal
        animationIn='zoomIn' 
        animationOut='zoomOut' 
        isVisible={props.isVisible} 
        onBackdropPress={props.onBackdropPress}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitleText}>{props.title}</Text>
            <Text style={styles.modalContentText}>{props.text}</Text>
            <View style={styles.buttonContainer}>
              {renderButton('Yes', props.onYes)}
              {renderButton('No', props.onNo)}
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalContainer: {
    justifyContent: 'center',
    borderRadius: 10,
    padding: 20,
    height: 250
  },
    modalTitleText: {
    fontSize: 30,
  },
    modalContentText: {
    fontSize: 16,
    flex: 1
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