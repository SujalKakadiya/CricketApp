// This file is used to define the layout for the login screen
// and to set up the navigation stack for the login flow.
import { Stack } from "expo-router";

export default function Layout() {
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"/>
      </Stack>
  );
}