import { StyleSheet, useColorScheme } from 'react-native';
import { Text, View, } from '../../../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { calculateBalance } from '../../../helpers/calculateBalance';
import Colors from '../../../constants/Colors';
import { Expense} from '../../../helpers/calculateExpenses';
import { expensesHandle } from '../../../handlers/expenses';
import { useEffect, useRef, useState } from 'react';

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

export default function BalanceScreen() {
  const expenses = useRef(expensesHandle(gun));  
  const colorScheme = useColorScheme() ?? 'light';
  const [data, setData] = useState<Expense[]>([]);
  const [members, setMembers] = useState<string[]>([]);

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

  const renderItem = ({ item, index }: { item: {user: string, amount: number}; index: number }) => {
    return (
      <View style={[styles.container, { backgroundColor: index % 2 == 0 ? Colors[colorScheme].listBackgroundColor1 : Colors[colorScheme].listBackgroundColor2 }]}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.user}</Text>
          <Text style={[styles.itemAmount, { color: item.amount >= 0 ? (item.amount == 0 ? Colors[colorScheme].text : '#5CBCA9') : '#E35F52' }]}>
            {item.amount > 0 ? "+" + item.amount : item.amount} kr.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={previousBalance = calculateBalance(data, members, previousBalance)}
        renderItem={renderItem}
      />
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
  itemText: {
    fontSize: 24,
    flexDirection: 'row',
  },
  itemAmount: {
    fontSize: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
});
