import { Tabs } from "expo-router";
import { erpTabBarOptions, tabIcon } from "@/src/navigation/tab-options";

export default function StudentLayout() {
  const tab = erpTabBarOptions();
  return (
    <Tabs screenOptions={tab}>
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: tabIcon("home-outline") }}
      />
      <Tabs.Screen
        name="timetable"
        options={{ title: "Timetable", tabBarIcon: tabIcon("calendar-outline") }}
      />
      <Tabs.Screen
        name="report"
        options={{ title: "Exams", tabBarIcon: tabIcon("bookmark-outline") }}
      />
      <Tabs.Screen
        name="resources"
        options={{ title: "Resources", tabBarIcon: tabIcon("grid-outline") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: tabIcon("person-outline") }}
      />
    </Tabs>
  );
}
