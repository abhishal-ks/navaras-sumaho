import { Tabs } from "expo-router";
import { erpTabBarOptions, tabIcon } from "@/src/navigation/tab-options";

export default function SchoolAdminLayout() {
  const tab = erpTabBarOptions();
  return (
    <Tabs screenOptions={tab}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: tabIcon("home-outline"),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Students",
          tabBarIcon: tabIcon("school-outline"),
        }}
      />
      <Tabs.Screen
        name="teachers"
        options={{
          title: "Teachers",
          tabBarIcon: tabIcon("people-outline"),
        }}
      />
      <Tabs.Screen
        name="academics"
        options={{
          title: "Academics",
          tabBarIcon: tabIcon("book-outline"),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: tabIcon("document-text-outline"),
        }}
      />
    </Tabs>
  );
}