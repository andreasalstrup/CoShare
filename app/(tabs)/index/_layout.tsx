import { TopTabs } from "@bacons/expo-router-top-tabs";
import { useColorScheme } from "react-native";
import Colors from "../../../constants/Colors";

export default function ListTabLayout() {
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