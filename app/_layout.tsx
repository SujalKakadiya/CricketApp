import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PaperProvider } from "react-native-paper";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { persistor, store } from '@/store';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const prepare = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <PaperProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(login)" options={{ headerShown: false }} />
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </PaperProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
