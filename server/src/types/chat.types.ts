import { SessionLevel } from './session-level.type';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ChatResponse {
  response: string;
  recommendations: ConferenceSession[];
  timestamp?: string;
}

export interface ConferenceSession {
  id: string;
  title: string;
  description: string;
  topics: string[];
  track: string;
  speaker: string;
  level: SessionLevel;
  duration: number;
  timeSlot: string;
}

export interface SessionRecommendation {
  sessionIds: string[];
  reasoning: string;
}
