import rateLimit from "express-rate-limit";

// Shared JSON error shape so limited requests match the app's error contract.
const handler = (_req, res) =>
  res.status(429).json({
    error: { code: "RATE_LIMITED", message: "Too many requests — please try again later." },
  });

const common = { standardHeaders: true, legacyHeaders: false, handler };

// Strict: credential endpoints (brute-force defense). 10 attempts / 15 min / IP.
export const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, ...common });

// Public contact form (email/DB spam defense). 5 submissions / hour / IP.
export const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, ...common });

// App-wide backstop against general flooding. 300 requests / 15 min / IP.
export const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, ...common });
