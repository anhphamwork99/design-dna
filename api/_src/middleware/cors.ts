/**
 * CORS middleware configuration for Hono API proxy.
 *
 * Currently CORS is applied inline in src/index.ts using hono/cors.
 * This file serves as a placeholder for custom CORS logic if needed.
 *
 * Default: restricts to FRONTEND_URL env var (http://localhost:3000)
 */

import { cors } from 'hono/cors';

export function createCorsMiddleware() {
    return cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    });
}
