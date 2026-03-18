/**
 * CORS middleware configuration for Hono API proxy.
 *
 * Currently CORS is applied inline in app.ts using hono/cors.
 * This file serves as a placeholder for custom CORS logic if needed.
 */

import { cors } from 'hono/cors';

export function createCorsMiddleware(frontendUrl?: string) {
    return cors({
        origin: frontendUrl || '*',
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    });
}
