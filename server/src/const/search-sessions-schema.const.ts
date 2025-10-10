import { FunctionDeclarationSchemaType } from '@google-cloud/vertexai';

export const searchSessionsSchema = {
  name: 'search_sessions',
  description:
    'Search for conference sessions based on topics, experience level, track, or keywords. Returns matching sessions.',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      topics: {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: 'Topics of interest (e.g., "AI", "Cloud", "DevOps")',
        items: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
      level: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'Experience level: beginner, intermediate, or advanced',
        enum: ['beginner', 'intermediate', 'advanced'],
      },
      track: {
        type: FunctionDeclarationSchemaType.STRING,
        description: 'Conference track (e.g., "Technical", "Business", "Design")',
      },
      keywords: {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: 'Keywords to search in title and description',
        items: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
    },
    required: [],
  },
};
