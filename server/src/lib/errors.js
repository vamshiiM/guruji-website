// Typed application error. `code` is a stable string the frontend can branch on
// (e.g. "BAD_ADMIN", "RESERVED_EMAIL"); `status` is the HTTP status.
export class AppError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

// Wraps an async route handler so thrown/rejected errors reach the error middleware.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
