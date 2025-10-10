import { FunctionDeclarationSchemaType } from '@google-cloud/vertexai';

export const getSessionDetailsSchema = {
  name: 'get_session_details',
  description: 'Get detailed information about specific sessions by their IDs.',
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      session_ids: {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: 'Array of session IDs to retrieve details for',
        items: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
    },
    required: ['session_ids'],
  },
};
