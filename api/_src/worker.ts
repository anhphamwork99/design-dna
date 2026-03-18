/**
 * Cloudflare Worker entry point.
 * Exports the Hono app's fetch handler for Cloudflare Workers runtime.
 */
import app from './app.js';

export default app;
