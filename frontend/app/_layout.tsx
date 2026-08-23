import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { useEffect } from "react";
import { LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { ToastProvider } from "@/src/components/Toast";
import { AppDataProvider } from "@/src/store/AppDataContext";
import { ThemeProvider, useTheme } from "@/src/theme/ThemeContext";

// Disable logbox errors etc so that users can see the app
// and agent works as expected.
LogBox.ignoreAllLogs(true);

// Only Expo Go (dev) has to fetch @expo/vector-icons .ttf files from a CDN;
// native/production builds and web register them synchronously.
const IS_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// In production/native builds (and web) we DO NOT hold the native splash at
// all — the Home screen paints on the very first frame with no artificial
// delay, so tapping the app icon opens Home directly. We keep the brief
// splash hold ONLY inside Expo Go, where an <Icon> mounting before its font
// family registers would throw on Android (dev-only safeguard).
if (IS_EXPO_GO) {
  SplashScreen.preventAutoHideAsync();
}

function ThemedApp() {
  const { colors, scheme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }} />
      </ErrorBoundary>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useIconFonts();

  useEffect(() => {
    // Only relevant in Expo Go, where we held the splash above.
    if (IS_EXPO_GO && (loaded || error)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Native/production builds and web render Home immediately — no gate, no
  // loading screen. Only Expo Go briefly waits for CDN icon fonts.
  if (IS_EXPO_GO && !loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppDataProvider>
              <ToastProvider>
                <ThemedApp />
              </ToastProvider>
            </AppDataProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
