import { FlatList, StyleSheet, useColorScheme } from 'react-native';
import { Text, View } from '../../../components/Themed';
import Colors from '../../../constants/Colors';
import { useEffect, useRef, useState } from 'react';
import { shoppingListHandler } from '../../../handlers/list';

export default function BoughtScreen() {
  const shoppingListDB = useRef(shoppingListHandler(gun));

  const colorScheme = useColorScheme() ?? 'light';

  const [products, setProducts] = useState<ListData[]>([])

  useEffect(() =>{
    shoppingListDB.current.onBoughtListUpdate(
      (list : ListData[]) => {
        setProducts(list)
      }
    )
  }, [])

  const renderItem = ({item, index}: { item: ListData, index: number}) => {  
    return (
      <View>
        <View style={[styles.container, {backgroundColor: index % 2 == 0 ? Colors[colorScheme].listBackgroundColor1 : Colors[colorScheme].listBackgroundColor2}]}>
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.data.bought!.price} kr.</Text>       
          </View>
          <Text style={styles.infoText}>Bought by {item.data.bought!.user} {item.data.bought!.date}</Text>
        </View>
      </View>
    )
  }


  return (
    <View style={{flex: 1}}>
      <FlatList
        style={{marginTop: 48}}
        data={products}
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
});
