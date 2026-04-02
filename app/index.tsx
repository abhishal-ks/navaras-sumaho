import { useEffect } from "react";
import { View, Text } from "react-native";
import { Href, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    useEffect(() => {
        const check = async () => {
            console.log('INDEX LOADED');

            const token = await AsyncStorage.getItem("token");
console.log('TOKEN:',token);

            if (!token) {
                console.log("→ going to login");
                router.replace("/(auth)/login");
                return;
            }

            const role = await AsyncStorage.getItem("role");
            console.log('ROLE:', role);

            if (role === "TEACHER") {
                console.log("→ teacher");
                router.replace("/(teacher)");
            } else if (role === "SUPER_ADMIN" || role === "SCHOOL_ADMIN") {
                console.log("→ admin");
                router.replace("/(admin)/index" as Href);
            } else if (role === "STUDENT") {
                console.log("→ student");
                router.replace("/(student)");
            } else {
                console.log("→ auth");
                router.replace("/(auth)/login");
            }
        };

        check();
    }, []);

    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
}