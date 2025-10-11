import { Content } from '@google-cloud/vertexai';
import { ChatMessage } from '../types';

export function messagesToChatHistory(messages: ChatMessage[]): Content[] {
  return messages.slice(0, -1).map(({ role, content }) => ({
    role,
    parts: [{ text: content }],
  }));
}
