import { useState } from "react";
import { useAuth } from "@/src/features/auth/auth-store";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { erp } from "@/src/theme/erp";

export default function AcademicClasses() {
  const { me } = useAuth();
  const schoolId = (me && "schoolId" in me ? me.schoolId : null) as string | null;

  const [className, setClassName] = useState("");
  const [classSection, setClassSection] = useState("");

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
    <AppScreen title="Academic Classes">
      <View style={styles.container}>
        {error ? <ErrorBox message={error} /> : null}

        <Info>
          schoolId: {schoolId ?? "(none)"}{"\n"}
          Last response: {last ? JSON.stringify(last) : "(none)"}
        </Info>

        <Info>Class (requires an active year)</Info>
        <Field label="Class name" value={className} onChangeText={setClassName} placeholder="Grade 6" />
        <Field label="Section" value={classSection} onChangeText={setClassSection} placeholder="A" />
        <PrimaryButton
          title="Create class"
          onPress={() => {
            if (!schoolId) {
              setError("No schoolId yet. Create a school first.");
              return;
            }
            void run(() => AcademicsApi.createClass(schoolId, { name: className, section: classSection }));
          }}
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