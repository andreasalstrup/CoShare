import { TopTabs } from "@bacons/expo-router-top-tabs";
import { useColorScheme } from "react-native";
import Colors from "../../../constants/Colors";

export default function ExpensesTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <TopTabs
      options={{swipeEnabled: false}}
      screenOptions={{
        tabBarPressColor: Colors[colorScheme ?? 'light'].topNavBarIndicatorColorTurquoise,
        tabBarIndicatorStyle: {backgroundColor: Colors[colorScheme ?? 'light'].topNavBarIndicatorColorTurquoise},
      }}>
      <TopTabs.Header>
      </TopTabs.Header>
      <TopTabs.Screen
        name="index"
        options={{
          title: 'Settle'
        }}
      />
      <TopTabs.Screen
        name="balance"
        options={{
          title: 'Balance'
        }}
      />
    </TopTabs>
  );
}