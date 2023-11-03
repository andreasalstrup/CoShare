import React, { useState } from 'react';
import { StyleSheet, TextInput, useColorScheme } from 'react-native';
import { Text, View } from '../../components/Themed';

export default function NoticeScreen() {
  const [houseRules, setHouseRules] = useState('');
const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Household Rules</Text>
      <TextInput
        style={styles.input}
        placeholder="There are no rules"
        value={houseRules}
        onChangeText={(text) => setHouseRules(text)}
        editable
        multiline
      />
      <Text style={styles.title}>Contact Information</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    borderColor: 'gray',
    padding: 10,
    margin: 0,
    width: '100%',
    color: 'white',
    backgroundColor: '#5CBCA9',
    borderTopWidth: 1,
    borderBotWidth: 1,
  },
  input: {
    width: '100%',
    maxHeight: '50%',
    borderColor: 'gray',
    padding: 10,
    margin: 0,
    borderTopWidth: 1,
  },
});
