// Shape API responses to match the exact keys the existing frontend expects,
// so pages need no changes to their data handling.

export const serializeUser = (u) => ({
  name: u.name,
  email: u.email,
  role: u.role.toLowerCase(), // "USER"/"ADMIN" -> "user"/"admin"
  joinedAt: u.createdAt.toISOString(),
});

export const serializeBooking = (b) => ({
  id: b.id,
  name: b.name,
  email: b.email,
  phone: b.phone,
  service: b.service,
  date: b.date,
  time: b.time,
  address: b.address,
  notes: b.notes,
  status: b.status,
  createdAt: b.createdAt.toISOString(),
});

export const serializeService = (s) => ({
  id: s.id,
  name: s.name,
  price: s.price,
  duration: s.duration,
  // Backfill to "" so the client never has to null-check (matches the DB default).
  description: s.description ?? "",
  icon: s.icon ?? "",
});

export const serializeContactMessage = (m) => ({
  id: m.id,
  name: m.name,
  email: m.email,
  message: m.message,
  createdAt: m.createdAt.toISOString(),
});

// Admin-only view of a registered account. Kept separate from serializeUser so
// the public me/login/signup contract ({name,email,role,joinedAt}) stays stable.
export const serializeUserAdmin = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role.toLowerCase(), // "USER"/"ADMIN" -> "user"/"admin"
  joinedAt: u.createdAt.toISOString(),
  bookingsCount: u._count?.bookings ?? 0,
  // From the most recent booking (see users.controller.js); "" if none.
  phone: u.bookings?.[0]?.phone ?? "",
});
