import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from '../../components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import Colors from '../../constants/Colors';


function getCurrentWeekDays(weekNumber: number, yearNumber: number) {
  const startOfWeek = moment().isoWeekYear(yearNumber).isoWeek(weekNumber).startOf('isoWeek');
  const daysFormatted = [];

  for (let i = 0; i < 7; i++) {
    const formattedDay = startOfWeek.clone().add(i, 'days').format('ddd, D MMM');
    daysFormatted.push(formattedDay);
  }
  return daysFormatted;
}

export default function MealScreen() {
  const [editableDay, setEditableDay] = useState<number | null>(null);
  const [weekTexts, setWeekTexts] = useState<{ [key: string]: DayInfo[] }>({});  
  const [currentWeek, setCurrentWeek] = useState(moment().week());
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [weekKey, setWeekKey] = useState(moment().week().toString() + moment().year().toString())

  interface DayInfo {
    text: string;
  }

  const initialDayInfo: DayInfo = { text: '' };

  useEffect(() => { // Pending GunDB integration: This function should instead get the meal plan from GunDB
    if (!weekTexts[weekKey]) {
      const initialTexts = Array(7).fill(initialDayInfo);
      setWeekTexts(prevTexts => ({ ...prevTexts, [weekKey]: initialTexts }));
    }

  }, [weekKey, weekTexts, setCurrentYear]);

  const handleDayClick = (index: number) => {
    setEditableDay(index);
  };

  const handleTextChange = (text: string) => {
    if (editableDay !== null) {
      let texts = weekTexts[weekKey]
      texts[editableDay] = {text: text}      
      setWeekTexts({[weekKey]: texts});
      // Pending GunDB integration: After having handled the text change, it should save the meal plan to GunDB
    }
  };

  const showPreviousWeek = () => {
    let newWeek = (currentWeek === 1 ? 52 : currentWeek - 1)
    let newYear = (currentWeek <= 1 ? currentYear - 1 : currentYear)
    setCurrentWeek(newWeek);
    setCurrentYear(newYear)
    setWeekKey(newWeek.toString() + newYear.toString())
  };

  const showNextWeek = () => {
    let newWeek = currentWeek === 52 ? 1 : currentWeek + 1
    let newYear = currentWeek >= 52 ? currentYear + 1 : currentYear
    setCurrentWeek(newWeek);
    setCurrentYear(newYear)
    setWeekKey(newWeek.toString() + newYear.toString())
  };

  const renderDays = () => {
    const weekDays = getCurrentWeekDays(currentWeek, currentYear);
    const textsForCurrentWeek = weekTexts[weekKey] || Array(7).fill(initialDayInfo);
    const colorScheme = useColorScheme() ?? 'light';

    return weekDays.map((day, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleDayClick(index)}
        style={[
          styles.dayContainer, 
          {backgroundColor: index % 2 == 0 ? Colors[colorScheme].listBackgroundColor1 : Colors[colorScheme].listBackgroundColor2},
        ]}
      >
        <Text style={[styles.weekdaysText, { fontWeight: 'bold' }]}>{day}</Text>
        {editableDay === index ? (
          <TextInput
            style={[styles.weekdaysText, { fontStyle: 'italic', color: Colors[colorScheme].text }]}
            value={textsForCurrentWeek[index].text}
            onChangeText={handleTextChange}
            onBlur={() => setEditableDay(null)}
            autoFocus
          />
        ) : (
          <Text style={styles.weekdaysText}>{textsForCurrentWeek[index].text}</Text>
        )}
      </TouchableOpacity>
    ));
  };
  
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, {backgroundColor: Colors[colorScheme].background}]}>
        <Pressable onPress={showPreviousWeek}>
          <FontAwesome5
            name="chevron-left"
            size={24}
            color={Colors[colorScheme].text}
            style={styles.arrowButtons}
          />
        </Pressable>
        <Text style={styles.headerText}>Week {currentWeek}</Text>
        <Pressable onPress={showNextWeek}>
          <FontAwesome5
            name="chevron-right"
            size={24}
            color={Colors[colorScheme].text}
            style={styles.arrowButtons}
          />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.weekdaysContainer}>{renderDays()}</View>
      </ScrollView>
    </View>
  );
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