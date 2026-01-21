import { create } from 'zustand';
import { SessionStatus, Session, Interruption, BreakActivity } from '@/types';

interface FocusState {
  status: SessionStatus;
  timer: number; // in seconds
  currentSessionId: string | null;
  currentSession: Session | null;

  // Actions
  setStatus: (status: SessionStatus) => void;
  setTimer: (time: number) => void;
  decrementTimer: () => void;
  startSession: (session: Session) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  startBreak: (durationMinutes: number) => void;
  addInterruption: (interruption: Interruption) => void;
  setBreakActivity: (activity: BreakActivity) => void;
  reset: () => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  status: 'idle',
  timer: 25 * 60, // Default 25 minutes
  currentSessionId: null,
  currentSession: null,

  setStatus: (status) => set({ status }),
  setTimer: (timer) => set({ timer }),
  decrementTimer: () => set((state) => ({ timer: Math.max(0, state.timer - 1) })),

  startSession: (session) => set({
    status: 'focus',
    currentSessionId: session.id,
    currentSession: session,
    timer: session.durationMinutes * 60,
  }),

  pauseSession: () => set({ status: 'paused' }),

  resumeSession: () => set({ status: 'focus' }),

  endSession: () => set({
    status: 'idle',
    currentSessionId: null,
    currentSession: null
  }),

  startBreak: (durationMinutes) => set({
    status: 'break',
    timer: durationMinutes * 60
  }),

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
    currentSessionId: null,
    currentSession: null
  })
}));
