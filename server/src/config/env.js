import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function list(value, fallback = "") {
  return (value ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 4000,

  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),

  // Exact allowed origin(s) for CORS. Never "*", because we send credentials.
  frontendOrigin: list(process.env.FRONTEND_ORIGIN, "http://localhost:5173"),

  // undefined in dev (host-only cookie); ".yourdomain.com" in prod.
  cookieDomain: process.env.COOKIE_DOMAIN?.trim() || undefined,

  adminEmail: (process.env.ADMIN_EMAIL || "guruji@divya.com").trim().toLowerCase(),
  reservedAdminEmails: list(
    process.env.RESERVED_ADMIN_EMAILS,
    "admin@divya.com,guruji@divya.com"
  ).map((e) => e.toLowerCase()),

  resendApiKey: process.env.RESEND_API_KEY?.trim() || "",
  notifyEmail: process.env.NOTIFY_EMAIL?.trim() || "",
  mailFrom: process.env.MAIL_FROM?.trim() || "Divya Seva <onboarding@resend.dev>",
};
