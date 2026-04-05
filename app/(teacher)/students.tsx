import { AppScreen } from "@/src/ui/app-screen";
import { Field, Info } from "@/src/ui/basic";

export default function TeacherStudents() {
  return (
    <AppScreen title="Students" subtitle="Search & roster">
      <Info>Student search will connect to your roster API. For now, use class ID on the Attendance tab.</Info>
      <Field label="Search (coming soon)" value="" onChangeText={() => {}} placeholder="Name or roll" />
    </AppScreen>
  );
}
