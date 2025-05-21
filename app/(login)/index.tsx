import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Pressable, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import Ionicons from '@expo/vector-icons/Ionicons';
import { login, selectAuth } from '@/store/auth';
import { selectUsers } from '@/store/selectors/authselectors';
import { AppDispatch } from '@/store';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedError } from '@/components/ThemedError';

const FormField = ({ icon, placeholder, value, onChangeText, secureTextEntry, toggleSecure, error }) => (
  <View style={{ marginBottom: 16 }}>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: error ? 'red' : 'transparent'
    }}>
      <Ionicons name={icon} size={20} color="gray" style={{ marginRight: 5 }} />
      <ThemedInput
        placeholder={placeholder}
        style={{ flex: 1 }}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        value={value}
        autoCapitalize="none"
      />
      {toggleSecure && (
        <Pressable onPress={toggleSecure}>
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={20} color="gray" />
        </Pressable>
      )}
    </View>
    {error && <ThemedError>{error.message}</ThemedError>}
  </View>
);

export default function LoginScreen() {
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const users = useSelector(selectUsers);
  const auth = useSelector(selectAuth);
 
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: '', password: '' },
  });

  useEffect(() => {
  if (auth.isLoggedIn && auth.currentUser) {
    router.replace('/(drawer)/(tabs)/Home');
  }
}, [auth]);


  const onLogin = async ({ username, password }) => {
    if (loading) return;
    setLoading(true);
    try {
      const resultAction = await dispatch(login({ username, password }));
      if (resultAction.payload) {
        Alert.alert('Success', 'Login successful');
        router.replace('/(drawer)/(tabs)/Home');
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' }}
    >
      <View style={{ alignItems: 'center', marginBottom: 40 }}>
        <Ionicons name="logo-apple" size={60} color="#333" />
        <Text style={{ fontSize: 28, fontWeight: '700', marginTop: 10 }}>Welcome Back</Text>
        <Text style={{ color: '#666' }}>Login to continue</Text>
      </View>

      <Controller
        control={control}
        name="username"
        rules={{
          validate: (username) => {
            if (!username.trim()) return 'Username is required';
            if (username.length < 5) return 'Min 5 characters';
            if (!/^[a-z]+$/.test(username)) return 'Only lowercase letters allowed';
            return true;
          }
        }}
        render={({ field: { onChange, value } }) => (
          <FormField
            icon="person-outline"
            placeholder="Username"
            value={value}
            onChangeText={onChange}
            error={errors.username}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          validate: (password) => {
            if (!password.trim()) return 'Password is required';
            if (password.length < 8) return 'Min 8 characters';
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password))
              return 'Stronger password required';
            return true;
          }
        }}
        render={({ field: { onChange, value } }) => (
          <FormField
            icon="lock-closed-outline"
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry={secureText}
            toggleSecure={() => setSecureText(!secureText)}
            error={errors.password}
          />
        )}
      />

      <Pressable onPress={() => Alert.alert('Reset Password')} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
        <Text style={{ color: '#0a84ff', fontWeight: '500' }}>Forgot Password?</Text>
      </Pressable>

      <Pressable
        onPress={handleSubmit(onLogin)}
        style={{
          backgroundColor: '#0a84ff',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginBottom: 20
        }}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>Login</Text>}
      </Pressable>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text>Don't have an account? </Text>
        <Pressable onPress={() => router.push('/(register)')}>
          <Text style={{ color: '#0a84ff', fontWeight: '600' }}>Register</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
