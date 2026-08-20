import { prisma } from "../db.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signToken, verifyToken } from "../lib/jwt.js";
import { COOKIE_NAME, setCookieOptions, clearCookieOptions } from "../lib/cookies.js";
import { AppError, asyncHandler } from "../lib/errors.js";
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
  const normalized = email.trim().toLowerCase();

  if (env.reservedAdminEmails.includes(normalized)) {
    throw new AppError("RESERVED_EMAIL", "This email is reserved.", 409);
  }
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    throw new AppError("EMAIL_TAKEN", "An account with this email already exists.", 409);
  }

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
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
  const ok = user && (await verifyPassword(password, user.passwordHash));

  if (!ok) {
    // Preserve the old client's distinct "invalid admin credentials" message.
    const looksAdmin =
      (user && user.role === "ADMIN") || env.reservedAdminEmails.includes(normalized);
    if (looksAdmin) throw new AppError("BAD_ADMIN", "Invalid admin credentials", 401);
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
