import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { router } from "expo-router";
import * as StudentsApi from "@/src/api/students";
import * as AcademicsApi from "@/src/api/academics";
import * as SchoolsApi from "@/src/api/schools";
import { ErrorBox, Field, Info, PrimaryButton } from "@/src/ui/basic";
import { OptionSelector } from "@/src/ui/erp-widgets";
import { useAuth } from "@/src/features/auth/auth-store";
import { AppScreen } from "@/src/ui/app-screen";

export default function StudentsList() {
  const { me } = useAuth();
  const schoolId = (me as any)?.schoolId;

  const [classId, setClassId] = useState("");

  const schoolQuery = useQuery({
    queryKey: ["school", schoolId],
    queryFn: () => SchoolsApi.getSchool(schoolId!),
    enabled: Boolean(schoolId),
  });

  const classesQuery = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => AcademicsApi.listClasses(schoolId!),
    enabled: Boolean(schoolId),
  });

  const studentsQuery = useQuery({
    queryKey: ["students", "class", classId],
    queryFn: () => StudentsApi.listByClass(classId),
    enabled: Boolean(classId),
  });

  const classOptions = (classesQuery.data as Array<{ _id: string; name: string; section: string }>)?.map((cls) => ({
    label: `${cls.name}-${cls.section}`,
    value: cls._id,
  })) || [];

  return (
    <AppScreen title="Student List">
      <View style={{ paddingBottom: 20 }}>
        <PrimaryButton
          title="← Back"
          onPress={() => router.back()}
        />
      </View>

      {schoolQuery.data && (
        <Info>School: {schoolQuery.data.name}</Info>
      )}

      <OptionSelector
        label="Class"
        value={classId}
        onSelect={setClassId}
        options={classOptions}
      />
      <PrimaryButton title="Refresh list" onPress={() => void studentsQuery.refetch()} loading={studentsQuery.isFetching} disabled={!classId} />

      {studentsQuery.isLoading ? <Info loading>Loading students…</Info> : null}
      {studentsQuery.isError ? <ErrorBox message={(studentsQuery.error as any)?.message ?? "Failed to load"} /> : null}
      {studentsQuery.data && (
        <>
          <Info>Students in class ({studentsQuery.data.length})</Info>
          {studentsQuery.data.map((s) => (
            <Info key={s._id}>
              {s.name} - {s.admissionNumber} - {s.gender}
            </Info>
          ))}
        </>
      )}
    </AppScreen>
  );
}
