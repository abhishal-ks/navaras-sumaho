import { useEffect } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/src/features/auth/auth-store";

export default function Index() {
    const { status, me } = useAuth();

    useEffect(() => {
        const check = async () => {
            if (status === "loading") return;

            if (status === "unauthenticated") {
                router.replace("/(auth)/login");
                return;
            }

            const resolvedRole =
                me?.role ||
                (await AsyncStorage.getItem("role")) ||
                "UNKNOWN";

            if (resolvedRole === "TEACHER") {
                router.replace("/(teacher)");
            } else if (resolvedRole === "SUPER_ADMIN" || resolvedRole === "SCHOOL_ADMIN") {
                router.replace("/(admin)");
            } else if (resolvedRole === "STUDENT") {
                router.replace("/(student)");
            } else if (resolvedRole === "PARENT") {
                router.replace("/(parent)");
            } else {
                router.replace("/(auth)/login");
            }
        };

        check();
    }, [status, me]);

    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
}