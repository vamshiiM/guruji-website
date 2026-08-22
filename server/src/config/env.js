import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const isProd = process.env.NODE_ENV === "production";

function list(value, fallback = "") {
  return (value ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const jwtSecret = required("JWT_SECRET");
// A weak secret means forgeable tokens (= login as anyone). Enforce real entropy.
if (isProd && jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production.");
}

// Exact allowed origin(s) for CORS. Never "*", because we send credentials.
const frontendOrigin = list(process.env.FRONTEND_ORIGIN, "http://localhost:5173");
if (isProd && !process.env.FRONTEND_ORIGIN) {
  throw new Error("FRONTEND_ORIGIN must be set in production.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProd,
  port: Number(process.env.PORT) || 4000,

  databaseUrl: required("DATABASE_URL"),
  jwtSecret,

  frontendOrigin,

  // undefined in dev (host-only cookie); ".yourdomain.com" in prod.
  cookieDomain: process.env.COOKIE_DOMAIN?.trim() || undefined,

  adminEmail: (process.env.ADMIN_EMAIL || "guruji@divya.com").trim().toLowerCase(),
  reservedAdminEmails: list(
    process.env.RESERVED_ADMIN_EMAILS,
    "admin@divya.com,guruji@divya.com"
  ).map((e) => e.toLowerCase()),

  resendApiKey: process.env.RESEND_API_KEY?.trim() || "",
  // Comma-separated list → all admin recipients get booking/contact alerts.
  notifyEmails: list(process.env.NOTIFY_EMAIL),
  mailFrom: process.env.MAIL_FROM?.trim() || "Divya Seva <onboarding@resend.dev>",
};
