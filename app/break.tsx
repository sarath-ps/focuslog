import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useFocusStore } from '@/store/useFocusStore';
import { BreakActivity } from '@/types';
import { useEffect } from 'react';

export default function BreakScreen() {
  const router = useRouter();
  const { startBreak, setBreakActivity, timer, tick, endSession, status, currentSessionId } = useFocusStore();

  useEffect(() => {
     // If we just landed here from Timer, we need to initialize the break
     if (status === 'focus') {
         startBreak(5); // Default 5 min break
     }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'break') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

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

  const handleEndBreak = () => {
      // Logic for next pomodoro or end session
      // For MVP flow, let's just end session and go home
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
      <Text style={styles.header}>Break Time</Text>

      <View style={styles.timerContainer}>
         <Text style={styles.timerText}>{formatTime(timer)}</Text>
      </View>

      <Text style={styles.subtext}>What are you doing?</Text>

      <View style={styles.chipsContainer}>
        {['Coffee', 'Social', 'Walk', 'Food', 'Rest'].map((chip) => (
            <TouchableOpacity
                key={chip}
                style={styles.chip}
                onPress={() => handleActivity(chip.toLowerCase() as BreakActivity['category'])}
            >
                <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEndBreak}>
          <Text style={styles.buttonText}>End Session</Text>
      </TouchableOpacity>
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
  button: {
      backgroundColor: 'white',
      paddingHorizontal: 40,
      paddingVertical: 15,
      borderRadius: 30,
  },
  buttonText: {
      color: Colors.dark.secondary,
      fontWeight: 'bold',
      fontSize: 16,
  }
});
