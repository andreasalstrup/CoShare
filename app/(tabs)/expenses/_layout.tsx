import { useColorScheme } from "react-native";
import Colors from "../../../constants/Colors";
import { useState } from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BalanceScreen from "./balance";
import SettleScreen from ".";

const renderScene = SceneMap({
  index: SettleScreen,
  balance: BalanceScreen,
});

export default function ExpensesTabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'index', title: 'Settle' },
    { key: 'balance', title: 'Balance' },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar {...props} 
      style={{backgroundColor: Colors[colorScheme].topNavBarBackgroundColor}}
      activeColor={Colors[colorScheme].text}
      inactiveColor="gray"
      pressColor={Colors[colorScheme].topNavBarIndicatorColorTurquoise} 
      indicatorStyle={{backgroundColor: Colors[colorScheme].topNavBarIndicatorColorTurquoise}} />
  );

  return (
    <TabView
      swipeEnabled={false}
      renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex} />
  );
}