import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { InterruptionCategory, Interruption } from '@/types';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function InterruptionScreen() {
  const router = useRouter();
  const { addInterruption, resumeSession, abandonSession, currentSessionId } = useFocusStore();
  const { startRecording, stopRecording, isRecording } = useAudioRecorder();

  const [selectedCategory, setSelectedCategory] = useState<InterruptionCategory | null>(null);

  const handleInterruption = async (category: InterruptionCategory) => {
    if (!currentSessionId) return;

    if (category === 'other') {
      // Toggle recording
      if (isRecording) {
        const result = await stopRecording();
        if (result) {
            await logInterruption('other', 'voice', {
                id: Date.now().toString(),
                uri: result.uri,
                durationMs: result.durationMs,
                createdAt: new Date().toISOString()
            });
            setSelectedCategory('other');
        }
      } else {
        await startRecording();
      }
      return;
    }

    await logInterruption(category, 'touch');
    setSelectedCategory(category);
  };

  const logInterruption = async (
      category: InterruptionCategory,
      source: 'touch' | 'voice',
      voiceNote?: Interruption['voiceNote']
  ) => {
    if (!currentSessionId) return;

    await addInterruption({
      id: Date.now().toString(),
      sessionId: currentSessionId,
      source,
      category,
      voiceNote,
      createdAt: new Date().toISOString()
    });
  };

  const handleResume = () => {
      resumeSession();
      router.back();
  };

  const handleEndSession = () => {
      abandonSession();
      router.dismissAll();
      router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why did you stop?</Text>

      <View style={styles.grid}>
        {[
          { label: 'Door', value: 'door' },
          { label: 'Work Call', value: 'work_call' },
          { label: 'Family', value: 'family' },
          { label: 'Phone', value: 'notification' },
          { label: 'Lost Focus', value: 'lost_focus' },
          { label: isRecording ? 'Recording...' : 'Other (Mic)', value: 'other' },
        ].map((item) => {
            const isSelected = selectedCategory === item.value;
            const isRecordingThis = item.value === 'other' && isRecording;

            return (
              <TouchableOpacity
                key={item.value}
                style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                    isRecordingThis && styles.cardRecording
                ]}
                onPress={() => handleInterruption(item.value as InterruptionCategory)}
              >
                {item.value === 'other' && (
                    <Ionicons
                        name={isRecording ? "stop-circle" : "mic"}
                        size={24}
                        color={isRecordingThis ? Colors.dark.danger : Colors.dark.text}
                        style={{marginBottom: 5}}
                    />
                )}
                <Text style={styles.cardText}>{item.label}</Text>
              </TouchableOpacity>
            );
        })}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.resumeButton]} onPress={handleResume}>
            <Text style={styles.resumeText}>Resume Focus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.textButton} onPress={handleEndSession}>
            <Text style={styles.endText}>End Pomodoro</Text>
        </TouchableOpacity>
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
    marginBottom: 40,
  },
  card: {
    width: '45%',
    aspectRatio: 1.5,
    backgroundColor: Colors.dark.surface,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.secondary,
  },
  cardRecording: {
      borderColor: Colors.dark.danger,
      backgroundColor: '#3d1a1a',
  },
  cardText: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '500',
  },
  actionContainer: {
      gap: 15,
      alignItems: 'center',
      width: '100%',
  },
  actionButton: {
      width: '100%',
      padding: 18,
      borderRadius: 30,
      alignItems: 'center',
  },
  resumeButton: {
      backgroundColor: Colors.dark.primary,
  },
  resumeText: {
      color: Colors.dark.text,
      fontSize: 18,
      fontWeight: 'bold',
  },
  textButton: {
      padding: 10,
  },
  endText: {
      color: Colors.dark.danger,
      fontSize: 16,
  }
});
