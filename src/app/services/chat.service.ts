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
    } catch (err: any) {
      const errorMessage = this.getErrorMessage(err);
      this.error.set(errorMessage);
      console.error('Chat error:', err);

      this.messages.update(messages => messages.slice(0, -1));
    } finally {
      this.isLoading.set(false);
    }
  }

  retryLastMessage(): void {
    const messages = this.messages();
    if (messages.length > 0) {
      const lastUserMessage = [...messages]
        .reverse()
        .find(msg => msg.role === 'user');

      if (lastUserMessage) {
        this.sendMessage(lastUserMessage.content);
      }
    }
  }

  private getErrorMessage(err: any): string {
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network and try again.';
    }

    if (err.status === 0) {
      return 'Unable to reach the server. Please check your connection.';
    }

    if (err.status === 400) {
      return 'Invalid request. Please try rephrasing your message.';
    }

    if (err.status === 401 || err.status === 403) {
      return 'Authentication error. Please refresh the page and try again.';
    }

    if (err.status === 404) {
      return 'Service not found. Please contact support.';
    }

    if (err.status === 429) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (err.status >= 500) {
      return 'Server error. Please try again in a moment.';
    }

    if (err.error && err.error.message) {
      return err.error.message;
    }

    return 'Failed to send message. Please try again.';
  }

  clearChat(): void {
    this.messages.set([]);
    this.recommendations.set([]);
    this.error.set(null);
    this.filterService.clearFilters();
  }
}
