import { useQuery } from "@tanstack/react-query";
import * as TeachersApi from "@/src/api/teachers";
import { AppScreen } from "@/src/ui/app-screen";
import { ErrorBox, Info } from "@/src/ui/basic";
import { ListRow, SectionHeader } from "@/src/ui/erp-widgets";
import { Text } from "react-native";

export default function Teachers() {
  const q = useQuery({
    queryKey: ["teachers"],
    queryFn: () => TeachersApi.list(),
  });

  return (
    <AppScreen title="Teachers">
      {q.isLoading ? <Info loading>Loading teachers…</Info> : null}
      {q.isError ? <ErrorBox message={(q.error as Error)?.message ?? "Failed"} /> : null}
      {!q.isLoading && q.data?.length === 0 ? (
        <Info>No teachers found</Info>
      ) : (
        <>
          <SectionHeader title="Staff Members" />
          {q.data?.map((t) => (
            <ListRow
              key={t._id}
              left={<Text style={{ fontSize: 18, marginRight: 12 }}>👨‍🏫</Text>}
              title={t.name}
              subtitle={t.email}
            />
          ))}
        </>
      )}
    </AppScreen>
  );
}
