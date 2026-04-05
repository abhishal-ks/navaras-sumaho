import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { erp } from "@/src/theme/erp";

type IconName = ComponentProps<typeof Ionicons>["name"];

export function erpTabBarOptions(): BottomTabNavigationOptions {
  return {
    headerShown: false,
    tabBarActiveTintColor: erp.colors.accent,
    tabBarInactiveTintColor: erp.colors.tabInactive,
    tabBarStyle: {
      backgroundColor: erp.colors.tabBar,
      borderTopColor: erp.colors.border,
      borderTopWidth: 1,
      height: erp.tabBarHeight + 12,
      paddingBottom: 8,
      paddingTop: 6,
    },
    tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
  };
}

export function tabIcon(name: IconName) {
  return function TabBarIcon({
    color,
    size,
  }: {
    color: string;
    size: number;
  }) {
    return <Ionicons name={name} size={size} color={color} />;
  };
}
