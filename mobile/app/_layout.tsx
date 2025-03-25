import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter, useSegments, Stack, SplashScreen } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";
import { useFonts } from "expo-font";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, token, checkAuth } = useAuthStore();

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    checkAuth();
  }, []);

  //   handle navigation based on the auth state
  useEffect(() => {
    const inAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, token, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style={"dark"} />
    </SafeAreaProvider>
  );
}
