import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: env.frontendOrigin, // exact origin(s); required for credentialed cookies
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    })
  );
  app.use(express.json());

  app.use("/api", routes);

  app.use((_req, res) =>
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found" } })
  );
  app.use(errorHandler);

  return app;
}
