import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createDrawerNavigator();
const Drawer = withLayoutContext(Navigator);

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer screenOptions={{ headerShown: false }}>
        <Drawer.Screen
          name="(tabs)"
          options={{ 
            drawerLabel: 'Home',
            title: 'Home',
          }}
        />
        <Drawer.Screen
          name="user"
          options={{
            drawerLabel: 'User',
            title: 'User Profile',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
