// app/(tabs)/announcements.tsx

import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { AppScreen } from "@/src/ui/app-screen";
import { erp } from "@/src/theme/erp";
import { Ionicons } from "@expo/vector-icons";

type Announcement = {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: 'high' | 'normal' | 'low';
  author: string;
};

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'School Holiday Notice',
    message: 'School will be closed on Monday due to maintenance work. Classes will resume normally on Tuesday.',
    date: '2024-01-15',
    priority: 'high',
    author: 'Principal Office'
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    message: 'PTM scheduled for next Friday at 2:00 PM. Please ensure your ward attends with completed homework.',
    date: '2024-01-14',
    priority: 'normal',
    author: 'Class Teacher'
  },
  {
    id: '3',
    title: 'Sports Day Registration',
    message: 'Registration for annual sports day is now open. Last date to register is January 25th.',
    date: '2024-01-13',
    priority: 'low',
    author: 'Sports Committee'
  }
];

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return erp.colors.danger;
      case 'normal': return erp.colors.warning;
      case 'low': return erp.colors.success;
      default: return erp.colors.accent;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return 'alert-circle';
      case 'normal': return 'information-circle';
      case 'low': return 'checkmark-circle';
      default: return 'notifications';
    }
  };

  return (
    <View style={styles.announcementCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Ionicons
            name={getPriorityIcon(announcement.priority)}
            size={20}
            color={getPriorityColor(announcement.priority)}
            style={styles.priorityIcon}
          />
          <Text style={styles.title}>{announcement.title}</Text>
        </View>
        <Text style={styles.date}>{announcement.date}</Text>
      </View>

      <Text style={styles.message}>{announcement.message}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.author}>By: {announcement.author}</Text>
      </View>
    </View>
  );
}

export default function Announcements() {
  return (
    <AppScreen title="Announcements" subtitle="Latest updates and notices">
      <ScrollView showsVerticalScrollIndicator={false}>
        {mockAnnouncements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}

        {mockAnnouncements.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color={erp.colors.textMuted} />
            <Text style={styles.emptyText}>No announcements at the moment</Text>
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  announcementCard: {
    backgroundColor: erp.colors.surface,
    padding: erp.space.lg,
    borderRadius: erp.radii.lg,
    marginBottom: erp.space.md,
    borderWidth: 1,
    borderColor: erp.colors.border,
  },
  cardHeader: {
    marginBottom: erp.space.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: erp.space.xs,
  },
  priorityIcon: {
    marginRight: erp.space.sm,
  },
  title: {
    color: erp.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  date: {
    color: erp.colors.textMuted,
    fontSize: 12,
  },
  message: {
    color: erp.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: erp.space.md,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: erp.colors.border,
    paddingTop: erp.space.sm,
  },
  author: {
    color: erp.colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: erp.space.xxl,
  },
  emptyText: {
    color: erp.colors.textMuted,
    fontSize: 16,
    marginTop: erp.space.md,
  },
});