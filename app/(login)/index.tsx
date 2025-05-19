import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Pressable, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedError } from "@/components/ThemedError";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedButtonText } from "@/components/ThemedButtonText";
import { ThemedContent } from "@/components/ThemedContent";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ThemedRegisterText } from "@/components/ThemedRegisterText";
import { RootState, AppDispatch } from '@/store';
import {selectLoggedUser, selectUsers} from '../../store/selectors/authselectors';
import { loginUserAction } from '@/store/actions/authstore';
import { login } from '@/store/auth';

type FormData = {
  username: string;
  password: string;
};

export default function LoginScreen() {
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { username: '', password: '' },
  });

  const validateUsername = (username: string) => {
    if (!username.trim()) return 'Username is required';
    if (username.length < 5) return 'Min 5 characters';
    if (!/^[a-z]+$/.test(username)) return 'Only lowercase letters allowed';
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return 'Password is required';
    if (password.length < 8) return 'Min 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password))
      return 'Stronger password required';
    return true;
  };

  const onLogin = async ({ username, password }: FormData) => {
    if (loading) return;
    setLoading(true);

    try {
      const resultAction = await dispatch(login({ username, password }));
        if (resultAction.payload) {
        const user = resultAction.payload;
        console.log("Login successful", user);
        Alert.alert('Success', 'Login successful');
        router.replace('/(drawer)/(tabs)/Home');
      } else {
        console.error('Login failed:', resultAction.error.message);
        Alert.alert('Error', 'Invalid credentials');  
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, justifyContent: 'center', padding: 24}}
    >
      <ThemedView style={{ alignItems: 'center', marginBottom: 30, padding: 16 }}>
        <Ionicons name="logo-apple" size={60} color="#000" style={{ marginBottom: 10 }} />
        <ThemedText style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 6, color: '#333', lineHeight: 32 }}>Welcome Back</ThemedText>
        <ThemedText style={{ fontSize: 16, color: '#333' }}>Login to continue</ThemedText>
      </ThemedView>

      <View style={{ marginBottom: 16 }}>
        <Controller
          control={control}
          name="username"
          rules={{ validate: validateUsername }}
          render={({ field: { onChange, value } }) => (
            <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="person-outline" size={20} color="gray" style={{ position: 'absolute', padding: 2, left: 12 }} />
              <ThemedInput
                placeholder="Username"
                accessibilityLabel='username-input'
                value={value}
                onChangeText={onChange}
                style={{ paddingLeft: 40, flex: 1, borderColor: errors.username ? 'red' : 'gray' }}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}
        />
        {errors.username && <ThemedError>{errors.username.message}</ThemedError>}
      </View>

      <View style={{ marginBottom: 16 }}>
        <Controller
          control={control}
          name="password"
          rules={{ validate: validatePassword }}
          render={({ field: { onChange, value } }) => (
            <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="lock-closed-outline" size={20} color="gray" style={{ position: 'absolute', padding: 2, left: 12 }} />
              <ThemedInput
                placeholder="Password"
                secureTextEntry={secureText}
                value={value}
                onChangeText={onChange}
                style={{ paddingLeft: 40, flex: 1, borderColor: errors.password ? 'red' : 'gray' }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable onPress={() => setSecureText(!secureText)} style={{ padding: 8, position: 'absolute', right: 10 }}>
                <Ionicons name={secureText ? 'eye-off' : 'eye'} size={20} color="gray" />
              </Pressable>
            </View>
          )}
        />
        {errors.password && <ThemedError>{errors.password.message}</ThemedError>}
      </View>

      <Pressable onPress={() => Alert.alert('Reset Password')} style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
        <Text style={{ color: '#0a84ff', fontWeight: '600' }}>Forgot Password?</Text>
      </Pressable>

      <ThemedButton onPress={handleSubmit(onLogin)} disabled={loading}>
        {loading ? <ActivityIndicator color="#3D90D7" /> : <ThemedButtonText>Login</ThemedButtonText>}
      </ThemedButton>

      <ThemedContent>
        <ThemedContainer>Don't have an account?</ThemedContainer>
        <ThemedRegisterText onPress={() => router.push('/(register)')}>
          Register
        </ThemedRegisterText> 
      </ThemedContent>
    </KeyboardAvoidingView>
  );
}
