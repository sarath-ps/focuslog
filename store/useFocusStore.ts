import { create } from 'zustand';
import { SessionStatus, Session, Interruption, BreakActivity } from '@/types';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications only if not on web (or wrap in check)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

interface FocusState {
  status: SessionStatus;
  timer: number; // in seconds (display value)
  currentSessionId: string | null;
  currentSession: Session | null;

  // Timestamps for robustness
  endTime: number | null; // epoch ms
  pausedAt: number | null; // epoch ms

  // Actions
  startSession: (session: Session) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  startBreak: (durationMinutes: number) => void;

  // Data logging
  addInterruption: (interruption: Interruption) => void;
  setBreakActivity: (activity: BreakActivity) => void;

  // Timer tick (called by interval)
  tick: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  status: 'idle',
  timer: 25 * 60,
  currentSessionId: null,
  currentSession: null,
  endTime: null,
  pausedAt: null,

  startSession: async (session) => {
    // Schedule notification
    const durationSec = session.durationMinutes * 60;
    const endTime = Date.now() + durationSec * 1000;

    await scheduleEndNotification(durationSec);

    set({
      status: 'focus',
      currentSessionId: session.id,
      currentSession: session,
      timer: durationSec,
      endTime: endTime,
      pausedAt: null
    });
  },

  pauseSession: async () => {
    const { endTime } = get();
    if (endTime) {
        if (Platform.OS !== 'web') {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
        // Calculate remaining time to preserve it
        const now = Date.now();
        const remainingMs = Math.max(0, endTime - now);

        set({
            status: 'paused',
            pausedAt: now,
            endTime: null, // Clear end time as it's no longer valid until resumed
            timer: Math.ceil(remainingMs / 1000)
        });
    } else {
         set({ status: 'paused' });
    }
  },

  resumeSession: async () => {
    const { timer } = get();
    // New end time = Now + remaining timer
    const endTime = Date.now() + timer * 1000;

    await scheduleEndNotification(timer);

    set({
        status: 'focus',
        endTime,
        pausedAt: null
    });
  },

  endSession: async () => {
    if (Platform.OS !== 'web') {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
    set({
      status: 'idle',
      currentSessionId: null,
      currentSession: null,
      endTime: null,
      pausedAt: null
    });
  },

  startBreak: async (durationMinutes) => {
    const durationSec = durationMinutes * 60;
    const endTime = Date.now() + durationSec * 1000;

    await scheduleEndNotification(durationSec);

    set({
      status: 'break',
      timer: durationSec,
      endTime,
      pausedAt: null
    });
  },

  addInterruption: (interruption) => set((state) => {
    if (!state.currentSession) return {};
    return {
      currentSession: {
        ...state.currentSession,
        interruptions: [...state.currentSession.interruptions, interruption]
      }
    };
  }),

  setBreakActivity: (activity) => set((state) => {
     if (!state.currentSession) return {};
     return {
         currentSession: {
             ...state.currentSession,
             breakActivity: activity
         }
     };
  }),

  tick: () => set((state) => {
      if (state.status === 'paused' || state.status === 'idle') return {};

      if (state.endTime) {
          const now = Date.now();
          const remainingSeconds = Math.max(0, Math.ceil((state.endTime - now) / 1000));
          return { timer: remainingSeconds };
      }
      return {};
  })
}));

async function scheduleEndNotification(seconds: number) {
  if (Platform.OS === 'web') return;

  try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== 'granted') return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time's up!",
          body: "Session completed.",
          sound: true,
        },
        trigger: {
          seconds: seconds,
        } as any,
      });
  } catch (error) {
      console.warn("Notification scheduling failed", error);
  }
}
