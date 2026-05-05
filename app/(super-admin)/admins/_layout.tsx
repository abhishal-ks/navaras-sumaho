import { Stack } from "expo-router";

export default function AdminsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="schools" />
      <Stack.Screen name="administrators" />
    </Stack>
  );
}
