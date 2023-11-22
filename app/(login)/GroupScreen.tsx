import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import styles from './styles';


export default function GroupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is where groups come true</Text>            
    </View>
  );
}