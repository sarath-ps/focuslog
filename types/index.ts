export type SessionStatus = 'idle' | 'focus' | 'paused' | 'break';

export type VoiceNote = {
  id: string;
  uri: string;
  durationMs: number;
  transcription?: string;
  createdAt: string; // ISO date
};

export type InterruptionCategory = 'door' | 'work_call' | 'family' | 'notification' | 'lost_focus' | 'other';

export type Interruption = {
  id: string;
  sessionId: string;
  source: 'voice' | 'touch';
  category: InterruptionCategory;
  voiceNote?: VoiceNote;
  createdAt: string;
};

export type BreakActivityCategory = 'coffee' | 'phone' | 'social' | 'walk' | 'food' | 'rest' | 'other';

export type BreakActivity = {
  id: string;
  sessionId: string;
  type: 'voice' | 'touch';
  category: BreakActivityCategory;
  voiceNote?: VoiceNote;
  createdAt: string;
};

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
