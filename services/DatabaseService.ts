import * as SQLite from 'expo-sqlite';
import { Session, Interruption, SessionStatus, BreakActivity } from '@/types';

let db: SQLite.SQLiteDatabase | null = null;

export const DatabaseService = {
  async getDB() {
    if (!db) {
      db = await SQLite.openDatabaseAsync('focuslog.db');
    }
    return db;
  },

  async initDatabase() {
    const db = await this.getDB();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS day_logs (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT NOT NULL UNIQUE,
        total_pomodoros INTEGER DEFAULT 0,
        completed_pomodoros INTEGER DEFAULT 0,
        interrupted_pomodoros INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS pomodoro_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        day_id TEXT NOT NULL,
        started_at TEXT NOT NULL,
        ended_at TEXT,
        duration_minutes INTEGER NOT NULL,
        status TEXT NOT NULL,
        intent_category TEXT,
        intent_audio_uri TEXT,
        intent_transcript TEXT,
        interruption_count INTEGER DEFAULT 0,
        FOREIGN KEY (day_id) REFERENCES day_logs (id)
      );

      CREATE TABLE IF NOT EXISTS interruption_events (
        id TEXT PRIMARY KEY NOT NULL,
        pomodoro_id TEXT NOT NULL,
        occurred_at TEXT NOT NULL,
        category TEXT NOT NULL,
        source TEXT NOT NULL,
        audio_uri TEXT,
        transcript TEXT,
        FOREIGN KEY (pomodoro_id) REFERENCES pomodoro_sessions (id)
      );

      CREATE TABLE IF NOT EXISTS break_activities (
        id TEXT PRIMARY KEY NOT NULL,
        pomodoro_id TEXT NOT NULL UNIQUE,
        occurred_at TEXT NOT NULL,
        category TEXT NOT NULL,
        audio_uri TEXT,
        transcript TEXT,
        FOREIGN KEY (pomodoro_id) REFERENCES pomodoro_sessions (id)
      );
    `);
    console.log('Database initialized successfully');
  },

  async ensureDayLog(date: string): Promise<string> {
    const db = await this.getDB();
    const existing = await db.getFirstAsync<{ id: string }>('SELECT id FROM day_logs WHERE date = ?', [date]);

    if (existing) {
      return existing.id;
    }

    const id = date; // Simple ID strategy for DayLog: use the date string YYYY-MM-DD
    const now = new Date().toISOString();
    await db.runAsync(
      'INSERT INTO day_logs (id, date, created_at) VALUES (?, ?, ?)',
      [id, date, now]
    );
    return id;
  },

  async createSession(session: Session) {
    const db = await this.getDB();
    await db.runAsync(
      `INSERT INTO pomodoro_sessions (
        id, day_id, started_at, duration_minutes, status,
        intent_category, intent_audio_uri, intent_transcript, interruption_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.id,
        session.dayId,
        session.startTime,
        session.durationMinutes,
        session.status,
        session.intentCategory ?? null,
        session.intentVoiceNote?.uri ?? null,
        session.intentTranscription ?? null,
        0
      ]
    );

    // Update DayLog total pomodoros
    await db.runAsync(
      'UPDATE day_logs SET total_pomodoros = total_pomodoros + 1 WHERE id = ?',
      [session.dayId]
    );
  },

  async addInterruption(interruption: Interruption) {
    const db = await this.getDB();
    await db.runAsync(
      `INSERT INTO interruption_events (
        id, pomodoro_id, occurred_at, category, source, audio_uri, transcript
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        interruption.id,
        interruption.sessionId,
        interruption.createdAt,
        interruption.category,
        interruption.source,
        interruption.voiceNote?.uri ?? null,
        interruption.voiceNote?.transcription ?? null
      ]
    );

    // Update session interruption count
    await db.runAsync(
      'UPDATE pomodoro_sessions SET interruption_count = interruption_count + 1 WHERE id = ?',
      [interruption.sessionId]
    );
  },

  async updateSessionStatus(id: string, status: SessionStatus, endedAt?: string) {
    const db = await this.getDB();
    if (endedAt) {
      await db.runAsync(
        'UPDATE pomodoro_sessions SET status = ?, ended_at = ? WHERE id = ?',
        [status, endedAt, id]
      );
    } else {
      await db.runAsync(
        'UPDATE pomodoro_sessions SET status = ? WHERE id = ?',
        [status, id]
      );
    }
  },

  async completeSession(id: string, dayId: string) {
     const db = await this.getDB();
     const now = new Date().toISOString();
     await db.runAsync(
         'UPDATE pomodoro_sessions SET status = ?, ended_at = ? WHERE id = ?',
         ['completed', now, id]
     );

     await db.runAsync(
         'UPDATE day_logs SET completed_pomodoros = completed_pomodoros + 1 WHERE id = ?',
         [dayId]
     );
  },

  async abandonSession(id: string, dayId: string) {
      const db = await this.getDB();
      const now = new Date().toISOString();
      await db.runAsync(
          'UPDATE pomodoro_sessions SET status = ?, ended_at = ? WHERE id = ?',
          ['abandoned', now, id]
      );

      await db.runAsync(
        'UPDATE day_logs SET interrupted_pomodoros = interrupted_pomodoros + 1 WHERE id = ?',
        [dayId]
      );
  },

  async logBreakActivity(activity: BreakActivity) {
    const db = await this.getDB();
    // Using INSERT OR REPLACE to handle updates (user changing mind on chip)
    // pomodoro_id is UNIQUE in break_activities table
    await db.runAsync(
      `INSERT OR REPLACE INTO break_activities (
        id, pomodoro_id, occurred_at, category, audio_uri, transcript
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        activity.id,
        activity.sessionId,
        activity.createdAt,
        activity.category,
        activity.voiceNote?.uri ?? null,
        activity.voiceNote?.transcription ?? null
      ]
    );
  }
};
