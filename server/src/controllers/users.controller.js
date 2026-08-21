import { prisma } from "../db.js";
import { asyncHandler } from "../lib/errors.js";
import { serializeUserAdmin } from "../lib/serializers.js";

// Admin only: the real registered-user roster (newest first), each with a live
// booking count. Sample bookings have userId: null, so they never inflate counts.
export const listUsers = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookings: true } },
      // Surface the phone from the user's most recent booking (accounts have no
      // phone field of their own).
      bookings: { orderBy: { createdAt: "desc" }, take: 1, select: { phone: true } },
    },
  });
  res.json({ users: users.map(serializeUserAdmin) });
});
