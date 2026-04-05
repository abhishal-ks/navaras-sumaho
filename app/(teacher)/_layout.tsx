import { Tabs } from "expo-router";
import { erpTabBarOptions, tabIcon } from "@/src/navigation/tab-options";

export default function TeacherLayout() {
  const tab = erpTabBarOptions();
  return (
    <Tabs screenOptions={tab}>
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon("home-outline") }}
      />
      <Tabs.Screen
        name="classes"
        options={{ title: "Classes", tabBarIcon: tabIcon("book-outline") }}
      />
      <Tabs.Screen
        name="students"
        options={{ title: "Students", tabBarIcon: tabIcon("search-outline") }}
      />
      <Tabs.Screen
        name="announcements"
        options={{ title: "Alerts", tabBarIcon: tabIcon("notifications-outline") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: tabIcon("person-outline") }}
      />
      <Tabs.Screen name="attendance" options={{ href: null }} />
      <Tabs.Screen name="assignments" options={{ href: null }} />
    </Tabs>
  );
}
