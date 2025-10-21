import { computed, Injectable, signal } from '@angular/core';
import { ConferenceSession } from '../models/chat.model';
import { SessionLevel } from '../models/session-level.type';

@Injectable({
  providedIn: 'root',
})
export class ChatFilterService {
  private readonly _sessions = signal<ConferenceSession[]>([]);

  readonly topics = signal<string[]>([]);
  readonly levels = signal<SessionLevel[]>([]);
  readonly tracks = signal<string[]>([]);
  readonly searchTerm = signal<string>('');

  readonly filteredSessions = computed(() => {
    const sessions = this._sessions();
    const currentTopics = this.topics();
    const currentLevels = this.levels();
    const currentTracks = this.tracks();
    const currentSearchTerm = this.searchTerm();

    if (!hasActiveFilters(currentTopics, currentLevels, currentTracks, currentSearchTerm)) {
      return sessions;
    }

    return sessions.filter((session) => {
      const matchesTopic = existsOnFilledList(currentTopics, session.topics);
      const matchesLevel = existsOnFilledList(currentLevels, [session.level]);
      const matchesTrack = existsOnFilledList(currentTracks, [session.track]);
      const matchesSearch = matchesFilledSearch(session, currentSearchTerm);

      return matchesTopic && matchesLevel && matchesTrack && matchesSearch;
    });
  });

  readonly availableTopics = computed(() =>
    setUniqueAndSort(this._sessions().flatMap(({ topics }) => topics))
  );

  readonly availableTracks = computed(() =>
    setUniqueAndSort(this._sessions().map(({ track }) => track))
  );

  setSessions(sessions: ConferenceSession[]): void {
    this._sessions.set(sessions);
  }

  clearFilters(): void {
    this.topics.set([]);
    this.levels.set([]);
    this.tracks.set([]);
    this.searchTerm.set('');
  }

  toggleTopic(topic: string): void {
    toggleOnList(this.topics(), topic);
  }

  toggleLevel(level: SessionLevel): void {
    toggleOnList(this.levels(), level);
  }

  toggleTrack(track: string): void {
    toggleOnList(this.tracks(), track);
  }
}

function setUniqueAndSort<T>(list: T[]): T[] {
  const uniqueSet = new Set<T>();
  list.forEach((item) => uniqueSet.add(item));
  return Array.from(uniqueSet).sort();
}

function existsOnFilledList<T>(list: T[], search: T[]): boolean {
  if (list.length === 0) {
    return true;
  }
  return search.some((item) => list.includes(item));
}

function matchesFilledSearch(
  { title, description, speaker }: ConferenceSession,
  search: string
): boolean {
  if (!search) {
    return true;
  }
  return (
    title.toLowerCase().includes(search.toLowerCase()) ||
    description.toLowerCase().includes(search.toLowerCase()) ||
    speaker.toLowerCase().includes(search.toLowerCase())
  );
}

function toggleOnList<T>(list: T[], item: T): void {
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1);
  } else {
    list.push(item);
  }
}

function hasActiveFilters(
  topics: string[],
  levels: SessionLevel[],
  tracks: string[],
  searchTerm: string
): boolean {
  return topics.length > 0 || levels.length > 0 || tracks.length > 0 || searchTerm.trim() !== '';
}
