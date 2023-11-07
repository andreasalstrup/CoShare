import { StyleSheet } from 'react-native';
import { Text, View, } from '../../components/Themed';
import { Component } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const DATA = [
  {
      name: 'Bananas',
      data: [{user: "Test bruger", date: "2020.11.01", price: 3}],
  },
  {
    name: 'Chorizo',
    data: [{user: "Andreas", date: "2020.11.01", price: 35}],
  },
  {
    name: 'Beans',
    data: [{user: "Mike", date: "2020.11.01", price: 2}],
  },
  {
    name: 'Apple',
    data: [{user: "Emil", date: "2020.11.01", price: 2.5}],
  },
  {
    name: 'Chocolate',
    data: [{user: "Martin", date: "2020.11.01", price: 13.95}],
  },
]

type ListData = { 
  name: string, 
  data: { user: string, date: string, price: number }[]
}

function renderItem({item, index}: { item: ListData, index: number}) {
  return (
    <Swipeable
      friction={3}
      renderLeftActions={leftSwipeAction}
      renderRightActions={rightSwipeAction}
      onSwipeableOpen={swipeHandler}>
      <View style={[styles.container, 
        {backgroundColor: index % 2 == 0 ? '#eeeeee' : '#D3D3D3'}]}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.data[0].price} kr.</Text>        
        </View>
        <Text style={styles.infoText}>Added by {item.data[0].user} {item.data[0].date}</Text>
      </View>
    </Swipeable>
  )
}

function leftSwipeAction() {
  return (
    <View style={{backgroundColor: '#5CBCA9', justifyContent: 'center', alignItems: 'flex-end'}}>
      <FontAwesome5
        name="arrow-alt-circle-right" 
        size={32} 
        color="white"
        style={styles.swipe}
        />
    </View>
  )
}

function rightSwipeAction() {
  return (
    <View style={{backgroundColor: '#E35F52', justifyContent: 'center', alignItems: 'flex-end'}}>
      <FontAwesome5
        name="trash-alt" 
        size={32} 
        color="white"
        style={styles.swipe}
        />
    </View>
  )
}

function swipeHandler(dir: 'left' | 'right') {
  if (dir == "left") {
      alert(dir);
  } else {
      alert(dir);
  }
}

export default class ListScreen extends Component {
  render() {
    return (
      <FlatList
        data={DATA}
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
    fontWeight: 'regular',
    color: "black",
    flexDirection: 'row',
  },
  itemPrice: {
    fontSize: 35,
    fontWeight: 'regular',
    color: "black",
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  infoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "black",
    marginLeft: 10,
    marginBottom: 5,
    marginTop: -5,
  },
  swipe: {
    padding: 20,
  }
});