import { ConferenceSession, SearchSessionsParams } from '../types';

export function getSessionDetails(
  args: SearchSessionsParams,
  sessions: ConferenceSession[]
): ConferenceSession[] {
  const { session_ids } = args;
  return sessions.filter(({ id }) => session_ids.includes(id));
}
