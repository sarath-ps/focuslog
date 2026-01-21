import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function ReviewScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Review</Text>

      <View style={styles.statsContainer}>
          <View style={styles.statBox}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statBox}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Interrupted</Text>
          </View>
      </View>

      <ScrollView style={styles.timeline}>
          <Text style={styles.dateHeader}>Today</Text>
          {/* Mock Data */}
          <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                  <Text style={styles.time}>10:00 AM</Text>
                  <View style={styles.line} />
              </View>
              <View style={styles.timelineContent}>
                  <Text style={styles.taskTitle}>Writing PRD</Text>
                  <Text style={styles.taskMeta}>25m · 0 interruptions</Text>
              </View>
          </View>
           <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                  <Text style={styles.time}>10:30 AM</Text>
                  <View style={styles.line} />
              </View>
              <View style={styles.timelineContent}>
                  <Text style={styles.taskTitle}>Coding Auth</Text>
                  <Text style={styles.taskMeta}>12m · Interrupted (Call)</Text>
              </View>
          </View>
      </ScrollView>

      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 20,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  statsContainer: {
      flexDirection: 'row',
      gap: 15,
      marginBottom: 30,
  },
  statBox: {
      flex: 1,
      backgroundColor: Colors.dark.surface,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
  },
  statValue: {
      color: Colors.dark.text,
      fontSize: 24,
      fontWeight: 'bold',
  },
  statLabel: {
      color: '#888',
      fontSize: 12,
  },
  timeline: {
      flex: 1,
  },
  dateHeader: {
      color: Colors.dark.primary,
      fontWeight: 'bold',
      marginBottom: 15,
  },
  timelineItem: {
      flexDirection: 'row',
      marginBottom: 20,
  },
  timelineLeft: {
      width: 70,
      alignItems: 'center',
  },
  time: {
      color: '#888',
      fontSize: 12,
      marginBottom: 5,
  },
  line: {
      width: 2,
      flex: 1,
      backgroundColor: Colors.dark.surface,
  },
  timelineContent: {
      flex: 1,
      backgroundColor: Colors.dark.surface,
      padding: 15,
      borderRadius: 10,
  },
  taskTitle: {
      color: Colors.dark.text,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 5,
  },
  taskMeta: {
      color: '#888',
      fontSize: 12,
  },
  closeButton: {
      padding: 20,
      alignItems: 'center',
  },
  closeButtonText: {
      color: Colors.dark.text,
      fontSize: 16,
  }
});
