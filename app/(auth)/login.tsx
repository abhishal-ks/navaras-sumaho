import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { api } from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            const token = res.data.accessToken;
            await AsyncStorage.setItem("token", token);

            // 🔥 fetch role AFTER login
            const me = await api.get("/auth/me");

            const role = me.data.role;
            await AsyncStorage.setItem("role", role);

            // go to app
            router.replace("/(tabs)");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Log in to continue your journey</Text>

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#9a8c98"
                        style={styles.input}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#9a8c98"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff8f0",
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: 320,
        backgroundColor: "#fef6e4",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 6,
    },
    title: {
        fontSize: 22,
        color: "#5f4b32",
        fontWeight: "600",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: "#a68a64",
        marginBottom: 18,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
        color: "#5f4b32",
        borderWidth: 1,
        borderColor: "#e6ccb2",
    },
    button: {
        backgroundColor: "#e07a5f",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 6,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
});