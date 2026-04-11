import { useQuery } from "@tanstack/react-query";
import * as LearningApi from "@/src/api/learning";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, Info } from "@/src/ui/basic";
import { ListRow, SectionHeader } from "@/src/ui/erp-widgets";
import { Text } from "react-native";

export default function StudentResources() {
  const q = useQuery({
    queryKey: ["resources"],
    queryFn: () => LearningApi.listResources(),
  });

  return (
    <AppScreen title="Resources" subtitle="Materials">
      {q.isLoading ? <Info loading>Loading resources…</Info> : null}
      {q.isError ? <ErrorBox message={(q.error as Error)?.message ?? "Failed"} /> : null}
      {!q.isLoading && q.data?.length === 0 ? (
        <Info>Worksheets, links, and files will appear here.</Info>
      ) : (
        <>
          <SectionHeader title="Available Resources" />
          {q.data?.map((r) => (
            <ListRow
              key={r._id}
              left={<Text style={{ fontSize: 18, marginRight: 12 }}>📚</Text>}
              title={r.title}
              subtitle={r.description?.slice(0, 60)}
            />
          ))}
        </>
      )}
    </AppScreen>
  );
}
