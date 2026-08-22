import { prisma } from "../db.js";
import { AppError, asyncHandler } from "../lib/errors.js";
import { cappedString } from "../lib/validate.js";
import { sendContactNotification } from "../lib/email.js";
import { serializeContactMessage } from "../lib/serializers.js";

// Admin only: list all submitted contact messages, newest first.
export const listContactMessages = asyncHandler(async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json({ messages: messages.map(serializeContactMessage) });
});

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body || {};
  const safeName = cappedString(name, { field: "Name", max: 100, required: true });
  const safeEmail = cappedString(email, { field: "Email", max: 254, required: true });
  const safeMessage = cappedString(message, { field: "Message", max: 2000, required: true });

  const msg = await prisma.contactMessage.create({
    data: {
      name: safeName,
      email: safeEmail.toLowerCase(),
      message: safeMessage,
    },
  });

  res.status(201).json({ ok: true });
  sendContactNotification(msg); // fire-and-forget
});
