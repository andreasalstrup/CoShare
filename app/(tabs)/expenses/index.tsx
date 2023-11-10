import { StyleSheet } from 'react-native';
import { Text, View, } from '../../../components/Themed';
import { Component } from 'react';
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
  { user: 'user 1', amount: 90 },
  { user: 'user 2', amount: 30 },
  { user: 'user 3', amount: 0 },
];

const calculatedExpenses = calculateExpenses(DATA);

function renderItem({item, index}: { item: Transaction, index: number}) {
  return (
    <Swipeable
      friction={1.5}
      overshootFriction={8}
      renderLeftActions={leftSwipeAction}
      onSwipeableOpen={swipeHandler}>
      <View style={[styles.container, 
        {backgroundColor: index % 2 == 0 ? '#eeeeee' : '#D3D3D3'}]}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.from}</Text>
          <Text style={styles.itemAmount}>{item.amount} kr.</Text>
          <Text style={styles.itemText}>{item.to}</Text>
        </View>
      </View>
    </Swipeable>
  )
}

function leftSwipeAction() {
  return (
    <View style={styles.leftSwipe}>
      <FontAwesome5
        name="arrow-alt-circle-right" 
        size={32} 
        color="white"
        style={styles.swipeIcon}
        />
    </View>
  )
}

function swipeHandler(dir: 'left' | 'right') {
  if (dir == "left") {
      console.log(dir);
  } else {
      console.log(dir);
  }
}

export default class SettleScreen extends Component {
  render() {
    return (
      <FlatList
        style={{marginTop: 48}}
        data={calculatedExpenses}
        renderItem={renderItem}
      />
    );
  }
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
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: 35,
    color: 'black',
    flexDirection: 'row',
  },
  itemAmount: {
    fontSize: 35,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  infoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    marginBottom: 5,
    marginTop: -5,
  },
  leftSwipe: {
    backgroundColor: '#5CBCA9',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  swipeIcon: {
    padding: 20,
  }
});