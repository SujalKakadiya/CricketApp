import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { withLayoutContext, useRouter } from 'expo-router';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

const { Navigator } = createDrawerNavigator();
const Drawer = withLayoutContext(Navigator);

function CustomDrawerContent(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  });
  
  // Try to get user data from Redux state first
  // Replace this with your actual selector to get user info from Redux store
  const userFromRedux = useSelector(state => state.auth.user);
  
  useEffect(() => {
    // If we have user data in Redux, use it
    if (userFromRedux) {
      setUserData({
        name: userFromRedux.name || userFromRedux.username || 'User',
        email: userFromRedux.email || ''
      });
      return;
    }
  }, [userFromRedux]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Dispatch logout action to clear Redux state
              dispatch(logout());
              
              // Navigate to login screen, using replace to prevent going back
              router.replace('/(login)');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle" size={60} color="#007AFF" />
        </View>
        <Text style={styles.profileName}>{userData.name}</Text>
        {userData.email ? (
          <Text style={styles.profileEmail}>{userData.email}</Text>
        ) : null}
      </View>
      
      {/* Drawer Items */}
      <DrawerItemList {...props} />
      
      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerTintColor: '#007AFF',
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#333333',
          drawerLabelStyle: styles.drawerLabel,
          drawerItemStyle: styles.drawerItem,
          drawerIconStyle: styles.drawerIcon
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{ 
            drawerLabel: 'Home', 
            title: 'Home',
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={22} color={color} />
            )
          }}
        />
        <Drawer.Screen
          name="user"
          options={{ 
            drawerLabel: 'User Profile', 
            title: 'User Profile',
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            )
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{ 
            drawerLabel: 'Settings', 
            title: 'Settings',
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={22} color={color} />
            )
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    marginBottom: 8,
    alignItems: 'center',
  },
  profileIcon: {
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  logoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    marginTop: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  drawerItem: {
    borderRadius: 8,
  },
  drawerIcon: {
    marginRight: 8, // Add space between icon and label
  }
});