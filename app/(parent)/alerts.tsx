import { useQuery } from "@tanstack/react-query";
import * as AnnouncementsApi from "@/src/api/announcements";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, Info } from "@/src/ui/basic";
import { ListRow, SectionHeader } from "@/src/ui/erp-widgets";

export default function ParentAlerts() {
  const q = useQuery({
    queryKey: ["announcements", "my", "parent"],
    queryFn: () => AnnouncementsApi.my(),
  });

  return (
    <AppScreen title="Alerts" subtitle="School notices">
      {q.isLoading ? <Info loading>Loading announcements…</Info> : null}
      {q.isError ? <ErrorBox message={(q.error as Error)?.message ?? "Failed"} /> : null}
      {!q.isLoading && q.data?.length === 0 ? (
        <Info>No announcements yet</Info>
      ) : (
        <>
          <SectionHeader title="Feed" />
          {q.data?.map((a) => (
            <ListRow key={a._id} title={a.title} subtitle={a.message.slice(0, 80)} />
          ))}
        </>
      )}
    </AppScreen>
  );
}
