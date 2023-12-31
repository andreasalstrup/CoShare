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
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ].tabIconSelected,
        tabBarActiveBackgroundColor: Colors[colorScheme].tabIconSelectedBackground,
      }}>
      <Tabs.Screen
        name="shoppingList"
        options={{          
          title: 'List',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{          
          title: 'Expenses',
          tabBarIcon: ({ color }) => <TabBarIcon name="dollar-sign" color={color} />,
        }}
      />
      <Tabs.Screen
        name="meal"
        options={{          
          title: 'Meal Plan',
          tabBarIcon: ({ color }) => <TabBarIcon name="hamburger" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notice"
        options={{          
          title: 'Notice Board',
          tabBarIcon: ({ color }) => <TabBarIcon name="info-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{          
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
