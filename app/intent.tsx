import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { Session } from '@/types';

export default function IntentScreen() {
  const router = useRouter();
  const startSession = useFocusStore((state) => state.startSession);

  const handleStart = () => {
    // Mock session start
    const newSession: Session = {
      id: Date.now().toString(),
      status: 'focus',
      startTime: new Date().toISOString(),
      durationMinutes: 25,
      elapsedSeconds: 0,
      interruptions: [],
    };

    startSession(newSession);
    router.replace('/timer');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>What are you working on?</Text>

      <TouchableOpacity style={styles.micButton} onPress={handleStart}>
        <Text style={styles.micIcon}>🎙️</Text>
      </TouchableOpacity>

      <Text style={styles.subtext}>Tap to record or select:</Text>

      <View style={styles.chipsContainer}>
        {['Coding', 'Writing', 'Reading', 'Meeting'].map((chip) => (
            <TouchableOpacity key={chip} style={styles.chip} onPress={handleStart}>
                <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
        ))}
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
    padding: 20,
  },
  prompt: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.dark.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  micIcon: {
    fontSize: 40,
  },
  subtext: {
    color: '#888',
    marginBottom: 20,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipText: {
    color: Colors.dark.text,
  },
});
