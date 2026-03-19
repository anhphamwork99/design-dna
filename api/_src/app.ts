import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { healthRoute } from './routes/health.js';
import { apiKeysRoute } from './routes/api-keys.js';
import { aiRoute } from './routes/ai.js';
import { analysesRoute } from './routes/analyses.js';
import { patternsRoute } from './routes/patterns.js';
import { migrateThumbnailsRoute } from './routes/migrate-thumbnails.js';

/**
 * Cloudflare Worker Bindings — set via `wrangler secret put`.
 * In local dev, set in `.dev.vars` file.
 */
export type CloudflareBindings = {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    ENCRYPTION_KEY: string;
    FRONTEND_URL?: string;
};

type HonoEnv = {
    Bindings: CloudflareBindings;
};

const app = new Hono<HonoEnv>();

// CORS — same-origin (SPA + API on same Worker), allow localhost in dev
app.use(
    '*',
    cors({
        origin: (origin) => {
            // Same-origin requests (no Origin header)
            if (!origin) return '*';
            // Allow any localhost origin in development
            if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
                return origin;
            }
            // Allow *.workers.dev domains
            if (/\.workers\.dev$/.test(origin)) {
                return origin;
            }
            // Allow custom domain if configured
            return origin;
        },
        credentials: true,
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    }),
);

// Env fallback for local dev (tsx / dev:node).
// In Cloudflare Workers, c.env is populated automatically from wrangler secrets.
// In local Node.js, c.env is empty — bridge from process.env.
app.use('*', async (c, next) => {
    if (!c.env.SUPABASE_URL && typeof process !== 'undefined' && process.env.SUPABASE_URL) {
        c.env = {
            ...c.env,
            SUPABASE_URL: process.env.SUPABASE_URL!,
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
            ENCRYPTION_KEY: process.env.ENCRYPTION_KEY!,
            FRONTEND_URL: process.env.FRONTEND_URL,
        } as CloudflareBindings;
    }
    await next();
});

// Request logger
app.use('*', async (c, next) => {
    const start = Date.now();
    console.log(`→ ${c.req.method} ${c.req.url}`);
    await next();
    console.log(`← ${c.req.method} ${c.req.url} ${c.res.status} (${Date.now() - start}ms)`);
});

// Routes
app.route('/api', healthRoute);
app.route('/api', apiKeysRoute);
app.route('/api', aiRoute);
app.route('/api', analysesRoute);
app.route('/api', patternsRoute);
app.route('/api', migrateThumbnailsRoute);

export default app;
