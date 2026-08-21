import { prisma } from "../db.js";
import { AppError, asyncHandler } from "../lib/errors.js";
import { serializeBooking } from "../lib/serializers.js";
import { sendBookingNotification } from "../lib/email.js";

const STATUSES = ["Confirmed", "Pending confirmation", "Cancelled"];

// Admin sees all bookings; a regular user sees only their own (by email).
export const listBookings = asyncHandler(async (req, res) => {
  const where = req.user.role === "ADMIN" ? {} : { email: req.user.email };
  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  res.json({ bookings: bookings.map(serializeBooking) });
});

const pad2 = (n) => String(n).padStart(2, "0");
// Now in the server's local time. Lexicographic comparison of two "YYYY-MM-DD"
// (or two "HH:MM") strings is equivalent to chronological order.
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function nowHM() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export const createBooking = asyncHandler(async (req, res) => {
  const { service, date, time, address, notes, name, phone } = req.body || {};
  if (!service?.trim() || !date?.trim() || !name?.trim() || !phone?.trim()) {
    throw new AppError("VALIDATION", "Service, date, name and phone are required.", 400);
  }

  // Phone must contain at least 7 digits (letters/garbage rejected).
  const cleanPhone = phone.trim();
  if ((cleanPhone.match(/\d/g) || []).length < 7) {
    throw new AppError("VALIDATION", "Enter a valid phone number.", 400);
  }

  const cleanDate = date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
    throw new AppError("VALIDATION", "Enter a valid date (YYYY-MM-DD).", 400);
  }
  // Allow today; reject anything strictly before it (lenient across time zones).
  if (cleanDate < todayStr()) {
    throw new AppError("VALIDATION", "The ceremony date cannot be in the past.", 400);
  }

  const cleanTime = time?.trim() || null;
  // On same-day bookings, the time must not already be in the past.
  if (cleanTime && /^\d{2}:\d{2}$/.test(cleanTime) && cleanDate === todayStr() && cleanTime < nowHM()) {
    throw new AppError("VALIDATION", "The ceremony time cannot be in the past.", 400);
  }

  const booking = await prisma.booking.create({
    data: {
      userId: req.user.id,
      email: req.user.email, // scope to the signed-in user, like the old addBooking
      name: name.trim(),
      phone: cleanPhone,
      service: service.trim(),
      date: cleanDate,
      time: cleanTime,
      address: address?.trim() || null,
      notes: notes?.trim() || null,
      status: "Pending confirmation",
    },
  });

  res.status(201).json({ booking: serializeBooking(booking) });
  sendBookingNotification(booking); // fire-and-forget; never blocks the response
});

export const updateBooking = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) {
    throw new AppError("VALIDATION", "Invalid status.", 400);
  }
  const existing = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("NOT_FOUND", "Booking not found.", 404);

  const booking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json({ booking: serializeBooking(booking) });
});

export const deleteBooking = asyncHandler(async (req, res) => {
  const existing = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("NOT_FOUND", "Booking not found.", 404);

  await prisma.booking.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
