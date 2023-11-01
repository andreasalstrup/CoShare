import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { StyleSheet } from 'react-native';
import List from '../../../components/List';
import { ScrollView } from 'react-native-gesture-handler';

const DATA = [
  {
      name: 'Bananas',
      data: [{user: "Test bruger", date: "2020.11.01", price: 3}],
  },
  {
      name: 'Chorizo',
      data: [{user: "Andreas", date: "2020.10.29", price: 31}],
  },
  {
      name: 'Beans',
      data: [{user: "Mike", date: "2020.10.11", price: 5}],
  },
  {
      name: 'Apple',
      data: [{user: "Martin", date: "2020.11.05", price: 2}],
  },
  {
      name: 'Orange',
      data: [{user: "Emil", date: "2020.11.02", price: 2}],
  },
  {
    name: 'Apple',
    data: [{user: "Martin", date: "2020.11.05", price: 2}],
  },
  {
      name: 'Orange',
      data: [{user: "Emil", date: "2020.11.02", price: 2}],
  },
  {
    name: 'Apple',
    data: [{user: "Martin", date: "2020.11.05", price: 2}],
  },
  {
      name: 'Orange',
      data: [{user: "Emil", date: "2020.11.02", price: 2}],
  },
];

export default class ListScreen extends Component {
  render() {
    return (
        <List sections={DATA}/>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: "white"
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
  });