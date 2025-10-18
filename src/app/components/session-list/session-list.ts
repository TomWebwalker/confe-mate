import { Component, input } from '@angular/core';
import { ConferenceSession } from '../../models/chat.model';
import { SessionCard } from '../session-card/session-card';

@Component({
  selector: 'app-session-list',
  imports: [SessionCard],
  template: `
    <div class="recommendations-container">
      <h3>Recommended Sessions</h3>
      <div class="sessions-list">
        @for (session of sessions(); track session.id) {
          <app-session-card [session]="session" />
        }
      </div>
    </div>
  `,
  styleUrl: './session-list.css'
})
export class SessionList {
  sessions = input.required<ConferenceSession[]>();
}
