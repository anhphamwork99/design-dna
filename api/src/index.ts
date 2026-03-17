import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import 'dotenv/config';
import { healthRoute } from './routes/health.js';

const app = new Hono();

// CORS — only allow frontend origin
app.use(
    '*',
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);

// Routes
app.route('/api', healthRoute);

// Start server
const port = Number(process.env.PORT) || 4000;
console.log(`🚀 API server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
