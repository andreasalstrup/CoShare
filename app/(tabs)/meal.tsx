import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';


const getCurrentWeek = () => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 0);
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const currentWeek = Math.floor((Number(currentDate) - Number(startOfYear)) / oneWeek);
  return currentWeek;
};

const getCurrentWeekDays = () => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
  const days = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const getDayName = (dayIndex: number) => {return daysOfWeek[dayIndex]};

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
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Week {getCurrentWeek()}</Text>
      </View>
      <View style={styles.weekdaysContainer}>
        {getCurrentWeekDays().map((day, index) => (
          <View key={index} style={[styles.dayContainer, { backgroundColor: index % 2 == 0 ? '#eeeeee' : '#D3D3D3' }]}>
            <Text>{day}</Text>
            <Text>{/* user.name */}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  headerContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    padding: 10,
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
    justifyContent: 'center',
    padding: 5,
    borderBottomWidth: 1,
  },
});