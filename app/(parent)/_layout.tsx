import { Tabs } from "expo-router";
import { erpTabBarOptions, tabIcon } from "@/src/navigation/tab-options";

export default function ParentLayout() {
  const tab = erpTabBarOptions();
  return (
    <Tabs screenOptions={tab}>
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon("home-outline") }}
      />
      <Tabs.Screen
        name="results"
        options={{ title: "Results", tabBarIcon: tabIcon("ribbon-outline") }}
      />
      <Tabs.Screen
        name="attendance"
        options={{ title: "Attendance", tabBarIcon: tabIcon("clipboard-outline") }}
      />
      <Tabs.Screen
        name="alerts"
        options={{ title: "Alerts", tabBarIcon: tabIcon("notifications-outline") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: tabIcon("person-outline") }}
      />
    </Tabs>
  );
}
