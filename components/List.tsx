import { View, Text, StyleSheet, FlatList, SectionList, ListRenderItem, SectionListRenderItem } from 'react-native'
import React from 'react'
import { Directions, ScrollView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

type ListData = { 
    name: string, 
    data: { user: string, date: string, price: number }[]
}

function renderItem({item, index, section, separators}: any) {
    return (
        <View style={styles.item}>
            <Text>Added by {item.user} {item.date}</Text>
        </View>
    )
}

const rightSwipeActions = () => {
    return (
      <View style={{backgroundColor: 'red', justifyContent: 'center', alignItems: 'flex-end'}}>
        <Text style={{color: '#1b1a17', paddingHorizontal: 10, fontWeight: '600', paddingVertical: 20,}}>Delete</Text>
      </View>
    );
};

const LeftSwipeActions = () => {
    return (
        <View style={{backgroundColor: 'green', justifyContent: 'center', alignItems: 'flex-end'}}>
        <Text style={{color: '#1b1a17', paddingHorizontal: 10, fontWeight: '600', paddingVertical: 20,}}>Add price</Text>
      </View>
    );
}

const swipeHandler = (dir: any) => {
    if (dir == "left") {
        alert(dir);
    } else {
        alert(dir);
    }
};

function renderSectionHeader({ section }: { section: ListData })  {
    const itemName = section.name
    const itemData = section.data[0]

    return (
        <Swipeable 
            renderLeftActions={LeftSwipeActions}
            renderRightActions={rightSwipeActions}
            onSwipeableOpen={swipeHandler}>
            <View style={styles.section}>
                <Text style={styles.title}>{itemName}</Text>
                <Text style={styles.price}>{itemData.price} kr</Text>
            </View>
        </Swipeable>
    )
}

export default function List({ sections }: { sections: ListData[] }) {
  return (
    <SectionList
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={sections}
        stickySectionHeadersEnabled={false}
    />
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 35,
      fontWeight: 'bold',
      color: "black",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    item: {
        backgroundColor: '#eeeeee',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        padding: 8,
        flexDirection: 'row',
      },
    price: {
        fontSize: 35,
        fontWeight: 'bold',
        color: "black",
        position: 'absolute', 
        right: 5,
        top: 5
    },
    section: {
        backgroundColor: '#D3D3D3',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        padding: 8,
        flexDirection: 'row',
      },
  });