import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as AnnouncementsApi from "@/src/api/announcements";
import { ErrorBox, Info, PrimaryButton } from "@/src/ui/basic";
import { AppScreen } from "@/src/ui/app-screen";
import { erp } from "@/src/theme/erp";

export default function AnnouncementsList() {
  const listQuery = useQuery({
    queryKey: ["announcements", "my"],
    queryFn: () => AnnouncementsApi.my(),
  });

  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    
    setDeleting(id);
    try {
      await AnnouncementsApi.deleteAnnouncement(id);
      await listQuery.refetch();
    } catch (e: any) {
      alert(e?.message ?? "Failed to delete announcement");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AppScreen title="My Announcements">
      <View style={{ paddingBottom: 20 }}>
        <PrimaryButton
          title="← Back"
          onPress={() => router.back()}
        />
      </View>

      <Info>My announcements</Info>
      <PrimaryButton title="Refresh" onPress={() => void listQuery.refetch()} loading={listQuery.isFetching} />
      {listQuery.isLoading ? <Info loading>Loading announcements…</Info> : null}
      {listQuery.isError ? <ErrorBox message={(listQuery.error as any)?.message ?? "Failed to load"} /> : null}
      {listQuery.data && listQuery.data.length > 0 ? (
        <View style={styles.announcementsList}>
          {listQuery.data.map((a) => (
            <View key={a._id} style={styles.announcementCard}>
              <View style={styles.announcementHeader}>
                <View style={styles.announcementTitleContainer}>
                  <Text style={styles.announcementTitle}>{a.title}</Text>
                  <Text style={styles.announcementAudience}>{a.audienceType === "school" ? "📢 School" : "🏫 Class"}</Text>
                </View>
                <Pressable
                  onPress={() => handleDelete(a._id)}
                  disabled={deleting === a._id}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color={erp.colors.danger} />
                </Pressable>
              </View>
              <Text style={styles.announcementMessage}>{a.message}</Text>
              <Text style={styles.announcementDate}>{new Date(a.createdAt).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      ) : !listQuery.isLoading ? (
        <Info>No announcements created yet</Info>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  announcementsList: {
    gap: erp.space.md,
    marginTop: erp.space.md,
  },
  announcementCard: {
    backgroundColor: erp.colors.surface,
    borderRadius: erp.radii.md,
    padding: erp.space.md,
    borderWidth: 1,
    borderColor: erp.colors.border,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: erp.space.sm,
  },
  announcementTitleContainer: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: erp.colors.textPrimary,
    marginBottom: 4,
  },
  announcementAudience: {
    fontSize: 12,
    color: erp.colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  announcementMessage: {
    fontSize: 14,
    color: erp.colors.textPrimary,
    marginBottom: erp.space.sm,
    lineHeight: 20,
  },
  announcementDate: {
    fontSize: 11,
    color: erp.colors.textMuted,
  },
});
