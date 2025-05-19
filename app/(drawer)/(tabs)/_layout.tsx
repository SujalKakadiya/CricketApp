import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }} initialRouteName='Home'>    
      <Tabs.Screen
        name="AllTodosScreen"
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="DeleteTodosScreen"
        options={{
          title: 'Delete',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="trash" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Home"
        options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
        />
       <Tabs.Screen
        name="HistoryTodosScreen"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="UpdateTodosScreen"
        options={{
          title: 'Edit',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="edit" color={color} />,
        }}
      />
    </Tabs>
  );
}
