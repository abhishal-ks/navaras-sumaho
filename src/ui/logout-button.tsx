import React, { useState } from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import { PrimaryButton } from "@/src/ui/basic";
import { Alert } from "react-native";

export function LogoutButton() {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Logout Failed", "Unable to logout. Please try again.");
    }
  };

  return <PrimaryButton title="Logout" onPress={handleLogout} loading={isLoading} />;
}
