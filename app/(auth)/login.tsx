import { View, TextInput, Button, StyleSheet } from "react-native";
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

            // go to app
            router.replace("/(tabs)");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        placeholder="Password"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={setPassword}
                    />
                    <Button title="Login" onPress={handleLogin} />
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
        padding: 20,
    },
    form: {
        width: "100%",
        maxWidth: 300,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
    },
});