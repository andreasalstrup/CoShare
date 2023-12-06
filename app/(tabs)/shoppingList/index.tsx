import { Button, StyleSheet, TextInput, useColorScheme } from 'react-native';
import Modal from "react-native-modal";
import { Text, View, } from '../../../components/Themed';
import { useState } from 'react';
import { FlatList, Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Colors from '../../../constants/Colors';
import ActionButton from 'react-native-action-button';
import { MultiSelect } from 'react-native-element-dropdown';
import moment from 'moment';
import AreYouSureModal from '../../../components/AreYouSureModal';

const usersDropdown = [
  { label: 'Test bruger', value: 'Test bruger' },
  { label: 'Andreas', value: 'Andreas' },
  { label: 'Mike', value: 'Mike' },
  { label: 'Emil', value: 'Emil' },
  { label: 'Martin', value: 'Martin' },
];

const seedData : ListData[] = [
  {
    name: 'Bananas',
    data: {added: {user: "Test bruger", date: "2020.11.01"}, users: [], bought: {user: "Test bruger", date: "2020.11.01", price: 3}},
  },
  {
    name: 'Chorizo',
    data: {added: {user: "Andreas", date: "2020.11.01"}, users: [], bought: {user: "Andreas", date: "2020.11.01", price: 35}},
  },
  {
    name: 'Beans',
    data: {added: {user: "Mike", date: "2020.11.01"}, users: [], bought: {user: "Mike", date: "2020.11.01", price: 2}},
  },
  {
    name: 'Apple',
    data: {added: {user: "Emil", date: "2020.11.01"}, users: [], bought: {user: "Emil", date: "2020.11.01", price: 2.5}},
  },
  {
    name: 'Chocolate',
    data: {added: {user: "Martin", date: "2020.11.01"}, users: []},
  },
]

type ListData = { 
  name: string,
  data: {added: { user: string, date: string}, users: { name: string }[], bought?: { user: string, date: string, price: number}}
}

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
  )
}

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

