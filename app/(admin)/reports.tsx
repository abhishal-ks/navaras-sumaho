import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as AcademicsApi from "@/src/api/academics";
import { ErrorBox, Field, Info, PrimaryButton, Screen } from "@/src/ui/basic";

export default function AdminReports() {
  const [studentId, setStudentId] = useState("");

  const reportQuery = useQuery({
    queryKey: ["reports", "student", studentId],
    queryFn: () => AcademicsApi.getStudentReport(studentId),
    enabled: Boolean(studentId),
  });

  return (
    <Screen title="Reports">
      <Field label="Student ID" value={studentId} onChangeText={setStudentId} placeholder="paste student _id" />
      <PrimaryButton
        title="Fetch report"
        onPress={() => void reportQuery.refetch()}
        loading={reportQuery.isFetching}
        disabled={!studentId}
      />

      {reportQuery.isLoading ? <Info>Loading report…</Info> : null}
      {reportQuery.isError ? <ErrorBox message={(reportQuery.error as any)?.message ?? "Failed to load"} /> : null}
      {reportQuery.data ? <Info>{JSON.stringify(reportQuery.data, null, 2)}</Info> : null}
    </Screen>
  );
}

