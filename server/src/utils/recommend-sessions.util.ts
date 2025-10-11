import { ConferenceSession, SearchSessionsParams } from '../types';

export function recommendSessions(
  args: SearchSessionsParams,
  sessions: ConferenceSession[]
): ConferenceSession[] {
  const { interests, experience_level, preferred_tracks, max_results = 5 } = args;
  let scored = sessions.map((session) => {
    let score = 0;

    // Score based on interests matching topics
    if (interests) {
      interests.forEach((interest) => {
        if (
          session.topics.some((topic) => topic.toLowerCase().includes(interest.toLowerCase())) ||
          session.title.toLowerCase().includes(interest.toLowerCase()) ||
          session.description.toLowerCase().includes(interest.toLowerCase())
        ) {
          score += 10;
        }
      });
    }

    // Score based on experience level
    if (experience_level && session.level === experience_level) {
      score += 5;
    }

    // Score based on preferred tracks
    if (preferred_tracks) {
      preferred_tracks.forEach((track) => {
        if (session.track.toLowerCase().includes(track.toLowerCase())) {
          score += 3;
        }
      });
    }

    return { session, score };
  });

  // Sort by score and return top results
  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((item) => item.score > 0)
    .slice(0, max_results)
    .map((item) => item.session);
}
