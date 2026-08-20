import { prisma } from "../db.js";
import { AppError, asyncHandler } from "../lib/errors.js";
import { sendContactNotification } from "../lib/email.js";

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    throw new AppError("VALIDATION", "Name, email and message are required.", 400);
  }

  const msg = await prisma.contactMessage.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    },
  });

  res.status(201).json({ ok: true });
  sendContactNotification(msg); // fire-and-forget
});
