import { NextRequest } from "next/server";

// utils/rateLimiter.js
let rateLimiters = {};

// Clean up old entries every 15 minutes
setInterval(() => {
  const current = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  Object.keys(rateLimiters).forEach((key) => {
    rateLimiters[key] = rateLimiters[key].filter(
      (timestamp) => current - timestamp < windowMs
    );
    if (rateLimiters[key].length === 0) {
      delete rateLimiters[key];
    }
  });
}, 15 * 60 * 1000); // Run cleanup every 15 minutes

export function rateLimit(req: NextRequest, maxRequests, windowMs) {
  // Better IP detection for production
  const key =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const current = Date.now();
  if (!rateLimiters[key]) {
    rateLimiters[key] = [];
  }

  // Remove outdated requests
  rateLimiters[key] = rateLimiters[key].filter(
    (timestamp) => current - timestamp < windowMs
  );

  if (rateLimiters[key].length >= maxRequests) {
    return false;
  }

  rateLimiters[key].push(current);
  return true;
}
