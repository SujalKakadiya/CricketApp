import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const user = useSelector((state: any) => state.auth?.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const avatarUri = user?.photo || 'https://media.gettyimages.com/id/2204322609/photo/dubai-united-arab-emirates-virat-kohli-of-india-celebrates-after-the-icc-champions-trophy.jpg?s=612x612&w=0&k=20&c=znWfq4fOA1UCaVRLiOiVhEfXAOU6pV--_QLSm7Dg9Io=';

  const ActionItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      {icon}
      <Text style={styles.actionLabel}>{label}</Text>
      <Feather name="chevron-right" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.fullname || 'Sujal Kakadiya'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'sujalk10@gmail.com'}</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('../screens/EditProfile')}>
          <Ionicons name="create-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Action Tiles */}
      <View style={styles.tilesContainer}>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Orders')}>
          <MaterialIcons name="shopping-bag" size={28} color="#007AFF" />
          <Text style={styles.tileLabel}>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Wishlist')}>
          <Ionicons name="heart-outline" size={28} color="#FF3B30" />
          <Text style={styles.tileLabel}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Addresses')}>
          <Ionicons name="location-outline" size={28} color="#34C759" />
          <Text style={styles.tileLabel}>Addresses</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Coupons')}>
          <FontAwesome name="ticket" size={26} color="#FF9500" />
          <Text style={styles.tileLabel}>Coupons</Text>
        </TouchableOpacity>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <ActionItem
          icon={<Ionicons name="person-outline" size={22} color="#007AFF" />}
          label="Edit Profile"
          onPress={() => router.replace('../screens/EditProfileScreen')}
        />
        <ActionItem
          icon={<Ionicons name="lock-closed-outline" size={22} color="#007AFF" />}
          label="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <ActionItem
          icon={<Ionicons name="help-circle-outline" size={22} color="#007AFF" />}
          label="Help & Support"
          onPress={() => navigation.navigate('Help')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ccc',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  tile: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  tileLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
});
