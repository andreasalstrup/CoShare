import { StyleSheet, useColorScheme} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Text, View, } from '../../../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { calculateExpenses, Expense, Transaction } from '../../../helpers/calculateExpenses';
import Colors from '../../../constants/Colors';
import AreYouSureModal from '../../../components/AreYouSureModal';
import { expensesHandle } from '../../../handlers/expenses';
import { calculateBalance } from '../../../helpers/calculateBalance';

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
};

export default function SettleScreen() {
  const expenses = useRef(expensesHandle(gun));  
  const colorScheme = useColorScheme() ?? 'light';
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null);
  const swipeableRows : Swipeable[] = [];
  const [data, setData] = useState<Expense[]>([]);
  const [members, setMembers] = useState<string[]>([]);

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

  function getGroupMembers(member: string): void{
    setMembers(prev => {
      if(!prev.includes(member)){
        return [...prev, member]
      }
      return prev
    })
  }
  
  useEffect(() => {
    expenses.current.getExpenses(getExpenses);
    expenses.current.getGroupMembers(getGroupMembers);
  }, [])

  let previousBalance: { user: string, amount: number }[] = [];

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

  return (
    <View>
      <FlatList
        style={{marginTop: 48}}
        data={calculateExpenses(calculateBalance(data, members, previousBalance))}
        renderItem={renderItem}  
        extraData={data}      
      />
      <AreYouSureModal
        title='Confirm Payment'
        text={`Have you sent ${selectedItem?.amount} kr. to ${selectedItem?.to}`}
        isVisible={modalVisible}
        onBackdropPress={() => {
          closeModal()
        }}
        onYes={() =>{
          if(selectedItem != null){
            expenses.current.settleExpenses(selectedItem);
          }
          closeModal()
        }}
        onNo={() =>{
          closeModal()
        }}/>
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
});