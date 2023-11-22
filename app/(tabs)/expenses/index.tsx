import { StyleSheet, Modal, Pressable, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import { Text, View, } from '../../../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { calculateExpenses } from '../../../helpers/calculateExpenses';


type Expense = {
  user: string;
  amount: number;
};

type Transaction = {
  from: string;
  to: string;
  amount: number;
};

const DATA: Expense[] = [
  { user: 'Martin', amount: 90 },
  { user: 'Andreas', amount: 30 },
  { user: 'Bisgaard', amount: 0 },
  { user: 'Mike', amount: 85 },
];

const calculatedExpenses = calculateExpenses(DATA);

export default function SettleScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);

  const openModal = (item: Transaction) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    return (
      <Swipeable
        friction={1.5}
        overshootFriction={8}
        renderLeftActions={leftSwipeAction}
        onSwipeableOpen={() => openModal(item)}
      >
        <View style={[styles.container, { backgroundColor: index % 2 == 0 ? '#eeeeee' : '#D3D3D3' }]}>
          <View style={styles.item}>
            <Text style={styles.itemTextFrom}>{item.from}</Text>
            <Text style={styles.itemAmount}>{item.amount.toFixed(2)} kr.</Text>
            <Text style={styles.itemTextTo}>{item.to}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  const leftSwipeAction = () => {
    return (
      <View style={styles.leftSwipe}>
        <FontAwesome5
          name="arrow-alt-circle-right"
          size={32}
          color="white"
          style={styles.swipeIcon}
        />
      </View>
    );
  };

  const renderButton = (text: string, backgroundColor: string) => {
    return (
      <Pressable style={[styles.button, { backgroundColor }]} onPress={closeModal}>
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        style={{marginTop: 48}}
        data={calculatedExpenses}
        renderItem={renderItem}
      />
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedItem && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitleText}>Confirm Payment</Text>
              <Text style={styles.modalContentText}>Have you sent {selectedItem.amount} kr. to {selectedItem.to}?</Text>
              <View style={styles.buttonContainer}>
                {renderButton('Yes', '#5CBCA9')}
                {renderButton('No', '#E35F52')}
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#000000',
    padding: 2,
  },
  item: {
    backgroundColor: 'transparent',
    borderBottomColor: '#000000',
    borderBottomWidth: 0,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemTextFrom: {
    fontSize: 24,
    color: '#E35F52',
    flexDirection: 'row',
  },
  itemTextTo: {
    fontSize: 24,
    color: '#5CBCA9',
    flexDirection: 'row',
  },
  itemAmount: {
    fontSize: 24,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  leftSwipe: {
    backgroundColor: '#5CBCA9',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  swipeIcon: {
    padding: 10,
  },
    modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    height: "40%"
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
    marginTop: '40%',
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