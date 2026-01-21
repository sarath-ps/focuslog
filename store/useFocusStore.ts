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
  endTime: number | null; // Timestamp when the current timer ends
  pausedTimeRemaining: number | null; // Seconds remaining when paused
  completedSessionsCount: number;
  currentSessionId: string | null;
  currentSession: Session | null;

  // Timestamps for robustness
  endTime: number | null; // epoch ms
  pausedAt: number | null; // epoch ms

  // Actions
  setStatus: (status: SessionStatus) => void;
  syncTimer: () => void; // Updates 'timer' based on 'endTime'
  startSession: (session: Session) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  startBreak: (durationMinutes: number) => void;

  // Data logging
  addInterruption: (interruption: Interruption) => void;
  setBreakActivity: (activity: BreakActivity) => void;
  completeSession: () => void;
  reset: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  status: 'idle',
  timer: 25 * 60,
  endTime: null,
  pausedTimeRemaining: null,
  completedSessionsCount: 0,
  currentSessionId: null,
  currentSession: null,

  setStatus: (status) => set({ status }),

  // Call this in a loop/interval from the UI
  syncTimer: () => set((state) => {
    if (state.status === 'paused' || state.status === 'idle') return {};

    if (state.endTime) {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((state.endTime - now) / 1000));
      return { timer: remaining };
    }
    return {};
  }),

  startSession: (session) => {
    const durationSeconds = session.durationMinutes * 60;
    const endTime = Date.now() + durationSeconds * 1000;
    set({
      status: 'focus',
      currentSessionId: session.id,
      currentSession: session,
      timer: durationSeconds,
      endTime: endTime,
      pausedTimeRemaining: null,
    });
  },

  pauseSession: () => set((state) => {
    if (!state.endTime) return {}; // Should not happen if strictly typed/logic
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((state.endTime - now) / 1000));
    return {
      status: 'paused',
      endTime: null,
      pausedTimeRemaining: remaining,
      timer: remaining, // Update display one last time
    };
  }),

  resumeSession: () => set((state) => {
    if (state.pausedTimeRemaining === null) return {};
    const newEndTime = Date.now() + state.pausedTimeRemaining * 1000;
    return {
      status: 'focus',
      endTime: newEndTime,
      pausedTimeRemaining: null,
    };
  }),

  endSession: () => set({
    status: 'idle',
    currentSessionId: null,
    currentSession: null,
    endTime: null,
    pausedTimeRemaining: null,
    timer: 25 * 60, // Reset default
  }),

  startBreak: (durationMinutes) => {
    const durationSeconds = durationMinutes * 60;
    const endTime = Date.now() + durationSeconds * 1000;
    set({
      status: 'break',
      timer: durationSeconds,
      endTime: endTime,
      pausedTimeRemaining: null,
    });
  },

  completeSession: () => set((state) => ({
    completedSessionsCount: state.completedSessionsCount + 1
  })),

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

  reset: () => set({
    status: 'idle',
    timer: 25 * 60,
    endTime: null,
    pausedTimeRemaining: null,
    completedSessionsCount: 0,
    currentSessionId: null,
    currentSession: null
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
