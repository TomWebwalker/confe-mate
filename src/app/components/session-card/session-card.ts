import { Component, input } from '@angular/core';
import { ConferenceSession } from '../../models/chat.model';

@Component({
  selector: 'app-session-card',
  templateUrl: './session-card.html',
  styleUrl: './session-card.css'
})
export class SessionCard {
  session = input.required<ConferenceSession>();
}
