import React from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import { Info, PrimaryButton, Screen } from "@/src/ui/basic";

export default function ParentHome() {
  const { logout } = useAuth();

  return (
    <Screen title="Parent">
      <Info>
        Parent role is recognized in routing. Parent-specific endpoints/UI can be added once backend features land.
      </Info>
      <PrimaryButton title="Logout" onPress={logout} />
    </Screen>
  );
}

