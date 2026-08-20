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
});
