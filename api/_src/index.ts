import 'dotenv/config';

import { serve } from '@hono/node-server';
import app from './app.js';

// Start server (local development only)
const port = Number(process.env.PORT) || 4000;
console.log(`🚀 API server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
