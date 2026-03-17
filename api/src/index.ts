import 'dotenv/config';

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoute } from './routes/health.js';
import { apiKeysRoute } from './routes/api-keys.js';
import { aiRoute } from './routes/ai.js';
import { analysesRoute } from './routes/analyses.js';
import { patternsRoute } from './routes/patterns.js';

const app = new Hono();

// CORS — only allow frontend origin (MUST be before other middleware)
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(
    '*',
    cors({
        origin: (origin) => {
            // Return the origin if it matches, otherwise return null
            if (origin === ALLOWED_ORIGIN || origin === 'http://localhost:3000') {
                return origin;
            }
            return ALLOWED_ORIGIN;
        },
        credentials: true,
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    }),
);

// Request logger
app.use('*', async (c, next) => {
    const start = Date.now();
    console.log(`→ ${c.req.method} ${c.req.url}`);
    await next();
    console.log(`← ${c.req.method} ${c.req.url} ${c.res.status} (${Date.now() - start}ms)`);
});

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
