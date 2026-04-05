import { Tabs } from "expo-router";
import { erpTabBarOptions, tabIcon } from "@/src/navigation/tab-options";

export default function AdminLayout() {
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
        name="students"
        options={{
          title: "People",
          tabBarIcon: tabIcon("people-outline"),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: tabIcon("notifications-outline"),
        }}
      />
      <Tabs.Screen
        name="academics"
        options={{
          title: "Academics",
          tabBarIcon: tabIcon("school-outline"),
        }}
      />
      <Tabs.Screen
        name="schools"
        options={{
          title: "Settings",
          tabBarIcon: tabIcon("settings-outline"),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
