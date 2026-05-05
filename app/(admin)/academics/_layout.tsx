import { Stack } from "expo-router";

export default function AcademicsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="years" />
      <Stack.Screen name="classes" />
      <Stack.Screen name="subjects" />
      <Stack.Screen name="assignments" />
    </Stack>
  );
}