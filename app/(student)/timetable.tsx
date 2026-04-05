import { AppScreen } from "@/src/ui/app-screen";
import { Info } from "@/src/ui/basic";
import { ListRow } from "@/src/ui/erp-widgets";

export default function StudentTimetable() {
  return (
    <AppScreen title="Timetable" subtitle="Today">
      <ListRow title="Mathematics" subtitle="08:00 · Room 101" />
      <ListRow title="Physics" subtitle="09:00 · Lab A" />
      <Info>Connect to timetable API when available.</Info>
    </AppScreen>
  );
}
