import { FunctionDeclarationSchemaType } from '@google-cloud/vertexai';

export const recommendSessionsSchema = {
  name: 'recommend_sessions',
  description:
    'Get personalized session recommendations based on user preferences and constraints.',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      interests: {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: 'User interests and topics',
        items: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
      experience_level: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'User experience level',
        enum: ['beginner', 'intermediate', 'advanced'],
      },
      preferred_tracks: {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: 'Preferred conference tracks',
        items: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
      max_results: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: 'Maximum number of recommendations to return (default: 5)',
      },
    },
    required: ['interests'],
  },
};
