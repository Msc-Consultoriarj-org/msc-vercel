// Vercel Serverless Function Adapter
// This file adapts the Express/tRPC server to work in Vercel's serverless environment

import { createServer } from '../dist/index.js';

let serverInstance = null;

export default async function handler(req, res) {
  // Initialize server only once (cold start optimization)
  if (!serverInstance) {
    serverInstance = await createServer();
  }

  // Handle the request
  return serverInstance(req, res);
}
