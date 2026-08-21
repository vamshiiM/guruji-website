import { verifyToken } from "../lib/jwt.js";
import { COOKIE_NAME } from "../lib/cookies.js";
import { prisma } from "../db.js";
import { AppError, asyncHandler } from "../lib/errors.js";

// Verifies the JWT cookie and loads the current user onto req.user.
// req.user = { id, email, role, name } — email is used to scope bookings.
export const authRequired = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw new AppError("UNAUTHENTICATED", "Sign in required.", 401);

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new AppError("UNAUTHENTICATED", "Session expired. Please sign in again.", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new AppError("UNAUTHENTICATED", "Sign in required.", 401);

  req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
  next();
});
