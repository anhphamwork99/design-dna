/**
 * Local development entry point (Node.js).
 * For Cloudflare Workers, use `worker.ts` instead (via wrangler).
 *
 * Usage: npm run dev:node
 */

import 'dotenv/config';

// Lazy import to avoid requiring @hono/node-server in production builds
async function startDevServer() {
    const { serve } = await import('@hono/node-server');
    const { default: app } = await import('./app.js');
    const port = Number(process.env.PORT) || 4000;
    console.log(`🚀 API server running on http://localhost:${port}`);
    serve({ fetch: app.fetch, port });
}

startDevServer();
