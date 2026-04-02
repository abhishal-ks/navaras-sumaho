import { Tabs } from "expo-router";

export default function AdminLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="students" options={{ title: "Students" }} />
      <Tabs.Screen name="reports" options={{ title: "Reports" }} />
      <Tabs.Screen name="academics" options={{ title: "Academics" }} />
      <Tabs.Screen name="schools" options={{ title: "School" }} />
    </Tabs>
  );
}