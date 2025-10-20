import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatFilterService } from '../../services/chat-filter.service';
import { SessionList } from '../session-list/session-list';
import { SessionFilters } from '../session-filters/session-filters';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, SessionList, SessionFilters],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  protected readonly chatService = inject(ChatService);
  protected readonly filterService = inject(ChatFilterService);
  protected readonly messageInput = signal('');
  private readonly messagesEnd = viewChild<ElementRef>('messagesEnd');

  constructor() {
    effect(() => {
      this.chatService.messages();
      this.scrollToBottom();
    });
  }

  async onSendMessage(): Promise<void> {
    const content = this.messageInput();
    if (content.trim()) {
      await this.chatService.sendMessage(content);
      this.messageInput.set('');
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
  }

  onClearChat(): void {
    this.chatService.clearChat();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.messagesEnd()?.nativeElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}
