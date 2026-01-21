export type SessionStatus = 'idle' | 'focus' | 'paused' | 'break';

export type VoiceNote = {
  id: string;
  uri: string;
  durationMs: number;
  transcription?: string;
  createdAt: string; // ISO date
};

export type Interruption = {
  id: string;
  sessionId: string;
  type: 'voice' | 'touch';
  category: 'door' | 'call' | 'family' | 'notification' | 'focus_loss' | 'other';
  voiceNote?: VoiceNote;
  createdAt: string;
};

export type BreakActivity = {
  id: string;
  sessionId: string;
  type: 'voice' | 'touch';
  category: 'coffee' | 'phone' | 'walk' | 'food' | 'rest' | 'other';
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
