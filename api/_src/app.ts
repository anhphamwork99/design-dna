import 'dotenv/config';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoute } from './routes/health.js';
import { apiKeysRoute } from './routes/api-keys.js';
import { aiRoute } from './routes/ai.js';
import { analysesRoute } from './routes/analyses.js';
import { patternsRoute } from './routes/patterns.js';

const app = new Hono();

// CORS — allow any localhost origin in dev, Vercel domain in production
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(
    '*',
    cors({
        origin: (origin) => {
            // Allow any localhost origin in development
            if (origin && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
                return origin;
            }
            // Allow configured frontend URL
            if (origin === FRONTEND_URL) {
                return origin;
            }
            // Allow Vercel preview/production domains
            if (origin && /\.vercel\.app$/.test(origin)) {
                return origin;
            }
            return FRONTEND_URL;
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

export default app;
