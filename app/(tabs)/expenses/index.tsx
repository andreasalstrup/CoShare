import { StyleSheet, Pressable, Dimensions, useColorScheme } from 'react-native';
import Modal from "react-native-modal";
import React, { useState, useRef } from 'react';
import { Text, View, } from '../../../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { calculateExpenses } from '../../../helpers/calculateExpenses';
import Colors from '../../../constants/Colors';
import { expensesHandle } from '../../../handlers/expenses';


type Expense = {
  user: string;
  amount: number;
};

type Transaction = {
  from: string;
  to: string;
  amount: number;
};

var DATA: Expense[] = [];



export default function SettleScreen() {

  function getExpenses(expenseData: Expense[]): void{
    DATA = expenseData;
    console.log(DATA);
  }
  /*gun.get('groups').get('69').get('expenses').set({user: 'Martin', amount: 90});
  gun.get('groups').get('69').get('expenses').set({user: 'Andreas', amount: 30});
  gun.get('groups').get('69').get('expenses').set({user: 'Bisgaard', amount: 0});
  gun.get('groups').get('69').get('expenses').set({user: 'Mike', amount: 65});*/
  const expenses = useRef(expensesHandle(gun));
  expenses.current.getExpenses('69', getExpenses);
  

  const calculatedExpenses = calculateExpenses(DATA);
  const colorScheme = useColorScheme() ?? 'light';
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);
  const swipeableRows : Swipeable[] = [] 

  const openModal = (item: Transaction) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
    swipeableRows.map((row) => row.close())
  };

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    return (
      <Swipeable
        ref={ref => ref != null ? swipeableRows[index] = ref : undefined}
        friction={1.5}
        overshootFriction={8}
        renderLeftActions={leftSwipeAction}
        onSwipeableOpen={() => openModal(item)}
      >
        <View style={[styles.container, { backgroundColor: index % 2 == 0 ? Colors[colorScheme].listBackgroundColor1 : Colors[colorScheme].listBackgroundColor2 }]}>
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
        data={calculateExpenses(DATA)}
        renderItem={renderItem}
      />
      <Modal
        animationIn='zoomIn'
        animationOut='zoomOut'
        isVisible={modalVisible}
        onBackdropPress={closeModal}
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
    justifyContent: 'center',
    alignItems: 'center'
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