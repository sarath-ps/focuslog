// Mock DatabaseService for Web
import { Session, Interruption, SessionStatus } from '@/types';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const DatabaseService = {
  async initDatabase() {
    if (!isWeb) return;
    console.log('[Web Mock] Database initialized');
  },

  async ensureDayLog(date: string): Promise<string> {
    if (!isWeb) return date;
    console.log('[Web Mock] ensureDayLog', date);
    return date;
  },

  async createSession(session: Session) {
    if (!isWeb) return;
    console.log('[Web Mock] createSession', session);
  },

  async addInterruption(interruption: Interruption) {
    if (!isWeb) return;
    console.log('[Web Mock] addInterruption', interruption);
  },

  async updateSessionStatus(id: string, status: SessionStatus, endedAt?: string) {
    if (!isWeb) return;
    console.log('[Web Mock] updateSessionStatus', id, status, endedAt);
  },

  async completeSession(id: string, dayId: string) {
    if (!isWeb) return;
    console.log('[Web Mock] completeSession', id, dayId);
  },

  async abandonSession(id: string, dayId: string) {
      if (!isWeb) return;
      console.log('[Web Mock] abandonSession', id, dayId);
  }
};
