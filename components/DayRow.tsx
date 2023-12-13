import { Text, TouchableOpacity, StyleSheet, useColorScheme, TextInput } from 'react-native'
import React from 'react'
import Colors from '../constants/Colors';

type DayRowProps = {
  WeekDay: string, 
  index: number, text: string | undefined, 
  editableDay: number | null, 
  handleDayClick: (day: number) => void, 
  handleTextChange: (text: string) => void
}

export default function DayRow({ WeekDay, index, text, editableDay, handleDayClick, handleTextChange }: DayRowProps) {

  const colorScheme = useColorScheme() ?? 'light';  
  return (
    <TouchableOpacity
            key={index}
            onPress={() => handleDayClick(index)}
            style={[
              styles.dayContainer, 
              {backgroundColor: index % 2 == 0 ? Colors[colorScheme].listBackgroundColor1 : Colors[colorScheme].listBackgroundColor2},
            ]}
          >
            <Text style={[styles.weekdaysText, { fontWeight: 'bold', color: Colors[colorScheme].text }]}>{WeekDay}</Text>
            {editableDay === index ? (
              <TextInput
                style={[styles.weekdaysText, { fontStyle: 'italic', color: Colors[colorScheme].text }]}
                value={text}
                onChangeText={handleTextChange}
                onBlur={() => editableDay = null}
                autoFocus
              />
            ) : (
              <Text style={[styles.weekdaysText, {color: Colors[colorScheme].text}]}>{text}</Text>
            )}
          </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
    },
    headerText: {
      fontSize: 24,
      padding: 20,
      fontWeight: 'bold',
    },
    weekdaysContainer: {
      flex: 1,
      flexWrap: 'wrap',
    },
    dayContainer: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
    },
    weekdaysText: {
      fontSize: 18,
    },
    arrowButtons: {
      paddingLeft: 20,
      paddingRight: 20,
    },
    scrollViewContent: {
      flexGrow: 1,
    },
  });