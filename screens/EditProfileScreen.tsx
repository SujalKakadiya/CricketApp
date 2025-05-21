import React, { useState } from 'react';
import { View,Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '@/store/actions/authstore'; // Update path

export default function EditProfileScreen({ }) {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  const [fullname, setFullname] = useState(user?.fullname || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState(user?.photo || null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!fullname.trim() || !username.trim() || !email.trim()) {
      Alert.alert('Please fill all fields');
      return;
    }

    // Optional: Add email validation here
    const updatedData = { fullname, username, email, photo: image };
    dispatch(updateUserProfile(updatedData)); // Adjust action logic as needed
    Alert.alert('Profile updated successfully');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: image || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={styles.editIcon}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          value={fullname}
          onChangeText={setFullname}
          placeholder="Enter full name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#007AFF',
    padding: 6,
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
