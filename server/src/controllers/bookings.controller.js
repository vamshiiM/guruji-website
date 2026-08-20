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

export const createBooking = asyncHandler(async (req, res) => {
  const { service, date, time, address, notes, name, phone } = req.body || {};
  if (!service?.trim() || !date?.trim() || !name?.trim() || !phone?.trim()) {
    throw new AppError("VALIDATION", "Service, date, name and phone are required.", 400);
  }

  const booking = await prisma.booking.create({
    data: {
      userId: req.user.id,
      email: req.user.email, // scope to the signed-in user, like the old addBooking
      name: name.trim(),
      phone: phone.trim(),
      service: service.trim(),
      date: date.trim(),
      time: time?.trim() || null,
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
