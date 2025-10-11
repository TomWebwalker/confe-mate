import { ConferenceSession, SearchSessionsParams } from '../types';

export function searchSessions(
  args: SearchSessionsParams,
  sessions: ConferenceSession[]
): ConferenceSession[] {
  const { topics, level, track, keywords } = args;
  let filteredSessions = [...sessions];

  if (topics && topics.length > 0) {
    filteredSessions = filteredSessions.filter((session) =>
      topics.some((topic: string) =>
        session.topics.some((t) => t.toLowerCase().includes(topic.toLowerCase()))
      )
    );
  }

  if (level) {
    filteredSessions = filteredSessions.filter((session) => session.level === level);
  }

  if (track) {
    filteredSessions = filteredSessions.filter((session) =>
      session.track.toLowerCase().includes(track.toLowerCase())
    );
  }

  if (keywords && keywords.length > 0) {
    filteredSessions = filteredSessions.filter((session) =>
      keywords.some(
        (keyword) =>
          session.title.toLowerCase().includes(keyword.toLowerCase()) ||
          session.description.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }

  return filteredSessions;
}
