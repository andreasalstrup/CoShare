import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from '../../components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import Colors from '../../constants/Colors';
import { Weekdays } from '../../constants/MealPlan';
import DayRow from '../../components/DayRow';
import { mealPlanHandle } from '../../handlers/meal';

export default function MealScreen() {
  const mealPlan = useRef(mealPlanHandle(gun));

  const [weekTexts, setWeekTexts] = useState<WeekTexts>(undefined);
  const [editableDay, setEditableDay] = useState<Weekdays | null>(null);

  const [currentWeek, setCurrentWeek] = useState(moment().week());
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [weekKey, setWeekKey] = useState(moment().week().toString() + moment().year().toString())
  
  useEffect(() => {
    mealPlan.current.getWeekMealPlan(weekKey, (weekTexts) => {
      setWeekTexts(weekTexts);
    });
  },[weekKey])
    
  const showPreviousWeek = () => {
    const newWeek = (currentWeek === 1 ? 52 : currentWeek - 1);
    const newYear = (currentWeek <= 1 ? currentYear - 1 : currentYear);
    const weekKey = newWeek.toString() + newYear.toString();
    setCurrentWeek(newWeek);
    setCurrentYear(newYear)
    setWeekKey(weekKey)
  };

  const showNextWeek = () => {
    const newWeek = (currentWeek === 52 ? 1 : currentWeek + 1);
    const newYear = (currentWeek >= 52 ? currentYear + 1 : currentYear);
    const weekKey = newWeek.toString() + newYear.toString();
    setCurrentWeek(newWeek);
    setCurrentYear(newYear)
    setWeekKey(weekKey)
  };
  
  const handleDayClick = (day: number) => {
    setEditableDay(day);
  };

  const handleTextChange = (text: string) => {
    if (editableDay !== null) {
      let newWeekTexts: WeekTexts = {...weekTexts!, [Weekdays[editableDay]]: text}
      mealPlan.current.setWeekMealPlan(weekKey, newWeekTexts);
      setWeekTexts(newWeekTexts);
    }
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
        <View style={styles.weekdaysContainer}>
          <DayRow WeekDay='Mon' index={Weekdays.Mon} text={weekTexts?.Mon} editableDay={editableDay} handleDayClick={handleDayClick} handleTextChange={handleTextChange}></DayRow>
          <DayRow WeekDay='Tue' index={Weekdays.Tue} text={weekTexts?.Tue} editableDay={editableDay} handleDayClick={handleDayClick} handleTextChange={handleTextChange}></DayRow>
          <DayRow WeekDay='Wed' index={Weekdays.Wed} text={weekTexts?.Wed} editableDay={editableDay} handleDayClick={handleDayClick} handleTextChange={handleTextChange}></DayRow>
          <DayRow WeekDay='Thu' index={Weekdays.Thu} text={weekTexts?.Thu} editableDay={editableDay} handleDayClick={handleDayClick} handleTextChange={handleTextChange}></DayRow>
          <DayRow WeekDay='Fri' index={Weekdays.Fri} text={weekTexts?.Fri} editableDay={editableDay} handleDayClick={handleDayClick} handleTextChange={handleTextChange}></DayRow>
          <DayRow WeekDay='Sat' index={Weekdays.Sat} text={weekTexts?.Sat} editableDay={editableDay} handleDayClick={handleDayClick} handleTextChange={handleTextChange}></DayRow>
          <DayRow WeekDay='Sun' index={Weekdays.Sun} text={weekTexts?.Sun} editableDay={editableDay} handleDayClick={handleDayClick} handleTextChange={handleTextChange}></DayRow>
        </View>
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