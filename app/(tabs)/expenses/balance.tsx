import { StyleSheet } from 'react-native';
import { Text, View, } from '../../../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import { calculateBalance } from '../../../helpers/calculateBalance';


type Expense = {
  user: string;
  amount: number;
};

const DATA: Expense[] = [
  { user: 'Martin', amount: 90 },
  { user: 'Andreas', amount: 30 },
  { user: 'Bisgaard', amount: 0 },
  { user: 'Mike', amount: 85 },
];

const calculatedBalances = calculateBalance(DATA);


export default function BalanceScreen() {

  const renderItem = ({ item, index }: { item: Expense; index: number }) => {
    return (
      <View style={[styles.container, { backgroundColor: index % 2 == 0 ? '#eeeeee' : '#D3D3D3' }]}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.user}</Text>
          <Text style={styles.itemAmount}>{item.amount.toFixed(2)} kr.</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        style={{marginTop: 48}}
        data={calculatedBalances}
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
    color: 'black',
    flexDirection: 'row',
  },
  itemAmount: {
    fontSize: 24,
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
});
