import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { useEffect } from 'react';

export default function TimerScreen() {
  const router = useRouter();
  const { timer, status, pauseSession, tick, endSession } = useFocusStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Only set interval if focused
    if (status === 'focus') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]);

  // Separate effect to handle timer completion
  useEffect(() => {
    if (timer === 0 && status === 'focus') {
      router.replace('/break');
    }
  }, [timer, status]);

  const handlePause = () => {
    pauseSession();
    router.push('/interruption');
  };

  const handleEnd = () => {
      endSession();
      router.replace('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timer)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={handlePause}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>

         <TouchableOpacity style={[styles.button, styles.endButton]} onPress={handleEnd}>
          <Text style={styles.buttonText}>End</Text>
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
  timerContainer: {
    marginBottom: 60,
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: Colors.dark.text,
    fontSize: 60,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: Colors.dark.surface,
    borderRadius: 30,
  },
  endButton: {
      backgroundColor: Colors.dark.danger,
  },
  buttonText: {
    color: Colors.dark.text,
    fontSize: 18,
  },
});
