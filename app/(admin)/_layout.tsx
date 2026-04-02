import { Tabs } from "expo-router";

export default function AdminLayout() {
  <Tabs>
    <Tabs.Screen name="index" />
    <Tabs.Screen name="students" />
    <Tabs.Screen name="reports" />
  </Tabs>
}