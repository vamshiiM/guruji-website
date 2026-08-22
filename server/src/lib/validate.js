import { AppError } from "./errors.js";

// Trim a value and enforce a maximum length so no user-supplied field can be an
// oversized blob (payload/email-amplification DoS). Returns the trimmed string.
// Pass { required: true } to reject empty values with a clear message.
export function cappedString(value, { field, max, required = false }) {
  const s = (value ?? "").toString().trim();
  if (required && !s) {
    throw new AppError("VALIDATION", `${field} is required.`, 400);
  }
  if (s.length > max) {
    throw new AppError("VALIDATION", `${field} is too long (max ${max} characters).`, 400);
  }
  return s;
}
