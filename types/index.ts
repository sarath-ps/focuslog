/**
 * Represents the current state of a focus session
 */
export type SessionStatus = 'idle' | 'focus' | 'paused' | 'break';

/**
 * Voice recording metadata
 */
export type VoiceNote = {
  id: string;
  uri: string;
  durationMs: number;
  transcription?: string;
  createdAt: string; // ISO date
};

/**
 * Categories for interruption types
 */
export type InterruptionCategory = 'door' | 'work_call' | 'family' | 'notification' | 'lost_focus' | 'other';

/**
 * Represents an interruption event during a focus session
 */
export type Interruption = {
  id: string;
  sessionId: string;
  source: 'voice' | 'touch';
  category: InterruptionCategory;
  voiceNote?: VoiceNote;
  createdAt: string;
};

/**
 * Categories for break activities
 */
export type BreakActivityCategory = 'coffee' | 'phone' | 'social' | 'walk' | 'food' | 'rest' | 'other';

/**
 * Represents an activity logged during a break
 */
export type BreakActivity = {
  id: string;
  sessionId: string;
  type: 'voice' | 'touch';
  category: BreakActivityCategory;
  voiceNote?: VoiceNote;
  createdAt: string;
};

/**
 * Represents a complete Pomodoro focus session
 */
export type Session = {
  id: string;
  status: SessionStatus;
  startTime: string;
  endTime?: string;
  durationMinutes: number; // Planned duration
  elapsedSeconds: number; // Actual focus time
  dayId?: string; // Reference to the day log this session belongs to

  // Intent
  intentVoiceNote?: VoiceNote;
  intentTranscription?: string;
  intentCategory?: string; // If using chips for intent

  // Interruptions
  interruptions: Interruption[];

  // Break
  breakActivity?: BreakActivity;
  breakDurationMinutes?: number;
};
