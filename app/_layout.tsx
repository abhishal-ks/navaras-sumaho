import { Stack } from "expo-router";
import { AuthProvider } from "@/src/features/auth/auth-store";
import { QueryProvider } from "@/src/providers/query-provider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryProvider>
  );
}