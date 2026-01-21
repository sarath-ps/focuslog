import { create } from 'zustand';
import { SessionStatus, Session, Interruption, BreakActivity } from '@/types';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DatabaseService } from '@/services/DatabaseService';
import { TIMER_CONFIG } from '@/constants/Config';

// Configure notifications only if not on web (or wrap in check)
// Moved inside init or wrapped to avoid top-level crash on Android (Expo Go)
const initNotifications = async () => {
  if (Platform.OS === 'web') return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {
    console.warn("Failed to set notification handler", e);
  }
};

interface FocusState {
  status: SessionStatus;
  timer: number; // in seconds (display value)
  endTime: number | null; // Timestamp when the current timer ends
  pausedTimeRemaining: number | null; // Seconds remaining when paused
  completedSessionsCount: number;
  currentSessionId: string | null;
  currentSession: Session | null;
  lastError: string | null; // Track the last error that occurred

  // Actions
  init: () => Promise<void>;
  setStatus: (status: SessionStatus) => void;
  syncTimer: () => void; // Updates 'timer' based on 'endTime'
  startSession: (session: Session) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  abandonSession: () => Promise<void>;
  startBreak: (durationMinutes: number) => void;
  extendBreak: (durationMinutes: number) => void;
  endBreak: () => void;

  // Data logging
  addInterruption: (interruption: Interruption) => Promise<void>;
  setBreakActivity: (activity: BreakActivity) => Promise<void>;
  completeSession: () => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  status: 'idle',
  timer: TIMER_CONFIG.DEFAULT_FOCUS_DURATION * 60,
  endTime: null,
  pausedTimeRemaining: null,
  completedSessionsCount: 0,
  currentSessionId: null,
  currentSession: null,
  lastError: null,

  init: async () => {
    await initNotifications();

    if (Platform.OS === 'web') {
       // Mock or use DatabaseService.web.ts if available
       // For Playwright tests on web, we might skip DB init or mock it
       // But DatabaseService seems to use expo-sqlite which might fail on web if not shimmed
       // Let's assume DatabaseService handles platform checks or we just try-catch
    }
    try {
        await DatabaseService.initDatabase();
        set({ lastError: null });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Database init failed';
        console.error("Database initialization error:", errorMessage);
        set({ lastError: `Database init failed: ${errorMessage}` });
    }
  },

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

  startSession: async (session) => {
    let dayId: string | undefined = 'mock-day-id';

    try {
        // Ensure DayLog exists
        const date = session.startTime.split('T')[0];
        // On web, skip DB calls for now or mock
        if (Platform.OS !== 'web') {
             dayId = await DatabaseService.ensureDayLog(date);
             const sessionWithDay = { ...session, dayId };
             await DatabaseService.createSession(sessionWithDay);
        }
        set({ lastError: null });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error("Failed to start session in database:", errorMessage);
        set({ lastError: `Session start failed: ${errorMessage}` });
    }

    const durationSeconds = session.durationMinutes * 60;
    const endTime = Date.now() + durationSeconds * 1000;
    set({
      status: 'focus',
      currentSessionId: session.id,
      currentSession: { ...session, dayId },
      timer: durationSeconds,
      endTime: endTime,
      pausedTimeRemaining: null,
    });
  },

  pauseSession: async () => {
    const state = get();
    if (!state.endTime || !state.currentSessionId) return;

    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((state.endTime - now) / 1000));

    // Update DB status
    try {
        if (Platform.OS !== 'web') {
            await DatabaseService.updateSessionStatus(state.currentSessionId, 'paused');
        }
        set({ lastError: null });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error("Failed to pause session in database:", errorMessage);
        set({ lastError: `Pause failed: ${errorMessage}` });
    }

