import { FlatList, StyleSheet, useColorScheme } from 'react-native';
import { Text, View } from '../../../components/Themed';
import Colors from '../../../constants/Colors';
import { useEffect, useRef, useState } from 'react';
import { shoppingListHandler } from '../../../handlers/list';
import { Swipeable } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import AreYouSureModal from '../../../components/AreYouSureModal';

const rightSwipeAction = () => {
  return (
    <View style={styles.rightSwipe}>
      <FontAwesome5
        name="trash-alt" 
        size={32} 
        color="white"
        style={styles.swipeIcon}
        />
    </View>
  )
}

export default function BoughtScreen() {
  const shoppingListDB = useRef(shoppingListHandler(gun));

  const colorScheme = useColorScheme() ?? 'light';
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);

  const [products, setProducts] = useState<ListData[]>([])
  const [productIds, setProductIds] = useState<string[]>([])

  const [itemToDelete, setItemToDelete] = useState(0)

  const swipeableRows : Swipeable[] = []  

  const toggleModalDeleteItem = () => setIsModalDeleteVisible(() => !isModalDeleteVisible);

  useEffect(() =>{
    shoppingListDB.current.onBoughtListUpdate(
      (list : ListData[], ids : string[]) => {
        setProductIds(ids)
        setProducts(list)
      }
    )
  }, [])

  const swipeHandler = (index: number) =>{
    setItemToDelete(index)
    toggleModalDeleteItem()
  }

  const renderItem = ({item, index}: { item: ListData, index: number}) => {  
    return (
      <Swipeable
        ref={ref => ref != null ? swipeableRows[index] = ref : undefined}
        friction={1.5}
        overshootFriction={8}
        renderRightActions={rightSwipeAction}
        onSwipeableOpen={() => swipeHandler(index)}>
        <View style={[styles.container, {backgroundColor: index % 2 == 0 ? Colors[colorScheme].listBackgroundColor1 : Colors[colorScheme].listBackgroundColor2}]}>
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.data.bought?.price} kr.</Text>       
          </View>
          <Text style={styles.infoText}>Bought by {item.data.bought?.user} {item.data.bought?.date}</Text>
        </View>
      </Swipeable>
    )
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        style={{marginTop: 48}}
        data={products}
        renderItem={renderItem}
      />
      <AreYouSureModal
        title='Move Item Back'
        text={`Are you sure you want to move ${products.at(itemToDelete)?.name} back?`}
        isVisible={isModalDeleteVisible}
        onBackdropPress={() => {
          setIsModalDeleteVisible(false)
          swipeableRows.at(itemToDelete)?.close()
        }}
        onYes={() =>{
          if(productIds.length > 0){
            shoppingListDB.current.deleteFromBoughtList(products.at(itemToDelete)!, productIds.at(itemToDelete)!)
          }
          swipeableRows.at(itemToDelete)?.reset()
          setItemToDelete(0)
          toggleModalDeleteItem()
        }}
        onNo={() =>{
          swipeableRows.at(itemToDelete)?.close()
          setItemToDelete(0)
          toggleModalDeleteItem()
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
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: 35,
    flexDirection: 'row',
  },
  itemPrice: {
    fontSize: 35,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  infoText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
    marginTop: -5,
  },
  rightSwipe: {
    backgroundColor: '#E35F52',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  swipeIcon: {
    padding: 20,
  },
});
