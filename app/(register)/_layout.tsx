// This file is used to define the layout for the register screen
// and to set up the navigation stack for the register flow.
import { Stack } from "expo-router";

export default function Layout() {
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index"/>
      </Stack>
  );
}