import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect, useRef } from 'react';

export default function TimerScreen() {
  const router = useRouter();
  const {
    timer,
    status,
    pauseSession,
    syncTimer,
    endSession,
    completeSession,
    completedSessionsCount
  } = useFocusStore();

  const { scheduleNotification, cancelNotifications } = useNotifications();
  const timerRef = useRef(timer);
  const countRef = useRef(completedSessionsCount);

  // Keep refs updated for effects that shouldn't re-run on every tick
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    countRef.current = completedSessionsCount;
  }, [completedSessionsCount]);

  // Handle Notifications
  useEffect(() => {
    if (status === 'focus') {
      // Schedule notification for when the timer is expected to end
      // Use ref value if necessary, but here we want the current timer value at the start of focus
      // Since this effect depends on status, it runs when status becomes 'focus'
      // At that moment, 'timer' is correct (duration or remaining)
      scheduleNotification(
        timer,
        'Focus Complete',
        `Focus session #${completedSessionsCount + 1} completed`
      );
    } else {
      cancelNotifications();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  // We explicitly disable exhaustive-deps here because we ONLY want to schedule when status changes to focus.
  // Adding 'timer' would cause rescheduling every second.
  // Adding 'completedSessionsCount', 'scheduleNotification', 'cancelNotifications' is fine but 'timer' is the blocker.
  // Since 'timer' is used as the initial duration for the schedule, capturing it when status changes is exactly what we want.

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'focus') {
      interval = setInterval(() => {
        syncTimer();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, syncTimer]);

  // Completion Check
  useEffect(() => {
    if (timer === 0 && status === 'focus') {
      completeSession();
      router.replace('/break');
    }
  }, [timer, status, completeSession, router]);

  const handlePause = () => {
    cancelNotifications(); // Ensure cancelled immediately
    pauseSession();
    router.push('/interruption');
  };

  const handleEnd = () => {
      cancelNotifications();
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
