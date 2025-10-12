# ConfeMate Backend Server

Express.js server with Vertex AI Function Calling integration for conference session recommendations.

## Setup

### 1. Google Cloud Authentication

Authenticate with Google Cloud to use Vertex AI:

```bash
gcloud auth application-default login
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp ../.env.example ../.env
```

Edit `.env` and set:
- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID
- `GOOGLE_CLOUD_LOCATION`: Region for Vertex AI (default: us-central1)
- `PORT`: Server port (default: 3000)

### 3. Enable Vertex AI API

Ensure Vertex AI API is enabled in your Google Cloud project:

```bash
gcloud services enable aiplatform.googleapis.com
```

## Running the Server

### Development Mode (with hot reload)

```bash
npm run server
```

### Build for Production

```bash
npm run server:build
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Chat with AI (Function Calling Enabled)
```
POST /api/chat
Body: {
  "messages": [
    { "role": "user", "content": "I'm interested in AI and machine learning" }
  ]
}

Response: {
  "response": "AI response text",
  "recommendations": [ConferenceSession[]],
  "timestamp": "ISO timestamp"
}
```

### Load Sessions Data
```
POST /api/sessions/load
Body: {
  "sessions": [
    {
      "id": "SESSION-001",
      "title": "Introduction to AI",
      "description": "Learn AI basics",
      "topics": ["AI", "Machine Learning"],
      "track": "Technical",
      "speaker": "John Doe",
      "level": "beginner",
      "duration": 60,
      "timeSlot": "10:00 AM"
    }
  ]
}
```

## Vertex AI Function Calling

The server implements **Vertex AI Function Calling** to provide intelligent session recommendations. The AI can call three functions:

### 1. `search_sessions`
Search for sessions based on topics, experience level, track, or keywords.

**Parameters:**
- `topics`: Array of topics (e.g., ["AI", "Cloud"])
- `level`: Experience level (beginner, intermediate, advanced)
- `track`: Conference track
- `keywords`: Keywords to search in title/description

### 2. `get_session_details`
Get detailed information about specific sessions by their IDs.

**Parameters:**
- `session_ids`: Array of session IDs to retrieve

### 3. `recommend_sessions`
Get personalized recommendations based on user preferences.

**Parameters:**
- `interests`: User interests and topics (required)
- `experience_level`: User experience level
- `preferred_tracks`: Preferred conference tracks
- `max_results`: Maximum number of recommendations (default: 5)

## Architecture

### Key Components

- **server.ts**: Express server with API endpoints
- **vertex-ai.service.ts**: Vertex AI integration with function calling
  - Gemini 1.5 Flash model for fast responses
  - Three tool functions for session search and recommendations
  - Automatic function execution and response handling

### Function Calling Flow

1. User sends a chat message
2. Vertex AI analyzes the message and determines which function(s) to call
3. Server executes the function(s) with the AI-provided parameters
4. Results are sent back to the AI
5. AI generates a natural language response with recommendations
6. Response and session data are returned to the client

### Benefits of Function Calling

- **Structured Data Access**: AI can query session data systematically
- **Accurate Recommendations**: Functions provide real session data, not hallucinated results
- **Flexible Queries**: AI determines the best search parameters based on conversation
- **Multi-turn Conversations**: Maintains context across multiple exchanges
