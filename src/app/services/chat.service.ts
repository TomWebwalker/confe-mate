import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ChatMessage, ChatResponse, ConferenceSession } from '../models/chat.model';
import { ChatFilterService } from './chat-filter.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly filterService = inject(ChatFilterService);
  private readonly apiUrl = '/api/chat';

  readonly messages = signal<ChatMessage[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly recommendations = signal<ConferenceSession[]>([]);

  constructor() {
    effect(() => {
      this.filterService.setSessions(this.recommendations());
    });
  }

  async sendMessage(content: string): Promise<void> {
    if (!content.trim()) {
      return;
    }

    this.error.set(null);

    const userMessage: ChatMessage = {
      role: 'user',
      content: content.trim()
    };

    this.messages.update(messages => [...messages, userMessage]);
    this.isLoading.set(true);

    try {
      const response = await lastValueFrom(
        this.http.post<ChatResponse>(
          this.apiUrl,
          { messages: this.messages() }
        )
      );

      const modelMessage: ChatMessage = {
        role: 'model',
        content: response.response
      };

      this.messages.update(messages => [...messages, modelMessage]);
      this.recommendations.set(response.recommendations);
    } catch (err) {
      this.error.set('Failed to send message. Please try again.');
      console.error('Chat error:', err);

      this.messages.update(messages => messages.slice(0, -1));
    } finally {
      this.isLoading.set(false);
    }
  }

  clearChat(): void {
    this.messages.set([]);
    this.recommendations.set([]);
    this.error.set(null);
    this.filterService.clearFilters();
  }
}
