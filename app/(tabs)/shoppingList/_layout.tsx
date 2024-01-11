import { useColorScheme } from "react-native";
import Colors from "../../../constants/Colors";
import BoughtScreen from './bought';
import ToBeBoughtScreen from '.';
import { useState } from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const renderScene = SceneMap({
  index: ToBeBoughtScreen,
  bought: BoughtScreen,
});

export default function ListTabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'index', title: 'To Be Bought' },
    { key: 'bought', title: 'Bought' },
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