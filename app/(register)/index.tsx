import { login, register } from "@/store/auth";
import { RootState } from "@/store/index";
import { useState } from "react";
import {
  Alert,
  Pressable,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedError } from "@/components/ThemedError";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedButtonText } from "@/components/ThemedButtonText";
import { ThemedContent } from "@/components/ThemedContent";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ThemedRegisterText } from "@/components/ThemedRegisterText";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";

type FormData = {
  fullname: string;
  username: string;
  password: string;
  dob: Date;
};

const RegisterScreen = () => {
  const [secureText, setSecureText] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const users = useSelector((state: RootState) => state.auth?.users );
  console.log("✅ User registered", users);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      fullname: "",
      username: "",
      password: "",
      dob: new Date(),
    },
  });

  const selectedDate = watch("dob");

  const validateFullname = (fullname: string) => {
    if (!fullname.trim()) return "Fullname is required";
    if (!/^[a-zA-Z ]+$/.test(fullname))
      return "Fullname can only contain letters and spaces";
    return true;
  };

  const validateUsername = (username: string) => {
    if (!username.trim()) return "Username is required";
    if (username.length < 5)
      return "Username must be at least 5 characters long";
    if (!/^[a-z]+$/.test(username))
      return "Username can only contain lowercase letters";
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password))
      return "Password must include uppercase, lowercase, digit and special character";
    return true;
  };

  const validateDob = (dob: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return age - 1 >= 18 ? true : "You must be at least 18 years old";
    }

    return age >= 18 ? true : "You must be at least 18 years old";
  };

  const handleRegister = async (data: FormData) => {
    const { fullname, username, password, dob } = data;
console.log('data',{data})
    if (users?.some((user) => user.username === username)) {
      console.log('object')
      Alert.alert("Error", "Username already exists");
      return;
    }

    try {
      setLoading(true);
      dispatch(register({ fullname, username, password, dob: new Date(dob)}));
      Alert.alert("Registration Successful", "You have been registered successfully!", [
        { text: "OK", onPress: () => router.replace("/(login)") },
      ]);
    } catch (error) {
      console.error(error);
      dispatch(login({ fullname: "", username: "", password: "", dob: new Date()}));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, justifyContent: "center", padding: 24 }}
    >
      <ThemedView style={{ alignItems: "center", marginBottom: 30, padding: 16 }}>
        <ThemedText style={{ fontSize: 32, fontWeight: "bold", marginBottom: 6, color: "#333", lineHeight: 32 }}>
          Create Account
        </ThemedText>
        <ThemedText style={{ fontSize: 16, color: "#333" }}>
          Register to get started
        </ThemedText>
      </ThemedView>

      {/* Fullname */}
      <View style={{ marginBottom: 16 }}>
        <Controller
          control={control}
          name="fullname"
          rules={{ validate: validateFullname }}
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
              <Ionicons name="person-outline" size={20} color="gray" style={{ position: "absolute", left: 12 }} />
              <ThemedInput
                placeholder="Fullname"
                value={value}
                onChangeText={onChange}
                style={{flex: 1, paddingLeft: 40, borderColor: errors.fullname ? "red" : "gray" }}
              />
            </View>
          )}
        />
        {errors.fullname && <ThemedError>{errors.fullname.message}</ThemedError>}
      </View>

      {/* Username */}
      <View style={{ marginBottom: 16 }}>
        <Controller
          control={control}
          name="username"
          rules={{ validate: validateUsername }}
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
              <Ionicons name="person-outline" size={20} color="gray" style={{ position: "absolute", left: 12, padding: 2 }} />
              <ThemedInput
                placeholder="Username"
                value={value}
                onChangeText={onChange}
                style={{ flex: 1, paddingLeft: 40, borderColor: errors.username ? "red" : "gray" }}
              />
            </View>
          )}
        />
        {errors.username && <ThemedError>{errors.username.message}</ThemedError>}
      </View>

      {/* Password */}
      <View style={{ marginBottom: 16 }}>
        <Controller
          control={control}
          name="password"
          rules={{ validate: validatePassword }}
          render={({ field: { onChange, value } }) => (
            <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
              <Ionicons name="lock-closed-outline" size={20} color="gray" style={{ position: "absolute", left: 12, padding: 2 }} />
              <ThemedInput
                placeholder="Password"
                secureTextEntry={secureText}
                value={value}
                onChangeText={onChange}
                style={{flex: 1, paddingLeft: 40, borderColor: errors.password ? "red" : "gray" }}
              />
              <Pressable onPress={() => setSecureText(!secureText)} style={{ position: "absolute", right: 10 }}>
                <Ionicons name={secureText ? "eye-off" : "eye"} size={20} color="gray" />
              </Pressable>
            </View>
          )}
        />
        {errors.password && <ThemedError>{errors.password.message}</ThemedError>}
      </View>

      {/* Date of Birth */}
      <View style={{ marginBottom: 16 }}>
        <Controller
          control={control}
          name="dob"
          rules={{ validate: validateDob }}
          render={({ field: { value } }) => (
            <>
              <Pressable onPress={() => setShowDatePicker(true)} style={{ padding: 12, backgroundColor: "#eee", borderRadius: 6 }}>
                <Text style={{ color: "#333" }}>{value ? new Date(value).toDateString() : "Select Date of Birth"}</Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date(value)}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setValue("dob", date);
                    }
                  }}
                  maximumDate={new Date()}
                  minimumDate={new Date("1900-01-01")}
                />
              )}
            </>
          )}
        />
        {errors.dob && <ThemedError>{errors.dob.message}</ThemedError>}
      </View>

      {/* Submit */}
      <ThemedButton onPress={handleSubmit(handleRegister)} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <ThemedButtonText>Register</ThemedButtonText>}
      </ThemedButton>

      {/* Footer */}
      <ThemedContent>
        <ThemedContainer>Already have an account?</ThemedContainer>
        <ThemedRegisterText onPress={() => router.push("/(login)")}>Login</ThemedRegisterText>
      </ThemedContent>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
 