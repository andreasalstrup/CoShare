import { Button, FlatList, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import Modal from "react-native-modal";
import EditScreenInfo from '../../../components/EditScreenInfo';
import { Text, View } from '../../../components/Themed';
import React, { useEffect, useRef, useState } from 'react';
import { shoppingListHandler } from '../../../handlers/list';
import { Gesture, GestureDetector, Swipeable } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import AreYouSureModal from '../../../components/AreYouSureModal';
import Colors from '../../../constants/Colors';
import ActionButton from 'react-native-action-button';
import CheckBox from 'expo-checkbox';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

export default function BoughtScreen() {
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
  const [bought, setBought] = useState(true);
  const [price, setPrice] = useState("");
  const [payingUser, setPayingUser] = useState("")
  const [boughtTime, setBoughtTime] = useState("")
  const [itemToBuy, setItemToBuy] = useState(0) 
  const [itemToEdit, setItemToEdit] = useState<number | null>() 
  const [itemToDelete, setItemToDelete] = useState(0)

  const swipeableRows : Swipeable[] = []  

  const toggleModalAddOrEditItem = () => setIsModalAddOrEditItemVisible(() => !isModalAddOrEditItemVisible);
  const toggleModalDeleteItem = () => setIsModalDeleteVisible(() => !isModalDeleteVisible);
  const toggleModalBuyItem = () => setIsModalBuyItemVisible(() => !isModalBuyItemVisible);
  const toggleCheckbox = () => setBought(() => !bought);
  
  useEffect(() =>{
    shoppingListDB.current.onBoughtUpdate(
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
    setBought(true)
    setPrice("")
    setItemToEdit(null)
    setItemToBuy(0)
    setPayingUser("")
    setBoughtTime("")
  }
  
  const editProduct = (index : number) => {
    let product = products[index]
    setProductName(product.name)
    let users: Member[] = []
    for (const key in products[index].data.users) {
      let member = members.find(m => m.name == products[index].data.users[key].name)
      if(member){
        users.push(member)
      }
    }
    setSelectedUsers(users)
    if (product.data.bought != null){
      let boughtObj = product.data.bought
      setPrice(boughtObj.price.toString())
      setPayingUser(boughtObj.user)
      console.log(boughtObj.user)
      console.log(payingUser)
      setBoughtTime(boughtObj.date)
    }
    
  }

  // const saveBoughtProduct = () => {
  //   const editedProduct = { ...products[itemToBuy],
  //     data: {
  //       ...products[itemToBuy].data,
  //       bought: {user: "Me", date: moment().format('YYYY.MM.DD'), price: Number(price)}
  //     }
  //   }
  //   shoppingListDB.current.buyFromList(editedProduct, productIds.at(itemToBuy))
  //   setItemToBuy(0)
  //   toggleModalBuyItem()
  //   swipeableRows.at(itemToBuy)?.reset()
  // }

  const saveEditedProduct = () => {
    toggleModalAddOrEditItem()
    if (itemToEdit != null) {
      let users: any = {}
      selectedUsers.forEach((value, index) => users[memberIds[members.findIndex(m => m.key == value.key)]] = {key: value.key, name: value.name})
      console.log('pls work' +JSON.stringify(users,null,4))
      const editedProduct: ListData = { ...products[itemToEdit], 
        name: productName,
        data: {
          ...products[itemToEdit].data,
          users: users,
          bought: bought ? {user: payingUser, date: boughtTime, price: Number(price)} : null
        }
      }

      if(bought) {
        shoppingListDB.current.updateItemInList(editedProduct, productIds.at(itemToEdit)!)
      }
      else {
        shoppingListDB.current.markAsNotBought(editedProduct, productIds.at(itemToEdit))
      }
    } 

    
  }

  const renderItem = ({item, index}: { item: ListData, index: number}) => {
    console.log("Bought log")
    console.log(Colors[colorScheme].listBackgroundColor2)
    console.log(colorScheme)

    return (
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
                {item.data.bought != null && <Text style={styles.infoText}>Bought by {item.data.bought.user} {item.data.bought.date} for {item.data.bought.price}</Text>}
              </View>
            </TouchableOpacity>
          </View>
        </GestureDetector>
    )
  }
  function editItemModal() {
    return <>
    <Modal animationIn='zoomIn' animationOut='zoomOut' isVisible={isModalAddOrEditItemVisible} onBackdropPress={() => setIsModalAddOrEditItemVisible(false)} onModalHide={clearProduct}>
    <View style={ styles.addItemModal }>
      <Text>Product</Text>
      <TextInput        
        style={styles.dropdown}        
        value={productName}
        onChangeText={(text) => setProductName(text)}        
      />
      <Text>Amount paid</Text>
      <TextInput        
        style={bought ? styles.dropdown : styles.disabledDropdown}
        keyboardType='numeric'
        placeholder="kr"
        value={price}
        onChangeText={(text : string) => setPrice(text)}
        editable={bought}
      />
      <Text>Who paid</Text>
      <Dropdown
        style={bought ? styles.dropdown : styles.disabledDropdown}
        disable={!bought}
        renderItem={(item, selected) => 
        <View style={[styles.dropdownItem, {marginBottom: selected ? -0.5 : 0}]}>
          <Text style={styles.dropdownTextItem}>{item.label}</Text>          
        </View>}
        data={members.map(m => {return {label: m.name, value: m.name}})}
        labelField="label"
        valueField="value"
        value={payingUser}
        placeholder={payingUser}
        onChange={item => {
          setPayingUser(item.value);
        }}
      />
      <Text>Split expenses between</Text>
      <MultiSelect
        style={bought ? styles.dropdown : styles.disabledDropdown}
        disable={!bought}
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
          value={bought}
          onValueChange={(newValue) => setBought(newValue)}
        />
        <Text onPress={toggleCheckbox} style={{width: '100%'}}>Bought</Text>
      </View>
      
      <Button color='#5CBCA9' title={"Edit Product"} onPress={saveEditedProduct} />
    </View>
  </Modal>
  </>
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        style={{marginTop: 48}}
        data={products}
        renderItem={renderItem}
      />
      {editItemModal()}    
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
    disabledDropdown: {
      backgroundColor: 'gray',
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

