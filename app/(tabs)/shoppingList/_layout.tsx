import { TopTabs } from "@bacons/expo-router-top-tabs";
import { View, useColorScheme } from "react-native";
import Colors from "../../../constants/Colors";

export default function ListTabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <TopTabs
      options={{swipeEnabled: false}}
      screenOptions={{
        tabBarPressColor: Colors[colorScheme].topNavBarIndicatorColorTurquoise,
        tabBarIndicatorStyle: {backgroundColor: Colors[colorScheme].topNavBarIndicatorColorTurquoise},
      }}>
      <TopTabs.Header>
        <View pointerEvents="none" style={{}}/>
      </TopTabs.Header>
      <TopTabs.Screen
        name="index"
        options={{
          title: 'To Be Bought'
        }}
      />
      <TopTabs.Screen
        name="bought"
        options={{
          title: 'Bought'
        }}
      />
    </TopTabs>
  );
}