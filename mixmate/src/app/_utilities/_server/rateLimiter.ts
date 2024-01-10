import { NextRequest } from "next/server";

// utils/rateLimiter.js
let rateLimiters = {};

export function rateLimit(req: NextRequest, maxRequests, windowMs) {   
  const key = req.headers.get('x-forwarded-for') || 'unknown';
  const current = Date.now();
  if (!rateLimiters[key]) {
    rateLimiters[key] = [];
  }

  // Remove outdated requests
  rateLimiters[key] = rateLimiters[key].filter(timestamp => current - timestamp < windowMs);

  if (rateLimiters[key].length >= maxRequests) {
    return false;
  }

  rateLimiters[key].push(current);
  return true;
}
