import { Tabs } from "expo-router";

export default function TeacherLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="attendance" />
            <Tabs.Screen name="announcements" />
        </Tabs>
    );
}