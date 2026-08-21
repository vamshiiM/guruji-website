import { AppError } from "../lib/errors.js";

// Must run AFTER authRequired. Enforces admin role server-side — this is the gate
// that used to live (insecurely) in client JS.
export function adminRequired(req, _res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(new AppError("FORBIDDEN", "Administrator access required.", 403));
  }
  next();
}
