import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { useEffect } from 'react';

export default function TimerScreen() {
  const router = useRouter();
  const { timer, status, pauseSession, decrementTimer, endSession } = useFocusStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Only set interval if focused
    if (status === 'focus') {
      interval = setInterval(() => {
        // We check the timer value inside the store updater or here?
        // useFocusStore's decrementTimer uses `set((state) => ...)` so it always has latest state.
        // But we need to check if we hit 0 to navigate.
        // Best practice: The store should probably handle the "tick" and return the new value,
        // or we check the value in a separate effect or inside the interval (with a ref or get() if we had it).
        // Since we are subscribing to `timer` via the hook, let's keep it simple for now but avoid re-creating interval on every tick.
        // Actually, if we include `timer` in deps, it recreates. If we don't, `timer` is stale inside closure.

        // Solution: Use the store's action to tick.
        // To handle navigation on 0, we can use a separate effect.
        decrementTimer();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status]); // Removed `timer` dependency to avoid recreating interval every second.

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
