import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome5>['name'];
  color: string;
}) {
  return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
        tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].tabIconSelectedBackground,
      }}>
      <Tabs.Screen
        name="(index)"
        options={{
          headerShown: false,
          title: 'List',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          headerShown: false,
          title: 'Expenses',
          tabBarIcon: ({ color }) => <TabBarIcon name="dollar-sign" color={color} />,
        }}
      />
      <Tabs.Screen
        name="meal"
        options={{
          headerShown: false,
          title: 'Meal Plan',
          tabBarIcon: ({ color }) => <TabBarIcon name="hamburger" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notice"
        options={{
          headerShown: false,
          title: 'Notice Board',
          tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
