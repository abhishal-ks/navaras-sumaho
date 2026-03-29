import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");

      setIsLoggedIn(!!token);
    };

    checkAuth();
  }, []);

  return (
    <Stack
      screenOptions={{ headerShown: false }}
    />
  );
}