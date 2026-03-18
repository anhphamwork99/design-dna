/**
 * Rate limiting middleware — PLACEHOLDER for Phase 10.
 *
 * Hono's built-in rate limiter requires a store (in-memory or Redis).
 * Actual implementation will be added in Phase 10 when we have:
 * - Auth context (user-based rate limiting)
 * - AI proxy endpoints that need protection
 *
 * For now, this exports a no-op middleware to maintain the structure.
 */

import type { MiddlewareHandler } from 'hono';

/**
 * Placeholder rate limit middleware.
 * Will be replaced with actual rate limiting in Phase 10.
 */
export function rateLimitMiddleware(): MiddlewareHandler {
    return async (c, next) => {
        // TODO: Implement rate limiting with hono-rate-limiter
        // - Per-user limits based on auth context
        // - Different limits for different endpoint tiers
        // - Store: in-memory for dev, Redis for production
        await next();
    };
}
