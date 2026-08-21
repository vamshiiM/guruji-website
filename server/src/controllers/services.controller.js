import { prisma } from "../db.js";
import { AppError, asyncHandler } from "../lib/errors.js";
import { serializeService } from "../lib/serializers.js";

// Public: the booking form and services page read this.
export const listServices = asyncHandler(async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
  res.json({ services: services.map(serializeService) });
});

export const addService = asyncHandler(async (req, res) => {
  const { name, price, duration, description, icon } = req.body || {};
  if (!name?.trim()) throw new AppError("VALIDATION", "Service name is required.", 400);

  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum < 0) {
    throw new AppError("VALIDATION", "Enter a valid price.", 400);
  }

  const service = await prisma.service.create({
    data: {
      name: name.trim(),
      price: Math.round(priceNum),
      duration: (duration || "").trim() || "1 hr",
      // Optional; default to "" so the public catalog never renders undefined.
      description: (description || "").trim(),
      icon: (icon || "").trim(),
    },
  });
  res.status(201).json({ service: serializeService(service) });
});

export const removeService = asyncHandler(async (req, res) => {
  const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("NOT_FOUND", "Service not found.", 404);

  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
