import { Stack } from "expo-router";

export default function AdminsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="school-admins" />
      <Stack.Screen name="assign-admins" />
    </Stack>
  );
}
