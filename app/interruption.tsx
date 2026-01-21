import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { Interruption } from '@/types';

export default function InterruptionScreen() {
  const router = useRouter();
  const { addInterruption, resumeSession, currentSessionId } = useFocusStore();

  const handleInterruption = (category: Interruption['category']) => {
    if (!currentSessionId) return;

    addInterruption({
      id: Date.now().toString(),
      sessionId: currentSessionId,
      type: 'touch',
      category,
      createdAt: new Date().toISOString()
    });

    // For MVP, just resume immediately after logging
    resumeSession();
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why did you stop?</Text>

      <View style={styles.grid}>
        {[
          { label: 'Door', value: 'door' },
          { label: 'Work Call', value: 'call' },
          { label: 'Family', value: 'family' },
          { label: 'Phone', value: 'notification' },
          { label: 'Lost Focus', value: 'focus_loss' },
          { label: 'Other', value: 'other' },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.card}
            onPress={() => handleInterruption(item.value as Interruption['category'])}
          >
            <Text style={styles.cardText}>{item.label}</Text>
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
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
  },
  card: {
    width: '45%',
    aspectRatio: 1.5,
    backgroundColor: Colors.dark.surface,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '500',
  },
});
