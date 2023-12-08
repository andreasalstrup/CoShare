import { Button, StyleSheet, TextInput, useColorScheme } from 'react-native';
import Modal from "react-native-modal";
import { Text, View, } from '../../../components/Themed';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Colors from '../../../constants/Colors';
import ActionButton from 'react-native-action-button';
import { MultiSelect } from 'react-native-element-dropdown';
import moment from 'moment';
import AreYouSureModal from '../../../components/AreYouSureModal';
import { shoppingListHandler } from '../../../handlers/list';

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
  const shoppingListDB = useRef(shoppingListHandler(gun));

  const colorScheme = useColorScheme() ?? 'light';
  const [isModalAddOrEditItemVisible, setIsModalAddOrEditItemVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [isModalBuyItemVisible, setIsModalBuyItemVisible] = useState(false);

  const [products, setProducts] = useState<ListData[]>([])
  const [productIds, setProductIds] = useState<string[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [memberIds, setMemberIds] = useState<string[]>([])

  const [productName, setProductName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Member[]>([]);
  const [alreadyBought, setAlreadyBought] = useState(false);
  const [price, setPrice] = useState('0');

  const [itemToBuy, setItemToBuy] = useState(0) 
  const [itemToEdit, setItemToEdit] = useState<number | null>() 
  const [itemToDelete, setItemToDelete] = useState(0)

  const swipeableRows : Swipeable[] = []  

  const toggleModalAddOrEditItem = () => setIsModalAddOrEditItemVisible(() => !isModalAddOrEditItemVisible);
  const toggleModalDeleteItem = () => setIsModalDeleteVisible(() => !isModalDeleteVisible);
  const toggleModalBuyItem = () => setIsModalBuyItemVisible(() => !isModalBuyItemVisible);
  const toggleCheckbox = () => setAlreadyBought(() => !alreadyBought);

  useEffect(() =>{
    shoppingListDB.current.onListUpdate(
      (data : ListData[], ids: string[]) => {
        setProductIds(ids)
        setProducts(data)
      }
    )

    shoppingListDB.current.onUsersUpdate(
      (data : Member[], ids: string[]) => {
        setMemberIds(ids)
        setMembers(data)
        if(members.length == 0)
        {
          setSelectedUsers(data)
        }
      }
    )
  }, [])

  const clearProduct = () => {
    setProductName('')
    setSelectedUsers(members)
    setAlreadyBought(false)
    setPrice('0')
    setItemToEdit(null)
    setItemToBuy(0)
  }
  
  const editProduct = (index : number) => {
    setProductName(products[index].name)
    let users: Member[] = []
    for (const key in products[index].data.users) {
      let member = members.find(m => m.name == products[index].data.users[key].name)
      if(member){
        users.push(member)
      }
    }
    setSelectedUsers(users)
  }

  const saveBoughtProduct = () => {
    const editedProduct = { ...products[itemToBuy],
      data: {
        ...products[itemToBuy].data,
        bought: {user: "Me", date: moment().format('YYYY.MM.DD'), price: Number(price)}
      }
    }
    shoppingListDB.current.buyFromList(editedProduct, productIds.at(itemToBuy))
    setItemToBuy(0)
    toggleModalBuyItem()
    swipeableRows.at(itemToBuy)?.reset()
  }

  const saveEditedProduct = () => {
    if (itemToEdit != null) {
      let users: any = {}
      selectedUsers.forEach((value, index) => users[memberIds[members.findIndex(m => m.key == value.key && m.name == value.name)]] = {key: value.key, name: value.name})
      console.log('pls work' +JSON.stringify(users,null,4))
      const editedProduct: ListData = { ...products[itemToEdit], 
        name: productName,
        data: {
          ...products[itemToEdit].data,
          users: users,
          bought: alreadyBought ? {user: "Me", date: moment().format('YYYY.MM.DD'), price: Number(price)} : null
        }
      }

      if(editedProduct.data.bought == null) {
        shoppingListDB.current.updateItemInList(editedProduct, productIds.at(itemToEdit)!)
      }
      else {
        shoppingListDB.current.buyFromList(editedProduct, productIds.at(itemToEdit))
      }
    } 

    toggleModalAddOrEditItem()
  }

  const saveAddedProduct = () => {
    const time = moment().format('YYYY.MM.DD');
    let users: any = {}
    selectedUsers.forEach(value => users[memberIds[members.findIndex(m => m.key == value.key && m.name == value.name)]] = {key: value.key, name: value.name})
    const newProduct: ListData = {
      name: productName,
      data: {
        added: {user: "Me", date: time},
        users: users,
        bought: alreadyBought ? {user: "Me", date: time, price: Number(price)} : null
      }
    }
    if(newProduct.data.bought == null) {
      shoppingListDB.current.addToList(newProduct)
    }
    else {
      shoppingListDB.current.buyFromList(newProduct)
    }
    
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
            data={members.map(m => {return {label: m.name, value: m.name}})}
            labelField="label"
            valueField="value"
            placeholder={'Selected: ' + selectedUsers.length}
            value={selectedUsers.map(u => u.name)}
            onChange={item => {
              setSelectedUsers(members.filter(m => item.includes(m.name)));
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
          
          <Button color='#5CBCA9' title={itemToEdit != null ? "Edit Product" : "Add Product"} onPress={itemToEdit != null ? saveEditedProduct : saveAddedProduct} />
        </View>
      </Modal>
      <Modal 
        animationIn='zoomIn' 
        animationOut='zoomOut' 
        isVisible={isModalBuyItemVisible} 
        onBackdropPress={() => {
          setIsModalBuyItemVisible(false)
          swipeableRows.at(itemToBuy)?.close()
        }} 
        onModalHide={clearProduct}>
        <View style={styles.buyItemModal}>
          <Text style={styles.modalTitleText}>{products.at(itemToBuy)?.name}</Text>
          <Text style={styles.infoText}>Added by {products.at(itemToBuy)?.data.added.user} {products.at(itemToBuy)?.data.added.date}</Text>
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
        text={`Are you sure you want to delete ${products.at(itemToDelete)?.name}?`}
        isVisible={isModalDeleteVisible}
        onBackdropPress={() => {
          setIsModalDeleteVisible(false)
          swipeableRows.at(itemToDelete)?.close()
        }}
        onYes={() =>{
          if(productIds.length > 0){
            shoppingListDB.current.deleteFromList(productIds.at(itemToDelete)!)
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