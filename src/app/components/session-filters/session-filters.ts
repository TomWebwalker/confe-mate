import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionLevel } from '../../models/session-level.type';
import { ChatFilterService } from '../../services/chat-filter.service';
import { FilterChips } from '../filter-chips/filter-chips';

@Component({
  selector: 'app-session-filters',
  imports: [CommonModule, FormsModule, FilterChips],
  templateUrl: './session-filters.html',
  styleUrl: './session-filters.css',
})
export class SessionFilters {
  protected readonly filterService = inject(ChatFilterService);

  readonly levels: SessionLevel[] = ['beginner', 'intermediate', 'advanced'];

  readonly searchTerm = this.filterService.searchTerm;

  onToggleTopic(topic: string): void {
    this.filterService.toggleTopic(topic);
  }

  onToggleLevel(level: SessionLevel): void {
    this.filterService.toggleLevel(level);
  }

  onToggleTrack(track: string): void {
    this.filterService.toggleTrack(track);
  }

  onClearFilters(): void {
    this.filterService.clearFilters();
  }

  readonly hasActiveFilters = computed(() => {
    return (
      this.filterService.topics().length > 0 ||
      this.filterService.levels().length > 0 ||
      this.filterService.tracks().length > 0 ||
      this.filterService.searchTerm().trim() !== ''
    );
  });
}