    set({
      status: 'paused',
      endTime: null,
      pausedTimeRemaining: remaining,
      timer: remaining, // Update display one last time
    });
  },

  resumeSession: async () => {
    const state = get();
    if (state.pausedTimeRemaining === null || !state.currentSessionId) return;

    const newEndTime = Date.now() + state.pausedTimeRemaining * 1000;

    // Update DB status
    try {
        if (Platform.OS !== 'web') {
            await DatabaseService.updateSessionStatus(state.currentSessionId, 'focus');
        }
        set({ lastError: null });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error("Failed to resume session in database:", errorMessage);
        set({ lastError: `Resume failed: ${errorMessage}` });
    }

    set({
      status: 'focus',
      endTime: newEndTime,
      pausedTimeRemaining: null,
    });
  },

  abandonSession: async () => {
    const state = get();
    if (state.currentSessionId && state.currentSession) {
      try {
          if (Platform.OS !== 'web') {
              await DatabaseService.abandonSession(state.currentSessionId, state.currentSession.dayId);
          }
          set({ lastError: null });
      } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown error';
          console.error("Failed to abandon session in database:", errorMessage);
          set({ lastError: `Abandon failed: ${errorMessage}` });
      }
    }

    set({
      status: 'idle',
      currentSessionId: null,
      currentSession: null,
      endTime: null,
      pausedTimeRemaining: null,
      timer: TIMER_CONFIG.DEFAULT_FOCUS_DURATION * 60, // Reset default
    });
  },

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

  extendBreak: (durationMinutes) => {
      const state = get();
      if (state.status !== 'break' || !state.endTime) return;

      const additionalSeconds = durationMinutes * 60;
      const newEndTime = state.endTime + (additionalSeconds * 1000);

      // Also update current timer for immediate feedback if currently at 0
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((newEndTime - now) / 1000));

      set({
          endTime: newEndTime,
          timer: remaining
      });
  },

  endBreak: () => {
    set({
      status: 'idle',
      currentSessionId: null,
      currentSession: null,
      endTime: null,
      pausedTimeRemaining: null,
      timer: TIMER_CONFIG.DEFAULT_FOCUS_DURATION * 60, // Reset to default focus time
    });
  },

  completeSession: async () => {
    const state = get();
    if (state.currentSessionId && state.currentSession) {
        try {
            if (Platform.OS !== 'web') {
                await DatabaseService.completeSession(state.currentSessionId, state.currentSession.dayId);
            }
            set({ lastError: null });
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            console.error("Failed to complete session in database:", errorMessage);
            set({ lastError: `Complete session failed: ${errorMessage}` });
        }
    }

    set((state) => ({
      completedSessionsCount: state.completedSessionsCount + 1
    }));
  },

  addInterruption: async (interruption) => {
    const state = get();
    if (!state.currentSession) return;

    try {
        if (Platform.OS !== 'web') {
            await DatabaseService.addInterruption(interruption);
        }
        set({ lastError: null });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error("Failed to add interruption to database:", errorMessage);
        set({ lastError: `Add interruption failed: ${errorMessage}` });
    }

    set({
      currentSession: {
        ...state.currentSession,
        interruptions: [...state.currentSession.interruptions, interruption]
      }
    });
  },

  setBreakActivity: async (activity) => {
     const state = get();
     if (!state.currentSession) return;

     try {
         if (Platform.OS !== 'web') {
             await DatabaseService.logBreakActivity(activity);
         }
         set({ lastError: null });
     } catch (e) {
         const errorMessage = e instanceof Error ? e.message : 'Unknown error';
         console.error("Failed to log break activity to database:", errorMessage);
         set({ lastError: `Log break activity failed: ${errorMessage}` });
     }

     set((state) => ({
         currentSession: {
             ...(state.currentSession as Session),
             breakActivity: activity
         }
     }));
  },

  reset: () => set({
    status: 'idle',
    timer: TIMER_CONFIG.DEFAULT_FOCUS_DURATION * 60,
    endTime: null,
    pausedTimeRemaining: null,
    completedSessionsCount: 0,
    currentSessionId: null,
    currentSession: null,
    lastError: null,
  }),

  clearError: () => set({ lastError: null }),
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
