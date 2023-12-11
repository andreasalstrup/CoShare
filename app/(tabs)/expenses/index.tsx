import { StyleSheet, Pressable, Dimensions, useColorScheme, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import React, { useState, useRef, useEffect } from 'react';
import { Text, View, } from '../../../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { calculateExpenses, Expense, Transaction } from '../../../helpers/calculateExpenses';
import Colors from '../../../constants/Colors';
import { expensesHandle } from '../../../handlers/expenses';

function expenseListCmp(cmp1 : Expense[], cmp2 : Expense[]){
  if (cmp1.length === cmp2.length){
    for (let i = 0; i < cmp1.length; i++){
      if (!(cmp1[i].equals(cmp2[i]))){
        return false
      }
    }
  }else{
    return false
  }
  return true
}

  /*gun.get('groups').get('89').get('expenses').set(new Expense('Martin', 90));
  gun.get('groups').get('89').get('expenses').set(new Expense('Andreas', 30));
  gun.get('groups').get('89').get('expenses').set(new Expense('Bisgaard', 0));
  gun.get('groups').get('89').get('expenses').set(new Expense('Mike', 65));*/

export default function SettleScreen() {
  const expenses = useRef(expensesHandle(gun));  
  const colorScheme = useColorScheme() ?? 'light';
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);
  const swipeableRows : Swipeable[] = [];
  const [data, setData] = useState<Expense[]>([]);
  const openModal = (item: Transaction) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
    swipeableRows.map((row) => row.close())
  };

  function getExpenses(expenseData: Expense[]): void{ 
    if (!expenseListCmp(expenseData, data)){
      setData(expenseData);
    }
  }

  const paymentComplete: (buttonId: number, transaction: Transaction | null) => void = (buttonId: number, selectedItem: Transaction | null): void => {
    if(buttonId == 1 && selectedItem != null){
      expenses.current.settleExpenses('89', selectedItem);
    }
    closeModal();
  };
  
  useEffect(() => {
    expenses.current.getExpenses('89', getExpenses);
    console.log('hi')
  }, [])

  function renderItem ({ item, index }: { item: Transaction; index: number }) : React.JSX.Element {
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

  const renderButton = (
    text: string,
    backgroundColor: string,
    buttonId: number,
    onPressHandler: (buttonId: number, transaction: Transaction | null) => void,
    selectedItem: Transaction | null
  ) => {
    return (
      <Pressable
        style={[styles.button, { backgroundColor }]}
        onPress={() => onPressHandler(buttonId, selectedItem)}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </Pressable>
    );
  };

  return (
    <View>       
      <FlatList
        style={{marginTop: 48}}
        data={calculateExpenses(data)}
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
                {renderButton('Yes', '#5CBCA9', 1, paymentComplete, selectedItem)}
                {renderButton('No', '#E35F52', 2, paymentComplete, selectedItem)}
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