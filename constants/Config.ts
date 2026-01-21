/**
 * Application configuration constants
 */

export const TIMER_CONFIG = {
  // Default duration for a focus session (in minutes)
  DEFAULT_FOCUS_DURATION: 25,
  
  // Default duration for a break (in minutes)
  DEFAULT_BREAK_DURATION: 5,
  
  // Duration to extend a break by (in minutes)
  BREAK_EXTENSION_DURATION: 5,
} as const;

export const AUDIO_CONFIG = {
  // Maximum recording duration (in seconds)
  MAX_RECORDING_DURATION: 300, // 5 minutes
  
  // Audio quality settings
  AUDIO_QUALITY: 'high' as const,
} as const;

export const DATABASE_CONFIG = {
  // Enable debug logging for database operations
  DEBUG_MODE: false,
} as const;
