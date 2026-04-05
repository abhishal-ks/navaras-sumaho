import { AppScreen } from "@/src/ui/app-screen";
import { Info } from "@/src/ui/basic";

export default function ParentAttendance() {
  return (
    <AppScreen title="Attendance" subtitle="Daily summary">
      <Info>
        Attendance history for your child will appear here when the backend exposes a parent-safe read API.
      </Info>
    </AppScreen>
  );
}
