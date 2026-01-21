import { create } from 'zustand';
import { SessionStatus, Session, Interruption, BreakActivity } from '@/types';

interface FocusState {
  status: SessionStatus;
  timer: number; // in seconds (display value)
  endTime: number | null; // Timestamp when the current timer ends
  pausedTimeRemaining: number | null; // Seconds remaining when paused
  completedSessionsCount: number;
  currentSessionId: string | null;
  currentSession: Session | null;

  // Actions
  setStatus: (status: SessionStatus) => void;
  syncTimer: () => void; // Updates 'timer' based on 'endTime'
  startSession: (session: Session) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  startBreak: (durationMinutes: number) => void;
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
