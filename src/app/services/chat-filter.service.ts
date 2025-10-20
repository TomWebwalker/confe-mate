import { computed, Injectable, model, signal } from '@angular/core';
import { ConferenceSession } from '../models/chat.model';
import { SessionLevel } from '../models/session-level.type';

export interface SessionFilters {
  topics: string[];
  levels: SessionLevel[];
  tracks: string[];
  searchTerm: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatFilterService {
  private readonly _sessions = signal<ConferenceSession[]>([]);

  readonly topics = signal<string[]>([]);
  readonly levels = signal<SessionLevel[]>([]);
  readonly tracks = signal<string[]>([]);
  readonly searchTerm = model<string>('');

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
      const matchesTopic =
        currentTopics.length === 0 || session.topics.some((topic) => currentTopics.includes(topic));

      const matchesLevel = currentLevels.length === 0 || currentLevels.includes(session.level);

      const matchesTrack = currentTracks.length === 0 || currentTracks.includes(session.track);

      const matchesSearch =
        !currentSearchTerm ||
        session.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        session.description.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        session.speaker.toLowerCase().includes(currentSearchTerm.toLowerCase());

      return matchesTopic && matchesLevel && matchesTrack && matchesSearch;
    });
  });

  readonly availableTopics = computed(() => {
    const sessions = this._sessions();
    const topicsSet = new Set<string>();
    sessions.forEach((session) => session.topics.forEach((topic) => topicsSet.add(topic)));
    return Array.from(topicsSet).sort();
  });

  readonly availableTracks = computed(() => {
    const sessions = this._sessions();
    const tracksSet = new Set<string>();
    sessions.forEach((session) => tracksSet.add(session.track));
    return Array.from(tracksSet).sort();
  });

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
