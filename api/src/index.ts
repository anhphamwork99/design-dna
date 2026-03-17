import { config } from 'dotenv';
config({ path: '.env.local' });

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoute } from './routes/health.js';
import { apiKeysRoute } from './routes/api-keys.js';
import { aiRoute } from './routes/ai.js';
import { analysesRoute } from './routes/analyses.js';
import { patternsRoute } from './routes/patterns.js';

const app = new Hono();

// CORS — only allow frontend origin
app.use(
    '*',
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    }),
);

// Body size limit for AI routes (base64 images can be large)
app.use('/api/ai/*', async (c, next) => {
    // Allow up to 20MB for AI endpoints carrying base64 images
    await next();
});

// Routes
app.route('/api', healthRoute);
app.route('/api', apiKeysRoute);
app.route('/api', aiRoute);
app.route('/api', analysesRoute);
app.route('/api', patternsRoute);

// Start server
const port = Number(process.env.PORT) || 4000;
console.log(`🚀 API server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
