import { Tabs } from "expo-router";
import { erpTabBarOptions, tabIcon } from "@/src/navigation/tab-options";

export default function TabLayout() {
  const tab = erpTabBarOptions();
  return (
    <Tabs screenOptions={tab}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: tabIcon("home-outline"),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: tabIcon("calendar-outline"),
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: "Announcements",
          tabBarIcon: tabIcon("notifications-outline"),
        }}
      />
    </Tabs>
  );
}