import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { api } from "@/src/services/api";

export default function Attendance() {
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any>({});

    const CLASS_ID = "69b95e0c2dd1f3a101c384a6";

    useEffect(() => {
        api
            .get(`/students/classes/${CLASS_ID}/students`)
            .then((res) => {
                setStudents(res.data);
            })
            .catch(console.log);
    }, []);

    const toggleAttendance = (id: string) => {
        setAttendance((prev: any) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20 }}>Take Attendance</Text>

            <FlatList
                data={students}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => toggleAttendance(item._id)}
                        style={{
                            padding: 10,
                            marginVertical: 5,
                            backgroundColor: attendance[item._id] ? "green" : "red",
                        }}
                    >
                        <Text style={{ color: "white" }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            <Button title="Submit Attendance" onPress={() => console.log(attendance)} />
        </View>
    );
}