export default function ToBeBoughtScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [isModalAddOrEditItemVisible, setIsModalAddOrEditItemVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [isModalBuyItemVisible, setIsModalBuyItemVisible] = useState(false);

  const [products, setProducts] = useState(seedData)

  const [productName, setProductName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(usersDropdown.map((user) => user.value));
  const [alreadyBought, setAlreadyBought] = useState(false);
  const [price, setPrice] = useState('0');

  const [itemToBuy, setItemToBuy] = useState(0) 
  const [itemToEdit, setItemToEdit] = useState<number | undefined>() 
  const [itemToDelete, setItemToDelete] = useState(0)

  const swipeableRows : Swipeable[] = []  

  const toggleModalAddOrEditItem = () => setIsModalAddOrEditItemVisible(() => !isModalAddOrEditItemVisible);
  const toggleModalDeleteItem = () => setIsModalDeleteVisible(() => !isModalDeleteVisible);
  const toggleModalBuyItem = () => setIsModalBuyItemVisible(() => !isModalBuyItemVisible);
  const toggleCheckbox = () => setAlreadyBought(() => !alreadyBought);

  const clearProduct = () => {
    setProductName('')
    setSelectedUsers(usersDropdown.map((user) => user.value))
    setAlreadyBought(false)
    setPrice('0')
    setItemToEdit(undefined)
    setItemToBuy(0)
  }
  
  const editProduct = (index : number) => {
    setProductName(products[index].name)
    setSelectedUsers(products[index].data.users.map((user) => user.name))
  }

  const saveBoughtProduct = () => {
    setProducts(products.map((product, index) => {
      if (product === products[itemToBuy]) {
        return { ...product,
          data: {
            ...product.data,
            bought: {user: "Me", date: moment().format('YYYY.MM.DD'), price: Number(price)}
          }
        }
      } 
      else {
        return product;
      }
    }))

    toggleModalBuyItem()
    swipeableRows[itemToBuy].reset()
  }

  const saveEditedProduct = () => {
    setProducts(products.map((product, index) => {
      if (itemToEdit && product === products[itemToEdit]) {
        return { ...product, 
          name: productName,
          data: {
            ...product.data,
            users: selectedUsers.map(user => ({name: user})),
            bought: alreadyBought ? {user: "Me", date: moment().format('YYYY.MM.DD'), price: Number(price)} : undefined
          }
        }
      } 
      else {
        return product;
      }
    }))

    toggleModalAddOrEditItem()
  }

  const saveAddedProduct = () => {
    const time = moment().format('YYYY.MM.DD');
    const newProduct = {
      name: productName,
      data: {
        added: {user: "Me", date: time},
        users: selectedUsers.map(user =>  ({name: user})),
        bought: alreadyBought ? {user: "Me", date: time, price: Number(price)} : undefined
      }
    }
    if(newProduct.data.bought === undefined) {
      //Add to GUN here
      console.log(newProduct.name + ' added')
    }
    else {
      //Move to GUN bought list here
      console.log(newProduct.name + ' bought by ' + newProduct.data.bought.user)
    }
    setProducts(products => [...products, newProduct])
    
    toggleModalAddOrEditItem()
  }

  const swipeHandler = (dir: 'left' | 'right', index: number) =>{
    if (dir == "left") {
      setItemToBuy(index)
      toggleModalBuyItem()
    } else {
      setItemToDelete(index)
      toggleModalDeleteItem()
    }
  }

  const renderItem = ({item, index}: { item: ListData, index: number}) => {  
    return (
      <Swipeable
        ref={ref => ref != null ? swipeableRows[index] = ref : undefined}
        friction={1.5}
        overshootFriction={8}
        renderLeftActions={leftSwipeAction}
        renderRightActions={rightSwipeAction}
        onSwipeableOpen={(dir) => swipeHandler(dir, index)}>
        <GestureDetector gesture={Gesture.LongPress().minDuration(300).onStart(e => {
          setItemToEdit(index)
          editProduct(index)
          toggleModalAddOrEditItem()
        })}> 
          <View>
            <TouchableOpacity
              activeOpacity={0.5}>
              <View style={[styles.container, {backgroundColor: index % 2 == 0 ? Colors[colorScheme].listBackgroundColor1 : Colors[colorScheme].listBackgroundColor2}]}>
                <View style={styles.item}>
                  <Text style={styles.itemText}>{item.name}</Text>      
                </View>
                <Text style={styles.infoText}>Added by {item.data.added.user} {item.data.added.date}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </GestureDetector>
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
      <Modal animationIn='zoomIn' animationOut='zoomOut' isVisible={isModalAddOrEditItemVisible} onBackdropPress={() => setIsModalAddOrEditItemVisible(false)} onModalHide={clearProduct}>
        <View style={ styles.addItemModal }>
          <Text>Product</Text>
          <TextInput
            style={styles.dropdown}
            placeholder="Product name"
            value={productName}
            onChangeText={(text) => setProductName(text)}
            editable
          />
          <Text>Split expenses between</Text>
          <MultiSelect
            style={styles.dropdown}
            renderItem={(item, selected) => 
            <View style={[styles.dropdownItem, {marginBottom: selected ? -0.5 : 0}]}>
              <Text style={styles.dropdownTextItem}>{item.label}</Text>
              <CheckBox
                style={{ marginRight: 10 }}
                color={'#5CBCA9'}
                value={selected}                
                pointerEvents='none'
              />
            </View>}
            data={usersDropdown}
            labelField="label"
            valueField="value"
            placeholder={'Selected: ' + selectedUsers.length}
            value={selectedUsers}
            onChange={item => {
              setSelectedUsers(item);
            }}
            visibleSelectedItem={false}
          />
          <View style={{flexDirection:'row', marginBottom: 10}}>
            <CheckBox
              style={{ marginRight: 10 }}
              color={'#5CBCA9'}
              value={alreadyBought}
              onValueChange={(newValue) => setAlreadyBought(newValue)}
            />
            <Text onPress={toggleCheckbox} style={{width: '100%'}}>Already bought</Text>
          </View>
          {alreadyBought ? <Text>Amount paid</Text> : null}
          {alreadyBought ? <TextInput
            style={styles.dropdown}
            keyboardType='numeric'
            placeholder="kr"
            value={price.toString()}
            onChangeText={(text : string) => setPrice(text)}
            editable
            onFocus={() => setPrice('')}
          /> : null}
          
          <Button color='#5CBCA9' title={itemToEdit ? "Edit Product" : "Add Product"} onPress={itemToEdit ? saveEditedProduct : saveAddedProduct} />
        </View>
      </Modal>
      <Modal 
        animationIn='zoomIn' 
        animationOut='zoomOut' 
        isVisible={isModalBuyItemVisible} 
        onBackdropPress={() => {
          setIsModalBuyItemVisible(false)
          swipeableRows[itemToBuy].close()
        }} 
        onModalHide={clearProduct}>
        <View style={styles.buyItemModal}>
          <Text style={styles.modalTitleText}>{products[itemToBuy].name}</Text>
          <Text style={styles.infoText}>Added by {products[itemToBuy].data.added.user} {products[itemToBuy].data.added.date}</Text>
          <View style={styles.amountPaid}>
            <Text>Amount paid</Text> 
            <TextInput
              style={styles.dropdown}
              keyboardType='numeric'
              placeholder="kr"
              value={price.toString()}
              onChangeText={(text : string) => setPrice(text)}
              editable
              onFocus={() => setPrice('')}
            />
          </View>
          <Button color='#5CBCA9' title="Add Price" onPress={saveBoughtProduct} />
        </View>
      </Modal>
      <AreYouSureModal
        title='Delete Item'
        text={'Are you sure you want to delete ' + products[itemToDelete].name}
        isVisible={isModalDeleteVisible}
        onBackdropPress={() => {
          setIsModalDeleteVisible(false)
          swipeableRows[itemToDelete].close()
        }}
        onYes={() =>{
          setProducts(prevState => prevState.filter((_,i) => i !== itemToDelete))
          swipeableRows[itemToDelete].reset()
          setItemToDelete(0)
          toggleModalDeleteItem()
        }}
        onNo={() =>{
          swipeableRows[itemToDelete].close()
          setItemToDelete(0)
          toggleModalDeleteItem()
        }}/>
      <ActionButton
        renderIcon={() => {return <FontAwesome5
          name="plus" 
          size={50} 
          color={Colors[colorScheme].background}
          />}}  
        onPress={toggleModalAddOrEditItem}
        buttonColor='#5CBCA9'
        position='center'
        size={70}/>
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
  infoText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
    marginTop: -5,
  },
  leftSwipe: {
    backgroundColor: '#5CBCA9',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  rightSwipe: {
    backgroundColor: '#E35F52',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  swipeIcon: {
    padding: 20,
  },
  addItemModal: {
    height: 300,
    padding: 22,
    justifyContent: 'center',
    borderRadius: 4,
  },
  dropdown: {
    backgroundColor: 'lightgray',
    marginBottom: 10,
    borderRadius: 4,
    paddingLeft: 10
  },
  dropdownItem: {
      padding: 17,
      flexDirection: 'row',
  },
  dropdownTextItem: {
      flex: 1,
      fontSize: 16,
  },
  modalTitleText: {
    fontSize: 30,
  },
  buyItemModal: {
    height: 250,
    padding: 22,
    borderRadius: 10,
  },
  amountPaid: {
    marginTop: 40,
  }
});