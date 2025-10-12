import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { VertexAIService } from './vertex-ai.service';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Vertex AI Service
const projectId = process.env.GOOGLE_CLOUD_PROJECT || '';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

if (!projectId) {
  console.error('GOOGLE_CLOUD_PROJECT environment variable is required');
  process.exit(1);
}

const vertexAIService = new VertexAIService(projectId, location);

// Make vertexAIService available to routes
app.set('vertexAIService', vertexAIService);

// Register API routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Project: ${projectId}`);
  console.log(`📍 Location: ${location}`);
  console.log(`🤖 Vertex AI Function Calling enabled`);
});
