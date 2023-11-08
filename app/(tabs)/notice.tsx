import React, { useState } from 'react';
import { StyleSheet, TextInput, useColorScheme, SafeAreaView, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';

export default function NoticeScreen() {
  const [houseRules, setHouseRules] = useState('');
  const users = [
    { name: 'Test Bruger', phone: '12 34 56 78', email: 'testbruger42@gmail.com' },
    { name: 'Andreas Alstrup', phone: '87 65 43 21', email: 'andreas.alstrup@gmail.com' },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Text style={styles.title}>Household Rules</Text>
          <TextInput
            style={styles.input}
            placeholder="Click to make rules"
            value={houseRules}
            onChangeText={(text) => setHouseRules(text)}
            editable
            multiline
          />
          <Text style={styles.title}>Contact Information</Text>
          {users.map((user, index) => (
            <View key={index} style={styles.userCard}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text>Phone: {user.phone}</Text>
              <Text>Email: {user.email}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    borderColor: 'gray',
    padding: 10,
    margin: 0,
    color: 'white',
    backgroundColor: '#5CBCA9',
    borderTopWidth: 1,
    borderBotWidth: 1,
  },
  input: {
    maxHeight: '50%',
    borderColor: 'gray',
    padding: 10,
    margin: 0,
    borderTopWidth: 1,
  },
  userCard: {
    border: 1,
    borderColor: 'gray',
    backgroundColor: 'rgba(92, 188, 169, 0.27)',
    padding: 10,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
