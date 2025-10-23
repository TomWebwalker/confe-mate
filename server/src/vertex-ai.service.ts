import { ChatSession, Content, GenerativeModel, VertexAI } from '@google-cloud/vertexai';
import {
  getSessionDetailsSchema,
  recommendSessionsSchema,
  searchSessionsSchema,
  systemInstruction,
} from './const';
import { ChatMessage, ConferenceSession, SearchSessionsParams } from './types';
import {
  getSessionDetails,
  messagesToChatHistory,
  recommendSessions,
  searchSessions,
} from './utils';

const functionDeclarations = [
  searchSessionsSchema,
  getSessionDetailsSchema,
  recommendSessionsSchema,
];

type ExecuteFunctionCall = 'search_sessions' | 'get_session_details' | 'recommend_sessions';

export class VertexAIService {
  private readonly vertexAI: VertexAI;
  private readonly model: GenerativeModel;
  private sessions: ConferenceSession[] = [];

  constructor(projectId: string, location: string) {
    this.vertexAI = new VertexAI({
      project: projectId,
      location: location,
    });

    // Using Gemini 2.5 Flash with function calling
    this.model = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
  }

  setSessionsData(sessions: ConferenceSession[]) {
    this.sessions = sessions;
  }

  async chat(
    messages: ChatMessage[]
  ): Promise<{ response: string; recommendations: ConferenceSession[] }> {
    try {
      // Format conversation history for Vertex AI
      const conversationHistory = messagesToChatHistory(messages);

      // Start chat with function calling enabled
      const chat = this.getChatSession(conversationHistory);

      const lastMessage = messages[messages.length - 1];
      let result = await chat.sendMessage(lastMessage.content);
      let response = result.response;

      // Handle function calls
      let allRecommendedSessions: ConferenceSession[] = [];

      while (response.candidates?.[0]?.content?.parts?.[0]?.functionCall) {
        const functionCall = response.candidates[0].content.parts[0].functionCall;
        const functionName = functionCall.name as ExecuteFunctionCall;
        const functionArgs = functionCall.args as SearchSessionsParams;

        console.log(`AI called function: ${functionName}`, functionArgs);

        // Execute the function
        const functionResult = this.executeFunctionCall(functionName, functionArgs);

        // Add recommended sessions
        if (Array.isArray(functionResult)) {
          allRecommendedSessions.push(...functionResult);
        }

        // Send function response back to the model
        const functionResponsePart = {
          functionResponse: {
            name: functionName,
            response: {
              content: functionResult,
            },
          },
        };

        result = await chat.sendMessage([functionResponsePart]);
        response = result.response;
      }

      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Remove duplicate sessions
      const uniqueSessions = allRecommendedSessions.filter(
        (session, index, self) => self.findIndex((s) => s.id === session.id) === index
      );

      return {
        response: responseText,
        recommendations: uniqueSessions,
      };
    } catch (error) {
      console.error('Error calling Vertex AI:', error);
      throw new Error('Failed to get AI response');
    }
  }

  private getChatSession(conversationHistory: Content[]): ChatSession {
    return this.model.startChat({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
        role: 'system',
      },
      history: conversationHistory,
      tools: [
        {
          functionDeclarations,
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
      },
    });
  }

  private executeFunctionCall(
    functionName: ExecuteFunctionCall,
    args: SearchSessionsParams
  ): ConferenceSession[] {
    switch (functionName) {
      case 'search_sessions':
        return searchSessions(args, this.sessions);
      case 'get_session_details':
        return getSessionDetails(args, this.sessions);
      case 'recommend_sessions':
        return recommendSessions(args, this.sessions);
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }
}
