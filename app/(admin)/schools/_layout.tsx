import { Stack } from "expo-router";

export default function SchoolsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="teachers" />
    </Stack>
  );
}