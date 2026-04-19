import { Tabs } from "expo-router";
import { erpTabBarOptions, tabIcon } from "@/src/navigation/tab-options";

export default function SuperAdminLayout() {
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
        name="schools"
        options={{
          title: "Schools",
          tabBarIcon: tabIcon("business-outline"),
        }}
      />
      <Tabs.Screen
        name="admins"
        options={{
          title: "Admins",
          tabBarIcon: tabIcon("people-outline"),
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