import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimit.js";

export function createApp() {
  const app = express();

  // Behind Railway's proxy: trust the first hop so req.ip (and rate limiting)
  // read the real client IP from X-Forwarded-For, not the proxy's.
  app.set("trust proxy", 1);

  // Baseline security headers (HSTS, nosniff, no-sniff framing, etc.). This is a
  // JSON API, so helmet's defaults are safe and don't affect CORS/cookies.
  app.use(helmet());

  app.use(cookieParser());
  app.use(
    cors({
      origin: env.frontendOrigin, // exact origin(s); required for credentialed cookies
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    })
  );
  // Bounded body size — a text API never needs large payloads; blocks payload DoS.
  app.use(express.json({ limit: "16kb" }));

  // App-wide flood backstop (per-route limiters are stricter, see routes).
  app.use(globalLimiter);

  app.use("/api", routes);

  app.use((_req, res) =>
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } })
  );
  app.use(errorHandler);

  return app;
}
