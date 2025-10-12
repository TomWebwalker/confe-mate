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
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  timeSlot: string;
}

export interface SessionRecommendation {
  sessionIds: string[];
  reasoning: string;
}
