import { AppError } from "../lib/errors.js";

// Serializes every error into { error: { code, message } }. The frontend api.js
// reads error.code to preserve branches like BAD_ADMIN / RESERVED_EMAIL.
export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  console.error("[unhandled]", err);
  return res
    .status(500)
    .json({ error: { code: "INTERNAL", message: "Something went wrong" } });
}
