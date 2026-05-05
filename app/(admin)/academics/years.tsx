import { useState } from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { OptionSelector } from "@/src/ui/erp-widgets";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { erp } from "@/src/theme/erp";

export default function AcademicYears() {
  const { me } = useAuth();
  const schoolId = (me && "schoolId" in me ? me.schoolId : null) as string | null;

  const [yearName, setYearName] = useState("");
  const [yearMode, setYearMode] = useState<"2024-25" | "2025-26" | "2026-27" | "other">("2026-27");
  const [activateYearId, setActivateYearId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<any | null>(null);

  const run = async (fn: () => Promise<any>) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fn();
      setLast(res);
      return res;
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title="Academic Years">
      <View style={styles.container}>
        {error ? <ErrorBox message={error} /> : null}

        <Info>
          schoolId: {schoolId ?? "(none)"}{"\n"}
          Last response: {last ? JSON.stringify(last) : "(none)"}
        </Info>

        <Info>Academic Year</Info>
        <OptionSelector
          label="Year name"
          options={[
            { label: "2024-25", value: "2024-25" },
            { label: "2025-26", value: "2025-26" },
            { label: "2026-27", value: "2026-27" },
            { label: "Other", value: "other" },
          ]}
          value={yearMode}
          onSelect={setYearMode}
        />
        {yearMode === "other" ? (
          <Field label="Custom year name" value={yearName} onChangeText={setYearName} placeholder="2026-27" />
        ) : null}
        <PrimaryButton
          title="Create academic year"
          onPress={() => {
            if (!schoolId) {
              setError("No schoolId yet. Create a school first.");
              return;
            }
            void run(() =>
              AcademicsApi.createAcademicYear(schoolId, {
                name: yearMode === "other" ? yearName : yearMode,
              })
            );
          }}
          loading={loading}
        />

        <Field label="Academic year ID to activate" value={activateYearId} onChangeText={setActivateYearId} placeholder="paste year _id" />
        <PrimaryButton
          title="Activate academic year"
          onPress={() => void run(() => AcademicsApi.activateAcademicYear(activateYearId))}
          loading={loading}
        />

        <PrimaryButton
          title="Back to Academics"
          onPress={() => router.back()}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: erp.space.lg,
    gap: erp.space.md,
  },
});