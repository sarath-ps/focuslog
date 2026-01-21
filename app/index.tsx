import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>VocalPomodoro</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/intent')}
        >
          <Text style={styles.startButtonText}>Start Pomodoro</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Today: 0 completed · 0 interrupted</Text>
        </View>

        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => router.push('/review')}
        >
          <Text style={styles.reviewButtonText}>Review Day</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  startButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 20,
  },
  statsText: {
    color: '#888',
    fontSize: 14,
  },
  reviewButton: {
    marginTop: 10,
    padding: 10,
  },
  reviewButtonText: {
    color: Colors.dark.primary,
    fontSize: 16,
  },
});
