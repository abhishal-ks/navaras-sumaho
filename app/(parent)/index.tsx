import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Info, PrimaryButton, Screen, ErrorBox } from "@/src/ui/basic";
import { LogoutButton } from "@/src/ui/logout-button";
import { Href, router } from "expo-router";
import * as ParentsApi from "@/src/api/parents";
import { ListRow, SectionHeader } from "@/src/ui/erp-widgets";

export default function ParentHome() {
  const childrenQuery = useQuery({
    queryKey: ["parent", "children"],
    queryFn: () => ParentsApi.getMyChildren(),
  });

  return (
    <Screen title="Parent">
      {childrenQuery.isLoading ? <Info loading>Loading children…</Info> : null}
      {childrenQuery.isError ? <ErrorBox message={(childrenQuery.error as Error)?.message ?? "Failed to load children"} /> : null}
      {childrenQuery.data && childrenQuery.data.length > 0 ? (
        <>
          <SectionHeader title="My Children" />
          {childrenQuery.data.map((child) => (
            <ListRow
              key={child.studentId}
              title={child.name}
              subtitle={`Admission: ${child.admissionNumber} | Class: ${child.className}`}
              onPress={() => router.push(`/(parent)/child/${child.studentId}` as Href)}
            />
          ))}
        </>
      ) : !childrenQuery.isLoading ? (
        <Info>No children linked to this account</Info>
      ) : null}

      <PrimaryButton title="Announcements" onPress={() => router.push("/(parent)/alerts" as Href)} />
      <LogoutButton />
    </Screen>
  );
}

