import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, Info, PrimaryButton } from "@/src/ui/basic";
import * as AcademicsApi from "@/src/api/academics";
import { View, Text, StyleSheet } from "react-native";
import { erp } from "@/src/theme/erp";

export default function ChildDetails() {
    const { studentId } = useLocalSearchParams<{ studentId: string }>();

    const reportQuery = useQuery({
        queryKey: ["reports", "student", studentId],
        queryFn: () => AcademicsApi.getStudentReport(studentId!),
        enabled: Boolean(studentId),
    });

    return (
        <AppScreen title="Child Details">
            {!studentId ? (
                <Info>Student ID not provided</Info>
            ) : (
                <>
                    <View style={styles.idDisplay}>
                        <Text style={styles.idLabel}>Student ID</Text>
                        <Text style={styles.idValue}>{studentId}</Text>
                    </View>
                    <PrimaryButton
                        title="View Report Card"
                        onPress={() => {
                            // For now, show the report here
                        }}
                    />
                    <PrimaryButton
                        title="View Attendance"
                        onPress={() => {
                            // TODO: implement attendance view
                        }}
                    />

                    {reportQuery.isLoading ? <Info loading>Loading report…</Info> : null}
                    {reportQuery.isError ? <ErrorBox message={(reportQuery.error as any)?.message ?? "Failed to load report"} /> : null}
                    {reportQuery.data ? (
                        <View style={styles.reportBox}>
                            <Text style={styles.reportText}>{JSON.stringify(reportQuery.data, null, 2)}</Text>
                        </View>
                    ) : null}
                </>
            )}
        </AppScreen>
    );
}

const styles = StyleSheet.create({
    idDisplay: {
        backgroundColor: erp.colors.surface,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    idLabel: {
        fontSize: 14,
        color: erp.colors.textSecondary,
        marginBottom: 4,
    },
    idValue: {
        fontSize: 16,
        color: erp.colors.textPrimary,
        fontWeight: "600",
    },
    reportBox: {
        backgroundColor: erp.colors.surface,
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
    },
    reportText: {
        fontFamily: "monospace",
        fontSize: 12,
        color: erp.colors.textPrimary,
    },
});