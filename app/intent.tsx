import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { Session } from '@/types';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { TIMER_CONFIG } from '@/constants/Config';
import { useState } from 'react';

export default function IntentScreen() {
  const router = useRouter();
  const startSession = useFocusStore((state) => state.startSession);
  const { startRecording, stopRecording, isRecording } = useAudioRecorder();
  const [isProcessing, setIsProcessing] = useState(false);

  const startNewSession = (intentCategory?: string, audioUri?: string, audioDuration?: number) => {
      const newSession: Session = {
        id: Date.now().toString(),
        status: 'focus',
        startTime: new Date().toISOString(),
        durationMinutes: TIMER_CONFIG.DEFAULT_FOCUS_DURATION,
        elapsedSeconds: 0,
        interruptions: [],
        intentCategory,
        intentVoiceNote: audioUri ? {
            id: Date.now().toString(),
            uri: audioUri,
            durationMs: audioDuration || 0,
            createdAt: new Date().toISOString()
        } : undefined
      };

      startSession(newSession);
      router.replace('/timer');
  };

  const handleMicPress = async () => {
      if (isRecording) {
          setIsProcessing(true);
          const recording = await stopRecording();
          setIsProcessing(false);

          if (recording) {
              startNewSession(undefined, recording.uri, recording.durationMs);
          }
      } else {
          await startRecording();
      }
  };

  const handleChipPress = (chip: string) => {
      startNewSession(chip);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>
          {isRecording ? "Listening..." : "What are you working on?"}
      </Text>

      <TouchableOpacity
        style={[
            styles.micButton,
            isRecording && styles.micButtonRecording
        ]}
        onPress={handleMicPress}
        disabled={isProcessing}
      >
        {isProcessing ? (
            <ActivityIndicator color={Colors.dark.background} size="large" />
        ) : (
            <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎙️'}</Text>
        )}
      </TouchableOpacity>

      {!isRecording && (
          <>
            <Text style={styles.subtext}>Tap to record or select:</Text>

            <View style={styles.chipsContainer}>
                {['Coding', 'Writing', 'Reading', 'Meeting'].map((chip) => (
                    <TouchableOpacity key={chip} style={styles.chip} onPress={() => handleChipPress(chip)}>
                        <Text style={styles.chipText}>{chip}</Text>
                    </TouchableOpacity>
                ))}
            </View>
          </>
      )}
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
  micButtonRecording: {
      backgroundColor: Colors.dark.danger,
      transform: [{ scale: 1.1 }]
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
