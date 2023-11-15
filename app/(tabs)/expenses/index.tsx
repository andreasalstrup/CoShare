import { StyleSheet, Modal, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
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
];

const calculatedExpenses = calculateExpenses(DATA);

export default function SettleScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    return (
      <Swipeable
        friction={1.5}
        overshootFriction={8}
        renderLeftActions={leftSwipeAction}
        onSwipeableOpen={() => openModal()}
      >
        <View style={[styles.container, { backgroundColor: index % 2 == 0 ? '#eeeeee' : '#D3D3D3' }]}>
          <View style={styles.item}>
            <Text style={styles.itemTextFrom}>{item.from}</Text>
            <Text style={styles.itemAmount}>{item.amount} kr.</Text>
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
          <TouchableOpacity style={styles.modalContent} onPress={closeModal}>
            <Text>Test123</Text>
          </TouchableOpacity>
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
  longBoi: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
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
  },
});