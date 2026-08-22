import { prisma } from "../db.js";
import { hashPassword, verifyPassword, DUMMY_HASH } from "../lib/password.js";
import { signToken, verifyToken } from "../lib/jwt.js";
import { COOKIE_NAME, setCookieOptions, clearCookieOptions } from "../lib/cookies.js";
import { AppError, asyncHandler } from "../lib/errors.js";
import { cappedString } from "../lib/validate.js";
import { serializeUser } from "../lib/serializers.js";
import { env } from "../config/env.js";

function issueCookie(res, user) {
  const token = signToken({ sub: user.id, role: user.role });
  res.cookie(COOKIE_NAME, token, setCookieOptions());
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
    throw new AppError("VALIDATION", "Name, email and a 6+ character password are required.", 400);
  }
  // Bound field sizes (password too — bcrypt on a huge string is a CPU DoS).
  const safeName = cappedString(name, { field: "Name", max: 100, required: true });
  const safeEmail = cappedString(email, { field: "Email", max: 254, required: true });
  if (password.length > 200) {
    throw new AppError("VALIDATION", "Password is too long (max 200 characters).", 400);
  }
  const normalized = safeEmail.toLowerCase();

  if (env.reservedAdminEmails.includes(normalized)) {
    throw new AppError("RESERVED_EMAIL", "This email is reserved.", 409);
  }
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    throw new AppError("EMAIL_TAKEN", "An account with this email already exists.", 409);
  }

  const user = await prisma.user.create({
    data: {
      name: safeName,
      email: normalized,
      passwordHash: await hashPassword(password),
      role: "USER",
    },
  });

  issueCookie(res, user);
  res.status(201).json({ user: serializeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email?.trim() || !password) {
    throw new AppError("VALIDATION", "Email and password are required.", 400);
  }
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  // Always run bcrypt (against a dummy hash if no user) so response time doesn't
  // reveal whether the email exists (timing-based user enumeration).
  const ok = (await verifyPassword(password, user ? user.passwordHash : DUMMY_HASH)) && !!user;

  if (!ok) {
    // One generic error for every failure — never disclose whether the email
    // exists or is an admin account (account enumeration defense).
    throw new AppError("BAD_CREDENTIALS", "Invalid email or password", 401);
  }

  issueCookie(res, user);
  res.json({ user: serializeUser(user) });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(COOKIE_NAME, clearCookieOptions());
  res.json({ ok: true });
});

// Public: returns the current user if a valid cookie is present, else { user: null }.
export const me = asyncHandler(async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.json({ user: null });
  try {
    const { sub } = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: sub } });
    return res.json({ user: user ? serializeUser(user) : null });
  } catch {
    return res.json({ user: null });
  }
});
