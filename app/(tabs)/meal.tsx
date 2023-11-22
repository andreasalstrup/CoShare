import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Text, View } from '../../components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';


const getCurrentWeek = () => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 0);
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const currentWeek = Math.floor((Number(currentDate) - Number(startOfYear)) / oneWeek);
  return currentWeek;
};

const getCurrentWeekDays = (weekNumber: number) => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate.getFullYear(), 0, 1 + (weekNumber - 1) * 7);
  const days = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const getDayName = (dayIndex: number) => daysOfWeek[dayIndex];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dayName = getDayName(date.getDay());
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();

    const formattedDate = `${dayName}, ${day} ${month}`;
    days.push(formattedDate);
  }
  return days;
};

export default function MealScreen() {
  const [editableDay, setEditableDay] = useState(null);
  const [dayTexts, setDayTexts] = useState(['', '', '', '', '', '', '']);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());

  const handleDayClick = (index: number) => {
    setEditableDay(index);
  };

  const handleTextChange = (text: string) => {
    if (editableDay !== null) {
      const updatedTexts = [...dayTexts];
      updatedTexts[editableDay] = text;
      setDayTexts(updatedTexts);
    }
  };

  const showPreviousWeek = () => {
    setCurrentWeek(prevWeek => prevWeek - 1);
  };

  const showNextWeek = () => {
    setCurrentWeek(prevWeek => prevWeek + 1);
  };

  const renderDays = () => {
    const weekDays = getCurrentWeekDays(currentWeek);
    return weekDays.map((day, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleDayClick(index)}
        style={[
          styles.dayContainer,
          { backgroundColor: index % 2 === 0 ? '#eeeeee' : '#D3D3D3' },
        ]}
      >
        <Text style={[styles.weekdaysText, { fontWeight: 'bold' }]}>{day}</Text>
        {editableDay === index ? (
          <TextInput
            style={[styles.weekdaysText, { fontStyle: 'italic' }]}
            value={dayTexts[index]}
            onChangeText={handleTextChange}
            onBlur={() => setEditableDay(null)}
            autoFocus
          />
        ) : (
          <Text style={styles.weekdaysText}>{dayTexts[index]}</Text>
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={showPreviousWeek}>
          <FontAwesome5
            name="chevron-left"
            size={24} 
            color="black"
            style={styles.arrowButtons}
          />
        </Pressable>
        <Text style={styles.headerText}>Week {currentWeek}</Text>
        <Pressable onPress={showNextWeek}>
          <FontAwesome5
            name="chevron-right"
            size={24} 
            color="black"
            style={styles.arrowButtons}
          />
        </Pressable>
      </View>
      <View style={styles.weekdaysContainer}>{renderDays()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    padding: 20,
    fontWeight: 'bold',
  },
  weekdaysContainer: {
    flex: 1,
    flexWrap: 'wrap',
    top: 3,
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
  }
});