import { handle } from '@hono/node-server/vercel';
import app from './_src/app.js';

// Single Vercel serverless function — catches all /api/* routes
export default handle(app);
