import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { useNotifications } from '@/hooks/useNotifications';
import { BreakActivity } from '@/types';
import { TIMER_CONFIG } from '@/constants/Config';
import { useEffect } from 'react';

export default function BreakScreen() {
  const router = useRouter();
  const {
    startBreak,
    extendBreak,
    endBreak,
    setBreakActivity,
    timer,
    syncTimer,
    status,
    currentSessionId
  } = useFocusStore();

  const { scheduleNotification, cancelNotifications } = useNotifications();

  useEffect(() => {
     // If we just landed here from Timer, we need to initialize the break
     if (status === 'focus') {
         startBreak(TIMER_CONFIG.DEFAULT_BREAK_DURATION);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    // Schedule break completion notification
    if (status === 'break') {
      scheduleNotification(timer, 'Break Over', 'Time to focus again!');
    }
    return () => {
      // Clean up if we leave
      cancelNotifications();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // Only when status switches to break or we re-mount. Avoid adding timer.

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'break') {
      interval = setInterval(() => {
        syncTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timer, syncTimer]);

  const handleActivity = (category: BreakActivity['category']) => {
      if (!currentSessionId) return;
      setBreakActivity({
          id: Date.now().toString(),
          sessionId: currentSessionId,
          type: 'touch',
          category,
          createdAt: new Date().toISOString()
      });
  };

  const handleStartFocus = () => {
      cancelNotifications();
      endBreak(); // Clean up break state
      // Logic to start new session would be here, but we just go to intent
      router.replace('/');
  };

  const handleExtendBreak = () => {
      cancelNotifications(); // Cancel 'Break Over' notification
      extendBreak(TIMER_CONFIG.BREAK_EXTENSION_DURATION);
      // Re-schedule notification for new time (current timer + extension duration)
      scheduleNotification(timer + (TIMER_CONFIG.BREAK_EXTENSION_DURATION * 60), 'Break Over', 'Time to focus again!');
  };

  const handleEndBreak = () => {
      cancelNotifications();
      endBreak();
      router.replace('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isBreakOver = timer === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{isBreakOver ? "Break Over" : "Break Time"}</Text>

      <View style={styles.timerContainer}>
         <Text style={styles.timerText}>{formatTime(timer)}</Text>
      </View>

      {!isBreakOver && (
        <>
          <Text style={styles.subtext}>What are you doing?</Text>
          <View style={styles.chipsContainer}>
            {['Coffee', 'Social', 'Phone', 'Walk', 'Food', 'Rest'].map((chip) => (
                <TouchableOpacity
                    key={chip}
                    style={styles.chip}
                    onPress={() => handleActivity(chip.toLowerCase() as BreakActivity['category'])}
                >
                    <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {isBreakOver ? (
        <View style={styles.controls}>
             <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleStartFocus}>
                <Text style={[styles.buttonText, styles.primaryButtonText]}>Start Focus</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.button} onPress={handleExtendBreak}>
                <Text style={styles.buttonText}>Extend (+5m)</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.button} onPress={handleEndBreak}>
                <Text style={styles.buttonText}>End Session</Text>
            </TouchableOpacity>
        </View>
      ) : (
         <TouchableOpacity style={styles.button} onPress={handleEndBreak}>
            <Text style={styles.buttonText}>End Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.secondary, // Different bg for break
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  timerContainer: {
    marginBottom: 40,
  },
  timerText: {
    color: 'white',
    fontSize: 80,
    fontWeight: '200',
  },
  subtext: {
    color: '#ccc',
    marginBottom: 20,
    fontSize: 18,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 40,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  chipText: {
    color: 'white',
  },
  controls: {
    gap: 15,
    width: '100%',
    alignItems: 'center',
  },
  button: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 40,
      paddingVertical: 15,
      borderRadius: 30,
      minWidth: 200,
      alignItems: 'center',
  },
  primaryButton: {
      backgroundColor: 'white',
  },
  buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  },
  primaryButtonText: {
      color: Colors.dark.secondary,
  }
});
